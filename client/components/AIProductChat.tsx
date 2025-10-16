/**
 * AI Product Chat Assistant
 * Chat with AI about product optimization, pricing, marketing, etc.
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  Sparkles,
  Bot,
  User,
  TrendingUp,
  DollarSign,
  Target,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { env } from '@/lib/env';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIProductChatProps {
  productName: string;
  productDescription?: string;
  productPrice?: number;
  productCategory?: string;
}

const quickQuestions = [
  { icon: DollarSign, text: 'ما السعر المناسب؟', prompt: 'ما هو السعر المناسب لهذا المنتج في السوق المصري؟' },
  { icon: TrendingUp, text: 'كيف أزيد المبيعات؟', prompt: 'ما هي أفضل استراتيجيات لزيادة مبيعات هذا المنتج؟' },
  { icon: Target, text: 'من الجمهور المستهدف؟', prompt: 'من هو الجمهور المستهدف الأمثل لهذا المنتج؟' },
  { icon: Lightbulb, text: 'أفكار تسويقية', prompt: 'أعطني 5 أفكار تسويقية إبداعية لهذا المنتج' },
];

export function AIProductChat({ 
  productName, 
  productDescription, 
  productPrice,
  productCategory 
}: AIProductChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `مرحباً! 👋 أنا مساعدك الذكي للمنتجات. يمكنني مساعدتك في:\n\n• تحسين الوصف والعنوان\n• اقتراح السعر المناسب\n• استراتيجيات التسويق\n• تحليل المنافسين\n• SEO والكلمات المفتاحية\n\nكيف يمكنني مساعدتك اليوم؟`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const systemPrompt = `أنت خبير في التجارة الإلكترونية والتسويق الرقمي في السوق المصري والعربي.

معلومات المنتج الحالي:
- الاسم: ${productName}
- الوصف: ${productDescription || 'غير متوفر'}
- السعر: ${productPrice ? `${productPrice} جنيه` : 'غير محدد'}
- الفئة: ${productCategory || 'غير محدد'}

قدم نصائح عملية ومحددة بناءً على السوق المصري. استخدم لغة عربية واضحة ومهنية.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: messageText }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      toast({
        title: '❌ خطأ',
        description: error.message || 'فشل إرسال الرسالة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MessageCircle className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg">مساعد المنتجات الذكي</h3>
            <p className="text-xs text-muted-foreground font-normal">
              اسأل عن أي شيء متعلق بالمنتج
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Messages */}
        <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ar-EG', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-muted-foreground mb-2">أسئلة سريعة:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, index) => {
              const Icon = q.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(q.prompt)}
                  disabled={loading}
                  className="text-xs"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {q.text}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage(input)}
              placeholder="اكتب سؤالك هنا..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
