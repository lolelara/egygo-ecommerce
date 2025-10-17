/**
 * WhatsApp Business API Integration
 * 
 * يدعم:
 * - إرسال رسائل الطلبات
 * - إشعارات النظام
 * - رسائل تسويقية
 * - دعم العملاء
 */

// WhatsApp Business API Configuration
const WHATSAPP_CONFIG = {
  businessPhone: import.meta.env.VITE_WHATSAPP_BUSINESS_PHONE || '+201000000000',
  apiUrl: import.meta.env.VITE_WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
  accessToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '',
  webhookVerifyToken: import.meta.env.VITE_WHATSAPP_WEBHOOK_TOKEN || '',
};

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'image' | 'document';
  content: string | object;
}

export interface OrderNotification {
  orderId: string;
  customerName: string;
  customerPhone: string;
  orderTotal: number;
  orderItems: string;
  orderStatus: string;
}

/**
 * Format phone number for WhatsApp
 * يحول رقم الهاتف للصيغة الدولية
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Add Egypt country code if not present
  if (!cleaned.startsWith('20') && cleaned.length === 10) {
    cleaned = '20' + cleaned;
  } else if (cleaned.startsWith('0')) {
    cleaned = '20' + cleaned.substring(1);
  }
  
  return cleaned;
}

/**
 * Send WhatsApp Text Message
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<boolean> {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    
    // For development: log instead of actually sending
    if (!WHATSAPP_CONFIG.accessToken || import.meta.env.DEV) {
      console.log('📱 WhatsApp Message (Dev Mode):');
      console.log(`To: ${formattedPhone}`);
      console.log(`Message: ${message}`);
      return true;
    }

    const response = await fetch(
      `${WHATSAPP_CONFIG.apiUrl}/${WHATSAPP_CONFIG.businessPhone}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }

    console.log('✅ WhatsApp message sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
    return false;
  }
}

/**
 * Send Order Confirmation via WhatsApp
 */
export async function sendOrderConfirmation(
  orderData: OrderNotification
): Promise<boolean> {
  const message = `
🎉 *تم تأكيد طلبك بنجاح!*

*رقم الطلب:* ${orderData.orderId}
*العميل:* ${orderData.customerName}
*الإجمالي:* ${orderData.orderTotal.toLocaleString()} ج.م

*المنتجات:*
${orderData.orderItems}

*الحالة:* ${orderData.orderStatus}

شكراً لتسوقك معنا! 🛍️
يمكنك تتبع طلبك من خلال الموقع.

للاستفسارات: اضغط هنا للتواصل
`.trim();

  return await sendWhatsAppMessage(orderData.customerPhone, message);
}

/**
 * Send Order Status Update
 */
export async function sendOrderStatusUpdate(
  phone: string,
  orderId: string,
  newStatus: string,
  trackingNumber?: string
): Promise<boolean> {
  let message = `
📦 *تحديث حالة الطلب*

*رقم الطلب:* ${orderId}
*الحالة الجديدة:* ${getStatusLabel(newStatus)}
`.trim();

  if (trackingNumber) {
    message += `\n*رقم التتبع:* ${trackingNumber}`;
  }

  message += '\n\nيمكنك تتبع طلبك من خلال الموقع.';

  return await sendWhatsAppMessage(phone, message);
}

/**
 * Send Account Approval Notification
 */
export async function sendAccountApprovalNotification(
  phone: string,
  name: string,
  accountType: 'merchant' | 'affiliate'
): Promise<boolean> {
  const typeLabel = accountType === 'merchant' ? 'التاجر' : 'المسوق';
  
  const message = `
✅ *تم قبول طلبك!*

مرحباً ${name}،

تم الموافقة على حسابك كـ *${typeLabel}*! 🎉

يمكنك الآن الدخول إلى لوحة التحكم والبدء.

للدخول:
${window.location.origin}/#/login

نتمنى لك تجربة ممتعة ومربحة! 💰
`.trim();

  return await sendWhatsAppMessage(phone, message);
}

/**
 * Send Account Rejection Notification
 */
export async function sendAccountRejectionNotification(
  phone: string,
  name: string,
  reason: string
): Promise<boolean> {
  const message = `
❌ *تحديث بخصوص طلبك*

عزيزي ${name},

للأسف، لم يتم قبول طلبك في الوقت الحالي.

*السبب:* ${reason}

يمكنك التواصل معنا للمزيد من التفاصيل أو تقديم طلب جديد.

نعتذر عن الإزعاج.
`.trim();

  return await sendWhatsAppMessage(phone, message);
}

/**
 * Send Commission Notification (للمسوقين)
 */
export async function sendCommissionNotification(
  phone: string,
  amount: number,
  orderId: string
): Promise<boolean> {
  const message = `
💰 *عمولة جديدة!*

تهانينا! حصلت على عمولة جديدة:

*المبلغ:* ${amount.toLocaleString()} ج.م
*الطلب:* ${orderId}

يمكنك مراجعة أرباحك من لوحة التحكم.

استمر في التسويق! 🚀
`.trim();

  return await sendWhatsAppMessage(phone, message);
}

/**
 * Send Marketing Message
 */
export async function sendMarketingMessage(
  phone: string,
  title: string,
  content: string,
  link?: string
): Promise<boolean> {
  let message = `
🎁 *${title}*

${content}
`.trim();

  if (link) {
    message += `\n\nللتفاصيل: ${link}`;
  }

  return await sendWhatsAppMessage(phone, message);
}

/**
 * Get Status Label in Arabic
 */
function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    pending: 'قيد المراجعة',
    confirmed: 'تم التأكيد',
    processing: 'جاري التجهيز',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
    refunded: 'تم الاسترجاع',
  };

  return statusLabels[status] || status;
}

/**
 * Generate WhatsApp Chat Link
 */
export function generateWhatsAppLink(
  phone: string,
  message?: string
): string {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  return `https://wa.me/${formattedPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

/**
 * Generate Support Chat Link
 */
export function generateSupportLink(orderId?: string): string {
  const supportPhone = WHATSAPP_CONFIG.businessPhone.replace('+', '');
  let message = 'مرحباً، أحتاج إلى مساعدة';
  
  if (orderId) {
    message += ` بخصوص الطلب رقم ${orderId}`;
  }
  
  return generateWhatsAppLink(supportPhone, message);
}

/**
 * Bulk Send Messages
 * إرسال رسائل جماعية (مع rate limiting)
 */
export async function sendBulkMessages(
  recipients: Array<{ phone: string; message: string }>,
  delayMs: number = 1000
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const sent = await sendWhatsAppMessage(recipient.phone, recipient.message);
    
    if (sent) {
      success++;
    } else {
      failed++;
    }

    // Rate limiting delay
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return { success, failed };
}

/**
 * Webhook handler for incoming messages
 */
export function handleWebhook(body: any): {
  from: string;
  message: string;
  timestamp: number;
} | null {
  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message) return null;

    return {
      from: message.from,
      message: message.text?.body || '',
      timestamp: message.timestamp,
    };
  } catch (error) {
    console.error('Error parsing webhook:', error);
    return null;
  }
}

export default {
  sendWhatsAppMessage,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendAccountApprovalNotification,
  sendAccountRejectionNotification,
  sendCommissionNotification,
  sendMarketingMessage,
  generateWhatsAppLink,
  generateSupportLink,
  sendBulkMessages,
  handleWebhook,
  formatPhoneNumber,
};
