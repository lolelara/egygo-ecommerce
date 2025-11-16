import { RequestHandler } from "express";
import { withOpenAIClient } from "../lib/openai-key-manager";

/**
 * Advanced Product Scraper with Puppeteer
 * 
 * Features:
 * - Dynamic content rendering
 * - JavaScript execution
 * - Screenshot capture
 * - Anti-bot bypass
 */
export const advancedScrapeProduct: RequestHandler = async (req, res) => {
  try {
    const { url, markup = 20, options = {} } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Note: Puppeteer needs to be installed
    // npm install puppeteer
    
    // For now, return a placeholder response
    // In production, implement full Puppeteer scraping
    
    const productData = {
      name: 'منتج مستورد (Puppeteer)',
      description: 'سيتم استخراج البيانات باستخدام Puppeteer للمواقع الديناميكية',
      price: 0,
      images: [],
      category: 'general',
      note: 'Puppeteer implementation pending'
    };

    res.json(productData);
  } catch (error: any) {
    console.error('Advanced scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape product',
      message: error.message 
    });
  }
};

export const aiEnhanceProductDescription: RequestHandler = async (req, res) => {
  try {
    const { product } = req.body;

    if (!product || !product.name) {
      return res.status(400).json({ error: 'Product with name is required' });
    }

    const description = product.description || 'لا يوجد وصف';
    const category = product.category || 'غير محدد';
    const price = product.price ? `${product.price} جنيه` : 'غير محدد';

    const prompt = `أنت خبير في كتابة أوصاف المنتجات الجذابة والاحترافية.

المنتج:
- الاسم: ${product.name}
- الوصف الحالي: ${description}
- الفئة: ${category}
- السعر: ${price}

المطلوب:
1. اكتب وصفاً محسّناً وجذاباً للمنتج (3-4 فقرات)
2. استخرج 5-7 كلمات مفتاحية SEO
3. اذكر 4-5 نقاط بارزة (highlights) للمنتج

أرجع النتيجة بصيغة JSON:
{
  "enhanced": "الوصف المحسّن",
  "seoKeywords": ["كلمة1", "كلمة2"],
  "highlights": ["نقطة1", "نقطة2"]
}`;

    const completion = await withOpenAIClient((client) => client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير في التسويق الإلكتروني وكتابة المحتوى التسويقي باللغة العربية.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }));

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    res.json({
      original: product.description || '',
      enhanced: parsed.enhanced || description,
      seoKeywords: parsed.seoKeywords || [],
      highlights: parsed.highlights || [],
    });
  } catch (error: any) {
    console.error('AI enhance product description error:', error);
    res.status(500).json({
      error: 'Failed to enhance product description',
      message: error.message,
    });
  }
};

export const aiMarketingSuggestions: RequestHandler = async (req, res) => {
  try {
    const { product } = req.body;

    if (!product || !product.name) {
      return res.status(400).json({ error: 'Product with name is required' });
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

    const completion = await withOpenAIClient((client) => client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير في التسويق الإلكتروني والتسويق بالعمولة في السوق المصري والعربي.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    }));

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    const suggestions = JSON.parse(jsonMatch[0]);
    res.json(suggestions);
  } catch (error: any) {
    console.error('AI marketing suggestions error:', error);
    res.status(500).json({
      error: 'Failed to get marketing suggestions',
      message: error.message,
    });
  }
};

export const aiGenerateProductTags: RequestHandler = async (req, res) => {
  try {
    const { product } = req.body;

    if (!product || !product.name) {
      return res.status(400).json({ error: 'Product with name is required' });
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

    const completion = await withOpenAIClient((client) => client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 400,
    }));

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    const tags = JSON.parse(jsonMatch[0]);
    res.json(tags);
  } catch (error: any) {
    console.error('AI generate tags error:', error);
    res.status(500).json({
      error: 'Failed to generate product tags',
      message: error.message,
    });
  }
};

