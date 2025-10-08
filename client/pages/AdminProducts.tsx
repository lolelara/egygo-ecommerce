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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import type {
  Product,
  Category,
  AdminProductCreate,
  AdminProductUpdate,
} from "@shared/api";
import { adminProductsApi } from "@/lib/admin-api";
import { productsApi, categoriesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AppwriteAuthContext";

const ProductForm = ({
  product,
  categories,
  onSubmit,
  onCancel,
}: {
  product?: Product;
  categories: Category[];
  onSubmit: (data: AdminProductCreate | AdminProductUpdate) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    categoryId: product?.category || "",
    images: product?.images || [],
    tags: product?.tags?.join(", ") || "",
    stockQuantity: 100, // Default stock
    affiliateCommission: product?.affiliateCommission || 8,
    colors: (product as any)?.colors?.join(", ") || "",
    sizes: (product as any)?.sizes?.join(", ") || "",
  });
  
  // Inventory management state
  const [colorSizeInventory, setColorSizeInventory] = useState<Array<{color: string, size: string, quantity: number}>>(() => {
    try {
      const existing = (product as any)?.colorSizeInventory;
      return existing ? JSON.parse(existing) : [];
    } catch {
      return [];
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const colorsArray = formData.colors
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);
    
    const sizesArray = formData.sizes
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);

    // Build inventory data for each color/size combination
    const inventoryData: Array<{color: string, size: string, quantity: number}> = [];
    
    if (colorsArray.length > 0 && sizesArray.length > 0) {
      // Use inventory from colorSizeInventory state
      inventoryData.push(...colorSizeInventory);
    }

    // Calculate total stock from inventory
    const totalStock = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
    
    console.log('📦 Inventory data being saved:', inventoryData);
    console.log('📊 Total stock calculated:', totalStock);

    const submitData = {
      ...formData,
      images: formData.images,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      colors: colorsArray,
      sizes: sizesArray,
      colorSizeInventory: JSON.stringify(inventoryData),
      stock: totalStock || formData.stockQuantity || 0, // Use total from inventory or default
    };
    
    console.log('💾 Submit data:', submitData);

    if (product) {
      onSubmit({ ...submitData, id: product.id } as AdminProductUpdate);
    } else {
      onSubmit(submitData as AdminProductCreate);
    }
  };
  
  // Generate inventory grid when colors/sizes change
  const handleColorsOrSizesChange = () => {
    const colorsArray = formData.colors.split(",").map(c => c.trim()).filter(Boolean);
    const sizesArray = formData.sizes.split(",").map(s => s.trim()).filter(Boolean);
    
    if (colorsArray.length > 0 && sizesArray.length > 0) {
      const newInventory: Array<{color: string, size: string, quantity: number}> = [];
      
      colorsArray.forEach(color => {
        sizesArray.forEach(size => {
          // Check if this combination already exists
          const existing = colorSizeInventory.find(
            item => item.color === color && item.size === size
          );
          
          newInventory.push({
            color,
            size,
            quantity: existing?.quantity || 0
          });
        });
      });
      
      setColorSizeInventory(newInventory);
    }
  };
  
  const updateInventoryQuantity = (color: string, size: string, quantity: number) => {
    setColorSizeInventory(prev => 
      prev.map(item => 
        item.color === color && item.size === size 
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">اسم المنتج</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">الفئة</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, categoryId: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر فئة" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">السعر (ج.م)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="originalPrice">السعر الأصلي (ج.م)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={formData.originalPrice}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                originalPrice: Number(e.target.value),
              }))
            }
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="affiliateCommission">نسبة العمولة (%)</Label>
          <Input
            id="affiliateCommission"
            type="number"
            value={formData.affiliateCommission}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                affiliateCommission: Number(e.target.value),
              }))
            }
            min="0"
            max="100"
            step="0.1"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>صور المنتج</Label>
        <ImageUploader
          value={formData.images}
          onChange={(urls) =>
            setFormData((prev) => ({ ...prev, images: urls }))
          }
          maxFiles={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">الكلمات المفتاحية (منفصلة بفواصل)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tags: e.target.value }))
          }
          placeholder="إلكترونيات, سماعات, بلوتوث"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="colors">الألوان المتاحة (منفصلة بفواصل)</Label>
          <Input
            id="colors"
            value={formData.colors}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, colors: e.target.value }));
            }}
            onBlur={handleColorsOrSizesChange}
            placeholder="أحمر, أزرق, أخضر"
          />
          <p className="text-xs text-muted-foreground">
            مثال: أحمر, أزرق, أسود أو Red, Blue, Black
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sizes">المقاسات المتاحة (منفصلة بفواصل)</Label>
          <Input
            id="sizes"
            value={formData.sizes}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, sizes: e.target.value }));
            }}
            onBlur={handleColorsOrSizesChange}
            placeholder="S, M, L, XL"
          />
          <p className="text-xs text-muted-foreground">
            مثال: S, M, L, XL أو 38, 40, 42, 44
          </p>
        </div>
      </div>

      {/* Inventory Grid */}
      {colorSizeInventory.length > 0 && (
        <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">المخزون لكل لون ومقاس</Label>
            <p className="text-xs text-muted-foreground">
              إجمالي المخزون: {colorSizeInventory.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto">
            {colorSizeInventory.map((item, index) => (
              <div key={index} className="space-y-1 border rounded p-2 bg-background">
                <div className="text-xs font-medium text-center">
                  {item.color} - {item.size}
                </div>
                <Input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => updateInventoryQuantity(item.color, item.size, Number(e.target.value))}
                  className="h-8 text-center"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground">
            💡 أدخل الكمية المتاحة لكل تركيبة لون ومقاس. المخزون الإجمالي سيتم حسابه تلقائياً.
          </p>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">
          {product ? "تحديث المنتج" : "إضافة المنتج"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getAll({}),
          categoriesApi.getAll(),
        ]);
        
        let filteredProducts = productsData.products as any;
        
        // Filter products by merchantId if user is a merchant (not admin)
        if (user && (user as any).labels && !(user as any).labels.includes('admin')) {
          console.log('Filtering products for merchant:', user.$id);
          filteredProducts = (productsData.products as any[]).filter((p: any) => {
            return p.merchantId === user.$id;
          });
          console.log('Merchant products:', filteredProducts.length);
        }
        
        setProducts(filteredProducts);
        setCategories(categoriesData.categories as any);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async (data: AdminProductCreate) => {
    try {
      // Pass user ID as merchantId for merchant users
      const newProduct = await adminProductsApi.create(data, user?.$id);
      setProducts((prev) => [newProduct as any, ...prev]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("فشل في إضافة المنتج");
    }
  };

  const handleUpdateProduct = async (data: AdminProductUpdate) => {
    try {
      // Check if user has permission to edit this product (must be admin or the merchant who owns it)
      const product = products.find(p => p.id === data.id);
      const isAdmin = user && (user as any).labels?.includes('admin');
      const isMerchantOwner = product && (product as any).merchantId === user?.$id;
      
      if (!isAdmin && !isMerchantOwner) {
        alert("ليس لديك صلاحية لتعديل هذا المنتج");
        return;
      }
      
      const updatedProduct = await adminProductsApi.update(data);
      setProducts((prev) =>
        prev.map((product) =>
          product.id === data.id
            ? ({ ...updatedProduct, category: data.categoryId || product.category } as any)
            : product,
        ),
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("فشل في تحديث المنتج");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      // Check if user has permission to delete this product
      const product = products.find(p => p.id === productId);
      const isAdmin = user && (user as any).labels?.includes('admin');
      const isMerchantOwner = product && (product as any).merchantId === user?.$id;
      
      if (!isAdmin && !isMerchantOwner) {
        alert("ليس لديك صلاحية لحذف هذا المنتج");
        return;
      }
      
      await adminProductsApi.delete(productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("فشل في حذف المنتج");
    }
  };  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              إدارة المنتج��ت
            </h1>
          </div>
          <div className="animate-pulse">
            <div className="h-10 bg-muted rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">إدارة المنتجات</h1>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إضافة منتج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة منتج جديد</DialogTitle>
                <DialogDescription>أدخل تفاصيل المنتج الجديد</DialogDescription>
              </DialogHeader>
              <ProductForm
                categories={categories}
                onSubmit={handleAddProduct}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المنتجات
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                المنتجات المتاحة
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter((p) => p.inStock).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                المنتجات غير المتاحة
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter((p) => !p.inStock).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                متوسط التقييم
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.length > 0
                  ? (
                      products.reduce((sum, p) => sum + p.rating, 0) /
                      products.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="البحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>المنتجات ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>المخزون</TableHead>
                  <TableHead>العمولة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const category = categories.find(
                    (c) => c.id === product.category,
                  );
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {category?.name || product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.price} ج.م</div>
                          {product.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {product.originalPrice} ج.م
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{product.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.inStock ? "default" : "secondary"}
                        >
                          {product.inStock ? "متاح" : "غير متاح"}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.affiliateCommission}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog
                            open={editingProduct?.id === product.id}
                            onOpenChange={(open) =>
                              !open && setEditingProduct(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>تعديل المنتج</DialogTitle>
                                <DialogDescription>
                                  تعديل تفاصيل المنتج
                                </DialogDescription>
                              </DialogHeader>
                              {editingProduct && (
                                <ProductForm
                                  product={editingProduct}
                                  categories={categories}
                                  onSubmit={handleUpdateProduct}
                                  onCancel={() => setEditingProduct(null)}
                                />
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
                                handleDeleteProduct(product.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
