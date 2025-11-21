import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Sparkles,
    Megaphone,
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    RefreshCw
} from 'lucide-react';
import AIContentGenerator from '@/components/affiliate/AIContentGenerator';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';

export default function MarketerTools() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalProducts: 0,
        missingDescription: 0,
        shortDescription: 0,
        noImages: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Fetch a batch of products to analyze (limit 100 for performance)
            const response = await databases.listDocuments(
                DATABASE_ID,
                'products',
                [Query.limit(100), Query.orderDesc('$createdAt')]
            );

            const products = response.documents;
            const total = products.length;
            let missingDesc = 0;
            let shortDesc = 0;
            let noImg = 0;

            products.forEach(p => {
                if (!p.description || p.description.length < 10) missingDesc++;
                else if (p.description.length < 50) shortDesc++;

                if (!p.images || p.images.length === 0) noImg++;
            });

            setStats({
                totalProducts: total,
                missingDescription: missingDesc,
                shortDescription: shortDesc,
                noImages: noImg
            });

        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 space-y-8" dir="rtl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Sparkles className="h-8 w-8 text-purple-600" />
                        أدوات المسوق الذكي
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        استخدم الذكاء الاصطناعي لتحسين منتجاتك وإنشاء حملات إعلانية ناجحة
                    </p>
                </div>
                <Button onClick={fetchStats} variant="outline" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                    تحديث البيانات
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
                    <TabsTrigger value="advisor">المستشار الذكي</TabsTrigger>
                    <TabsTrigger value="campaigns">منشئ الحملات</TabsTrigger>
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">إجمالي المنتجات (العينة)</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">بدون وصف</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{stats.missingDescription}</div>
                                <p className="text-xs text-muted-foreground">منتجات تحتاج لوصف فوراً</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">وصف قصير</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{stats.shortDescription}</div>
                                <p className="text-xs text-muted-foreground">أقل من 50 حرف</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">بدون صور</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">{stats.noImages}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>إجراءات سريعة</CardTitle>
                                <CardDescription>أدوات لتحسين متجرك بسرعة</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    className="w-full justify-between"
                                    variant="secondary"
                                    onClick={() => setActiveTab('campaigns')}
                                >
                                    <span className="flex items-center gap-2">
                                        <Megaphone className="h-4 w-4" />
                                        إنشاء إعلان جديد
                                    </span>
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    className="w-full justify-between"
                                    variant="secondary"
                                    onClick={() => window.location.href = '/#/admin/vendoor-products'}
                                >
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        تحسين وصف المنتجات (Bulk Rewrite)
                                    </span>
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Advisor Tab */}
                <TabsContent value="advisor" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>تحليل المتجر</CardTitle>
                            <CardDescription>نصائح ذكية لتحسين مبيعاتك بناءً على بيانات المنتجات</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {stats.missingDescription > 0 && (
                                <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-100 dark:border-red-900">
                                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-red-900 dark:text-red-200">مشكلة: {stats.missingDescription} منتجات بدون وصف</h4>
                                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                            المنتجات التي لا تحتوي على وصف نادراً ما تباع. استخدم أداة "Bulk Rewrite" في صفحة المنتجات لإضافة وصف تلقائي لها.
                                        </p>
                                        <Button
                                            variant="link"
                                            className="text-red-600 p-0 h-auto mt-2"
                                            onClick={() => window.location.href = '/#/admin/vendoor-products'}
                                        >
                                            الذهاب للمنتجات <ArrowRight className="h-4 w-4 mr-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {stats.shortDescription > 0 && (
                                <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-100 dark:border-yellow-900">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-200">تحسين: {stats.shortDescription} منتجات وصفها قصير جداً</h4>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                            الوصف القصير لا يقنع العميل. حاول إضافة مميزات وفوائد المنتج.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {stats.missingDescription === 0 && stats.shortDescription === 0 && (
                                <div className="flex items-center gap-4 p-6 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-100 dark:border-green-900 justify-center text-center">
                                    <div>
                                        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                                        <h4 className="font-semibold text-green-900 dark:text-green-200">عمل رائع!</h4>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            جميع منتجاتك (في العينة الحالية) تحتوي على وصف جيد.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Campaigns Tab */}
                <TabsContent value="campaigns">
                    <AIContentGenerator />
                </TabsContent>
            </Tabs>
        </div>
    );
}
