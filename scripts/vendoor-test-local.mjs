import puppeteer from 'puppeteer';
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import fs from 'fs';

// ========================================
// Configuration
// ========================================

const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';
const VENDOOR_LOGIN_URL = 'https://aff.ven-door.com/login';
const VENDOOR_PRODUCTS_URL = 'https://aff.ven-door.com/products';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68d8b9db00134c41e7c8';
const APPWRITE_API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const APPWRITE_DATABASE_ID = '68de037e003bd03c4d45';
const APPWRITE_PRODUCTS_COLLECTION_ID = 'products';
const APPWRITE_CATEGORIES_COLLECTION_ID = 'categories';

// Test mode - process only first N products
const TEST_MODE = true;
const TEST_LIMIT = 3; // Number of products to test

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// ========================================
// Helper Functions
// ========================================

function generateVendoorSKU(index) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `VD-${timestamp}-${random}-${index}`.toUpperCase();
}

async function getOrCreateVendoorCategory() {
  try {
    const categories = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_CATEGORIES_COLLECTION_ID
    );
    
    const vendoorCategory = categories.documents.find(
      cat => cat.name === 'Vendoor Products'
    );
    
    if (vendoorCategory) {
      console.log('✅ Found Vendoor category:', vendoorCategory.$id);
      return vendoorCategory.$id;
    }
    
    const newCategory = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_CATEGORIES_COLLECTION_ID,
      ID.unique(),
      {
        name: 'Vendoor Products',
        description: 'Products from Vendoor marketplace',
        image: 'https://via.placeholder.com/400'
      },
      [Permission.read(Role.any())]
    );
    
    console.log('✅ Created Vendoor category:', newCategory.$id);
    return newCategory.$id;
  } catch (error) {
    console.error('❌ Error with category:', error.message);
    return null;
  }
}

// ========================================
// Scraping Functions
// ========================================

async function login(page) {
  try {
    console.log('🔐 Logging in to Vendoor...');
    await page.goto(VENDOOR_LOGIN_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'login-page.png' });
    console.log('📸 Screenshot saved: login-page.png');
    
    // Wait a bit for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Try multiple selectors for email field
    const emailSelectors = [
      'input[name="email"]',
      'input[type="email"]',
      'input[id*="email"]',
      'input[placeholder*="email"]',
      '#email',
      '.email-input',
      // Vendoor uses a single text field named "name" for email/phone
      'input[name="name"]',
      '#name'
    ];
    
    let emailField = null;
    for (const selector of emailSelectors) {
      try {
        emailField = await page.$(selector);
        if (emailField) {
          console.log(`✅ Found email field with: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!emailField) {
      // Print all input fields for debugging
      const allInputs = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        return inputs.map(input => ({
          type: input.type,
          name: input.name,
          id: input.id,
          placeholder: input.placeholder,
          class: input.className
        }));
      });
      console.log('\n📋 All input fields found:');
      console.log(JSON.stringify(allInputs, null, 2));
      throw new Error('Email field not found. Check login-page.png');
    }
    
    // Type email
    await emailField.type(VENDOOR_EMAIL);
    console.log('✅ Email entered');
    
    // Try multiple selectors for password field
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      '#password',
      '.password-input'
    ];
    
    let passwordField = null;
    for (const selector of passwordSelectors) {
      try {
        passwordField = await page.$(selector);
        if (passwordField) {
          console.log(`✅ Found password field with: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!passwordField) {
      throw new Error('Password field not found');
    }
    
    await passwordField.type(VENDOOR_PASSWORD);
    console.log('✅ Password entered');
    
    // Take screenshot before submit
    await page.screenshot({ path: 'before-submit.png' });
    
    // Try to find submit button
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      '.submit-button',
      '.login-button'
    ];
    
    let submitted = false;
    for (const selector of submitSelectors) {
      try {
        const button = await page.$(selector);
        if (button) {
          console.log(`✅ Found submit button with: ${selector}`);
          await button.click();
          // Wait for either navigation OR a post-login element
          await Promise.race([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => null),
            page.waitForSelector('a[href*="logout"], a[href*="/products"], .sidebar, nav', { timeout: 60000 }).catch(() => null)
          ]);
          submitted = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    // If no CSS button found, try XPath by text (Arabic/English)
    if (!submitted) {
      const xpaths = [
        "//button[contains(., 'تسجيل') or contains(., 'الدخول') or contains(., 'دخول') or contains(., 'Login') or contains(., 'LOG IN')]",
        "//input[@type='submit']"
      ];
      for (const xp of xpaths) {
        const handles = await page.$x(xp);
        if (handles && handles.length > 0) {
          console.log(`✅ Found submit via XPath: ${xp}`);
          await handles[0].click();
          await Promise.race([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => null),
            page.waitForSelector('a[href*="logout"], a[href*="/products"], .sidebar, nav', { timeout: 60000 }).catch(() => null)
          ]);
          submitted = true;
          break;
        }
      }
    }

    if (!submitted) {
      // Try submitting the form directly
      const formSubmitted = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) {
          form.submit();
          return true;
        }
        return false;
      });
      if (formSubmitted) {
        await Promise.race([
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => null),
          page.waitForSelector('a[href*="logout"], a[href*="/products"], .sidebar, nav', { timeout: 60000 }).catch(() => null)
        ]);
      } else {
        // Fallback: press Enter
        await passwordField.press('Enter');
        await Promise.race([
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => null),
          page.waitForSelector('a[href*="logout"], a[href*="/products"], .sidebar, nav', { timeout: 60000 }).catch(() => null)
        ]);
      }
    }
    
    // Take screenshot after login
    await page.screenshot({ path: 'after-login.png' });
    
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    await page.screenshot({ path: 'login-error.png' });
    console.log('📸 Error screenshot saved: login-error.png');
    return false;
  }
}

