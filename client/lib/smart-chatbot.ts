/**
 * Smart Chatbot with Memory
 * شات بوت ذكي مع ذاكرة للمحادثات
 */

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface ConversationContext {
  userId: string;
  sessionId: string;
  userProfile?: {
    name?: string;
    orderHistory?: any[];
    favorites?: any[];
    cart?: any[];
  };
  currentPage?: string;
  productContext?: any;
}

interface ChatMemory {
  shortTerm: Message[]; // آخر 10 رسائل
  longTerm: Map<string, any>; // معلومات مهمة
  summary: string; // ملخص المحادثة
}

export class SmartChatbot {
  private memory: ChatMemory;
  private context: ConversationContext;
  private maxShortTermMessages = 10;
  
  constructor(context: ConversationContext) {
    this.context = context;
    this.memory = {
      shortTerm: [],
      longTerm: new Map(),
      summary: ''
    };
    
    this.initializeMemory();
  }
  
  /**
   * تهيئة الذاكرة من localStorage
   */
  private initializeMemory() {
    const stored = localStorage.getItem(`chat_memory_${this.context.userId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.memory.shortTerm = parsed.shortTerm.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        this.memory.longTerm = new Map(parsed.longTerm);
        this.memory.summary = parsed.summary;
      } catch (e) {
        console.error('Failed to load chat memory:', e);
      }
    }
  }
  
  /**
   * حفظ الذاكرة
   */
  private saveMemory() {
    const toSave = {
      shortTerm: this.memory.shortTerm,
      longTerm: Array.from(this.memory.longTerm.entries()),
      summary: this.memory.summary
    };
    localStorage.setItem(
      `chat_memory_${this.context.userId}`,
      JSON.stringify(toSave)
    );
  }
  
  /**
   * إضافة رسالة للذاكرة
   */
  private addToMemory(message: Message) {
    this.memory.shortTerm.push(message);
    
    // الاحتفاظ فقط بآخر N رسالة
    if (this.memory.shortTerm.length > this.maxShortTermMessages) {
      const removed = this.memory.shortTerm.shift();
      // نقل المعلومات المهمة للذاكرة طويلة المدى
      if (removed) {
        this.extractImportantInfo(removed);
      }
    }
    
    this.saveMemory();
  }
  
  /**
   * استخراج المعلومات المهمة
   */
  private extractImportantInfo(message: Message) {
    const content = message.content.toLowerCase();
    
    // استخراج اهتمامات المستخدم
    if (content.includes('أبحث عن') || content.includes('أريد')) {
      const interests = this.memory.longTerm.get('interests') || [];
      interests.push(content);
      this.memory.longTerm.set('interests', interests.slice(-5)); // آخر 5
    }
    
    // استخراج الميزانية
    const priceMatch = content.match(/(\d+)\s*(جنيه|ريال|دولار)/);
    if (priceMatch) {
      this.memory.longTerm.set('budget', parseInt(priceMatch[1]));
    }
    
    // استخراج التفضيلات
    if (content.includes('أحب') || content.includes('أفضل')) {
      const preferences = this.memory.longTerm.get('preferences') || [];
      preferences.push(content);
      this.memory.longTerm.set('preferences', preferences.slice(-3));
    }
  }
  
  /**
   * تحليل نية المستخدم
   */
  private analyzeIntent(message: string): {
    intent: string;
    entities: Record<string, any>;
    confidence: number;
  } {
    const lowerMessage = message.toLowerCase();
    
    // البحث عن منتج
    if (lowerMessage.match(/(أبحث|ابحث|أريد|اريد|عندكم|لديكم)/)) {
      return {
        intent: 'search_product',
        entities: { query: message },
        confidence: 0.9
      };
    }
    
    // سؤال عن السعر
    if (lowerMessage.match(/(سعر|ثمن|كم|تكلفة)/)) {
      return {
        intent: 'price_inquiry',
        entities: {},
        confidence: 0.85
      };
    }
    
    // تتبع الطلب
    if (lowerMessage.match(/(طلب|أوردر|شحنة|توصيل)/)) {
      return {
        intent: 'track_order',
        entities: {},
        confidence: 0.8
      };
    }
    
    // إضافة للسلة
    if (lowerMessage.match(/(أضف|اضف|اشتري|اشتريه)/)) {
      return {
        intent: 'add_to_cart',
        entities: {},
        confidence: 0.85
      };
    }
    
    // استفسار عام
    return {
      intent: 'general_inquiry',
      entities: {},
      confidence: 0.6
    };
  }
  
  /**
   * بناء السياق للرد
   */
  private buildContextPrompt(): string {
    let prompt = 'أنت مساعد ذكي لمتجر EgyGo الإلكتروني.\n\n';
    
    // معلومات المستخدم
    if (this.context.userProfile) {
      prompt += `معلومات العميل:\n`;
      if (this.context.userProfile.name) {
        prompt += `- الاسم: ${this.context.userProfile.name}\n`;
      }
      if (this.context.userProfile.orderHistory?.length) {
        prompt += `- عدد الطلبات السابقة: ${this.context.userProfile.orderHistory.length}\n`;
      }
      if (this.context.userProfile.cart?.length) {
        prompt += `- عدد المنتجات في السلة: ${this.context.userProfile.cart.length}\n`;
      }
    }
    
    // الذاكرة طويلة المدى
    if (this.memory.longTerm.size > 0) {
      prompt += `\nمعلومات من المحادثات السابقة:\n`;
      
      const interests = this.memory.longTerm.get('interests');
      if (interests?.length) {
        prompt += `- اهتمامات العميل: ${interests.join(', ')}\n`;
      }
      
      const budget = this.memory.longTerm.get('budget');
      if (budget) {
        prompt += `- الميزانية المذكورة: ${budget} جنيه\n`;
      }
    }
    
    // المحادثة الحالية
    if (this.memory.shortTerm.length > 0) {
      prompt += `\nآخر ${Math.min(3, this.memory.shortTerm.length)} رسائل:\n`;
      this.memory.shortTerm.slice(-3).forEach(msg => {
        prompt += `${msg.role === 'user' ? 'العميل' : 'المساعد'}: ${msg.content}\n`;
      });
    }
    
    // سياق المنتج الحالي
    if (this.context.productContext) {
      prompt += `\nالمنتج الحالي: ${this.context.productContext.name}\n`;
      prompt += `السعر: ${this.context.productContext.price} جنيه\n`;
    }
    
    prompt += `\nالرجاء الرد بطريقة ودية واحترافية باللغة العربية.`;
    
    return prompt;
  }
  
  /**
   * توليد رد ذكي
   */
  async generateResponse(userMessage: string): Promise<{
    message: string;
    actions?: Array<{
      type: string;
      label: string;
      data: any;
    }>;
    suggestions?: string[];
  }> {
    // إضافة رسالة المستخدم للذاكرة
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    this.addToMemory(userMsg);
    
    // تحليل النية
    const { intent, entities } = this.analyzeIntent(userMessage);
    
    // توليد الرد حسب النية
    let response = '';
    let actions: any[] = [];
    let suggestions: string[] = [];
    
    switch (intent) {
      case 'search_product':
        response = 'بالتأكيد! سأساعدك في البحث عن المنتج المناسب. ';
        if (entities.query) {
          response += `دعني أبحث عن "${entities.query}" لك...`;
          actions.push({
            type: 'search',
            label: 'عرض النتائج',
            data: { query: entities.query }
          });
        }
        suggestions = ['عرض الأكثر مبيعاً', 'عرض العروض الحالية', 'تصفح الفئات'];
        break;
        
      case 'price_inquiry':
        if (this.context.productContext) {
          response = `سعر ${this.context.productContext.name} هو ${this.context.productContext.price} جنيه. `;
          if (this.context.productContext.discount) {
            response += `يوجد خصم ${this.context.productContext.discount}%! `;
          }
          actions.push({
            type: 'add_to_cart',
            label: 'إضافة للسلة',
            data: { productId: this.context.productContext.$id }
          });
        } else {
          response = 'ما هو المنتج الذي تريد الاستفسار عن سعره؟';
        }
        break;
        
      case 'track_order':
        if (this.context.userProfile?.orderHistory?.length) {
          const lastOrder = this.context.userProfile.orderHistory[0];
          response = `آخر طلب لك رقم ${lastOrder.orderNumber} `;
          response += `وحالته: ${this.getOrderStatus(lastOrder.status)}. `;
          actions.push({
            type: 'view_order',
            label: 'عرض تفاصيل الطلب',
            data: { orderId: lastOrder.$id }
          });
        } else {
          response = 'ليس لديك طلبات حالياً. هل تريد تصفح المنتجات؟';
          suggestions = ['تصفح المنتجات', 'عرض العروض'];
        }
        break;
        
      case 'add_to_cart':
        if (this.context.productContext) {
          response = `سأضيف ${this.context.productContext.name} إلى سلتك!`;
          actions.push({
            type: 'add_to_cart',
            label: 'تأكيد الإضافة',
            data: { productId: this.context.productContext.$id }
          });
        } else {
          response = 'أي منتج تريد إضافته؟ يمكنني مساعدتك في البحث.';
        }
        break;
        
      default:
        // استخدام OpenAI API إذا كان متاح
        if (import.meta.env.VITE_OPENAI_API_KEY) {
          response = await this.callOpenAI(userMessage);
        } else {
          response = this.generateFallbackResponse(userMessage);
        }
        suggestions = ['كيف يمكنني المساعدة؟', 'عرض المنتجات', 'حالة طلبي'];
    }
    
    // إضافة رد المساعد للذاكرة
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
    this.addToMemory(assistantMsg);
    
    return { message: response, actions, suggestions };
  }
  
  /**
   * استدعاء OpenAI API
   */
  private async callOpenAI(userMessage: string): Promise<string> {
    try {
      const context = this.buildContextPrompt();
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: context },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackResponse(userMessage);
    }
  }
  
  /**
   * رد احتياطي
   */
  private generateFallbackResponse(userMessage: string): string {
    const responses = [
      'شكراً لتواصلك! كيف يمكنني مساعدتك اليوم؟',
      'أنا هنا للمساعدة! هل تبحث عن منتج معين؟',
      'يمكنني مساعدتك في البحث عن المنتجات أو تتبع طلباتك.',
      'هل لديك أي استفسار عن المنتجات أو الطلبات؟'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  /**
   * ترجمة حالة الطلب
   */
  private getOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'قيد الانتظار',
      'processing': 'قيد المعالجة',
      'shipped': 'تم الشحن',
      'delivered': 'تم التسليم',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
  }
  
  /**
   * مسح الذاكرة
   */
  clearMemory() {
    this.memory = {
      shortTerm: [],
      longTerm: new Map(),
      summary: ''
    };
    localStorage.removeItem(`chat_memory_${this.context.userId}`);
  }
  
  /**
   * الحصول على ملخص المحادثة
   */
  getConversationSummary(): string {
    if (this.memory.shortTerm.length === 0) {
      return 'لا توجد محادثة حالياً';
    }
    
    const topics = new Set<string>();
    this.memory.shortTerm.forEach(msg => {
      if (msg.role === 'user') {
        const { intent } = this.analyzeIntent(msg.content);
        topics.add(intent);
      }
    });
    
    return `تحدثنا عن: ${Array.from(topics).join(', ')}`;
  }
}
