import { Button } from "@/components/ui/button";
import { MessageCircle, Facebook, Twitter, Send, Copy, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickShareButtonsProps {
  link: string;
  productName?: string;
}

export default function QuickShareButtons({ link, productName = "منتج رائع" }: QuickShareButtonsProps) {
  const { toast } = useToast();

  const shareToWhatsApp = () => {
    const text = `🛍️ ${productName}\n\nتسوق الآن واحصل على أفضل الأسعار!\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = `🛍️ ${productName} - تسوق الآن!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`, '_blank');
  };

  const shareToTelegram = () => {
    const text = `🛍️ ${productName}\n\nتسوق الآن واحصل على أفضل الأسعار!`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `تسوق الآن: ${productName}`;
    const body = `مرحباً،\n\nأود أن أشارك معك هذا المنتج الرائع:\n\n${productName}\n\nرابط المنتج: ${link}\n\nتسوق سعيد!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast({
      title: "✅ تم النسخ",
      description: "تم نسخ الرابط بنجاح",
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={shareToWhatsApp}
        className="hover:bg-green-50 hover:border-green-500 transition-all"
        title="مشاركة على واتساب"
      >
        <MessageCircle className="h-4 w-4 text-green-600" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={shareToFacebook}
        className="hover:bg-blue-50 hover:border-blue-500 transition-all"
        title="مشاركة على فيسبوك"
      >
        <Facebook className="h-4 w-4 text-blue-600" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={shareToTwitter}
        className="hover:bg-sky-50 hover:border-sky-500 transition-all"
        title="مشاركة على تويتر"
      >
        <Twitter className="h-4 w-4 text-sky-500" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={shareToTelegram}
        className="hover:bg-blue-50 hover:border-blue-400 transition-all"
        title="مشاركة على تيليجرام"
      >
        <Send className="h-4 w-4 text-blue-500" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={shareViaEmail}
        className="hover:bg-gray-50 hover:border-gray-500 transition-all"
        title="مشاركة عبر البريد"
      >
        <Mail className="h-4 w-4 text-gray-600" />
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={copyToClipboard}
        className="hover:bg-purple-50 hover:border-purple-500 transition-all"
        title="نسخ الرابط"
      >
        <Copy className="h-4 w-4 text-purple-600" />
      </Button>
    </div>
  );
}
