/**
 * WhatsApp Button Component
 * 
 * زر عائم للتواصل السريع عبر واتساب
 */

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateSupportLink } from '@/lib/whatsapp-service';
import { useI18n } from '@/lib/i18n';

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left'; // bottom-left = يمين في RTL
  showQuickChat?: boolean;
}

export function WhatsAppButton({
  phone,
  message,
  position = 'bottom-left',
  showQuickChat = true,
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const { t } = useI18n();

  const handleOpenWhatsApp = (msg?: string) => {
    const finalMessage = msg || customMessage || message;
    const link = generateSupportLink();
    const finalLink = finalMessage 
      ? `${link}${link.includes('?') ? '&' : '?'}text=${encodeURIComponent(finalMessage)}`
      : link;
    
    window.open(finalLink, '_blank');
    setIsOpen(false);
    setCustomMessage('');
  };

  const positionClass = position === 'bottom-right' 
    ? 'right-4 sm:right-6' 
    : 'left-4 sm:left-6';

  const quickMessages = [
    { ar: 'مرحباً، أحتاج إلى مساعدة', en: 'Hello, I need help' },
    { ar: 'استفسار عن منتج', en: 'Product inquiry' },
    { ar: 'استفسار عن الشحن', en: 'Shipping inquiry' },
    { ar: 'مشكلة في الطلب', en: 'Order issue' },
  ];

  return (
    <>
      {/* Floating Button */}
      <div className={`fixed bottom-4 sm:bottom-6 ${positionClass} z-50`}>
        {!isOpen ? (
          <Button
            onClick={() => showQuickChat ? setIsOpen(true) : handleOpenWhatsApp()}
            size="lg"
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white animate-bounce-slow"
            title={t('whatsapp.chat')}
          >
            <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" />
          </Button>
        ) : (
          <Card className="w-80 sm:w-96 shadow-2xl animate-scale-in">
            <CardHeader className="bg-[#25D366] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-white">
                      {t('whatsapp.title')}
                    </CardTitle>
                    <CardDescription className="text-white/80 text-sm">
                      {t('whatsapp.subtitle')}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Quick Messages */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t('whatsapp.quickMessages')}:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {quickMessages.map((msg, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenWhatsApp(msg.ar)}
                      className="justify-start text-right h-auto py-2 px-3 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]"
                    >
                      <span className="text-sm">{msg.ar}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t('whatsapp.customMessage')}:
                </p>
                <Textarea
                  placeholder={t('whatsapp.messagePlaceholder')}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <Button
                  onClick={() => handleOpenWhatsApp()}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A]"
                >
                  <Send className="h-4 w-4 ml-2" />
                  {t('whatsapp.send')}
                </Button>
              </div>

              {/* Footer */}
              <p className="text-xs text-center text-muted-foreground">
                {t('whatsapp.poweredBy')} WhatsApp Business
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Custom Styles - Inline in Tailwind config or global CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      ` }} />
    </>
  );
}

/**
 * Simple WhatsApp Link Button
 */
export function WhatsAppLink({
  phone,
  message,
  children,
  className = '',
}: {
  phone: string;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const link = generateSupportLink();
  const finalLink = message 
    ? `${link}${link.includes('?') ? '&' : '?'}text=${encodeURIComponent(message)}`
    : link;

  return (
    <a
      href={finalLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      {children || 'تواصل عبر واتساب'}
    </a>
  );
}

export default WhatsAppButton;
