import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Share2, Download, Calculator, Target, BookOpen } from "lucide-react";

interface QuickActionsPanelProps {
  onCalculatorClick?: () => void;
}

export default function QuickActionsPanel({ onCalculatorClick }: QuickActionsPanelProps) {
  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          إجراءات سريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Button
            variant="outline"
            className="flex-col h-24 hover:bg-primary/10 hover:border-primary transition-all"
            asChild
          >
            <Link to="#links">
              <Link2 className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-semibold">إنشاء رابط</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex-col h-24 hover:bg-green-50 hover:border-green-500 transition-all"
            onClick={() => {
              const shareText = `تسوق الآن من إيجي جو واحصل على أفضل العروض! 🛍️\n${window.location.origin}`;
              if (navigator.share) {
                navigator.share({ text: shareText });
              } else {
                navigator.clipboard.writeText(shareText);
              }
            }}
          >
            <Share2 className="h-6 w-6 mb-2 text-green-600" />
            <span className="text-sm font-semibold">مشاركة سريعة</span>
          </Button>

          <Button
            variant="outline"
            className="flex-col h-24 hover:bg-blue-50 hover:border-blue-500 transition-all"
            asChild
          >
            <Link to="/affiliate/banners">
              <Download className="h-6 w-6 mb-2 text-blue-600" />
              <span className="text-sm font-semibold">تحميل بانر</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex-col h-24 hover:bg-purple-50 hover:border-purple-500 transition-all"
            onClick={onCalculatorClick}
          >
            <Calculator className="h-6 w-6 mb-2 text-purple-600" />
            <span className="text-sm font-semibold">حاسبة الأرباح</span>
          </Button>

          <Button
            variant="outline"
            className="flex-col h-24 hover:bg-orange-50 hover:border-orange-500 transition-all"
            asChild
          >
            <Link to="/affiliate/marketing-tips">
              <BookOpen className="h-6 w-6 mb-2 text-orange-600" />
              <span className="text-sm font-semibold">نصائح التسويق</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex-col h-24 hover:bg-pink-50 hover:border-pink-500 transition-all"
            asChild
          >
            <Link to="/affiliate/courses">
              <Target className="h-6 w-6 mb-2 text-pink-600" />
              <span className="text-sm font-semibold">الكورسات</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
