import https from 'https';

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8592879332:AAHYh6RSnKOj0eXz0p6gN1mm4xDB-z4GDvo';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''; // سيتم الحصول عليه تلقائياً

/**
 * Send message to Telegram
 */
export async function sendTelegramMessage(message, parseMode = 'HTML') {
  // Get chat ID if not set
  let chatId = TELEGRAM_CHAT_ID;
  
  if (!chatId) {
    console.log('⚠️  TELEGRAM_CHAT_ID غير محدد، سيتم استخدام getUpdates للحصول عليه');
    chatId = await getLastChatId();
    if (!chatId) {
      console.error('❌ فشل الحصول على Chat ID');
      return false;
    }
  }
  
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: parseMode
    });
    
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.ok) {
            console.log('✅ تم إرسال الرسالة على Telegram بنجاح!');
            resolve(true);
          } else {
            console.error('❌ فشل إرسال الرسالة:', response.description);
            resolve(false);
          }
        } catch (error) {
          console.error('❌ خطأ في تحليل الاستجابة:', error.message);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ خطأ في الاتصال:', error.message);
      resolve(false);
    });
    
    req.write(data);
    req.end();
  });
}

/**
 * Get last chat ID from bot updates
 */
async function getLastChatId() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TELEGRAM_BOT_TOKEN}/getUpdates`,
      method: 'GET'
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.ok && response.result.length > 0) {
            const lastUpdate = response.result[response.result.length - 1];
            const chatId = lastUpdate.message?.chat?.id || lastUpdate.my_chat_member?.chat?.id;
            if (chatId) {
              console.log(`✅ تم الحصول على Chat ID: ${chatId}`);
              resolve(chatId.toString());
            } else {
              resolve(null);
            }
          } else {
            console.log('⚠️  لم يتم العثور على رسائل. أرسل /start للبوت أولاً');
            resolve(null);
          }
        } catch (error) {
          console.error('❌ خطأ:', error.message);
          resolve(null);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ خطأ في الاتصال:', error.message);
      resolve(null);
    });
    
    req.end();
  });
}

/**
 * Format report for Telegram
 */
export function formatTelegramReport(data) {
  const {
    totalFound,
    successCount,
    failCount,
    duration,
    scrapedAt,
    databaseId,
    categoryId,
    results = []
  } = data;
  
  const successRate = totalFound > 0 ? ((successCount / totalFound) * 100).toFixed(1) : 0;
  const date = new Date(scrapedAt);
  const timeStr = date.toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
  
  let message = `🎉 <b>تقرير Vendoor Scraper</b>\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  message += `📊 <b>الإحصائيات:</b>\n`;
  message += `✅ نجح: <b>${successCount}</b> منتج\n`;
  message += `❌ فشل: <b>${failCount}</b> منتج\n`;
  message += `📦 إجمالي: <b>${totalFound}</b> منتج\n`;
  message += `📈 نسبة النجاح: <b>${successRate}%</b>\n\n`;
  
  if (duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    message += `⏱️ المدة: <b>${minutes}د ${seconds}ث</b>\n`;
  }
  
  message += `🕐 التوقيت: <code>${timeStr}</code>\n\n`;
  
  message += `🗄️ <b>قاعدة البيانات:</b>\n`;
  message += `Database: <code>${databaseId}</code>\n`;
  message += `Category: <code>${categoryId}</code>\n\n`;
  
  if (results.length > 0) {
    message += `🏆 <b>أمثلة من المنتجات الناجحة:</b>\n`;
    const samples = results.slice(0, 5);
    samples.forEach((product, index) => {
      message += `${index + 1}. ${product.name?.substring(0, 40) || 'منتج'}...\n`;
      message += `   SKU: <code>${product.sku}</code>\n`;
      message += `   السعر: <b>${product.price || 0} ج</b>\n`;
      if (product.totalStock > 0) {
        message += `   المخزون: ${product.totalStock}\n`;
      }
      message += `\n`;
    });
  }
  
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `✅ <b>اكتمل بنجاح!</b>\n\n`;
  message += `🔗 <a href="https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/databases/${databaseId}/collection-products">فتح المنتجات في Appwrite</a>`;
  
  return message;
}

/**
 * Send start notification
 */
export async function sendStartNotification(totalProducts) {
  const message = `🚀 <b>بدء Vendoor Scraper</b>\n\n` +
                 `📦 عدد المنتجات: <b>${totalProducts}</b>\n` +
                 `⏳ جاري المعالجة...\n\n` +
                 `سيتم إرسال تقرير كامل عند الانتهاء.`;
  
  return sendTelegramMessage(message);
}

/**
 * Send completion notification with full report
 */
export async function sendCompletionReport(data) {
  const message = formatTelegramReport(data);
  return sendTelegramMessage(message);
}

/**
 * Send error notification
 */
export async function sendErrorNotification(error) {
  const message = `❌ <b>خطأ في Vendoor Scraper</b>\n\n` +
                 `<code>${error.message || error}</code>\n\n` +
                 `الرجاء التحقق من الـ logs.`;
  
  return sendTelegramMessage(message);
}

// Test function
export async function testTelegramBot() {
  console.log('🧪 اختبار Telegram Bot...\n');
  
  const testMessage = `🤖 <b>Test Message</b>\n\n` +
                     `مرحباً! هذه رسالة تجريبية من EgyGo Bot.\n\n` +
                     `✅ البوت يعمل بشكل صحيح!\n` +
                     `🕐 ${new Date().toLocaleString('ar-EG')}`;
  
  const result = await sendTelegramMessage(testMessage);
  
  if (result) {
    console.log('✅ الاختبار نجح!');
  } else {
    console.log('❌ الاختبار فشل!');
    console.log('\n💡 تأكد من:');
    console.log('   1. إرسال /start للبوت على: https://t.me/egygo_bot');
    console.log('   2. Bot Token صحيح');
    console.log('   3. الاتصال بالإنترنت');
  }
  
  return result;
}

// Export for direct testing
if (import.meta.url === `file://${process.argv[1]}`) {
  testTelegramBot();
}
