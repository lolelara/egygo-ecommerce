import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases } from "@/lib/appwrite";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";

export default function MerchantProfileSettings() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        storeBanner: "",
        storeLogo: "",
        storeDescription: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                storeBanner: user.storeBanner || "",
                storeLogo: user.storeLogo || "",
                storeDescription: user.storeDescription || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            // Update userPreferences collection
            // Note: We are updating the document in 'userPreferences' collection which corresponds to the user
            // We assume user.$id is the document ID in userPreferences as per AdminUsers.tsx logic

            const DATABASE_ID = "68de037e003bd03c4d45"; // Hardcoded for now, should be env var
            const COLLECTION_ID = "userPreferences";

            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                user.$id,
                {
                    storeBanner: formData.storeBanner,
                    storeLogo: formData.storeLogo,
                    storeDescription: formData.storeDescription,
                }
            );

            toast({
                title: "تم الحفظ",
                description: "تم تحديث بيانات المتجر بنجاح",
            });
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast({
                title: "خطأ",
                description: "فشل تحديث البيانات: " + error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>تخصيص المتجر</CardTitle>
                <CardDescription>
                    قم بتخصيص مظهر متجرك ليجذب المزيد من العملاء
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="storeLogo">رابط شعار المتجر (Logo URL)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="storeLogo"
                                name="storeLogo"
                                value={formData.storeLogo}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                            />
                        </div>
                        {formData.storeLogo && (
                            <div className="mt-2">
                                <img
                                    src={formData.storeLogo}
                                    alt="Logo Preview"
                                    className="h-20 w-20 object-cover rounded-full border"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="storeBanner">رابط بانر المتجر (Banner URL)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="storeBanner"
                                name="storeBanner"
                                value={formData.storeBanner}
                                onChange={handleChange}
                                placeholder="https://example.com/banner.jpg"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">يفضل استخدام صورة بعرض 1200px وارتفاع 300px</p>
                        {formData.storeBanner && (
                            <div className="mt-2">
                                <img
                                    src={formData.storeBanner}
                                    alt="Banner Preview"
                                    className="w-full h-32 object-cover rounded-md border"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="storeDescription">وصف المتجر</Label>
                        <Textarea
                            id="storeDescription"
                            name="storeDescription"
                            value={formData.storeDescription}
                            onChange={handleChange}
                            placeholder="اكتب نبذة عن متجرك ومنتجاتك..."
                            rows={4}
                        />
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        حفظ التغييرات
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
