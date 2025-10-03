import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, TrendingUp, Briefcase, Shield, User } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

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

  // AI Response generator
  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // FAQ responses in Egyptian dialect
    if (lowerMessage.includes('شحن') || lowerMessage.includes('توصيل')) {
      return 'الشحن عندنا سريع وآمن! 📦\n\n• بنوصل لكل محافظات مصر\n• الشحن مجاني للطلبات أكتر من 500 جنيه\n• التوصيل خلال 3-5 أيام عمل\n• تقدر تتبع طلبك أول بأول';
    }

    if (lowerMessage.includes('دفع') || lowerMessage.includes('كاش')) {
      return 'متقلقش، الدفع عندنا سهل! 💳\n\n• كاش عند الاستلام متاح\n• فيزا وماستركارد\n• آمن 100%\n• ما بناخدش فلوس غير لما تستلم المنتج';
    }

    if (lowerMessage.includes('عمولة') || lowerMessage.includes('افلييت') || lowerMessage.includes('تسويق')) {
      return 'برنامج التسويق بالعمولة بتاعنا ممتاز! 🎯\n\n• عمولة لحد 25% على كل عملية بيع\n• أدوات تسويقية جاهزة\n• سحب أرباح سريع\n• دعم فني متواصل\n\nانضم دلوقتي من صفحة البرنامج!';
    }

    if (lowerMessage.includes('منتج') || lowerMessage.includes('سعر')) {
      return 'عندنا تشكيلة كبيرة من المنتجات! 🛍️\n\n• أسعار تنافسية\n• منتجات أصلية 100%\n• ضمان على كل المنتجات\n• عروض وخصومات مستمرة\n\nتقدر تتصفح المنتجات من الصفحة الرئيسية';
    }

    if (lowerMessage.includes('إرجاع') || lowerMessage.includes('استرجاع')) {
      return 'سياسة الإرجاع عندنا سهلة! 🔄\n\n• إرجاع مجاني خلال 14 يوم\n• استرداد كامل للمبلغ\n• بدون أسئلة كتير\n• المنتج لازم يكون في حالته الأصلية';
    }

    if (lowerMessage.includes('حساب') || lowerMessage.includes('تسجيل')) {
      return user
        ? `حسابك شغال تمام يا ${user.name}! ✅\n\nتقدر تراجع:\n• طلباتك من "طلباتي"\n• بياناتك من "حسابي"\n• المفضلة من أيقونة القلب`
        : 'عشان تستفيد من كل المميزات، سجل دخولك أو أنشئ حساب جديد! 🔐\n\nالتسجيل سهل ومجاني تماماً';
    }

    if (lowerMessage.includes('مساعدة') || lowerMessage.includes('دعم')) {
      return 'أنا هنا عشان أساعدك! 🤝\n\nممكن تسألني عن:\n• الشحن والتوصيل\n• طرق الدفع\n• المنتجات والأسعار\n• برنامج التسويق بالعمولة\n• الإرجاع والاسترداد\n• أي حاجة تانية!\n\nاسأل براحتك 😊';
    }

    // Default response
    return 'عذراً، مش فاهم سؤالك كويس 🤔\n\nممكن تعيده تاني بطريقة تانية؟ أو اختار واحد من المواضيع دي:\n\n• الشحن والتوصيل\n• طرق الدفع\n• برنامج التسويق\n• المنتجات والأسعار\n• الإرجاع والاسترداد';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: String(messages.length + 1),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const botMessage: Message = {
        id: String(messages.length + 2),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
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
                  <span className="text-xs opacity-90">متاح دلوقتي</span>
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
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></div>
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              مدعوم بالذكاء الاصطناعي 🤖
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
