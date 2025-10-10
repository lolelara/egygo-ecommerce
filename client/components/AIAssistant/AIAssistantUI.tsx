/**
 * 🤖 AI Assistant UI Component
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, X, Send, Mic, Paperclip, Sparkles,
  Package, TrendingUp, HelpCircle, BarChart3,
  Users, DollarSign, Target, Shield, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useAIAssistant, Message, UserRole } from './AIAssistantCore';

// Quick Actions
const quickActions = {
  customer: [
    { label: 'تتبع طلب', icon: Package, action: 'أريد تتبع طلبي الأخير' },
    { label: 'منتجات مقترحة', icon: Sparkles, action: 'اقترح لي منتجات مناسبة' },
    { label: 'عروض اليوم', icon: TrendingUp, action: 'ما هي عروض اليوم؟' },
    { label: 'المساعدة', icon: HelpCircle, action: 'أحتاج إلى المساعدة' },
  ],
  merchant: [
    { label: 'تحليل المبيعات', icon: BarChart3, action: 'أعطني تحليل للمبيعات' },
    { label: 'أفضل المنتجات', icon: TrendingUp, action: 'ما هي المنتجات الأكثر مبيعاً؟' },
    { label: 'العملاء', icon: Users, action: 'أعطني تحليل لسلوك العملاء' },
    { label: 'المخزون', icon: Package, action: 'تحقق من مستوى المخزون' },
  ],
  affiliate: [
    { label: 'أداء الحملات', icon: Target, action: 'كيف أداء حملاتي التسويقية؟' },
    { label: 'العمولات', icon: DollarSign, action: 'ما هي عمولاتي هذا الشهر؟' },
    { label: 'التقارير', icon: BarChart3, action: 'أعطني تقرير شامل' },
    { label: 'الروابط', icon: Target, action: 'أريد إنشاء رابط تسويقي' },
  ],
  admin: [
    { label: 'لوحة التحكم', icon: BarChart3, action: 'أعطني ملخص عن أداء المنصة' },
    { label: 'المستخدمون', icon: Users, action: 'كم عدد المستخدمين النشطين؟' },
    { label: 'الأمان', icon: Shield, action: 'هل هناك أي تهديدات أمنية؟' },
    { label: 'الأداء', icon: TrendingUp, action: 'كيف أداء الموقع؟' },
  ],
  guest: [
    { label: 'التسجيل', icon: Users, action: 'كيف أسجل في الموقع؟' },
    { label: 'العروض', icon: TrendingUp, action: 'ما هي أفضل العروض؟' },
    { label: 'الفئات', icon: Package, action: 'ما هي الفئات المتاحة؟' },
    { label: 'المساعدة', icon: HelpCircle, action: 'أحتاج إلى المساعدة' },
  ],
};

export default function AIAssistantUI() {
  const { userRole, messages, isLoading, sendMessage, setMessages } = useAIAssistant();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    await sendMessage(input.trim());
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: 'غير مدعوم',
        description: 'المتصفح لا يدعم التعرف على الصوت',
        variant: 'destructive',
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = () => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في التعرف على الصوت',
        variant: 'destructive',
      });
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    handleSend();
  };

  const getRoleBadge = () => {
    const badges = {
      admin: { label: '🛡️ مدير', color: 'bg-red-500' },
      merchant: { label: '💼 تاجر', color: 'bg-blue-500' },
      affiliate: { label: '🎯 شريك', color: 'bg-green-500' },
      customer: { label: '🛍️ عميل', color: 'bg-purple-500' },
      guest: { label: '👋 زائر', color: 'bg-gray-500' },
    };
    return badges[userRole] || badges.guest;
  };

  const currentQuickActions = quickActions[userRole] || quickActions.guest;
  const roleBadge = getRoleBadge();

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-2xl"
          >
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-8 w-8" />
                  <div>
                    <h3 className="font-bold">مساعد إيجي جو الذكي</h3>
                    <Badge className={`${roleBadge.color} text-white text-xs`}>
                      {roleBadge.label}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-b">
              <div className="flex gap-2 overflow-x-auto">
                {currentQuickActions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <action.icon className="h-4 w-4 ml-1" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>مرحباً! كيف يمكنني مساعدتك اليوم؟</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString('ar-EG')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleVoiceInput}
                  className={isRecording ? 'text-red-500' : ''}
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اكتب رسالتك..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