async function scrapeProductList(page) {
  try {
    console.log('\n📋 Loading products page...');
    await page.goto(VENDOOR_PRODUCTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await Promise.race([
      page.waitForSelector('.product-card, .card, table, a[href*="/product"], a[href*="/products"]', { timeout: 30000 }).catch(() => null),
      new Promise(r => setTimeout(r, 5000))
    ]);
    await page.screenshot({ path: 'products-page.png' });
    const html = await page.content();
    fs.writeFileSync('products-page.html', html);
    
    let products = await page.evaluate(() => {
      const results = [];
      
      const cards = Array.from(document.querySelectorAll('.product-card, .card'))
        .filter((card) => !!card.querySelector('a[href*="/product"], a[href*="/products"]'));
      
      cards.forEach((card) => {
        const titleEl = card.querySelector('.product-title, h3, h4, .card-title, .title') || card.querySelector('a[href*="/product"], a[href*="/products"]');
        const priceEl = card.querySelector('.price, .product-price, .card-price, [class*="price"]');
        const imageEl = card.querySelector('img');
        const linkEl = card.querySelector('a[href*="/product"], a[href*="/products"]');
        const title = (titleEl && titleEl.textContent ? titleEl.textContent.trim() : 'No Title');
        const price = (priceEl && priceEl.textContent ? priceEl.textContent.trim() : '0');
        const srcset = imageEl ? (imageEl.getAttribute('srcset') || '') : '';
        let imgUrl = imageEl ? (imageEl.getAttribute('src') || imageEl.getAttribute('data-src') || '') : '';
        if (!imgUrl && srcset) imgUrl = srcset.split(',')[0]?.trim().split(' ')[0] || '';
        const link = linkEl ? linkEl.href : '';
        if (link) results.push({ title, price, image: imgUrl, link });
      });
      
      if (results.length === 0) {
        const tables = Array.from(document.querySelectorAll('table'));
        tables.forEach((table) => {
          const rows = Array.from(table.querySelectorAll('tbody tr'));
          rows.forEach((row) => {
            const a = row.querySelector('a[href*="/product"], a[href*="/products"]');
            if (!a) return;
            const tds = Array.from(row.querySelectorAll('td'));
            let priceText = '0';
            const priceCell = tds.find(td => /\d/.test(td.textContent || ''));
            if (priceCell) priceText = (priceCell.textContent || '').trim();
            const imgEl = row.querySelector('img');
            const srcset = imgEl ? (imgEl.getAttribute('srcset') || '') : '';
            let image = imgEl ? (imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || '') : '';
            if (!image && srcset) image = srcset.split(',')[0]?.trim().split(' ')[0] || '';
            results.push({
              title: (a.textContent || '').trim() || 'No Title',
              price: priceText,
              image,
              link: a.href
            });
          });
        });
      }
      
      if (results.length === 0) {
        const anchors = Array.from(document.querySelectorAll('a[href*="/product"], a[href*="/products"]'));
        anchors.forEach((a) => {
          const img = a.querySelector('img');
          const srcset = img ? (img.getAttribute('srcset') || '') : '';
          let image = img ? (img.getAttribute('src') || img.getAttribute('data-src') || '') : '';
          if (!image && srcset) image = srcset.split(',')[0]?.trim().split(' ')[0] || '';
          let price = '0';
          const parent = a.closest('.product, .item, .row, .col, .card, li');
          if (parent) {
            const priceEl = parent.querySelector('.price, .product-price, [class*="price"]');
            if (priceEl) price = (priceEl.textContent || '').trim();
          }
          results.push({
            title: (a.textContent || '').trim() || 'No Title',
            price,
            image,
            link: a.href
          });
        });
      }
      
      return results;
    });
    
    console.log(`✅ Found ${products.length} products`);
    if (products.length === 0) {
      console.log('⚠️ No products detected. Trying to navigate via navbar link...');
      const xpaths = [
        "//a[contains(., 'المنتجات')]",
        "//a[contains(., 'جميع المنتجات')]",
        "//a[contains(., 'Products')]",
        "//a[contains(., 'All Products')]"
      ];
      for (const xp of xpaths) {
        const handles = await page.$x(xp);
        if (handles && handles.length > 0) {
          await handles[0].click();
          await Promise.race([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => null),
            page.waitForSelector('a[href*="/product"], a[href*="/products"], .card', { timeout: 30000 }).catch(() => null)
          ]);
          await new Promise(r => setTimeout(r, 1500));
          await page.screenshot({ path: 'products-page-2.png' });
          const html2 = await page.content();
          fs.writeFileSync('products-page-2.html', html2);
          products = await page.evaluate(() => {
            const results = [];
            const anchors = Array.from(document.querySelectorAll('a[href*="/product"], a[href*="/products"]'));
            anchors.forEach((a) => {
              const img = a.querySelector('img');
              const srcset = img ? (img.getAttribute('srcset') || '') : '';
              let image = img ? (img.getAttribute('src') || img.getAttribute('data-src') || '') : '';
              if (!image && srcset) image = srcset.split(',')[0]?.trim().split(' ')[0] || '';
              let price = '0';
              const parent = a.closest('.product, .item, .row, .col, .card, li');
              if (parent) {
                const priceEl = parent.querySelector('.price, .product-price, [class*="price"]');
                if (priceEl) price = (priceEl.textContent || '').trim();
              }
              results.push({ title: (a.textContent || '').trim() || 'No Title', price, image, link: a.href });
            });
            return results;
          });
          break;
        }
      }
    }
    console.log(`✅ Final products count: ${products.length}`);
    return products;
  } catch (error) {
    console.error('❌ Error scraping products:', error.message);
    return [];
  }
}

