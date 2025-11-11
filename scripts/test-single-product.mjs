import puppeteer from 'puppeteer';
import fs from 'fs';

const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';
const VENDOOR_LOGIN_URL = 'https://aff.ven-door.com/login';

// Test with one product
const TEST_PRODUCT_URL = 'https://aff.ven-door.com/product/3178';

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
    await page.screenshot({ path: 'login-error.png' });
    return false;
  }
}

async function scrapeProduct(page, url) {
  try {
    console.log('\n📦 Opening product page...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for content to load
    await new Promise(r => setTimeout(r, 3000));
    
    // Scroll down to load all content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2000));
    
    // Save HTML for debugging
    const html = await page.content();
    fs.writeFileSync('test-product-page.html', html, 'utf8');
    console.log('📄 HTML saved: test-product-page.html');
    
    // Take screenshot
    await page.screenshot({ path: 'test-product-page.png', fullPage: true });
    console.log('📸 Screenshot saved: test-product-page.png');
    
    const data = await page.evaluate(() => {
      const result = {
        title: '',
        seller: '',
        price: 0,
        description: '',
        images: [],
        colors: [],
        sizes: [],
        colorSizeInventory: [],
        totalStock: 0
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
      
      // Description
      const descEl = document.querySelector('p.prodcut-titles');
      if (descEl) {
        const clonedDesc = descEl.cloneNode(true);
        const links = clonedDesc.querySelectorAll('a');
        links.forEach(link => link.remove());
        result.description = clonedDesc.textContent.trim();
      }
      
      // Fallback for description
      if (!result.description || result.description.length < 10) {
        const allPs = Array.from(document.querySelectorAll('.component-What p, section p'));
        for (const p of allPs) {
          const text = p.textContent.trim();
          if (text.length > 20 && !text.includes('السعر') && !text.includes('البائع')) {
            result.description = text;
            break;
          }
        }
      }
      
      // Table inventory
      const tables = Array.from(document.querySelectorAll('table.table-product, table'));
      console.log('Found tables:', tables.length);
      
      tables.forEach((table, tIdx) => {
        const headers = Array.from(table.querySelectorAll('th, thead td'))
          .map(h => h.textContent.trim().toLowerCase());
        
        console.log('Table', tIdx, 'headers:', headers);
        
        const findCol = (patterns) => headers.findIndex(h => patterns.some(p => p.test(h)));
        
        const sizeIdx = findCol([/size/i, /مقاس/]);
        const colorIdx = findCol([/color/i, /لون/]);
        const qtyIdx = findCol([/stock/i, /كمية/, /qty/i, /quantity/i, /عدد/]);
        
        console.log('Columns:', { sizeIdx, colorIdx, qtyIdx });
        
        if (colorIdx === -1 && sizeIdx === -1 && qtyIdx === -1) {
          console.log('Skipping table - no relevant columns');
          return;
        }
        
        const rows = Array.from(table.querySelectorAll('tbody tr, tr'));
        console.log('Found rows:', rows.length);
        
        rows.forEach((row, idx) => {
          const isHeaderRow = row.querySelectorAll('th').length > 0;
          if (isHeaderRow) {
            console.log('Row', idx, 'is header, skipping');
            return;
          }
          
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length === 0) {
            console.log('Row', idx, 'has no td cells');
            return;
          }
          
          let size = sizeIdx >= 0 && cells[sizeIdx] ? cells[sizeIdx].textContent.trim() : '';
          let color = colorIdx >= 0 && cells[colorIdx] ? cells[colorIdx].textContent.trim() : '';
          let qtyText = qtyIdx >= 0 && cells[qtyIdx] ? cells[qtyIdx].textContent.trim() : '';
          
          if (!qtyText) {
            const numCell = cells.find(c => /\d/.test(c.textContent || ''));
            qtyText = numCell ? numCell.textContent.trim() : '0';
          }
          
          const qty = parseInt(qtyText.replace(/\D/g, '')) || 0;
          
          console.log('Row', idx, ':', { size, color, qty });
          
          if (color || size || qty > 0) {
            // Extract size number from combined "color size"
            if (size && color && size.includes(color)) {
              const sizeOnly = size.replace(color, '').trim();
              size = sizeOnly || size;
            }
            
            result.colorSizeInventory.push({ color: color || 'Default', size: size || 'Default', quantity: qty });
            if (color && !result.colors.includes(color)) result.colors.push(color);
            if (size && !result.sizes.includes(size)) result.sizes.push(size);
            result.totalStock += qty;
          }
        });
      });
      
      return result;
    });
    
    console.log('\n📊 Extracted Data:');
    console.log('Title:', data.title);
    console.log('Seller:', data.seller);
    console.log('Price:', data.price);
    console.log('Description:', data.description?.substring(0, 100) + '...');
    console.log('Description length:', (data.description || '').length);
    console.log('Colors:', data.colors);
    console.log('Sizes:', data.sizes);
    console.log('Inventory items:', data.colorSizeInventory.length);
    console.log('Total stock:', data.totalStock);
    
    if (data.colorSizeInventory.length > 0) {
      console.log('\nSample inventory:');
      data.colorSizeInventory.slice(0, 3).forEach(item => {
        console.log(`  ${item.color} - ${item.size}: ${item.quantity}`);
      });
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    if (!await login(page)) {
      throw new Error('Login failed');
    }
    
    await scrapeProduct(page, TEST_PRODUCT_URL);
    
    console.log('\n✅ Test complete! Check test-product-page.png');
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await browser.close();
  }
}

main();
