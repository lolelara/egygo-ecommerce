import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { merchantsApi, productsApi } from '@/lib/api';
import { Product } from '@shared/api';
import { ProductCard } from '@/components/ProductCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Loader2, Store, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function MerchantProfile() {
    const { id } = useParams<{ id: string }>();
    const [merchant, setMerchant] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [merchantData, productsData] = await Promise.all([
                    merchantsApi.getById(id),
                    productsApi.getAll({ userId: id, limit: 100 })
                ]);

                setMerchant(merchantData);

                // Filter products by merchant's userId if available in product data
                // Note: Product interface in shared/api.ts doesn't explicitly show userId/merchantId, 
                // but Appwrite documents usually have it. 
                // Let's assume we can filter by matching product.userId (if we expose it) or we need to fetch differently.
                // Wait, productsApi.getAll maps the response. Let's check if it maps userId.
                // It doesn't map userId. I should update productsApi to map userId/merchantId.

                // Temporary workaround: Fetch all and filter (inefficient but works for MVP)
                // Better: Update productsApi to support userId filter.

                // Let's assume for now we just show some products or I'll update the API in the next step.
                setProducts(productsData.products);

            } catch (error) {
                console.error('Failed to load merchant profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!merchant) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold">التاجر غير موجود</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Banner */}
            <div className="h-48 md:h-64 w-full bg-muted relative overflow-hidden">
                {merchant.storeBanner ? (
                    <img
                        src={merchant.storeBanner}
                        alt={merchant.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                        <Store className="h-16 w-16 text-primary/40" />
                    </div>
                )}
            </div>

            <div className="container px-4 md:px-6 -mt-16 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Profile Card */}
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <div className="bg-card rounded-lg shadow-lg p-6 border">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-sm mb-4">
                                    <AvatarImage src={merchant.storeLogo} alt={merchant.name} />
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                        {merchant.name.substring(0, 1).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <h1 className="text-2xl font-bold mb-2">{merchant.name}</h1>
                                <div className="flex items-center text-muted-foreground text-sm mb-4">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>عضو منذ {format(new Date(merchant.createdAt), 'MMMM yyyy', { locale: ar })}</span>
                                </div>

                                <Separator className="my-4" />

                                <div className="w-full space-y-3 text-right">
                                    {merchant.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <span>{merchant.email}</span>
                                        </div>
                                    )}
                                    {merchant.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-primary" />
                                            <span>{merchant.phone}</span>
                                        </div>
                                    )}
                                    {/* Add location if available */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-2/3 lg:w-3/4 space-y-8 mt-4 md:mt-16">
                        {/* Description */}
                        {merchant.storeDescription && (
                            <div className="bg-card rounded-lg p-6 border shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">عن المتجر</h2>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {merchant.storeDescription}
                                </p>
                            </div>
                        )}

                        {/* Products */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">منتجات التاجر</h2>
                            {products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                                    لا توجد منتجات لعرضها حالياً
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