async function scrapeProductDetails(page, productUrl) {
  try {
    console.log('   🔍 Scraping details...');
    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const details = await page.evaluate(() => {
      const data = {
        productImages: [],
        variants: [],
        totalStock: 0,
        colors: [],
        sizes: [],
        colorSizeInventory: []
      };
      const addImage = (url) => {
        if (url && url.startsWith('http') && !data.productImages.includes(url)) {
          data.productImages.push(url);
        }
      };
      const imgs = Array.from(document.querySelectorAll('.product-gallery img, .image-gallery img, .product-images img, img'));
      imgs.forEach((img) => {
        const srcset = img.getAttribute('srcset') || '';
        const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
        if (src) addImage(src);
        if (srcset) {
          const first = srcset.split(',')[0]?.trim().split(' ')[0] || '';
          addImage(first);
        }
      });
      const og = document.querySelector('meta[property="og:image"]');
      if (og && og.content) addImage(og.content);

      const tables = Array.from(document.querySelectorAll('table'));
      tables.forEach((table) => {
        let headerCells = Array.from(table.querySelectorAll('thead th'));
        if (headerCells.length === 0) {
          const firstRow = table.querySelector('tr');
          if (firstRow) headerCells = Array.from(firstRow.querySelectorAll('th, td'));
        }
        const headers = headerCells.map(h => (h.textContent || '').trim().toLowerCase());
        const findIdx = (patterns) => headers.findIndex(text => patterns.some(p => p.test(text)));
        const colorIdx = findIdx([/لون/, /color/]);
        const sizeIdx = findIdx([/مقاس/, /size/]);
        const qtyIdx = findIdx([/كمية/, /quantity/, /qty/, /stock/]);
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        rows.forEach(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length === 0) return;
          const color = colorIdx >= 0 ? (cells[colorIdx]?.textContent || '').trim() : '';
          const size = sizeIdx >= 0 ? (cells[sizeIdx]?.textContent || '').trim() : '';
          let stockText = qtyIdx >= 0 ? (cells[qtyIdx]?.textContent || '0') : '';
          if (!stockText) {
            const probable = cells.find(td => /\d/.test(td.textContent || ''));
            stockText = (probable?.textContent || '0');
          }
          const stock = parseInt(stockText.replace(/\D/g, '')) || 0;
          if ((color || size) || stock > 0) {
            const variant = { color, size, stock };
            data.variants.push(variant);
            data.colorSizeInventory.push({ color: color || 'Default', size: size || 'Default', quantity: stock });
            if (color && !data.colors.includes(color)) data.colors.push(color);
            if (size && !data.sizes.includes(size)) data.sizes.push(size);
            data.totalStock += stock;
          }
        });
      });
    
      return data;
    });
    
    return details;
  } catch (error) {
    console.error('   ❌ Error scraping details:', error.message);
    return null;
  }
}

