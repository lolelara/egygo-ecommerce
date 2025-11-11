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

// Test mode
const TEST_MODE = true;
const TEST_LIMIT = 5;

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
// Login Function
// ========================================

async function login(page) {
  try {
    console.log('🔐 Logging in to Vendoor...');
    await page.goto(VENDOOR_LOGIN_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find and fill email/name field
    const emailField = await page.$('input[name="name"]') || await page.$('input[type="email"]');
    if (!emailField) throw new Error('Email field not found');
    
    await emailField.type(VENDOOR_EMAIL);
    console.log('✅ Email entered');
    
    // Find and fill password
    const passwordField = await page.$('input[name="password"]') || await page.$('input[type="password"]');
    if (!passwordField) throw new Error('Password field not found');
    
    await passwordField.type(VENDOOR_PASSWORD);
    console.log('✅ Password entered');
    
    // Submit
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => null),
        page.waitForSelector('a[href*="/products"], nav', { timeout: 60000 }).catch(() => null)
      ]);
    }
    
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    return false;
  }
}

// ========================================
// Get Product Links from List Page
// ========================================

async function getProductLinks(page) {
  try {
    console.log('\n📋 Getting product links...');
    await page.goto(VENDOOR_PRODUCTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const links = await page.evaluate(() => {
      const results = [];
      
      // Try multiple selectors
      const anchors = Array.from(document.querySelectorAll('a[href*="/product"]'));
      
      anchors.forEach((a) => {
        const href = a.href;
        // Make sure it's a full product page URL
        if (href && href.includes('/product') && !results.includes(href)) {
          results.push(href);
        }
      });
      
      return results;
    });
    
    console.log(`✅ Found ${links.length} product links`);
    return links;
  } catch (error) {
    console.error('❌ Error getting links:', error.message);
    return [];
  }
}

// ========================================
// Scrape Individual Product Page
// ========================================

async function scrapeProductPage(page, productUrl, index) {
  try {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📦 Product #${index + 1}: ${productUrl}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot for debugging
    await page.screenshot({ path: `product-${index + 1}.png` });
    
    const productData = await page.evaluate(() => {
      const data = {
        title: '',
        price: 0,
        description: '',
        images: [],
        colors: [],
        sizes: [],
        colorSizeInventory: [],
        totalStock: 0
      };
      
      // 1. Get Title
      const titleEl = document.querySelector('h1, .product-title, .product-name');
      data.title = titleEl ? titleEl.textContent.trim() : 'Untitled Product';
      
      // 2. Get Price
      const priceEl = document.querySelector('.price, .product-price, [class*="price"]');
      if (priceEl) {
        const priceText = priceEl.textContent.trim();
        data.price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
      }
      
      // 3. Get Description
      const descEl = document.querySelector('.description, .product-description, p');
      if (descEl) {
        data.description = descEl.textContent.trim().substring(0, 500);
      }
      
      // 4. Get Images
      const addImage = (url) => {
        if (url && url.startsWith('http') && !data.images.includes(url)) {
          data.images.push(url);
        }
      };
      
      // Main product images
      const imgs = Array.from(document.querySelectorAll('img'));
      imgs.forEach((img) => {
        const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
        const srcset = img.getAttribute('srcset') || '';
        if (src) addImage(src);
        if (srcset) {
          const first = srcset.split(',')[0]?.trim().split(' ')[0] || '';
          if (first) addImage(first);
        }
      });
      
      // OG image
      const og = document.querySelector('meta[property="og:image"]');
      if (og && og.content) addImage(og.content);
      
      // 5. Get Variants from ALL tables
      const tables = Array.from(document.querySelectorAll('table'));
      
      tables.forEach((table) => {
        // Get headers
        let headerCells = Array.from(table.querySelectorAll('thead th'));
        if (headerCells.length === 0) {
          const firstRow = table.querySelector('tr');
          if (firstRow) {
            headerCells = Array.from(firstRow.querySelectorAll('th, td'));
          }
        }
        
        const headers = headerCells.map(h => (h.textContent || '').trim().toLowerCase());
        
        // Find column indices
        const findIdx = (patterns) => {
          return headers.findIndex(text => patterns.some(p => p.test(text)));
        };
        
        const colorIdx = findIdx([/لون/, /color/i]);
        const sizeIdx = findIdx([/مقاس/, /size/i]);
        const qtyIdx = findIdx([/كمية/, /quantity/i, /qty/i, /stock/i, /عدد/]);
        
        // If no headers match, skip this table
        if (colorIdx === -1 && sizeIdx === -1 && qtyIdx === -1) {
          return;
        }
        
        // Get data rows
        const rows = Array.from(table.querySelectorAll('tbody tr, tr'));
        
        rows.forEach((row, rowIdx) => {
          // Skip header row
          if (rowIdx === 0 && headerCells.length > 0) return;
          
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length === 0) return;
          
          // Extract data
          const color = colorIdx >= 0 && cells[colorIdx] 
            ? cells[colorIdx].textContent.trim() 
            : '';
            
          const size = sizeIdx >= 0 && cells[sizeIdx] 
            ? cells[sizeIdx].textContent.trim() 
            : '';
          
          let stockText = '';
          if (qtyIdx >= 0 && cells[qtyIdx]) {
            stockText = cells[qtyIdx].textContent || '0';
          } else {
            // Try to find any cell with numbers
            const numCell = cells.find(td => /\d/.test(td.textContent || ''));
            if (numCell) stockText = numCell.textContent || '0';
          }
          
          const stock = parseInt(stockText.replace(/\D/g, '')) || 0;
          
          // Only add if we have meaningful data
          if (color || size || stock > 0) {
            // Add to colorSizeInventory
            data.colorSizeInventory.push({
              color: color || 'Default',
              size: size || 'Default',
              quantity: stock
            });
            
            // Track unique colors
            if (color && !data.colors.includes(color)) {
              data.colors.push(color);
            }
            
            // Track unique sizes
            if (size && !data.sizes.includes(size)) {
              data.sizes.push(size);
            }
            
            // Add to total stock
            data.totalStock += stock;
          }
        });
      });
      
      return data;
    });
    
    console.log('\n📊 Scraped Data:');
    console.log('   Title:', productData.title);
    console.log('   Price:', productData.price);
    console.log('   Images:', productData.images.length);
    console.log('   Colors:', productData.colors);
    console.log('   Sizes:', productData.sizes);
    console.log('   Inventory Items:', productData.colorSizeInventory.length);
    console.log('   Total Stock:', productData.totalStock);
    
    return productData;
    
  } catch (error) {
    console.error('   ❌ Error scraping product:', error.message);
    return null;
  }
}

