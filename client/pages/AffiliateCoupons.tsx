import { useState } from "react";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Copy, Trash2, Edit, Tag, Calendar, Percent, DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";
const COUPONS_COLLECTION_ID = "coupons";

interface Coupon {
  $id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  affiliateId: string;
  isActive: boolean;
  $createdAt: string;
}

export default function AffiliateCoupons() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: 10,
    expiryDate: "",
    usageLimit: 100,
  });

  // Fetch coupons
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["affiliate-coupons", user?.$id],
    queryFn: async () => {
      if (!user?.$id) return [];
      const response = await databases.listDocuments(
        DATABASE_ID,
        COUPONS_COLLECTION_ID,
        [Query.equal("affiliateId", user.$id), Query.orderDesc("$createdAt")]
      );
      return response.documents as unknown as Coupon[];
    },
    enabled: !!user?.$id,
  });

  // Create coupon
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user?.$id) throw new Error("User not found");
      
      const couponData = {
        code: data.code.toUpperCase(),
        type: data.type,
        value: Number(data.value),
        expiryDate: data.expiryDate,
        usageLimit: Number(data.usageLimit),
        usageCount: 0,
        affiliateId: user.$id,
        isActive: true,
      };

      return await databases.createDocument(
        DATABASE_ID,
        COUPONS_COLLECTION_ID,
        ID.unique(),
        couponData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-coupons"] });
      setIsCreating(false);
      setFormData({
        code: "",
        type: "percentage",
        value: 10,
        expiryDate: "",
        usageLimit: 100,
      });
      toast({
        title: "تم إنشاء الكوبون بنجاح!",
        description: "يمكنك مشاركة الكوبون مع عملائك الآن",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل إنشاء الكوبون",
        variant: "destructive",
      });
    },
  });

  // Delete coupon
  const deleteMutation = useMutation({
    mutationFn: async (couponId: string) => {
      await databases.deleteDocument(DATABASE_ID, COUPONS_COLLECTION_ID, couponId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-coupons"] });
      toast({
        title: "تم حذف الكوبون",
        description: "تم حذف الكوبون بنجاح",
      });
    },
  });

  // Toggle active status
  const toggleMutation = useMutation({
    mutationFn: async ({ couponId, isActive }: { couponId: string; isActive: boolean }) => {
      await databases.updateDocument(DATABASE_ID, COUPONS_COLLECTION_ID, couponId, {
        isActive: !isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-coupons"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.expiryDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(formData);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "تم النسخ!",
      description: `تم نسخ الكود: ${code}`,
    });
  };

  // Check authorization
  if (!user?.isAffiliate && user?.role !== "affiliate") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <Tag className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <CardTitle>غير مصرح</CardTitle>
            <CardDescription>
              هذه الصفحة متاحة فقط للمسوقين المفعلين
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = "/#/update-affiliate-prefs")}
              className="w-full"
            >
              تفعيل حساب المسوق
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">كوبونات الخصم</h1>
        <p className="text-muted-foreground">
          أنشئ وأدر كوبونات الخصم الخاصة بك
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Create Coupon Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              إنشاء كوبون جديد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">كود الكوبون *</Label>
                <Input
                  id="code"
                  placeholder="SUMMER2025"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">نوع الخصم *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                    <SelectItem value="fixed">مبلغ ثابت (ج.م)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  قيمة الخصم * {formData.type === "percentage" ? "(%)" : "(ج.م)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  min="1"
                  max={formData.type === "percentage" ? "100" : undefined}
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">تاريخ الانتهاء *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">حد الاستخدام *</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "جاري الإنشاء..." : "إنشاء كوبون"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Coupons List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>كوبوناتي ({coupons.length})</CardTitle>
              <CardDescription>
                جميع كوبونات الخصم التي أنشأتها
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  جاري التحميل...
                </div>
              ) : coupons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لم تنشئ أي كوبونات بعد</p>
                  <p className="text-sm mt-2">
                    ابدأ بإنشاء كوبون من النموذج على اليسار
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {coupons.map((coupon) => {
                    const isExpired = new Date(coupon.expiryDate) < new Date();
                    const usagePercentage = (coupon.usageCount / coupon.usageLimit) * 100;

                    return (
                      <Card key={coupon.$id} className="border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <code className="text-lg font-bold bg-muted px-3 py-1 rounded">
                                  {coupon.code}
                                </code>
                                {coupon.isActive && !isExpired ? (
                                  <Badge className="bg-green-500">نشط</Badge>
                                ) : isExpired ? (
                                  <Badge variant="destructive">منتهي</Badge>
                                ) : (
                                  <Badge variant="secondary">متوقف</Badge>
                                )}
                                <Badge variant="outline">
                                  {coupon.type === "percentage" ? (
                                    <>
                                      <Percent className="h-3 w-3 mr-1" />
                                      {coupon.value}%
                                    </>
                                  ) : (
                                    <>
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      {coupon.value} ج.م
                                    </>
                                  )}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  ينتهي: {new Date(coupon.expiryDate).toLocaleDateString("ar-EG")}
                                </div>
                                <div className="text-muted-foreground">
                                  الاستخدام: {coupon.usageCount} / {coupon.usageLimit}
                                </div>
                              </div>

                              {/* Usage Bar */}
                              <div className="mt-3">
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-orange-500 transition-all"
                                    style={{ width: `${usagePercentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyCode(coupon.code)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  toggleMutation.mutate({
                                    couponId: coupon.$id,
                                    isActive: coupon.isActive,
                                  })
                                }
                                disabled={isExpired}
                              >
                                {coupon.isActive ? "إيقاف" : "تفعيل"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteMutation.mutate(coupon.$id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