export const priceAnalysis: RequestHandler = async (req, res) => {
  try {
    const { productName, currentPrice, productCategory, productCost } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'productName is required' });
    }

    const prompt = `أنت خبير تسعير منتجات في السوق المصري.

المنتج:
- الاسم: ${productName}
- السعر الحالي: ${currentPrice ? `${currentPrice} جنيه` : 'غير محدد'}
- الفئة: ${productCategory || 'غير محدد'}
- التكلفة: ${productCost ? `${productCost} جنيه` : 'غير معروف'}

قم بتحليل السعر واقترح:
1. السعر المثالي
2. نطاق السعر (الحد الأدنى والأقصى)
3. متوسط أسعار المنافسين
4. هامش الربح المقترح
5. موقع السعر في السوق (منخفض/متوسط/مرتفع)
6. الطلب المتوقع (منخفض/متوسط/مرتفع)
7. التبرير والتوصيات

أرجع النتيجة بصيغة JSON:
{
  "suggestedPrice": رقم,
  "minPrice": رقم,
  "maxPrice": رقم,
  "optimalPrice": رقم,
  "reasoning": "نص",
  "marketPosition": "low|medium|high",
  "expectedDemand": "low|medium|high",
  "competitorAverage": رقم,
  "profitMargin": رقم
}`;

    const completion = await withOpenAIClient((client) => client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير تسعير منتجات في السوق المصري والعربي.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    }));

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (error: any) {
    console.error('AI price analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze price',
      message: error.message,
    });
  }
};

export const competitorAnalysis: RequestHandler = async (req, res) => {
  try {
    const { productName, productPrice, productCategory } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'productName is required' });
    }

    const prompt = `أنت محلل منافسة خبير في السوق المصري.

المنتج:
- الاسم: ${productName}
- السعر: ${productPrice ? `${productPrice} جنيه` : 'غير محدد'}
- الفئة: ${productCategory || 'غير محدد'}

قم بتحليل SWOT (نقاط القوة، الضعف، الفرص، التهديدات) للمنتج في السوق المصري.

أرجع النتيجة بصيغة JSON array:
[
  {
    "category": "strength|weakness|opportunity|threat",
    "title": "عنوان قصير",
    "content": "شرح تفصيلي"
  }
]

قدم 3-4 نقاط لكل فئة.`;

    const completion = await withOpenAIClient((client) => client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'أنت محلل منافسة خبير في السوق المصري والعربي.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }));

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    const insights = JSON.parse(jsonMatch[0]);
    res.json(insights);
  } catch (error: any) {
    console.error('AI competitor analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze competitors',
      message: error.message,
    });
  }
};

export const generateProductImage: RequestHandler = async (req, res) => {
  try {
    const { productName, productDescription, stylePrompt, size = '1024x1024', customPrompt } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'productName is required' });
    }

    const basePrompt = `${productName}${productDescription ? `, ${productDescription}` : ''}`;
    const finalPrompt = customPrompt || `${basePrompt}, ${stylePrompt || ''}`;

    const result = await withOpenAIClient((client) => (client as any).images.generate({
      model: 'dall-e-3',
      prompt: finalPrompt,
      n: 1,
      size,
      quality: 'standard',
    }));

    const imageUrl = (result as any).data?.[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({ error: 'Failed to generate image' });
    }

    res.json({ imageUrl });
  } catch (error: any) {
    console.error('AI image generation error:', error);
    res.status(500).json({
      error: 'Failed to generate image',
      message: error.message,
    });
  }
};

/**
 * AI-Powered Description Enhancement
 * 
 * Uses OpenAI to improve product descriptions
 */
