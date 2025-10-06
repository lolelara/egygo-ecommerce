import puppeteer from 'puppeteer';
import { Request, Response } from 'express';

const LOGIN_URL = 'https://vendoor.co/user/login?returnUrl=%2Faffiliate%2Fproducts';
const PRODUCTS_BASE_URL = 'https://vendoor.co/affiliate/products?page=';

/**
 * تسجيل الدخول إلى Ven-door
 */
async function loginToVendoor(page: any, email: string, password: string) {
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });
  await page.type('input[name="Email"]', email);
  await page.type('input[name="Password"]', password);
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
}

/**
 * استخراج المنتجات من صفحة واحدة
 */
async function scrapeProductsPage(page: any, pageNum: number) {
  const url = `${PRODUCTS_BASE_URL}${pageNum}`;
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForSelector('table tbody tr', { timeout: 10000 });
  
  const products = await page.evaluate(() => {
    const rows = document.querySelectorAll('table tbody tr');
    const results: any[] = [];
    
    rows.forEach((row: any) => {
      try {
        const cells = row.querySelectorAll('td');
        if (cells.length < 6) return;
        
        const imgElement = cells[0].querySelector('img');
        const image = imgElement ? imgElement.src : '';
        
        const titleElement = cells[1].querySelector('a');
        const title = titleElement ? titleElement.textContent.trim() : '';
        
        const priceText = cells[2].textContent.trim();
        const price = priceText.replace(/[^\d.]/g, '');
        
        const commissionText = cells[3].textContent.trim();
        const commission = commissionText.replace(/[^\d.]/g, '');
        
        const stock = cells[4].textContent.trim();
        
        const productLink = titleElement ? titleElement.href : '';
        const productId = productLink.split('/').pop() || '';
        
        results.push({
          id: productId,
          title,
          price,
          commission,
          stock,
          image,
          url: productLink
        });
      } catch (error) {
        console.error('خطأ في معالجة صف:', error);
      }
    });
    
    return results;
  });
  
  return products;
}

/**
 * API endpoint لجلب منتجات Ven-door
 */
export async function scrapeVendoorProducts(req: Request, res: Response) {
  let browser;
  
  try {
    const page = parseInt(req.query.page as string) || 1;
    const email = process.env.VENDOOR_EMAIL || 'almlmibrahym574@gmail.com';
    const password = process.env.VENDOOR_PASSWORD || 'hema2004';
    
    console.log(`🚀 بدء scraping الصفحة ${page}...`);
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const browserPage = await browser.newPage();
    
    console.log('🔐 تسجيل الدخول...');
    await loginToVendoor(browserPage, email, password);
    
    console.log(`📄 جلب الصفحة ${page}...`);
    const products = await scrapeProductsPage(browserPage, page);
    
    await browser.close();
    
    console.log(`✅ تم جلب ${products.length} منتج`);
    
    res.json({
      success: true,
      page,
      totalProducts: products.length,
      products
    });
    
  } catch (error: any) {
    if (browser) await browser.close();
    console.error('❌ خطأ:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
