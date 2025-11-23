import puppeteer from 'puppeteer';
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

// Configuration
const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';
const VENDOOR_LOGIN_URL = 'https://aff.ven-door.com/login';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68d8b9db00134c41e7c8';
const APPWRITE_API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const APPWRITE_DATABASE_ID = '68de037e003bd03c4d45';

// Profit Margin - زيادة على سعر المنتج
const PROFIT_MARGIN = 10;  // 10 جنيه زيادة على كل منتج

// Product URL to scrape
const PRODUCT_URL = process.argv[2] || 'https://aff.ven-door.com/product/4428';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function login(page) {
  try {
    console.log('🔐 Logging in...');
    await page.goto(VENDOOR_LOGIN_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));

    const email = await page.$('input[name="name"]');
    if (!email) throw new Error('Email field not found');
    await email.type(VENDOOR_EMAIL);

    const pass = await page.$('input[name="password"]');
    if (!pass) throw new Error('Password field not found');
    await pass.type(VENDOOR_PASSWORD);

    const btn = await page.$('button[type="submit"]');
    if (btn) {
      await btn.click();
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => null),
        page.waitForSelector('nav', { timeout: 60000 }).catch(() => null)
      ]);
    }

    console.log('✅ Logged in');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    return false;
  }
}

async function scrapeProduct(page, url) {
  try {
    console.log('\n📦 Opening product page:', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 3000));

    const data = await page.evaluate(() => {
      const result = {
        title: '',
        seller: '',
        price: 0,
        description: '',
        mediaLinks: [],
        images: [],
        colors: [],
        sizes: [],
        colorSizeInventory: [],
        totalStock: 0
      };

      // Helpers
      const normalizeArabic = (s) => (s || '')
        .replace(/[أإآ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/[ًٌٍَُِّْ]/g, '')
        .trim();
      const normalizeSize = (s) => {
        const str = (s || '').trim();
        const m = str.match(/\d+(?:\.\d+)?/);
        return m ? m[0] : str;
      };

      // Title
      const titleEl = document.querySelector('h6.prodect-text');
      result.title = titleEl ? titleEl.textContent.trim() : '';

      // Seller
      const sellerDiv = Array.from(document.querySelectorAll('.card-body-2.price')).find(
        div => div.textContent.includes('البائع')
      );
      if (sellerDiv) {
        const sellerSpan = sellerDiv.querySelector('span');
        result.seller = sellerSpan ? sellerSpan.textContent.trim() : '';
      }

      // Price
      const priceDiv = Array.from(document.querySelectorAll('.card-body-2.price')).find(
        div => div.textContent.includes('السعر')
      );
      if (priceDiv) {
        const text = priceDiv.textContent;
        const match = text.match(/(\d+)/);
        if (match) result.price = parseInt(match[1]);
      }

      // Description & Media Link Extraction (Refined for .component-What structure)
      const componentWhat = document.querySelector('.component-What');
      let bestDesc = '';

      if (componentWhat) {
        // 1. Extract Media Links
        const mediaAnchors = componentWhat.querySelectorAll('a[href*="drive.google.com"]');
        mediaAnchors.forEach(a => {
          if (a.href && !result.mediaLinks.includes(a.href)) {
            result.mediaLinks.push(a.href);
          }
        });

        // 2. Extract Description
        // The structure shows nested <p> tags or siblings. We'll iterate through all <p> tags inside.
        const paragraphs = componentWhat.querySelectorAll('p');
        paragraphs.forEach(p => {
          // Check if this paragraph contains a media link we just found
          const hasMediaLink = p.querySelector('a[href*="drive.google.com"]');
          // Check if it's the title (h6 is usually separate, but just in case)
          const isTitle = p.classList.contains('prodect-text');

          if (!hasMediaLink && !isTitle) {
            const text = p.textContent.trim();
            if (text.length > 0) {
              bestDesc += text + '\n';
            }
          }
        });

        // Cleanup: If bestDesc is empty, try direct text content of componentWhat excluding title
        if (!bestDesc.trim()) {
          const clone = componentWhat.cloneNode(true);
          const titleToRemove = clone.querySelector('.prodect-text');
          if (titleToRemove) titleToRemove.remove();
          const linksToRemove = clone.querySelectorAll('a[href*="drive.google.com"]');
          linksToRemove.forEach(l => l.remove()); // Remove links to avoid them in text
          bestDesc = clone.textContent.trim();
        }
      } else {
        // Fallback to previous logic if .component-What is missing
        const descElements = document.querySelectorAll('.description, .product-description, p');
        for (const el of descElements) {
          const text = el.textContent.trim();
          if (text.length > 20 && text.length < 2000) {
            if (el.className.includes('description') || el.className.includes('detail')) {
              bestDesc = text;
              break;
            }
            if (text.length > bestDesc.length) {
              bestDesc = text;
            }
          }
        }
      }
      result.description = bestDesc.trim();

      // Images - Target ONLY the main product image in .abut-img
      const mainImgEl = document.querySelector('.abut-img img');
      if (mainImgEl && mainImgEl.src) {
        result.images.push(mainImgEl.src);
      } else {
        // Fallback: try to find the first large image in the main container if specific class fails
        const allImgs = document.querySelectorAll('article img');
        for (const img of allImgs) {
          if (img.src && img.width > 300 && !img.src.includes('logo') && !img.src.includes('profile')) {
            result.images.push(img.src);
            break; // Take only the first valid large image
          }
        }
      }

      // Inventory
      const tables = Array.from(document.querySelectorAll('table.table-product, table'));
      tables.forEach(table => {
        const headers = Array.from(table.querySelectorAll('th, thead td'))
          .map(h => h.textContent.trim().toLowerCase());

        if (headers.length === 0) return;

        const findCol = (patterns) => headers.findIndex(h => patterns.some(p => p.test(h)));

        const sizeIdx = findCol([/size/i, /مقاس/]);
        const colorIdx = findCol([/color/i, /لون/]);
        const qtyIdx = findCol([/stock/i, /كمية/, /qty/i, /quantity/i, /عدد/]);

        if (colorIdx === -1 && sizeIdx === -1 && qtyIdx === -1) return;

        const rows = Array.from(table.querySelectorAll('tbody tr, tr'));

        rows.forEach((row) => {
          const isHeaderRow = row.querySelectorAll('th').length > 0;
          if (isHeaderRow) return;

          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length === 0) return;

          let size = sizeIdx >= 0 && cells[sizeIdx] ? cells[sizeIdx].textContent.trim() : '';
          let color = colorIdx >= 0 && cells[colorIdx] ? cells[colorIdx].textContent.trim() : '';

          if (size && color && size.includes(color)) {
            const sizeOnly = size.replace(color, '').trim();
            size = sizeOnly || size;
          }

          color = normalizeArabic(color);
          size = normalizeSize(size);

          let qtyText = qtyIdx >= 0 && cells[qtyIdx] ? cells[qtyIdx].textContent : '';
          if (!qtyText) {
            const numCell = cells.find(c => /\d/.test(c.textContent || ''));
            qtyText = numCell ? numCell.textContent : '0';
          }

          const qty = parseInt(qtyText.replace(/\D/g, '')) || 0;

          if (color || size || qty > 0) {
            result.colorSizeInventory.push({
              color: color || 'Default',
              size: size || 'Default',
              quantity: qty
            });

            if (color && !result.colors.includes(color)) result.colors.push(color);
            if (size && !result.sizes.includes(size)) result.sizes.push(size);
            result.totalStock += qty;
          }
        });
      });

      result.colors = Array.from(new Set(result.colors));
      result.sizes = Array.from(new Set(result.sizes.map(s => String(s))));

      return result;
    });

    console.log('\n📊 Extracted Data:');
    console.log('   Title:', data.title);
    console.log('   Seller:', data.seller);
    console.log('   Price:', data.price, 'EGP');
    console.log('   Description length:', (data.description || '').length, 'chars');
    console.log('   Colors:', data.colors);
    console.log('   Sizes:', data.sizes);
    console.log('   Inventory items:', data.colorSizeInventory.length);
    console.log('   Total stock:', data.totalStock);

    return data;
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    return null;
  }
}