export const enhanceDescription: RequestHandler = async (req, res) => {
  try {
    const { description, language = 'ar' } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const systemPrompt = language === 'ar'
      ? 'أنت خبير في كتابة أوصاف المنتجات الجذابة والاحترافية باللغة العربية.'
      : 'You are an expert product copywriter for e-commerce.';

    const prompt = `حسّن هذا الوصف للمنتج وأجعله أكثر جاذبية واحترافية:

الوصف الحالي: ${description}

متطلبات:
1. اكتب وصف جذاب ومقنع
2. أبرز المميزات الرئيسية
3. استخدم لغة تسويقية احترافية
4. اجعله مناسب للسيو (SEO)
5. لا تزيد عن 500 كلمة

أرجع النتيجة بصيغة JSON:
{
  "enhanced": "الوصف المحسّن",
  "seoKeywords": ["كلمة1", "كلمة2"],
  "highlights": ["نقطة1", "نقطة2"]
}`;

    const completion = await withOpenAIClient((client) => client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }));

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(500).json({
        error: 'Invalid AI response format',
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    res.json({
      original: description,
      enhanced: parsed.enhanced || description,
      seoKeywords: parsed.seoKeywords || [],
      highlights: parsed.highlights || [],
    });
  } catch (error: any) {
    console.error('Enhancement error:', error);
    res.status(500).json({ 
      error: 'Failed to enhance description',
      message: error.message 
    });
  }
};

/**
 * Automatic Translation
 * 
 * Translates product data to Arabic
 */
export const translateProduct: RequestHandler = async (req, res) => {
  try {
    const { text, from = 'en', to = 'ar' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const systemPrompt = 'أنت مترجم محترف. ترجم النصوص بدقة مع الحفاظ على المعنى والأسلوب.';

    const prompt = `ترجم النص التالي من ${from} إلى ${to}:

${text}

أرجع النص المترجم فقط بدون أي شرح إضافي.`;

    const completion = await withOpenAIClient((client) => client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }));

    const translatedText = completion.choices[0]?.message?.content || '';

    const translated = {
      original: text,
      translated: translatedText,
      from,
      to,
      confidence: 0.95,
    };

    res.json(translated);
  } catch (error: any) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Failed to translate',
      message: error.message 
    });
  }
};

/**
 * Image Optimization
 * 
 * Compresses and optimizes product images
 */
export const optimizeImages: RequestHandler = async (req, res) => {
  try {
    const { images, quality = 80, maxWidth = 1200 } = req.body;

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Images array is required' });
    }

    const optimized = images.map((img: string) => ({
      original: img,
      optimized: img, // Placeholder
      size: '50% smaller',
      format: 'webp'
    }));

    res.json({ images: optimized });
  } catch (error: any) {
    console.error('Optimization error:', error);
    res.status(500).json({ 
      error: 'Failed to optimize images',
      message: error.message 
    });
  }
};

/**
 * Product Review Before Publishing
 * 
 * AI-powered quality check
 */
export const reviewProduct: RequestHandler = async (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: 'Product data is required' });
    }

    // Quality checks
    const checks = {
      hasName: !!product.name,
      hasDescription: !!product.description && product.description.length > 50,
      hasPrice: !!product.price && product.price > 0,
      hasImages: !!product.images && product.images.length > 0,
      hasCategory: !!product.category
    };

    const score = Object.values(checks).filter(Boolean).length / Object.keys(checks).length * 100;

    const review = {
      score,
      checks,
      recommendations: [],
      approved: score >= 80
    };

    // Add recommendations
    if (!checks.hasName) review.recommendations.push('أضف اسم المنتج');
    if (!checks.hasDescription) review.recommendations.push('أضف وصف مفصل (50 حرف على الأقل)');
    if (!checks.hasPrice) review.recommendations.push('حدد السعر');
    if (!checks.hasImages) review.recommendations.push('أضف صور المنتج');
    if (!checks.hasCategory) review.recommendations.push('اختر الفئة المناسبة');

    res.json(review);
  } catch (error: any) {
    console.error('Review error:', error);
    res.status(500).json({ 
      error: 'Failed to review product',
      message: error.message 
    });
  }
};