// ========================================
// Save Product to Appwrite
// ========================================

async function saveProductToAppwrite(productData, categoryId, index) {
  try {
    // Validate price
    if (productData.price < 50 || productData.price > 100000) {
      console.log(`   ⏭️ Invalid price (${productData.price})`);
      return null;
    }
    
    // Generate SKU
    const sku = generateVendoorSKU(index);
    
    // Prepare description (simple, without redundant inventory data)
    let description = productData.description || productData.title;
    description += `\n\n📦 SKU: ${sku}`;
    description += `\n🏪 المصدر: Vendoor`;
    
    // Prepare data for Appwrite
    const appwriteData = {
      name: productData.title,
      description: description.substring(0, 1500),
      price: productData.price,
      originalPrice: productData.price,
      images: productData.images.length > 0 ? productData.images : ['https://via.placeholder.com/400'],
      category: categoryId,
      sku: sku,
      source: 'vendoor',
      status: 'draft',
      inStock: productData.totalStock > 0,
      stock: productData.totalStock,
      stockQuantity: productData.totalStock,
      // ✅ الحقول الصحيحة للمقاسات والألوان
      colors: productData.colors,
      sizes: productData.sizes,
      colorSizeInventory: JSON.stringify(productData.colorSizeInventory)
    };
    
    console.log('\n💾 Saving to Appwrite...');
    console.log('   colors:', appwriteData.colors);
    console.log('   sizes:', appwriteData.sizes);
    console.log('   colorSizeInventory:', productData.colorSizeInventory.length, 'items');
    
    // Save to database
    const document = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_PRODUCTS_COLLECTION_ID,
      ID.unique(),
      appwriteData,
      [Permission.read(Role.any())]
    );
    
    console.log('✅ Product Saved!');
    console.log('   ID:', document.$id);
    console.log('   Name:', document.name);
    console.log('   Price:', document.price);
    console.log('   Stock:', document.stock);
    console.log('   Colors saved:', document.colors ? document.colors.length : 0);
    console.log('   Sizes saved:', document.sizes ? document.sizes.length : 0);
    
    return document;
    
  } catch (error) {
    console.error('\n❌ Error saving to Appwrite:', error.message);
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response, null, 2));
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
  console.log('║   🚀 VENDOOR SCRAPER - FIXED VERSION                     ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🔬 Test Limit: ${TEST_LIMIT} products`);
  console.log(`📊 Opens each product page individually`);
  console.log(`✅ Saves to correct database fields`);
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
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
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
    
    // Get product links
    const productLinks = await getProductLinks(page);
    if (productLinks.length === 0) {
      throw new Error('No product links found');
    }
    
    stats.total = TEST_MODE ? Math.min(productLinks.length, TEST_LIMIT) : productLinks.length;
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔄 Processing ${stats.total} products...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Process products
    const linksToProcess = TEST_MODE ? productLinks.slice(0, TEST_LIMIT) : productLinks;
    
    for (let i = 0; i < linksToProcess.length; i++) {
      const link = linksToProcess[i];
      
      // Scrape product page
      const productData = await scrapeProductPage(page, link, i);
      
      if (!productData) {
        stats.failed++;
        continue;
      }
      
      // Save to Appwrite
      const saved = await saveProductToAppwrite(productData, categoryId, i);
      
      if (saved) {
        stats.added++;
      } else {
        stats.failed++;
      }
      
      // Wait between products
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
  
  if (stats.added > 0) {
    console.log('✅ النجاح! البيانات محفوظة في الحقول الصحيحة:');
    console.log('   - colors: Array of colors');
    console.log('   - sizes: Array of sizes');
    console.log('   - colorSizeInventory: JSON with quantities');
    console.log('   - stock: Total stock');
  }
  
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
