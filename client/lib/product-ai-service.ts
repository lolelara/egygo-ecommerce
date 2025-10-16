/**
 * AI Service for Product Enhancement
 * Provides AI-powered features for product descriptions and marketing suggestions
 */

interface ProductData {
  name: string;
  description?: string;
  category?: string;
  price?: number;
  images?: string[];
}

interface MarketingSuggestion {
  platform: string;
  strategy: string;
  targetAudience: string;
  estimatedReach: string;
  tips: string[];
}

interface EnhancedDescription {
  original: string;
  enhanced: string;
  seoKeywords: string[];
  highlights: string[];
}

import { env } from './env';

class ProductAIService {
  private apiKey: string;
  private apiEndpoint = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    // Get API key from environment or use empty string
    this.apiKey = env.OPENAI_API_KEY;
  }

  /**
   * Enhance product description using AI
   */
  async enhanceProductDescription(product: ProductData): Promise<EnhancedDescription> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `أنت خبير في كتابة أوصاف المنتجات الجذابة والاحترافية.

المنتج:
- الاسم: ${product.name}
- الوصف الحالي: ${product.description || 'لا يوجد وصف'}
- الفئة: ${product.category || 'غير محدد'}
- السعر: ${product.price ? `${product.price} جنيه` : 'غير محدد'}

المطلوب:
1. اكتب وصفاً محسّناً وجذاباً للمنتج (3-4 فقرات)
2. استخرج 5-7 كلمات مفتاحية SEO
3. اذكر 4-5 نقاط بارزة (highlights) للمنتج

قواعد الكتابة:
- استخدم لغة عربية فصحى مبسطة
- ركز على الفوائد وليس فقط المميزات
- اجعل الوصف مقنعاً ومحفزاً للشراء
- استخدم أسلوب تسويقي احترافي

أرجع النتيجة بصيغة JSON:
{
  "enhanced": "الوصف المحسّن",
  "seoKeywords": ["كلمة1", "كلمة2", ...],
  "highlights": ["نقطة1", "نقطة2", ...]
}`;

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'أنت خبير في التسويق الإلكتروني وكتابة المحتوى التسويقي باللغة العربية.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }

      const result = JSON.parse(jsonMatch[0]);

      return {
        original: product.description || '',
        enhanced: result.enhanced,
        seoKeywords: result.seoKeywords || [],
        highlights: result.highlights || []
      };
    } catch (error) {
      console.error('Error enhancing product description:', error);
      throw error;
    }
  }

  /**
   * Get marketing suggestions for a product
   */
  async getMarketingSuggestions(product: ProductData): Promise<MarketingSuggestion[]> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `أنت خبير في التسويق الإلكتروني والتسويق بالعمولة في السوق المصري.

المنتج:
- الاسم: ${product.name}
- الوصف: ${product.description || 'لا يوجد'}
- الفئة: ${product.category || 'غير محدد'}
- السعر: ${product.price ? `${product.price} جنيه` : 'غير محدد'}

المطلوب:
اقترح 5-6 منصات تسويقية مناسبة لهذا المنتج مع استراتيجية تسويق لكل منصة.

المنصات المتاحة:
- فيسبوك (Facebook)
- إنستجرام (Instagram)
- تيك توك (TikTok)
- يوتيوب (YouTube)
- واتساب (WhatsApp Business)
- تليجرام (Telegram)
- تويتر/X (Twitter/X)
- لينكد إن (LinkedIn)
- سناب شات (Snapchat)

لكل منصة، قدم:
1. استراتيجية التسويق المناسبة
2. الجمهور المستهدف
3. الوصول المتوقع (تقديري)
4. 3-4 نصائح عملية للتسويق

أرجع النتيجة بصيغة JSON array:
[
  {
    "platform": "اسم المنصة",
    "strategy": "الاستراتيجية",
    "targetAudience": "الجمهور المستهدف",
    "estimatedReach": "الوصول المتوقع",
    "tips": ["نصيحة1", "نصيحة2", "نصيحة3"]
  }
]`;

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'أنت خبير في التسويق الإلكتروني والتسويق بالعمولة في السوق المصري والعربي.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }

      const suggestions = JSON.parse(jsonMatch[0]);
      return suggestions;
    } catch (error) {
      console.error('Error getting marketing suggestions:', error);
      throw error;
    }
  }

  /**
   * Generate product tags using AI
   */
  async generateProductTags(product: ProductData): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `استخرج 8-10 تاجات (tags) مناسبة لهذا المنتج:

المنتج:
- الاسم: ${product.name}
- الوصف: ${product.description || 'لا يوجد'}
- الفئة: ${product.category || 'غير محدد'}

التاجات يجب أن تكون:
- كلمات بحث شائعة
- مرتبطة بالمنتج
- مفيدة لـ SEO
- باللغة العربية والإنجليزية

أرجع النتيجة كـ JSON array: ["tag1", "tag2", ...]`;

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.6,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating product tags:', error);
      throw error;
    }
  }
}

export const productAIService = new ProductAIService();
export type { ProductData, MarketingSuggestion, EnhancedDescription };
