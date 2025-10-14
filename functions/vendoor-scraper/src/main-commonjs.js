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
    log(`Method: ${req.method}`);
    log(`Body: ${req.body}`);
    log(`Query: ${JSON.stringify(req.query || {})}`);
    
    // قراءة الـ payload من body أو query parameters
    let payload = {};
    
    if (req.body && req.body.trim() !== '') {
      try {
        payload = JSON.parse(req.body);
      } catch (e) {
        log('⚠️ خطأ في parse body، استخدام query parameters');
        payload = req.query || {};
      }
    } else {
      payload = req.query || {};
    }
    
    const action = payload.action || 'scrape-page';
    
    // بيانات تسجيل الدخول
    const email = payload.email || process.env.VENDOOR_EMAIL || 'almlmibrahym574@gmail.com';
    const password = payload.password || process.env.VENDOOR_PASSWORD || 'hema2004';
    
    log(`📋 Action: ${action}`);
    log(`👤 Email: ${email}`);
    
    let result;
    
    if (action === 'health') {
      // Health check
      log('✅ Health check');
      result = {
        success: true,
        message: 'Vendoor Scraper Function is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      
    } else if (action === 'scrape-all') {
      // جلب جميع المنتجات
      log('📦 جلب جميع المنتجات...');
      result = await scrapeAllProducts(email, password, log);
      
    } else if (action === 'scrape-page' || action === 'scrape-single') {
      // جلب صفحة واحدة أو منتج واحد
      const pageNum = payload.page || payload.productId || 1;
      log(`📄 جلب الصفحة/المنتج ${pageNum}...`);
      result = await scrapePage(email, password, pageNum, log);
      
    } else if (action === 'import-product' || action === 'import-multiple' || action === 'sync-manual') {
      // استيراد المنتجات
      log(`📥 استيراد المنتجات (${action})...`);
      result = await scrapeAllProducts(email, password, log);
      
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
