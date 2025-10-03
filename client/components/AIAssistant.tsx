import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, TrendingUp, Briefcase, Shield, User, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { useAuth } from '@/contexts/AppwriteAuthContext';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Chat history with messages
  const chatRef = useRef<Array<{role: 'system' | 'user' | 'assistant'; content: string}>>([]);

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

تعليمات مهمة:
1. تحدث باللهجة المصرية الطبيعية (مثل: "ازيك"، "دلوقتي"، "عشان"، "لحد")
2. كن ودوداً ومساعداً
3. أجب بإيجاز ووضوح (3-5 أسطر max)
4. استخدم emojis مصرية (🇪🇬 ❤️ 🛍️ 💰)
5. اذكر عروض إيجي جو عند الإمكان`;

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
            link: '/#/login',
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
            link: '/#/affiliate/dashboard',
          },
        },
        {
          icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
          title: 'استخدم الأدوات التسويقية',
          message: 'عندنا بنرات وصور جاهزة تقدر تستخدمها في حملاتك التسويقية',
          action: {
            label: 'شوف الأدوات',
            link: '/#/affiliate/creatives',
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
            link: '/#/admin/products',
          },
        },
        {
          icon: <Briefcase className="h-5 w-5 text-purple-600" />,
          title: 'تابع أداء مبيعاتك',
          message: 'راجع تقارير المبيعات بتاعتك واعرف أكتر المنتجات مبيعاً',
          action: {
            label: 'شوف التقارير',
            link: '/#/merchant/dashboard',
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
            link: '/#/admin/orders',
          },
        },
        {
          icon: <Shield className="h-5 w-5 text-primary" />,
          title: 'تحليل أداء الموقع',
          message: 'راجع إحصائيات الموقع واعرف المنتجات الأكتر مبيعاً والأقسام الأكتر زيارة',
          action: {
            label: 'لوحة التحكم',
            link: '/#/admin',
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

  // Handle send message with server-side OpenAI API
  const handleSendMessage = async () => {
    console.log('📤 handleSendMessage called');
    
    if (!inputValue.trim()) {
      console.log('⚠️ Empty input, aborting');
      return;
    }

    const currentInput = inputValue;
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
      console.log('✅ Using Appwrite Function (serverless)...');
      
      // Add user message to chat history
      chatRef.current.push({
        role: 'user',
        content: currentInput
      });

      // Call Appwrite Function
      const projectId = '68d8b9db00134c41e7c8';
      const functionId = 'openai-chat';
      const response = await fetch(
        `https://fra.cloud.appwrite.io/v1/functions/${functionId}/executions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': projectId,
          },
          body: JSON.stringify({
            messages: chatRef.current
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const execution = await response.json();
      
      // Wait for execution to complete and get response
      let executionResult = execution;
      while (executionResult.status === 'processing' || executionResult.status === 'waiting') {
        await new Promise(resolve => setTimeout(resolve, 500));
        const statusResponse = await fetch(
          `https://fra.cloud.appwrite.io/v1/functions/${functionId}/executions/${executionResult.$id}`,
          {
            headers: {
              'X-Appwrite-Project': projectId,
            },
          }
        );
        executionResult = await statusResponse.json();
      }

      if (executionResult.status !== 'completed') {
        throw new Error(`Function execution failed: ${executionResult.status}`);
      }

      const data = JSON.parse(executionResult.responseBody || '{}');
      const aiText = data.message || 'عذراً، ما قدرتش أفهم. جرب تاني 🙏';

      // Add assistant response to history
      chatRef.current.push({
        role: 'assistant',
        content: aiText
      });

      const botMessage: Message = {
        id: String(messages.length + 2),
        type: 'bot',
        content: aiText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      
      // Detailed error message
      let errorMessage = 'عذراً، حصل خطأ في الاتصال. جرب تاني بعد شوية 🙏';

      if (error?.message?.includes('API key') || error?.message?.includes('401')) {
        errorMessage = 'في مشكلة في إعدادات الـ API. يرجى التواصل مع الدعم 🔑';
      } else if (error?.message?.includes('quota') || error?.message?.includes('429')) {
        errorMessage = 'وصلنا للحد الأقصى من الطلبات. جرب تاني بعد دقيقة ⏱️';
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        errorMessage = 'في مشكلة في الاتصال بالإنترنت. تأكد من اتصالك وجرب تاني 🌐';
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
          className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 left-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">مساعد إيجي جو الذكي</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-90">متاح دلوقتي • OpenAI</span>
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
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
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
          <div className="p-4 border-t">
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
                onClick={handleSendMessage} 
                size="icon"
                disabled={isTyping || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              مدعوم بـ OpenAI 🤖
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
