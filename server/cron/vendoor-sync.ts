import cron from 'node-cron';
import { chromium } from 'playwright';

const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';

const BASE = 'https://aff.ven-door.com';
const LOGIN_URL = `${BASE}/login`;
const PRODUCTS_URL = (page: number) => `${BASE}/products?page=${page}`;

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

/**
 * تسجيل الدخول إلى Vendoor
 */
async function loginToVendoor(page: any, email: string, password: string) {
  console.log('🔐 [CRON] Logging in to Vendoor...');
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);
  
  await page.waitForSelector('input[name="name"]', { timeout: 10000 });
  await page.type('input[name="name"]', email, { delay: 50 });
  await page.type('input[type="password"]', password, { delay: 50 });
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {}),
    page.click('button[type="submit"]')
  ]).catch(() => {});
  
  await sleep(5000);
  
  if (page.url().includes('login')) {
    throw new Error('فشل تسجيل الدخول');
  }
  
  console.log('✅ [CRON] Login successful');
}

/**
 * جلب منتجات من صفحة واحدة
 */
async function scrapeProductsPage(page: any, pageNum: number) {
  const url = PRODUCTS_URL(pageNum);
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  
  await page.waitForSelector('table tbody tr a[href*="/product/"]', { timeout: 10000 }).catch(() => {});
  
  const products = await page.evaluate(`
    (function() {
      var out = [];
      var pickText = function(el) {
        if (!el) return '';
        var text = el.innerText || el.textContent || '';
        return String(text).trim();
      };
      
      var rows = document.querySelectorAll('table tbody tr');
      for (var i = 0; i < rows.length; i++) {
        try {
          var row = rows[i];
          var tds = row.querySelectorAll('td');
          if (!tds || tds.length < 3) continue;

          var imgA = tds[1] && tds[1].querySelector('a img');
          var titleA = (tds[3] && tds[3].querySelector('a')) || (tds[2] && tds[2].querySelector('a'));
          var secondaryA = tds[2] && tds[2].querySelector('a');
          var priceA = tds[4] && tds[4].querySelector('a, span, div, b, strong');
          var commissionA = tds[5] && tds[5].querySelector('a, span, div, b, strong');
          var stockSpan = tds[6] && tds[6].querySelector('span.stock-odd, span, div');

          var image = imgA ? (imgA.getAttribute('src') || imgA.getAttribute('data-src') || '') : '';
          var title = pickText(titleA) || pickText(tds[3]) || pickText(tds[2]) || pickText(row);
          var supplier = pickText(secondaryA) || pickText(tds[2]) || pickText(tds[3]);
          var price = pickText(priceA) || pickText(tds[4]);
          var commission = pickText(commissionA) || pickText(tds[5]);
          var stock = pickText(stockSpan) || pickText(tds[6]);

          var id = '';
          var linkEl = titleA || row.querySelector('a[href*="/product/"]');
          var rawHref = linkEl ? (linkEl.getAttribute('href') || linkEl.href || '').trim() : '';
          if (rawHref) {
            try {
              var a = document.createElement('a');
              a.href = rawHref;
              var parts = a.pathname.split('/').filter(function(p) { return p; });
              var idxp = -1;
              for (var j = 0; j < parts.length; j++) {
                if (parts[j] === 'products' || parts[j] === 'product') { idxp = j; break; }
              }
              if (idxp >= 0 && parts[idxp + 1]) id = parts[idxp + 1];
              else id = parts[parts.length - 1] || '';
            } catch (e) {}
          }

          if (title) {
            out.push({ 
              id: id || ('row-' + (i + 1)), 
              title: title, 
              supplier: supplier, 
              price: price, 
              commission: commission, 
              stock: stock, 
              image: image 
            });
          }
        } catch (e) {}
      }
      return out;
    })()
  `);
  
  return products;
}

/**
 * مهمة التحديث التلقائي
 */
export async function syncVendoorProducts() {
  console.log('🔄 [CRON] Starting Vendoor products sync...');
  
  let browser;
  try {
    browser = await chromium.launch({ 
      headless: true, 
      args: ['--no-sandbox','--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    await loginToVendoor(page, VENDOOR_EMAIL, VENDOOR_PASSWORD);
    
    // جلب جميع المنتجات
    const allProducts: any[] = [];
    
    for (let p = 1; p <= 41; p++) {
      const products = await scrapeProductsPage(page, p);
      
      if (products.length === 0) {
        console.log(`✅ [CRON] No more products at page ${p}`);
        break;
      }
      
      allProducts.push(...products);
      console.log(`📦 [CRON] Scraped page ${p}: ${products.length} products`);
      await sleep(400);
    }
    
    await browser.close();
    
    // تحديث المنتجات في قاعدة البيانات
    const { updateVendoorProducts } = await import('../lib/vendoor-processor');
    const results = await updateVendoorProducts(allProducts);
    
    console.log(`✅ [CRON] Sync completed: ${results.updated} updated, ${results.failed} failed`);
    
    return {
      success: true,
      totalProducts: allProducts.length,
      updated: results.updated,
      failed: results.failed
    };
    
  } catch (error: any) {
    console.error('❌ [CRON] Error syncing Vendoor products:', error);
    
    if (browser) {
      await browser.close();
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * تشغيل Cron Job
 * يعمل كل يوم في الساعة 3 صباحاً
 */
export function startVendoorSyncCron() {
  // كل يوم في الساعة 3 صباحاً
  cron.schedule('0 3 * * *', async () => {
    console.log('⏰ [CRON] Vendoor sync job triggered');
    await syncVendoorProducts();
  });
  
  console.log('✅ [CRON] Vendoor sync cron job started (runs daily at 3 AM)');
}

/**
 * تشغيل يدوي للتحديث
 */
export async function runManualSync() {
  console.log('🔧 [MANUAL] Starting manual Vendoor sync...');
  return await syncVendoorProducts();
}
