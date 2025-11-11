/**
 * Vendoor Scraper Reports Handler
 * Google Apps Script لتسجيل تقارير Vendoor Scraper في Google Sheets
 */

// معرف Google Sheet (استبدله بمعرف الشيت الخاص بك)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

/**
 * دالة للتعامل مع طلبات POST
 */
function doPost(e) {
  try {
    // قراءة البيانات من الطلب
    const data = JSON.parse(e.postData.contents);
    
    // حفظ التقرير في الشيت
    const result = saveReportToSheet(data);
    
    // إرجاع استجابة نجاح
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'تم حفظ التقرير بنجاح',
        timestamp: new Date().toISOString(),
        rowsAdded: result.rowsAdded
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // إرجاع استجابة خطأ
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * دالة للتعامل مع طلبات GET (للاختبار)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'active',
      message: 'Vendoor Reports API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * حفظ التقرير في Google Sheet
 */
function saveReportToSheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // 1. حفظ الملخص العام
  saveSummarySheet(ss, data);
  
  // 2. حفظ تفاصيل المنتجات
  saveProductsSheet(ss, data);
  
  // 3. حفظ السجل التاريخي
  saveHistorySheet(ss, data);
  
  return {
    rowsAdded: (data.results || []).length + 1
  };
}

/**
 * حفظ ملخص التقرير
 */
function saveSummarySheet(ss, data) {
  let sheet = ss.getSheetByName('Summary');
  
  // إنشاء الشيت إذا لم يكن موجود
  if (!sheet) {
    sheet = ss.insertSheet('Summary');
    
    // إضافة العناوين
    const headers = [
      'التاريخ والوقت',
      'إجمالي المنتجات',
      'نجح',
      'فشل',
      'نسبة النجاح %',
      'المدة (ثانية)',
      'المدة (دقائق)',
      'متوسط الوقت/منتج',
      'هامش الربح',
      'Database ID',
      'Category ID',
      'حالة التشغيل'
    ];
    
    sheet.appendRow(headers);
    
    // تنسيق العناوين
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285F4');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setHorizontalAlignment('center');
    
    // تجميد الصف الأول
    sheet.setFrozenRows(1);
  }
  
  // إضافة البيانات
  const timestamp = new Date(data.scrapedAt || new Date());
  const successRate = data.totalFound > 0 
    ? ((data.successCount / data.totalFound) * 100).toFixed(2) 
    : 0;
  const avgTime = data.totalFound > 0 
    ? (data.duration / data.totalFound).toFixed(2) 
    : 0;
  const durationMinutes = (data.duration / 60).toFixed(2);
  
  const row = [
    timestamp,
    data.totalFound || 0,
    data.successCount || 0,
    data.failCount || 0,
    successRate,
    data.duration || 0,
    durationMinutes,
    avgTime,
    data.profitMargin || 10,
    data.databaseId || '',
    data.categoryId || '',
    'مكتمل'
  ];
  
  sheet.appendRow(row);
  
  // تنسيق الصف الجديد
  const lastRow = sheet.getLastRow();
  const dataRange = sheet.getRange(lastRow, 1, 1, row.length);
  
  // تلوين حسب النجاح/الفشل
  if (data.failCount === 0) {
    dataRange.setBackground('#D9EAD3'); // أخضر فاتح
  } else if (data.successCount === 0) {
    dataRange.setBackground('#F4CCCC'); // أحمر فاتح
  } else {
    dataRange.setBackground('#FFF2CC'); // أصفر فاتح
  }
  
  // ضبط عرض الأعمدة تلقائياً
  sheet.autoResizeColumns(1, row.length);
}

/**
 * حفظ تفاصيل المنتجات
 */
function saveProductsSheet(ss, data) {
  const sheetName = 'Products - ' + Utilities.formatDate(
    new Date(data.scrapedAt), 
    Session.getScriptTimeZone(), 
    'yyyy-MM-dd HH:mm'
  );
  
  let sheet = ss.insertSheet(sheetName);
  
  // العناوين
  const headers = [
    '#',
    'اسم المنتج',
    'السعر النهائي',
    'السعر الأصلي',
    'هامش الربح',
    'المخزون الكلي',
    'عدد الصور',
    'عدد التنويعات',
    'الحالة',
    'Product ID',
    'SKU',
    'رابط المصدر'
  ];
  
  sheet.appendRow(headers);
  
  // تنسيق العناوين
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#34A853');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  
  // إضافة بيانات المنتجات
  const products = data.results || [];
  
  products.forEach((product, index) => {
    const profitMargin = (product.price || 0) - (product.originalPrice || 0);
    const numImages = (product.images || []).length;
    const numVariants = (product.variants || []).length;
    
    const row = [
      index + 1,
      product.name || '',
      product.price || 0,
      product.originalPrice || 0,
      profitMargin,
      product.totalStock || 0,
      numImages,
      numVariants,
      product.status || 'draft',
      product.$id || '',
      product.sku || '',
      product.sourceUrl || ''
    ];
    
    sheet.appendRow(row);
  });
  
  // تنسيق الأرقام
  if (products.length > 0) {
    // تنسيق أعمدة الأسعار
    sheet.getRange(2, 3, products.length, 3).setNumberFormat('#,##0.00 "ج.م"');
    
    // تنسيق أعمدة الأعداد
    sheet.getRange(2, 6, products.length, 1).setNumberFormat('#,##0');
  }
  
  // ضبط عرض الأعمدة
  sheet.autoResizeColumns(1, headers.length);
  
  // إضافة رابط للمنتجات
  if (products.length > 0) {
    const urlColumn = 12;
    for (let i = 0; i < products.length; i++) {
      const row = i + 2;
      const url = products[i].sourceUrl;
      if (url) {
        sheet.getRange(row, urlColumn).setFormula(
          '=HYPERLINK("' + url + '", "رابط")'
        );
      }
    }
  }
  
  // إضافة ملخص في الأسفل
  const summaryRow = products.length + 3;
  sheet.getRange(summaryRow, 1).setValue('الإجمالي:').setFontWeight('bold');
  sheet.getRange(summaryRow, 2).setFormula('=COUNTA(B2:B' + (products.length + 1) + ')');
  sheet.getRange(summaryRow, 3).setFormula('=SUM(C2:C' + (products.length + 1) + ')');
  sheet.getRange(summaryRow, 4).setFormula('=SUM(D2:D' + (products.length + 1) + ')');
  sheet.getRange(summaryRow, 5).setFormula('=SUM(E2:E' + (products.length + 1) + ')');
  sheet.getRange(summaryRow, 6).setFormula('=SUM(F2:F' + (products.length + 1) + ')');
  
  // تنسيق صف الإجمالي
  sheet.getRange(summaryRow, 1, 1, headers.length)
    .setBackground('#E8F0FE')
    .setFontWeight('bold');
}

/**
 * حفظ السجل التاريخي
 */
function saveHistorySheet(ss, data) {
  let sheet = ss.getSheetByName('History Log');
  
  if (!sheet) {
    sheet = ss.insertSheet('History Log');
    
    const headers = [
      'التاريخ والوقت',
      'نوع السجل',
      'الحالة',
      'الرسالة',
      'التفاصيل'
    ];
    
    sheet.appendRow(headers);
    
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#EA4335');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
  }
  
  const timestamp = new Date(data.scrapedAt || new Date());
  const status = data.failCount === 0 ? 'نجح' : 'جزئي';
  const message = 'تم معالجة ' + data.successCount + ' من ' + data.totalFound + ' منتج';
  const details = JSON.stringify({
    duration: data.duration,
    profitMargin: data.profitMargin,
    categoryId: data.categoryId
  });
  
  const row = [
    timestamp,
    'Scraper Run',
    status,
    message,
    details
  ];
  
  sheet.appendRow(row);
  sheet.autoResizeColumns(1, row.length);
}

/**
 * دالة لإنشاء Dashboard (اختياري)
 */
function createDashboard() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let dashboard = ss.getSheetByName('Dashboard');
  
  if (!dashboard) {
    dashboard = ss.insertSheet('Dashboard', 0);
    
    // عنوان Dashboard
    dashboard.getRange('A1').setValue('📊 Vendoor Scraper Dashboard')
      .setFontSize(18)
      .setFontWeight('bold')
      .setBackground('#4285F4')
      .setFontColor('#FFFFFF');
    
    dashboard.getRange('A1:F1').merge();
    
    // إحصائيات عامة
    dashboard.getRange('A3').setValue('إجمالي العمليات:');
    dashboard.getRange('B3').setFormula('=COUNTA(Summary!A:A)-1');
    
    dashboard.getRange('A4').setValue('إجمالي المنتجات:');
    dashboard.getRange('B4').setFormula('=SUM(Summary!C:C)');
    
    dashboard.getRange('A5').setValue('المنتجات الناجحة:');
    dashboard.getRange('B5').setFormula('=SUM(Summary!D:D)');
    
    dashboard.getRange('A6').setValue('المنتجات الفاشلة:');
    dashboard.getRange('B6').setFormula('=SUM(Summary!E:E)');
    
    dashboard.getRange('A7').setValue('متوسط نسبة النجاح:');
    dashboard.getRange('B7').setFormula('=AVERAGE(Summary!F:F)&"%"');
    
    dashboard.getRange('A8').setValue('إجمالي الوقت (ساعات):');
    dashboard.getRange('B8').setFormula('=SUM(Summary!G:G)/60');
    
    // تنسيق
    dashboard.getRange('A3:A8').setFontWeight('bold');
    dashboard.getRange('B3:B8').setNumberFormat('#,##0.00');
    
    dashboard.autoResizeColumns(1, 6);
  }
}

/**
 * دالة اختبار
 */
function testSaveReport() {
  const testData = {
    scrapedAt: new Date().toISOString(),
    databaseId: 'test-db-123',
    categoryId: 'test-cat-456',
    totalFound: 10,
    successCount: 8,
    failCount: 2,
    duration: 300,
    profitMargin: 10,
    results: [
      {
        $id: 'product-1',
        name: 'منتج تجريبي 1',
        price: 110,
        originalPrice: 100,
        totalStock: 50,
        images: ['img1.jpg', 'img2.jpg'],
        variants: [{color: 'أحمر', size: 'L'}],
        status: 'approved',
        sku: 'TEST-001',
        sourceUrl: 'https://example.com/product1'
      },
      {
        $id: 'product-2',
        name: 'منتج تجريبي 2',
        price: 220,
        originalPrice: 210,
        totalStock: 30,
        images: ['img3.jpg'],
        variants: [],
        status: 'approved',
        sku: 'TEST-002',
        sourceUrl: 'https://example.com/product2'
      }
    ]
  };
  
  const result = saveReportToSheet(testData);
  Logger.log('Test completed: ' + JSON.stringify(result));
}
