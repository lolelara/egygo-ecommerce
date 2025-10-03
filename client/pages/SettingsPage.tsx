import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">الإعدادات</h1>
        <p className="text-muted-foreground">
          إدارة إعدادات حسابك والتطبيق
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>المظهر</CardTitle>
            <CardDescription>
              اختر مظهر التطبيق (فاتح، داكن، أو تلقائي حسب نظامك)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                  <Sun className="h-4 w-4" />
                  <span>مظهر فاتح</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mt-3">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  <span>مظهر داكن</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mt-3">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                  <Monitor className="h-4 w-4" />
                  <span>تلقائي (حسب النظام)</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معاينة المظهر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg bg-card">
                <h3 className="font-semibold mb-2">بطاقة عادية</h3>
                <p className="text-sm text-muted-foreground">
                  هذا نص تجريبي لمعاينة الألوان في المظهر الحالي
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-primary text-primary-foreground">
                <h3 className="font-semibold mb-2">بطاقة رئيسية</h3>
                <p className="text-sm">
                  هذا نص تجريبي على خلفية اللون الرئيسي
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-3 border rounded-lg bg-accent text-accent-foreground">
                <p className="text-sm font-medium">لون مميز</p>
              </div>
              <div className="p-3 border rounded-lg bg-secondary text-secondary-foreground">
                <p className="text-sm font-medium">لون ثانوي</p>
              </div>
              <div className="p-3 border rounded-lg bg-muted text-muted-foreground">
                <p className="text-sm font-medium">لون باهت</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