async function addProductToAppwrite(product, categoryId, page, productIndex) {
  try {
    // Ignore certain products
    const ignoreList = ['لوحة التحكم', 'تسجيل الخروج', 'أضف اوردر', 'جميع المنتجات', 'المنتجات الخاصه', 'فيديو'];
    if (ignoreList.some(term => product.title.includes(term))) {
      console.log(`   ⏭️ Skipped: ${product.title}`);
      return null;
    }
    
    // Parse price
    const price = parseFloat(product.price.replace(/[^\d.]/g, '')) || 0;
    if (price < 50 || price > 100000) {
      console.log(`   ⏭️ Invalid price (${price}): ${product.title}`);
      return null;
    }
    
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📦 Product #${productIndex + 1}: ${product.title.substring(0, 50)}...`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    // Scrape details
    const details = await scrapeProductDetails(page, product.link);
    if (!details) {
      console.log('   ❌ Failed to scrape details');
      return null;
    }
    
    // Prepare images
    const productImages = details.productImages.length > 0 
      ? details.productImages 
      : (product.image ? [product.image] : ['https://via.placeholder.com/400']);
    
    // Generate SKU
    const sku = generateVendoorSKU(productIndex);
    
    // Build description
    let description = `${product.title}\n\n`;
    description += `📦 SKU: ${sku}\n`;
    description += `🏪 المصدر: Vendoor\n`;
    description += `🔗 الرابط: ${product.link}\n\n`;
    
    if (details.colorSizeInventory.length > 0) {
      description += '🎨 المخزون المتاح:\n';
      details.colorSizeInventory.forEach((item, i) => {
        description += `${i + 1}. ${item.color} / ${item.size}: ${item.quantity} قطعة\n`;
      });
      description += `\n📊 الإجمالي: ${details.totalStock} قطعة\n`;
    }
    
    // Prepare product data
    const productData = {
      name: product.title,
      description: description.substring(0, 1500),
      price: price,
      originalPrice: price, // Store original Vendoor price
      images: productImages,
      category: categoryId, // Use 'category' not 'categoryId'
      sku: sku,
      source: 'vendoor',
      status: 'draft',
      inStock: details.totalStock > 0,
      stock: details.totalStock,
      stockQuantity: details.totalStock,
      // NEW: Add inventory fields
      colors: details.colors,
      sizes: details.sizes,
      colorSizeInventory: JSON.stringify(details.colorSizeInventory)
    };
    
    console.log('\n📋 Product Data to Save:');
    console.log('   Name:', productData.name);
    console.log('   Price:', productData.price);
    console.log('   Images:', productData.images.length);
    console.log('   Stock:', productData.stock);
    console.log('   Colors:', productData.colors);
    console.log('   Sizes:', productData.sizes);
    console.log('   Inventory Items:', details.colorSizeInventory.length);
    
    // Save to Appwrite
    const document = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_PRODUCTS_COLLECTION_ID,
      ID.unique(),
      productData,
      [Permission.read(Role.any())]
    );
    
    console.log('\n✅ Product Saved!');
    console.log('   ID:', document.$id);
    console.log('   Stock saved:', document.stock);
    console.log('   Colors saved:', document.colors);
    console.log('   Sizes saved:', document.sizes);
    console.log('   Inventory saved:', document.colorSizeInventory ? 'YES' : 'NO');
    
    return document;
    
  } catch (error) {
    console.error('\n❌ Error saving product:', error.message);
    if (error.response) {
      console.error('   Response:', error.response);
    }
    return null;
  }
}

