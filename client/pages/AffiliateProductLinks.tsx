import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, ExternalLink, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Product {
  $id: string;
  name: string;
  basePrice: number; // السعر الأساسي قبل العمولة
  minCommissionPrice: number; // أقل سعر شامل العمولة (الحد الأدنى)
  images: string[];
  merchantId: string;
  isActive: boolean;
}

interface AffiliateLink {
  productId: string;
  customPrice: number;
  affiliateCode: string;
  link: string;
}

export default function AffiliateProductLinks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [customPrices, setCustomPrices] = useState<{ [key: string]: number }>({});
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.products,
        [
          Query.equal('isActive', true),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );

      const productsData = response.documents.map((doc: any) => ({
        $id: doc.$id,
        name: doc.name,
        basePrice: doc.basePrice || doc.price || 0,
        minCommissionPrice: doc.minCommissionPrice || doc.price || 0,
        images: doc.images || [],
        merchantId: doc.merchantId,
        isActive: doc.isActive
      }));

      setProducts(productsData);

      // Initialize custom prices with minimum commission price
      const initialPrices: { [key: string]: number } = {};
      productsData.forEach((product: Product) => {
        initialPrices[product.$id] = product.minCommissionPrice;
      });
      setCustomPrices(initialPrices);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل المنتجات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCommission = (product: Product, customPrice: number) => {
    const commission = customPrice - product.basePrice;
    const commissionPercentage = ((commission / product.basePrice) * 100).toFixed(1);
    return { commission, commissionPercentage };
  };

  const generateAffiliateLink = (productId: string) => {
    const affiliateCode = user?.affiliateCode || `AFF${user?.$id.slice(0, 6).toUpperCase()}`;
    const customPrice = customPrices[productId] || 0;
    const baseUrl = window.location.origin;
    return `${baseUrl}/#/product/${productId}?ref=${affiliateCode}&price=${customPrice}`;
  };

  const copyToClipboard = async (link: string, productId: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(productId);
      toast({
        title: "تم النسخ!",
        description: "تم نسخ رابط الشراكة إلى الحافظة",
      });
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ الرابط",
        variant: "destructive",
      });
    }
  };

  const handlePriceChange = (productId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCustomPrices(prev => ({
      ...prev,
      [productId]: numValue
    }));
  };

  const isPriceValid = (product: Product, customPrice: number) => {
    return customPrice >= product.minCommissionPrice;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إنشاء روابط الشراكة</CardTitle>
          <p className="text-sm text-muted-foreground">
            قم بإنشاء روابط شراكة مخصصة مع تحديد سعرك الخاص (يجب أن يكون أعلى من الحد الأدنى)
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>كيف يعمل النظام:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>السعر الأساسي: سعر المنتج قبل العمولة (يحدده التاجر)</li>
                <li>الحد الأدنى للسعر: أقل سعر يمكنك بيع المنتج به (يحدده التاجر)</li>
                <li>سعرك المخصص: يمكنك إضافة أي قيمة أعلى من الحد الأدنى</li>
                <li>عمولتك = سعرك المخصص - السعر الأساسي</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا توجد منتجات متاحة حالياً</p>
              </div>
            ) : (
              products.map((product) => {
                const customPrice = customPrices[product.$id] || product.minCommissionPrice;
                const { commission, commissionPercentage } = calculateCommission(product, customPrice);
                const isValid = isPriceValid(product, customPrice);

                return (
                  <div
                    key={product.$id}
                    className={`p-4 border rounded-lg ${!isValid ? 'border-destructive' : ''}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{product.name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">السعر الأساسي:</span>
                            <p className="font-semibold">${product.basePrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">الحد الأدنى:</span>
                            <p className="font-semibold text-orange-600">
                              ${product.minCommissionPrice.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">عمولتك:</span>
                            <p className="font-semibold text-green-600">
                              ${commission.toFixed(2)} ({commissionPercentage}%)
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">سعرك النهائي:</span>
                            <p className="font-semibold text-blue-600">
                              ${customPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`price-${product.$id}`}>
                          سعرك المخصص (الحد الأدنى: ${product.minCommissionPrice.toFixed(2)})
                        </Label>
                        <Input
                          id={`price-${product.$id}`}
                          type="number"
                          step="0.01"
                          min={product.minCommissionPrice}
                          value={customPrice}
                          onChange={(e) => handlePriceChange(product.$id, e.target.value)}
                          className={!isValid ? 'border-destructive' : ''}
                        />
                        {!isValid && (
                          <p className="text-xs text-destructive mt-1">
                            السعر يجب أن يكون أعلى من أو يساوي ${product.minCommissionPrice.toFixed(2)}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`link-${product.$id}`}>رابط الشراكة</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`link-${product.$id}`}
                            value={generateAffiliateLink(product.$id)}
                            readOnly
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              copyToClipboard(
                                generateAffiliateLink(product.$id),
                                product.$id
                              )
                            }
                            disabled={!isValid}
                          >
                            {copiedLink === product.$id ? (
                              <span className="text-xs">✓</span>
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            disabled={!isValid}
                          >
                            <a
                              href={generateAffiliateLink(product.$id)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
