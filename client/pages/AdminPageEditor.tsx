
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { cmsApi, type Page } from "@/lib/cms-api";
import { PageLoader } from "@/components/ui/loading-screen";
import { Save, ArrowRight } from "lucide-react";

export default function AdminPageEditor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        isPublished: false,
        metaTitle: "",
        metaDescription: "",
    });

    useEffect(() => {
        if (id) {
            loadPage(id);
        }
    }, [id]);

    const loadPage = async (pageId: string) => {
        try {
            const page = await cmsApi.getPageById(pageId);
            if (page) {
                setFormData({
                    title: page.title,
                    slug: page.slug,
                    content: page.content,
                    isPublished: page.isPublished,
                    metaTitle: page.metaTitle || "",
                    metaDescription: page.metaDescription || "",
                });
            }
        } catch (error) {
            console.error("Error loading page:", error);
            alert("فشل تحميل الصفحة");
            navigate("/admin/pages");
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        // Auto-generate slug if creating new page and slug hasn't been manually edited
        if (!id && !formData.slug) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            setFormData((prev) => ({ ...prev, title, slug }));
        } else {
            setFormData((prev) => ({ ...prev, title }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (id) {
                await cmsApi.updatePage(id, formData);
                alert("تم تحديث الصفحة بنجاح");
            } else {
                await cmsApi.createPage(formData);
                alert("تم إنشاء الصفحة بنجاح");
                navigate("/admin/pages");
            }
        } catch (error) {
            console.error("Error saving page:", error);
            alert("فشل حفظ الصفحة");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <PageLoader message="جاري تحميل بيانات الصفحة..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/admin/pages")}
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {id ? "تعديل الصفحة" : "صفحة جديدة"}
                            </h1>
                            <p className="text-muted-foreground">
                                {id ? `تعديل: ${formData.title}` : "إنشاء صفحة محتوى جديدة"}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/admin/pages")}
                        >
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                "جاري الحفظ..."
                            ) : (
                                <>
                                    <Save className="h-4 w-4 ml-2" />
                                    حفظ التغييرات
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>المحتوى الأساسي</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">عنوان الصفحة</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                        placeholder="مثال: من نحن"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">الرابط (Slug)</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground text-sm bg-muted px-2 py-2 rounded-md">
                                            egygo.me/pages/
                                        </span>
                                        <Input
                                            id="slug"
                                            value={formData.slug}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    slug: e.target.value,
                                                }))
                                            }
                                            placeholder="about-us"
                                            className="font-mono"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">المحتوى</Label>
                                    <Textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                content: e.target.value,
                                            }))
                                        }
                                        placeholder="اكتب محتوى الصفحة هنا..."
                                        className="min-h-[400px] font-mono text-sm"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        يدعم تنسيق HTML البسيط
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>حالة النشر</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">نشر الصفحة</Label>
                                        <p className="text-sm text-muted-foreground">
                                            جعل الصفحة مرئية للزوار
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.isPublished}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({ ...prev, isPublished: checked }))
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>تحسين محركات البحث (SEO)</CardTitle>
                                <CardDescription>
                                    تحسين ظهور الصفحة في نتائج البحث
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="metaTitle">عنوان Meta</Label>
                                    <Input
                                        id="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                metaTitle: e.target.value,
                                            }))
                                        }
                                        placeholder={formData.title}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        اتركه فارغاً لاستخدام عنوان الصفحة
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="metaDescription">وصف Meta</Label>
                                    <Textarea
                                        id="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                metaDescription: e.target.value,
                                            }))
                                        }
                                        rows={4}
                                        placeholder="وصف مختصر للصفحة يظهر في نتائج البحث..."
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
