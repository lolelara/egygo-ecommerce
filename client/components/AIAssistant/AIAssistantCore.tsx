/**
 * 🤖 Enhanced AI Assistant Core
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';

// User Role Types
export type UserRole = 'customer' | 'merchant' | 'affiliate' | 'admin' | 'guest';

// Message Interface
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
    category?: string;
    confidence?: number;
    suggestions?: string[];
    data?: any;
  };
}

// Analytics Interface
export interface AnalyticsData {
  orders?: any[];
  products?: any[];
  revenue?: number;
  customers?: number;
  trends?: any[];
  predictions?: any[];
}

// AI Service Class
export class AIService {
  private model: string;
  private userRole: UserRole;
  private analytics: AnalyticsData;

  constructor(userRole: UserRole = 'guest', analytics: AnalyticsData = {}) {
    this.model = 'gpt-4-turbo-preview';
    this.userRole = userRole;
    this.analytics = analytics;
  }

  // Analyze user intent
  analyzeIntent(message: string): string {
    const intents = {
      product_search: ['ابحث', 'منتج', 'سعر', 'متوفر', 'موجود', 'أريد', 'احتاج'],
      order_tracking: ['طلب', 'شحن', 'توصيل', 'وصل', 'متى', 'أين', 'تتبع'],
      support: ['مساعدة', 'مشكلة', 'خطأ', 'لا يعمل', 'عطل', 'ساعدني'],
      recommendation: ['اقترح', 'انصح', 'رأيك', 'الأفضل', 'ماذا', 'توصية'],
      analytics: ['تحليل', 'إحصائيات', 'تقرير', 'أداء', 'مبيعات', 'بيانات'],
      pricing: ['سعر', 'تكلفة', 'خصم', 'عرض', 'كوبون', 'رخيص'],
      account: ['حساب', 'تسجيل', 'دخول', 'كلمة', 'نسيت', 'بروفايل'],
      payment: ['دفع', 'فيزا', 'بطاقة', 'تقسيط', 'كاش', 'محفظة'],
      shipping: ['شحن', 'توصيل', 'استلام', 'عنوان', 'موعد'],
      returns: ['إرجاع', 'استبدال', 'ضمان', 'عيب', 'مشكلة'],
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  // Analyze sentiment
  analyzeSentiment(message: string): 'positive' | 'negative' | 'neutral' {
    const positive = ['شكرا', 'ممتاز', 'رائع', 'جميل', 'أحب', 'سعيد', 'مذهل'];
    const negative = ['سيء', 'مشكلة', 'غاضب', 'محبط', 'أكره', 'فشل', 'خطأ'];

    const hasPositive = positive.some(word => message.includes(word));
    const hasNegative = negative.some(word => message.includes(word));

    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  // Get role-based system prompt
  getRoleBasedPrompt(language: string = 'ar'): string {
    const basePrompt = `You are an intelligent assistant for EgyGo e-commerce store.
    Current time: ${new Date().toISOString()}
    User role: ${this.userRole}
    Language: ${language === 'ar' ? 'Arabic' : 'English'}
    
    Guidelines:
    1. Be helpful, friendly, and professional
    2. Provide accurate and specific information
    3. Use emojis appropriately
    4. Give actionable suggestions
    5. Personalize responses based on user role`;

    const roleContext = {
      customer: `
        Focus on:
        - Product recommendations
        - Order assistance
        - Problem solving
        - Special offers
        Available data:
        - Previous orders: ${this.analytics.orders?.length || 0}
        - Wishlist items: ${this.analytics.products?.length || 0}
      `,
      merchant: `
        Focus on:
        - Sales analytics
        - Performance insights
        - Inventory management
        - Customer behavior
        Available data:
        - Total revenue: ${this.analytics.revenue || 0} EGP
        - Orders: ${this.analytics.orders?.length || 0}
        - Customers: ${this.analytics.customers || 0}
      `,
      affiliate: `
        Focus on:
        - Campaign performance
        - Commission tracking
        - Marketing strategies
        - Audience insights
      `,
      admin: `
        Focus on:
        - System monitoring
        - Performance metrics
        - Security alerts
        - User management
        Available data:
        - Total revenue: ${this.analytics.revenue || 0} EGP
        - Total orders: ${this.analytics.orders?.length || 0}
        - Active users: ${this.analytics.customers || 0}
      `,
      guest: `
        Focus on:
        - Welcome and introduction
        - Product showcase
        - Registration benefits
        - General assistance
      `,
    };

    return basePrompt + (roleContext[this.userRole] || roleContext.guest);
  }

  // Generate smart response
  async generateResponse(message: string, history: Message[] = []): Promise<{
    content: string;
    metadata: any;
  }> {
    const intent = this.analyzeIntent(message);
    const sentiment = this.analyzeSentiment(message);
    const systemPrompt = this.getRoleBasedPrompt();

    try {
      // Call backend chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('AI API error');
      }

      const data = await response.json();
      
      return {
        content: data.choices[0].message.content,
        metadata: {
          intent,
          sentiment,
          confidence: 0.95,
        },
      };
    } catch (error) {
      console.error('AI Error:', error);
      
      // Fallback response
      return {
        content: this.getFallbackResponse(intent),
        metadata: {
          intent,
          sentiment,
          confidence: 0.5,
        },
      };
    }
  }

  // Get fallback response
  getFallbackResponse(intent: string): string {
    const responses = {
      product_search: '🔍 يمكنك البحث عن المنتجات من خلال صفحة المنتجات أو استخدام شريط البحث.',
      order_tracking: '📦 يمكنك تتبع طلباتك من صفحة "طلباتي" في حسابك الشخصي.',
      support: '🤝 فريق الدعم متاح لمساعدتك. يمكنك التواصل معنا على support@egygo.me',
      recommendation: '✨ لدينا مجموعة رائعة من المنتجات! تحقق من قسم "الأكثر مبيعاً".',
      analytics: '📊 يمكنك عرض التحليلات التفصيلية من لوحة التحكم الخاصة بك.',
      pricing: '💰 لدينا عروض مميزة! تحقق من صفحة العروض للحصول على أفضل الأسعار.',
      account: '👤 يمكنك إدارة حسابك من صفحة الملف الشخصي.',
      payment: '💳 نقبل جميع طرق الدفع: البطاقات الائتمانية، المحافظ الإلكترونية، والدفع عند الاستلام.',
      shipping: '🚚 نوفر شحن سريع لجميع المحافظات خلال 2-5 أيام عمل.',
      returns: '↩️ يمكنك إرجاع المنتجات خلال 14 يوم من تاريخ الاستلام.',
      general: '👋 مرحباً! كيف يمكنني مساعدتك اليوم؟',
    };

    return responses[intent] || responses.general;
  }
}

// Custom Hook for AI Assistant
export function useAIAssistant() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [analytics, setAnalytics] = useState<AnalyticsData>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Determine user role
  useEffect(() => {
    if (user) {
      determineUserRole();
      loadAnalytics();
    }
  }, [user]);

  const determineUserRole = async () => {
    if (!user) {
      setUserRole('guest');
      return;
    }

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        'users',
        [Query.equal('email', user.email)]
      );

      if (response.documents.length > 0) {
        const userData = response.documents[0];
        setUserRole(userData.role || 'customer');
      }
    } catch (error) {
      console.error('Error determining role:', error);
      setUserRole('customer');
    }
  };

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      // Load user-specific analytics
      const orders = await databases.listDocuments(
        DATABASE_ID,
        'orders',
        [Query.equal('userId', user.$id), Query.limit(20)]
      );

      const wishlist = await databases.listDocuments(
        DATABASE_ID,
        'wishlist',
        [Query.equal('userId', user.$id)]
      );

      setAnalytics({
        orders: orders.documents,
        products: wishlist.documents,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const sendMessage = async (content: string): Promise<Message> => {
    setIsLoading(true);
    
    const aiService = new AIService(userRole, analytics);
    const response = await aiService.generateResponse(content, messages);
    
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      metadata: response.metadata,
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
    
    return assistantMessage;
  };

  return {
    userRole,
    analytics,
    messages,
    isLoading,
    sendMessage,
    setMessages,
  };
}
