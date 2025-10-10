import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  SortAsc, 
  Grid, 
  List, 
  ChevronRight,
  Star,
  ShoppingCart,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  discount?: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch category and products
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        setCategory({
          id: categoryId || '1',
          name: 'إلكترونيات',
          description: 'أحدث الأجهزة الإلكترونية والتقنية',
          image: 'https://via.placeholder.com/1200x300',
          productCount: 156
        });

        setProducts([
          {
            id: '1',
            name: 'هاتف ذكي متطور',
            price: 2999,
            originalPrice: 3499,
            image: 'https://via.placeholder.com/300x300',
            rating: 4.5,
            reviews: 234,
            inStock: true,
            discount: 14
          },
          {
            id: '2',
            name: 'لابتوب للألعاب',
            price: 5999,
            originalPrice: 6999,
            image: 'https://via.placeholder.com/300x300',
            rating: 4.8,
            reviews: 156,
            inStock: true,
            discount: 14
          },
          {
            id: '3',
            name: 'سماعات لاسلكية',
            price: 899,
            image: 'https://via.placeholder.com/300x300',
            rating: 4.3,
            reviews: 89,
            inStock: true
          },
          {
            id: '4',
            name: 'ساعة ذكية',
            price: 1299,
            originalPrice: 1599,
            image: 'https://via.placeholder.com/300x300',
            rating: 4.6,
            reviews: 312,
            inStock: false,
            discount: 19
          }
        ]);
      } catch (error) {
        console.error('Error fetching category data:', error);
        toast.error('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleAddToCart = (productId: string) => {
    toast.success('تمت الإضافة إلى السلة');
  };

  const handleAddToWishlist = (productId: string) => {
    toast.success('تمت الإضافة إلى المفضلة');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      {category && (
        <div className="mb-8">
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
                <p className="text-lg">{category.description}</p>
                <Badge variant="secondary" className="mt-4">
                  {category.productCount} منتج
                </Badge>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">الرئيسية</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/categories" className="hover:text-primary">الفئات</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{category.name}</span>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 ml-2" />
            تصفية
          </Button>
          <select 
            className="px-3 py-1 border rounded-md text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">الأكثر رواجاً</option>
            <option value="price-low">السعر: من الأقل للأعلى</option>
            <option value="price-high">السعر: من الأعلى للأقل</option>
            <option value="rating">التقييم</option>
            <option value="newest">الأحدث</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Products Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'
        : 'space-y-4'
      }>
        {products.map(product => (
          <Card key={product.id} className={viewMode === 'list' ? 'flex' : ''}>
            <div className={viewMode === 'list' ? 'w-48' : ''}>
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                {product.discount && (
                  <Badge className="absolute top-2 right-2" variant="destructive">
                    -{product.discount}%
                  </Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">نفذ المخزون</Badge>
                  </div>
                )}
              </div>
            </div>
            
            <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold mb-2 hover:text-primary">{product.name}</h3>
              </Link>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm ml-1">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} تقييم)</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold">{product.price} ج.م</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.originalPrice} ج.م
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  disabled={!product.inStock}
                  onClick={() => handleAddToCart(product.id)}
                >
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  أضف للسلة
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAddToWishlist(product.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">السابق</Button>
          <Button variant="default" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">التالي</Button>
        </div>
      </div>
    </div>
  );
}
