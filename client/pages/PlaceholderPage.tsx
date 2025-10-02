import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  title,
  description = "هذه الصفحة قادمة قريبًا. تابع تصفح منتجاتنا أو تحقق مرة أخرى لاحقًا!",
}: PlaceholderPageProps) {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Construction className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{description}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild>
              <Link to="/">العودة للرئيسية</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/products">تصفح المنتجات</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
