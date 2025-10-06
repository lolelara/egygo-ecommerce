import { useState } from "react";
import { Bot, Send, Sparkles, Users, Box, MapPin, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function AIShoppingAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date(),
      suggestions: ["أريد حذاء رياضي", "ما أفضل العروض؟", "أحتاج هدية لصديقي"],
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([
      ...messages,
      { role: "user", content: input, timestamp: new Date() },
      {
        role: "assistant",
        content: "بناءً على بحثك، أقترح حذاء Nike Air Max بسعر 1299 جنيه. يتميز بالراحة العالية وتصميم عصري.",
        timestamp: new Date(),
      },
    ]);
    setInput("");
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <div>
            <CardTitle>المساعد الذكي</CardTitle>
            <CardDescription>chatbot عربي يقترح المنتجات ويجاوب فوراً</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className="flex-shrink-0">
                  <AvatarFallback>{msg.role === "user" ? "أ" : "🤖"}</AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${msg.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.suggestions && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {msg.suggestions.map((s, i) => (
                        <Button key={i} size="sm" variant="outline" onClick={() => setInput(s)}>
                          {s}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            placeholder="اكتب سؤالك هنا..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// AR Product Viewer
export function ARProductViewer({ productId }: { productId: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Box className="h-6 w-6" />
          <div>
            <CardTitle>عرض ثلاثي الأبعاد</CardTitle>
            <CardDescription>اختبر المنتج في مساحتك بالواقع المعزز</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-4">
            <Box className="h-24 w-24 mx-auto text-purple-600 animate-pulse" />
            <div>
              <Button size="lg">
                <Sparkles className="ml-2 h-5 w-5" />
                افتح في AR
              </Button>
              <p className="text-xs text-muted-foreground mt-2">اضغط لعرض المنتج في منزلك</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Family Accounts
export function FamilyAccounts() {
  const members = [
    { name: "أحمد (أنت)", role: "مدير", avatar: "أ" },
    { name: "سارة", role: "عضو", avatar: "س" },
    { name: "محمد", role: "عضو", avatar: "م" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <div>
            <CardTitle>الحساب العائلي</CardTitle>
            <CardDescription>مشاركة السلة وقوائم الأمنيات</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {members.map((member, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                {member.role === "عضو" && (
                  <Button variant="ghost" size="sm">
                    إزالة
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button className="w-full" variant="outline">
            <Share2 className="ml-2 h-4 w-4" />
            دعوة عضو جديد
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Live Shipment Tracking
export function LiveShipmentTracking({ orderId }: { orderId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>تتبع الشحن المباشر</CardTitle>
        <CardDescription>خريطة حية + إشعارات واتساب</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <MapPin className="h-16 w-16 text-red-600 animate-bounce absolute" style={{ top: "40%", left: "50%" }} />
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg">
            <p className="font-semibold">السائق: محمد أحمد</p>
            <p className="text-sm text-muted-foreground">يبعد 2.5 كم • الوصول خلال 15 دقيقة</p>
            <Button size="sm" className="w-full mt-2">
              تواصل مع السائق
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
