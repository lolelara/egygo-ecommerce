/**
 * OpenAI Client
 * Direct integration with OpenAI API for AI-powered features
 *
 * تم تحديث هذا العميل ليستخدم راوت الباك إند /api/chat
 * الذي يدير مفاتيح OpenAI من خلال Appwrite (openai-key-manager)
 */

const CHAT_API_URL = '/api/chat';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatApiResponse {
  message?: string;
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * استدعاء API الشات في الباك إند
 */
async function callOpenAI(messages: OpenAIMessage[], model: string = 'gpt-4'): Promise<string> {
  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Chat API error: ${response.status} - ${errorText}`);
  }

  const data: ChatApiResponse = await response.json();
  return data.message || data.choices?.[0]?.message?.content || '';
}

/**
 * تحسين وصف المنتج باستخدام AI
 */
export async function enhanceDescription(description: string, productData: any): Promise<string> {
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: 'أنت خبير في كتابة أوصاف منتجات جذابة ومقنعة للتجارة الإلكترونية باللغة العربية.'
    },
    {
      role: 'user',
      content: `حسّن هذا الوصف للمنتج وأجعله أكثر جاذبية واحترافية:

الوصف الحالي: ${description}

معلومات المنتج:
${JSON.stringify(productData, null, 2)}

متطلبات:
1. اكتب وصف جذاب ومقنع
2. أبرز المميزات الرئيسية
3. استخدم لغة تسويقية احترافية
4. اجعله مناسب للسيو (SEO)
5. لا تزيد عن 500 كلمة`
    }
  ];

  return await callOpenAI(messages);
}

/**
 * ترجمة المنتج إلى لغة أخرى
 */
export async function translateProduct(product: any, targetLang: string): Promise<any> {
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: `أنت مترجم محترف. ترجم بيانات المنتج إلى ${targetLang} مع الحفاظ على المعنى والسياق.`
    },
    {
      role: 'user',
      content: `ترجم بيانات المنتج التالية إلى ${targetLang}. أرجع JSON فقط بدون أي نص إضافي:

${JSON.stringify(product, null, 2)}`
    }
  ];

  const result = await callOpenAI(messages);
  
  try {
    // محاولة استخراج JSON من الاستجابة
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(result);
  } catch (error) {
    console.error('Error parsing translated product:', error);
    throw new Error('فشل في تحليل المنتج المترجم');
  }
}

/**
 * تحسين الصور (توليد أوصاف alt text)
 */
export async function optimizeImages(imageUrls: string[]): Promise<Array<{ url: string; alt: string; title: string }>> {
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: 'أنت خبير في كتابة أوصاف الصور لتحسين السيو (SEO) والوصول.'
    },
    {
      role: 'user',
      content: `لدي ${imageUrls.length} صورة منتج. اقترح alt text و title مناسبين لكل صورة.

الصور:
${imageUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

أرجع JSON array بالصيغة:
[
  { "url": "...", "alt": "...", "title": "..." }
]`
    }
  ];

  const result = await callOpenAI(messages);
  
  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(result);
  } catch (error) {
    console.error('Error parsing optimized images:', error);
    // Fallback: return basic structure
    return imageUrls.map((url, i) => ({
      url,
      alt: `صورة المنتج ${i + 1}`,
      title: `منتج - صورة ${i + 1}`
    }));
  }
}

/**
 * مراجعة المنتج وتقديم اقتراحات
 */
export async function reviewProduct(product: any): Promise<{
  score: number;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}> {
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: 'أنت خبير في تحليل منتجات التجارة الإلكترونية وتقديم اقتراحات للتحسين.'
    },
    {
      role: 'user',
      content: `راجع هذا المنتج وقدم تقييم شامل:

${JSON.stringify(product, null, 2)}

أرجع JSON بالصيغة:
{
  "score": 0-100,
  "suggestions": ["اقتراح 1", "اقتراح 2"],
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"]
}`
    }
  ];

  const result = await callOpenAI(messages);
  
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(result);
  } catch (error) {
    console.error('Error parsing product review:', error);
    return {
      score: 70,
      suggestions: ['تحسين الوصف', 'إضافة المزيد من الصور'],
      strengths: ['منتج جيد'],
      weaknesses: ['يحتاج تحسين']
    };
  }
}

/**
 * توليد كلمات مفتاحية للسيو
 */
export async function generateSEOKeywords(product: any): Promise<string[]> {
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: 'أنت خبير SEO. ولّد كلمات مفتاحية مناسبة للمنتجات.'
    },
    {
      role: 'user',
      content: `ولّد 10-15 كلمة مفتاحية مناسبة لهذا المنتج:

${JSON.stringify(product, null, 2)}

أرجع array من الكلمات المفتاحية فقط بصيغة JSON.`
    }
  ];

  const result = await callOpenAI(messages);
  
  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(result);
  } catch (error) {
    console.error('Error parsing SEO keywords:', error);
    return ['منتج', 'تسوق', 'شراء'];
  }
}

/**
 * توليد عنوان جذاب للمنتج
 */
export async function generateProductTitle(productData: any): Promise<string> {
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: 'أنت خبير في كتابة عناوين منتجات جذابة ومحسّنة للسيو.'
    },
    {
      role: 'user',
      content: `ولّد عنوان جذاب ومحسّن للسيو لهذا المنتج (لا تزيد عن 60 حرف):

${JSON.stringify(productData, null, 2)}

أرجع العنوان فقط بدون أي نص إضافي.`
    }
  ];

  return await callOpenAI(messages);
}

export default {
  enhanceDescription,
  translateProduct,
  optimizeImages,
  reviewProduct,
  generateSEOKeywords,
  generateProductTitle
};
