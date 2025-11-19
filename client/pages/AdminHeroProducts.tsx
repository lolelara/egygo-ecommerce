import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Star, StarOff, Loader2, CheckCircle2 } from 'lucide-react';
import { getImageUrl } from '@/lib/storage';

export default function AdminHeroProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.products,
                [
                    Query.equal('status', 'approved'),
                    Query.limit(50),
                    Query.orderDesc('$createdAt')
                ]
            );
            setProducts(response.documents);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleHeroStatus = async (productId: string, currentStatus: boolean) => {
        try {
            setUpdating(productId);

            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.products,
                productId,
                {
                    isFeaturedInHero: !currentStatus
                }
            );

            // Update local state
            setProducts(prev => prev.map(p =>
                p.$id === productId ? { ...p, isFeaturedInHero: !currentStatus } : p
            ));
        } catch (error) {
            console.error('Error updating product:', error);
            alert('حدث خطأ أثناء التحديث');
        } finally {
            setUpdating(null);
        }
    };

    const featuredProducts = products.filter(p => p.isFeaturedInHero);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">إدارة منتجات Hero Section</h1>
                <p className="text-muted-foreground">
                    اختر المنتجات التي ستظهر في قسم Hero بالصفحة الرئيسية
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-primary">{featuredProducts.length}</div>
                        <p className="text-sm text-muted-foreground">منتجات مميزة حالياً</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{products.length}</div>
                        <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">نشط</div>
                        <p className="text-sm text-muted-foreground">حالة النظام</p>
                    </CardContent>
                </Card>
            </div>

            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
                <Card className="border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            المنتجات المميزة في Hero ({featuredProducts.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {featuredProducts.map((product) => (
                                <div
                                    key={product.$id}
                                    className="border rounded-lg p-4 bg-primary/5 hover:bg-primary/10 transition-colors"
                                >
                                    <div className="flex gap-3">
                                        <img
                                            src={getImageUrl(product.images?.[0])}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                                            <p className="text-sm text-primary font-bold">{product.price} ج.م</p>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="mt-2"
                                                onClick={() => toggleHeroStatus(product.$id, true)}
                                                disabled={updating === product.$id}
                                            >
                                                {updating === product.$id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <StarOff className="h-4 w-4 mr-2" />
                                                        إزالة من Hero
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* All Products List */}
            <Card>
                <CardHeader>
                    <CardTitle>جميع المنتجات</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div
                                key={product.$id}
                                className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                            >
                                {/* Product Image */}
                                <img
                                    src={getImageUrl(product.images?.[0])}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {product.description || 'لا يوجد وصف'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-lg font-bold text-primary">
                                            {product.price} ج.م
                                        </span>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-sm text-muted-foreground line-through">
                                                {product.originalPrice} ج.م
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Status Badge */}
                                {product.isFeaturedInHero && (
                                    <Badge className="bg-primary">
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        مميز في Hero
                                    </Badge>
                                )}

                                {/* Action Button */}
                                <Button
                                    variant={product.isFeaturedInHero ? 'outline' : 'default'}
                                    size="sm"
                                    onClick={() => toggleHeroStatus(product.$id, product.isFeaturedInHero)}
                                    disabled={updating === product.$id}
                                >
                                    {updating === product.$id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : product.isFeaturedInHero ? (
                                        <>
                                            <StarOff className="h-4 w-4 mr-2" />
                                            إزالة
                                        </>
                                    ) : (
                                        <>
                                            <Star className="h-4 w-4 mr-2" />
                                            إضافة لـ Hero
                                        </>
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
