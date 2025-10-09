import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 border-t border-purple-100 dark:border-purple-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
              EgyGo
            </Link>
            <p className="text-sm text-muted-foreground">
              وجهتك الوحيدة للمنتجات عالية الجودة مع أفضل برنامج شراكة في
              الصناعة.
            </p>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 transition-colors">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900 transition-colors">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900 transition-colors">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 transition-colors">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  معلومات عنا
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  معلومات الشحن
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  الإرجاع والاستبدال
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  الأسئلة الشائعة
                </Link>
              </li>
            </ul>
          </div>

          {/* Affiliate Program */}
          <div className="space-y-4">
            <h3 className="font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">برنامج الشراكة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/affiliate"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  انضم كشريك
                </Link>
              </li>
              <li>
                <Link
                  to="/affiliate/dashboard"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  لوحة تحكم الشراكة
                </Link>
              </li>
              <li>
                <Link
                  to="/affiliate/resources"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  مصادر التسويق
                </Link>
              </li>
              <li>
                <Link
                  to="/affiliate/commission"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  هيكل العمولة
                </Link>
              </li>
              <li>
                <Link
                  to="/affiliate/support"
                  className="text-muted-foreground hover:text-secondary transition-colors"
                >
                  دعم الشركاء
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">ابق على اطلاع</h3>
            <p className="text-sm text-muted-foreground">
              اشترك للحصول على عروض خاصة وهدايا مجانية وفرص شراكة.
            </p>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Input
                placeholder="أدخل بريدك الإلكتروني"
                type="email"
                className="flex-1"
              />
              <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-purple-700 hover:to-orange-600">
                <Mail className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                اشترك
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              بالاشتراك، فإنك توافق على سياسة الخصوصية وشروط الخدمة.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 EgyGo. جميع الحقوق محفوظة.</p>
          <div className="flex space-x-4 rtl:space-x-reverse mt-4 sm:mt-0">
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              شروط الخدمة
            </Link>
            <Link
              to="/cookies"
              className="hover:text-primary transition-colors"
            >
              سياسة ملفات تعريف الارتباط
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
