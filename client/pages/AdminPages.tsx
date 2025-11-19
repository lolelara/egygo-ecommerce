
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ExternalLink, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cmsApi, type Page } from "@/lib/cms-api";
import { PageLoader } from "@/components/ui/loading-screen";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function AdminPages() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        setLoading(true);
        try {
            const data = await cmsApi.getAllPages();
            setPages(data);
        } catch (error) {
            console.error("Error loading pages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذه الصفحة؟")) return;

        try {
            await cmsApi.deletePage(id);
            setPages(pages.filter((p) => p.$id !== id));
        } catch (error) {
            console.error("Error deleting page:", error);
            alert("فشل حذف الصفحة");
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <PageLoader message="جاري تحميل الصفحات..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">إدارة المحتوى</h1>
                        <p className="text-muted-foreground">
                            إدارة الصفحات التعريفية والمقالات
                        </p>
                    </div>
                    <Button onClick={() => navigate("/admin/pages/new")}>
                        <Plus className="h-4 w-4 ml-2" />
                        صفحة جديدة
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>الصفحات المنشورة</CardTitle>
                        <CardDescription>
                            قائمة بجميع الصفحات الثابتة في الموقع
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pages.length === 0 ? (
                            <div className="text-center py-10">
                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">لا توجد صفحات بعد</h3>
                                <p className="text-muted-foreground mb-4">
                                    ابدأ بإنشاء صفحة جديدة مثل "من نحن" أو "سياسة الخصوصية"
                                </p>
                                <Button onClick={() => navigate("/admin/pages/new")}>
                                    إنشاء أول صفحة
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>العنوان</TableHead>
                                        <TableHead>الرابط (Slug)</TableHead>
                                        <TableHead>الحالة</TableHead>
                                        <TableHead>تاريخ التعديل</TableHead>
                                        <TableHead className="text-left">إجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pages.map((page) => (
                                        <TableRow key={page.$id}>
                                            <TableCell className="font-medium">
                                                {page.title}
                                            </TableCell>
                                            <TableCell>
                                                <code className="bg-muted px-2 py-1 rounded text-xs">
                                                    /{page.slug}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                {page.isPublished ? (
                                                    <Badge className="bg-green-500">منشور</Badge>
                                                ) : (
                                                    <Badge variant="outline">مسودة</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(page.$updatedAt), "PPP", {
                                                    locale: ar,
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        title="عرض الصفحة"
                                                    >
                                                        <a
                                                            href={`/#/pages/${page.slug}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            navigate(`/admin/pages/edit/${page.$id}`)
                                                        }
                                                        title="تعديل"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(page.$id)}
                                                        title="حذف"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
