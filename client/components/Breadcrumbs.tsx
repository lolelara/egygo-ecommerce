import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const PATH_LABELS: Record<string, string> = {
  "": "الرئيسية",
  products: "المنتجات",
  categories: "الفئات",
  cart: "سلة التسوق",
  checkout: "إتمام الطلب",
  orders: "طلباتي",
  wishlist: "المفضلة",
  affiliate: "الشراكة",
  merchant: "التاجر",
  admin: "الإدارة",
  account: "حسابي",
  login: "تسجيل الدخول",
  register: "إنشاء حساب",
  // ... add more as needed
};

export function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  let path = "";
  const crumbs = segments.map((seg, idx) => {
    path += `/${seg}`;
    const isLast = idx === segments.length - 1;
    const label = PATH_LABELS[seg] || decodeURIComponent(seg);
    return isLast ? (
      <BreadcrumbItem key={path}>
        <BreadcrumbPage>{label}</BreadcrumbPage>
      </BreadcrumbItem>
    ) : (
      <BreadcrumbItem key={path}>
        <BreadcrumbLink asChild>
          <Link to={path}>{label}</Link>
        </BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
    );
  });

  // Always show home
  return (
    <Breadcrumb className="py-2 px-2 md:px-0">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">الرئيسية</Link>
          </BreadcrumbLink>
          {segments.length > 0 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
        {crumbs}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
