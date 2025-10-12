import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Plus,
  FileText,
  TrendingUp,
  Truck
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MerchantQuickActions() {
  const actions = [
    {
      icon: Plus,
      title: "إضافة منتج جديد",
      description: "أضف منتج جديد إلى متجرك",
      link: "/merchant/products?action=add",
      color: "bg-green-50 text-green-600 hover:bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Package,
      title: "إدارة المخزون",
      description: "تحديث كميات المنتجات",
      link: "/merchant/products",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: ShoppingCart,
      title: "الطلبات الجديدة",
      description: "عرض ومعالجة الطلبات",
      link: "/merchant/orders",
      color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      icon: BarChart3,
      title: "التقارير والإحصائيات",
      description: "تحليل أداء المبيعات",
      link: "/merchant/analytics",
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "المنتجات الأكثر مبيعاً",
      description: "عرض أفضل المنتجات",
      link: "/merchant/analytics?tab=products",
      color: "bg-pink-50 text-pink-600 hover:bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      icon: Truck,
      title: "إدارة الشحن",
      description: "تحديث حالة الشحنات",
      link: "/merchant/orders?filter=shipping",
      color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      icon: FileText,
      title: "الفواتير",
      description: "عرض وتحميل الفواتير",
      link: "/merchant/invoices",
      color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      icon: Settings,
      title: "إعدادات المتجر",
      description: "تخصيص إعدادات متجرك",
      link: "/merchant/settings",
      color: "bg-gray-50 text-gray-600 hover:bg-gray-100",
      iconColor: "text-gray-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>إجراءات سريعة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Button
                variant="outline"
                className={`h-auto flex-col items-start gap-2 p-4 w-full ${action.color} border-none`}
              >
                <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                <div className="text-right w-full">
                  <p className="font-semibold text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
