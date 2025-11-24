import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminFlashSalesApi } from '@/lib/admin-api';
import FlashSaleCreator from '@/components/FlashSaleCreator';
import { Loader2, Trash2, Calendar, Clock, Zap, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminFlashSales() {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { toast } = useToast();

    const fetchSales = async () => {
        setLoading(true);
        try {
            const data = await adminFlashSalesApi.getAll();
            setSales(data);
        } catch (error) {
            console.error('Error fetching flash sales:', error);
            toast({
                title: 'خطأ',
                description: 'فشل تحميل العروض',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await adminFlashSalesApi.delete(id);
            setSales(prev => prev.filter(s => s.id !== id));
            toast({
                title: 'تم الحذف',
                description: 'تم حذف العرض بنجاح'
            });
        } catch (error) {
            toast({
                title: 'خطأ',
                description: 'فشل حذف العرض',
                variant: 'destructive'
            });
        }
    };

    const getStatusBadge = (sale: any) => {
        const now = new Date();
        const start = new Date(sale.startDate);
        const end = new Date(sale.endDate);

        if (now > end) {
            return <Badge variant="secondary">منتهي</Badge>;
        } else if (now >= start && now <= end) {
            return <Badge className="bg-green-500 animate-pulse">نشط الآن</Badge>;
        } else {
            return <Badge variant="outline" className="text-blue-500 border-blue-200">مجدول</Badge>;
        }
    };

    return (
        <AdminLayout title="إدارة عروض الفلاش">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">عروض الفلاش (Flash Sales)</h2>
                        <p className="text-muted-foreground">
                            إدارة حملات التخفيضات المؤقتة وعروض البرق
                        </p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                                <Zap className="mr-2 h-4 w-4" />
                                إنشاء عرض جديد
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>إنشاء عرض فلاش جديد</DialogTitle>
                                <DialogDescription>
                                    قم بتحديد تفاصيل العرض والمنتجات المشمولة
                                </DialogDescription>
                            </DialogHeader>
                            <FlashSaleCreator onSuccess={() => {
                                setIsCreateOpen(false);
                                fetchSales();
                            }} />
                        </DialogContent>
                    </Dialog>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : sales.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                <Zap className="h-8 w-8 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">لا توجد عروض حالياً</h3>
                            <p className="text-muted-foreground max-w-sm mb-6">
                                لم يتم إنشاء أي عروض فلاش بعد. ابدأ بإنشاء عرض جديد لجذب المزيد من العملاء.
                            </p>
                            <Button onClick={() => setIsCreateOpen(true)} variant="outline">
                                إنشاء أول عرض
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {sales.map((sale) => (
                            <Card key={sale.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3 bg-muted/30">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg mb-1">{sale.title}</CardTitle>
                                            <CardDescription className="flex items-center gap-1">
                                                <Badge variant="secondary" className="text-xs font-normal">
                                                    {sale.discount}% خصم
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    • {sale.productIds?.length || 0} منتجات
                                                </span>
                                            </CardDescription>
                                        </div>
                                        {getStatusBadge(sale)}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {format(new Date(sale.startDate), 'dd MMM', { locale: ar })} - {format(new Date(sale.endDate), 'dd MMM', { locale: ar })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {format(new Date(sale.startDate), 'HH:mm')} - {format(new Date(sale.endDate), 'HH:mm')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2 border-t">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    حذف
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        سيتم حذف هذا العرض نهائياً. لن يتمكن العملاء من رؤيته بعد الآن.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(sale.id)} className="bg-red-500 hover:bg-red-600">
                                                        حذف
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
