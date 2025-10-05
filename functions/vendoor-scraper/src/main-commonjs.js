const { scrapeAllProducts, scrapePage } = require('./scraper-commonjs.js');

/**
 * Appwrite Function Entry Point
 * 
 * Context يحتوي على:
 * - req: Request object
 * - res: Response object
 * - log: للـ logging
 * - error: للـ errors
 */
module.exports = async ({ req, res, log, error }) => {
  try {
    log('🚀 بدء Vendoor Scraper Function');
    
    // قراءة الـ payload
    const payload = JSON.parse(req.body || '{}');
    const action = payload.action || 'scrape-all';
    
    // بيانات تسجيل الدخول
    const email = payload.email || process.env.VENDOOR_EMAIL || 'almlmibrahym574@gmail.com';
    const password = payload.password || process.env.VENDOOR_PASSWORD || 'hema2004';
    
    log(`📋 Action: ${action}`);
    log(`👤 Email: ${email}`);
    
    let result;
    
    if (action === 'scrape-all') {
      // جلب جميع المنتجات
      log('📦 جلب جميع المنتجات...');
      result = await scrapeAllProducts(email, password, log);
      
    } else if (action === 'scrape-page') {
      // جلب صفحة واحدة
      const pageNum = payload.page || 1;
      log(`📄 جلب الصفحة ${pageNum}...`);
      result = await scrapePage(email, password, pageNum, log);
      
    } else {
      throw new Error(`Action غير مدعوم: ${action}`);
    }
    
    log('✅ اكتمل بنجاح!');
    
    return res.json(result);
    
  } catch (err) {
    error('❌ خطأ في Function:', err);
    
    return res.json({
      success: false,
      error: err.message,
      stack: err.stack
    }, 500);
  }
};
