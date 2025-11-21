import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, TrendingUp, Briefcase, Shield, User, Loader2, FileText, BarChart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { buildUserContext, buildAdminContext } from '@/lib/ai-context-builder';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AITip {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    link: string;
  };
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [activeProvider, setActiveProvider] = useState<'openai' | 'gemini'>('openai');

  // Chat history with messages
  const chatRef = useRef<Array<{ role: 'system' | 'user' | 'assistant'; content: string }>>([]);

  // User context data
  const [userContextData, setUserContextData] = useState<string | null>(null);

  // Load user/admin context when chat opens
  useEffect(() => {
    if (isOpen && user && !userContextData) {
      loadUserContext();
    }
  }, [isOpen, user]);

  const loadUserContext = async (): Promise<string | null> => {
    if (!user) return null;

    setIsLoadingContext(true);
    try {
      // Check if user is admin (adjust based on your logic)
      const isAdmin = (user as any).labels?.includes('admin') || user.email === 'admin@egygo.com';

      let context: string;
      if (isAdmin) {
        context = await buildAdminContext();
      } else {
        context = await buildUserContext(user.$id);
      }

      setUserContextData(context);
      console.log('✅ Context loaded:', context.substring(0, 100) + '...');
      return context;
    } catch (error) {
      console.error('Error loading context:', error);
      return null;
    } finally {
      setIsLoadingContext(false);
    }
  };

  // Lazily initialize chat history on the client-side only
  useEffect(() => {
    console.log('🔍 useEffect triggered - initializing chat...');

    if (typeof window === 'undefined') {
      console.log('⚠️ Server-side render detected, skipping');
      return;
    }

    if (chatRef.current.length > 0) {
      console.log('✅ Chat already initialized, skipping');
      return;
    }

    console.log('� Initializing chat history with system prompt...');

    try {
      // Initialize chat history with system prompt
      const systemPrompt = `أنت مساعد ذكي لموقع إيجي جو للتسوق الإلكتروني في مصر. 

معلومات عن الموقع:
- موقع تسوق إلكتروني مصري
- يبيع منتجات متنوعة بأسعار تنافسية
- شحن لجميع أنحاء مصر (مجاني فوق 500 جنيه)
- دفع عند الاستلام متاح
- برنامج تسويق بالعمولة (لحد 25%)
- برنامج للتجار لبيع منتجاتهم
- ضمان على المنتجات
- إرجاع مجاني خلال 14 يوم

قدراتك الخاصة:
✅ يمكنك رؤية بيانات المستخدم الكاملة (طلبات، عمولات، إحصائيات)
✅ يمكنك عمل تقارير شاملة للأدمن عن أداء الموقع
✅ يمكنك تحليل البيانات وإعطاء نصائح مخصصة
✅ يمكنك اقتراح خطط تطوير بناءً على نشاط المستخدم

الأوامر الخاصة:
• "راجع حسابي" → أعرض تحليل شامل لحساب المستخدم
• "اعمل تقرير" → أنشئ تقرير مفصل للأدمن عن الموقع
• "نصائح" → أعطي نصائح ذكية بناءً على البيانات
• "جدول تطوير" → أقترح خطة عمل مخصصة

تعليمات مهمة:
1. تحدث باللهجة المصرية الطبيعية (مثل: "ازيك"، "دلوقتي"، "عشان"، "لحد")
2. استخدم البيانات المتاحة لك لتقديم إجابات مخصصة ودقيقة
3. عند كتابة تقارير، نظمها بعناوين واضحة وأرقام محددة
4. أعطي توصيات قابلة للتنفيذ (actionable recommendations)
5. استخدم emojis مصرية (🇪🇬 ❤️ 🛍️ 💰 📊 📈 🏆)
6. عند رؤية بيانات المستخدم في [بيانات المستخدم]، حللها واستخدمها في إجابتك`;


      chatRef.current = [
        {
          role: 'system',
          content: systemPrompt
        }
      ];

      console.log('💬 Chat history initialized, length:', chatRef.current.length);
      setIsModelReady(true);
      setInitError(null);
      console.log('✅ Chat initialization complete!');
    } catch (error) {
      console.error('❌ Failed to initialize chat:', error);
      setInitError('init-failed');
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Quick action buttons
  const quickActions = [
    { label: '📊 راجع حسابي', value: 'راجع حسابي وقولي إيه الإحصائيات بتاعتي' },
    { label: '💡 نصائح ذكية', value: 'اديني نصائح ذكية بناءً على نشاطي' },
    { label: '📈 جدول تطوير', value: 'اعمل لي جدول تطوير مخصص' },
    { label: '🎯 اقتراحات', value: 'اقترح علي حاجات تساعدني أحسن أدائي' },
  ];

  // Admin quick actions
  const adminActions = [
    { label: '📊 تقرير شامل', value: 'اعمل تقرير شامل عن أداء الموقع' },
    { label: '🏆 أفضل المسوقين', value: 'اعرض أفضل 10 مسوقين بالعمولة' },
    { label: '📦 حالة المخزون', value: 'راجع حالة المخزون والمنتجات المنخفضة' },
    { label: '💰 تحليل الإيرادات', value: 'حلل الإيرادات وقولي فين المشاكل' },
  ];

  const handleQuickAction = (value: string) => {
    setInputValue(value);
    // أرسل الرسالة مباشرة باستخدام القيمة المحددة
    handleSendMessage(value);
  };

  // Generate AI tips based on user role and stats
  const generateAITips = (): AITip[] => {
    if (!user) {
      return [
        {
          icon: <User className="h-5 w-5" />,
          title: 'سجل دخولك الآن',
          message: 'سجل دخول عشان تقدر تتابع طلباتك وتستفيد من كل المميزات',
          action: {
            label: 'تسجيل الدخول',
            link: '/login',
          },
        },
      ];
    }

    const tips: AITip[] = [];

    // Tips for Affiliates
    if (user.isAffiliate) {
      tips.push(
        {
          icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
          title: 'زود أرباحك من التسويق',
          message: 'ركز على المنتجات اللي فيها عمولة أعلى وشاركها على السوشيال ميديا بشكل منتظم',
          action: {
            label: 'شوف أفضل المنتجات',
            link: '/affiliate/dashboard',
          },
        },
        {
          icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
          title: 'استخدم الأدوات التسويقية',
          message: 'عندنا بنرات وصور جاهزة تقدر تستخدمها في حملاتك التسويقية',
          action: {
            label: 'شوف الأدوات',
            link: '/affiliate/creatives',
          },
        }
      );
    }

    // Tips for Merchants
    if (user.role === 'merchant') {
      tips.push(
        {
          icon: <Briefcase className="h-5 w-5 text-purple-600" />,
          title: 'حسن صور منتجاتك',
          message: 'المنتجات اللي فيها صور واضحة بتبيع أكتر بنسبة 70%. حط صور احترافية لمنتجاتك',
          action: {
            label: 'إدارة المنتجات',
            link: '/admin/products',
          },
        },
        {
          icon: <Briefcase className="h-5 w-5 text-purple-600" />,
          title: 'تابع أداء مبيعاتك',
          message: 'راجع تقارير المبيعات بتاعتك واعرف أكتر المنتجات مبيعاً',
          action: {
            label: 'شوف التقارير',
            link: '/merchant/dashboard',
          },
        }
      );
    }

    // Tips for Admins
    if (user.role === 'admin') {
      tips.push(
        {
          icon: <Shield className="h-5 w-5 text-primary" />,
          title: 'راجع الطلبات الجديدة',
          message: 'فيه طلبات محتاجة مراجعة. اتأكد من معالجتها بسرعة عشان رضا العملاء',
          action: {
            label: 'الطلبات',
            link: '/admin/orders',
          },
        },
        {
          icon: <Shield className="h-5 w-5 text-primary" />,
          title: 'تحليل أداء الموقع',
          message: 'راجع إحصائيات الموقع واعرف المنتجات الأكتر مبيعاً والأقسام الأكتر زيارة',
          action: {
            label: 'لوحة التحكم',
            link: '/admin',
          },
        }
      );
    }

    // General tips for all users
    tips.push(
      {
        icon: <Bot className="h-5 w-5 text-blue-600" />,
        title: 'محتاج مساعدة؟',
        message: 'أنا هنا عشان أساعدك! اسألني أي حاجة عن الموقع أو منتجاتنا',
      }
    );

    return tips;
  };

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = user
        ? `أهلاً ${user.name}! 👋\n\nأنا مساعدك الذكي في إيجي جو. ازيك النهاردة؟ محتاج مساعدة في حاجة معينة؟`
        : 'أهلاً بيك في إيجي جو! 👋\n\nأنا المساعد الذكي بتاعنا. ممكن أساعدك في إيه النهاردة؟';

      setMessages([
        {
          id: '1',
          type: 'bot',
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);

      // Show AI tips after welcome message
      setTimeout(() => {
        const tips = generateAITips();
        const tipsMessage = tips
          .slice(0, 2)
          .map((tip) => `💡 ${tip.title}\n${tip.message}`)
          .join('\n\n');

        setMessages((prev) => [
          ...prev,
          {
            id: String(prev.length + 1),
            type: 'bot',
            content: tipsMessage,
            timestamp: new Date(),
          },
        ]);
      }, 1000);
    }
  }, [isOpen, user]);

  // Handle send message with client-side API calls (OpenAI or Gemini)
  const handleSendMessage = async (overrideText?: string) => {
    console.log('📤 handleSendMessage called');

    if (!isModelReady) {
      console.log('⚠️ Model not ready yet, aborting');
      return;
    }

    const rawInput = overrideText ?? inputValue;
    if (!rawInput.trim()) {
      console.log('⚠️ Empty input, aborting');
      return;
    }

    const currentInput = rawInput;
    console.log('📝 User input:', currentInput);

    // Add user message
    const userMessage: Message = {
      id: String(messages.length + 1),
      type: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      console.log('✅ Fetching API keys from Appwrite...');

      // 1. Get ALL active API keys from Appwrite, sorted by priority
      const keysResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.openai_keys,
        [
          Query.equal('status', 'active'),
          Query.orderDesc('priority'), // High priority first
          Query.limit(10)
        ]
      );

      const keys = keysResponse.documents;
      console.log(`Found ${keys.length} active keys`);

      if (keys.length === 0) {
        throw new Error('لم يتم العثور على مفاتيح API نشطة. يرجى الاتصال بالدعم.');
      }

      let lastError = null;
      let success = false;

      // 2. Iterate through keys until one works
      for (const activeKey of keys) {
        if (!activeKey.apiKey) continue;

        const apiKey = activeKey.apiKey;
        let provider = activeKey.provider || 'openai';

        // Auto-detect provider based on key prefix if possible
        if (apiKey.startsWith('sk-')) {
          provider = 'openai';
        } else if (apiKey.startsWith('AIza')) {
          provider = 'gemini';
        }

        console.log(`🔄 Trying ${provider} key (Priority: ${activeKey.priority})...`);

        try {
          // Check if user is asking for contextual data
          const contextualKeywords = ['راجع', 'شوف بياناتي', 'تقرير', 'نصائح', 'نصيحة', 'جدول تطوير', 'حسابي'];
          const needsContext = contextualKeywords.some(keyword => currentInput.includes(keyword));

          // Prepare context
          let context = '';
          if (needsContext) {
            context = userContextData || '';
            if (!context) {
              context = (await loadUserContext()) || '';
            }
          }

          // Prepare system prompt
          const systemPrompt = `أنت مساعد ذكي لموقع إيجي جو للتسوق الإلكتروني في مصر.
          معلومات عن الموقع: موقع تسوق إلكتروني مصري، يبيع منتجات متنوعة، شحن لجميع أنحاء مصر، دفع عند الاستلام.
          تعليمات: تحدث باللهجة المصرية، كن مفيداً وودوداً، استخدم الإيموجي.
          ${context ? `\nبيانات المستخدم الحالية:\n${context}` : ''}`;

          let aiText = '';

          if (provider === 'gemini') {
            // --- Gemini API Implementation ---
            console.log('🤖 Calling Gemini API...');

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: systemPrompt + "\n\nالمستخدم: " + currentInput }]
                  }
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 1000,
                }
              })
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.error('❌ Gemini API Error:', response.status, errorData);
              throw new Error(errorData.error?.message || `Gemini API Error: ${response.status}`);
            }

            const data = await response.json();
            aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أستطع فهم ذلك.';

          } else {
            // --- OpenAI API Implementation ---
            console.log('🤖 Calling OpenAI API...');

            // Add user message to chat history
            chatRef.current.push({
              role: 'user',
              content: currentInput
            });

            // Limit chat history
            if (chatRef.current.length > 10) {
              chatRef.current = chatRef.current.slice(chatRef.current.length - 10);
            }

            const messagesToSend = [
              { role: 'system', content: systemPrompt },
              ...chatRef.current.map(m => ({ role: m.role, content: m.content }))
            ];

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
              },
              body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messagesToSend,
                temperature: 0.7,
                max_tokens: 1000
              })
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.error('❌ OpenAI API Error:', response.status, errorData);
              throw new Error(errorData.error?.message || `OpenAI API Error: ${response.status}`);
            }

            const data = await response.json();
            aiText = data.choices?.[0]?.message?.content || 'عذراً، لم أستطع فهم ذلك.';

            // Add assistant response to history
            chatRef.current.push({
              role: 'assistant',
              content: aiText
            });
          }

          // Success!
          console.log('✅ AI Response:', aiText.substring(0, 50) + '...');
          setActiveProvider(provider as 'openai' | 'gemini');

          const botMessage: Message = {
            id: String(messages.length + 2),
            type: 'bot',
            content: aiText,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, botMessage]);
          success = true;
          break; // Exit loop on success

        } catch (error: any) {
          console.error(`❌ Error with ${provider} key:`, error);
          lastError = error;

          // If it's a quota or auth error, continue to next key
          if (error.message?.includes('429') || error.message?.includes('quota') ||
            error.message?.includes('401') || error.message?.includes('key')) {
            console.log('⚠️ Key failed (Quota/Auth), trying next key...');
            continue;
          }

          // For other errors, also continue (maybe network glitch on one provider?)
          continue;
        }
      }

      if (!success) {
        throw lastError || new Error('فشل الاتصال بجميع مزودي الخدمة');
      }

    } catch (error: any) {
      console.error('AI API Error (All keys failed):', error);

      // Detailed error message
      let errorMessage = 'عذراً، حصل خطأ في الاتصال. جرب تاني بعد شوية 🙏';

      if (error?.message?.includes('API key') || error?.message?.includes('401') || error?.message?.includes('found')) {
        errorMessage = 'في مشكلة في إعدادات الـ API. يرجى التواصل مع الدعم للتأكد من المفاتيح 🔑';
      } else if (error?.message?.includes('quota') || error?.message?.includes('429')) {
        errorMessage = 'وصلنا للحد الأقصى من الطلبات. جرب تاني بعد دقيقة ⏱️';
      }

      const botMessage: Message = {
        id: String(messages.length + 2),
        type: 'bot',
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getUserRoleBadge = () => {
    if (!user) return null;

    if (user.role === 'admin') {
      return (
        <Badge variant="default" className="bg-primary">
          <Shield className="h-3 w-3 mr-1" />
          مدير
        </Badge>
      );
    }

    if (user.role === 'merchant') {
      return (
        <Badge className="bg-purple-600">
          <Briefcase className="h-3 w-3 mr-1" />
          تاجر
        </Badge>
      );
    }

    if (user.isAffiliate) {
      return (
        <Badge className="bg-orange-600">
          <TrendingUp className="h-3 w-3 mr-1" />
          مسوق
        </Badge>
      );
    }

    return null;
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 md:bottom-6 left-6 h-14 w-14 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-96 h-[500px] md:h-[600px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">مساعد إيجي جو الذكي</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-90">متاح دلوقتي • {activeProvider === 'gemini' ? 'Google Gemini' : 'OpenAI'}</span>
                  {getUserRoleBadge()}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-foreground/20 text-primary-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1 items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground mr-2">جاري الكتابة...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t space-y-3">
            {/* Quick Actions */}
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">إجراءات سريعة:</p>
                <div className="grid grid-cols-2 gap-2">
                  {(user && (user as any).labels?.includes('admin') ? adminActions : quickActions).map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.value)}
                      disabled={isTyping || isLoadingContext}
                      className="text-xs h-auto py-2 px-2 justify-start"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Context Indicator */}
            {isLoadingContext && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>جاري تحميل بياناتك...</span>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="اكتب رسالتك هنا..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                disabled={isTyping}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                size="icon"
                disabled={isTyping || !inputValue.trim() || !isModelReady}
                data-send-button
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              مدعوم بـ {activeProvider === 'gemini' ? 'Google Gemini' : 'OpenAI'} 🤖 {userContextData && '• بيانات محدثة'}
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