function generateStableSKU(link) {
  try {
    const match = link.match(/\/product\/(\d+)/);
    if (match && match[1]) {
      return `V-${match[1]}`;
    }
    let hash = 0;
    for (let i = 0; i < link.length; i++) {
      const char = link.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `V-HASH-${Math.abs(hash)}`;
  } catch (e) {
    return `V-UNKNOWN-${Date.now()}`;
  }
}

async function saveToAppwrite(data, url) {
  try {
    console.log('\n💾 Saving to Appwrite...');

    let description = (data.description || '').trim();
    if (data.mediaLinks && data.mediaLinks.length > 0) {
      const linksText = data.mediaLinks.map((l) => `- ${l}`).join('\n');
      description = `${description}\n\n📎 روابط الميديا:\n${linksText}`.trim();
    }

    const filteredImages = (data.images || [])
      .map(u => String(u).trim())
      .filter((u) => u && u.length < 2000 && u.startsWith('http') && !/logo2?\.png|favicon/i.test(u));

    const originalPrice = data.price || 0;
    const finalPrice = originalPrice + PROFIT_MARGIN;

    const sku = generateStableSKU(url);
    description += `\n\nSKU: ${sku}\nالمصدر: Vendoor`;

    const productData = {
      name: data.title || 'Unnamed Product',
      description: description || 'No description',
      price: finalPrice,
      originalPrice: originalPrice,
      images: filteredImages.length > 0 ? filteredImages : ['https://via.placeholder.com/400'],
      colors: data.colors || [],
      sizes: data.sizes || [],
      colorSizeInventory: JSON.stringify(data.colorSizeInventory || []),
      stock: data.totalStock,
      totalStock: data.totalStock,
      categoryId: 'general',
      source: 'vendoor',
      sourceUrl: url,
      sku: sku,
      status: 'approved',
    };

    // Check if product exists by SKU
    const { Query } = await import('node-appwrite');
    const existing = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      'products',
      [Query.equal('sku', sku)]
    );

    let result;
    if (existing.documents.length > 0) {
      console.log(`🔄 Updating existing product (${existing.documents[0].$id})...`);

      // Update only dynamic fields
      const updateData = {
        stock: data.totalStock,
        totalStock: data.totalStock,
        price: finalPrice,
        originalPrice: originalPrice,
        colors: data.colors || [],
        sizes: data.sizes || [],
        colorSizeInventory: JSON.stringify(data.colorSizeInventory || []),
      };

      result = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        'products',
        existing.documents[0].$id,
        updateData
      );
      console.log('✅ Product updated:', result.$id);
    } else {
      console.log('🆕 Creating new product...');
      result = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        'products',
        ID.unique(),
        productData,
        [
          Permission.read(Role.any()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );
      console.log('✅ Product created:', result.$id);
    }

    return result;
  } catch (error) {
    console.error('❌ Save error:', error.message);
    return null;
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║         Vendoor Single Product Scraper                    ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\n📍 Product URL:', PRODUCT_URL);

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    if (!await login(page)) {
      throw new Error('Login failed');
    }

    const data = await scrapeProduct(page, PRODUCT_URL);

    if (data && data.title) {
      const saved = await saveToAppwrite(data, PRODUCT_URL);
      if (saved) {
        console.log('\n✅ SUCCESS! Product saved to database');
        console.log('   Product ID:', saved.$id);
        console.log('   Name:', saved.name);
        console.log('   Stock:', saved.stock);
      }
    } else {
      console.log('\n❌ Failed to extract product data');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
  } finally {
    await browser.close();
  }
}

main();