// ========================================
// Main Function
// ========================================

async function scrapeVendoorProducts() {
  const startTime = Date.now();
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║   🧪 VENDOOR SCRAPER - TEST MODE (LOCAL)                 ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🔬 Test Limit: ${TEST_LIMIT} products`);
  console.log(`📊 Full Logging: Enabled`);
  console.log('');
  
  // Get category
  const categoryId = await getOrCreateVendoorCategory();
  if (!categoryId) {
    console.error('❌ Failed to get category');
    process.exit(1);
  }
  
  // Launch browser
  console.log('\n🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Set user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  let stats = {
    total: 0,
    added: 0,
    skipped: 0,
    failed: 0
  };
  
  try {
    // Login
    const loginSuccess = await login(page);
    if (!loginSuccess) {
      throw new Error('Login failed');
    }
    
    // Get products
    const products = await scrapeProductList(page);
    if (products.length === 0) {
      throw new Error('No products found');
    }
    
    stats.total = TEST_MODE ? Math.min(products.length, TEST_LIMIT) : products.length;
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔄 Processing ${stats.total} products...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Process products
    const productsToProcess = TEST_MODE ? products.slice(0, TEST_LIMIT) : products;
    
    for (let i = 0; i < productsToProcess.length; i++) {
      const product = productsToProcess[i];
      
      const result = await addProductToAppwrite(product, categoryId, page, i);
      
      if (result) {
        stats.added++;
      } else {
        stats.failed++;
      }
      
      // Wait between products to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
  
  // Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║                   📊 FINAL REPORT                         ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`⏱️  Duration: ${duration}s`);
  console.log(`📦 Total Processed: ${stats.total}`);
  console.log(`✅ Successfully Added: ${stats.added}`);
  console.log(`⏭️  Skipped: ${stats.skipped}`);
  console.log(`❌ Failed: ${stats.failed}`);
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

// Run
scrapeVendoorProducts()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
