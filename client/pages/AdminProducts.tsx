import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  CheckSquare,
  Square,
  Zap,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/ImageUploader";
import VideoUploader from "@/components/VideoUploader";
import { getImageUrl } from "@/lib/storage";
import { PageLoader } from "@/components/ui/loading-screen";
import type {
  Product,
  Category,
  AdminProductCreate,
  AdminProductUpdate,
} from "@shared/api";
import { adminProductsApi, adminUsersApi, aiContentApi } from "@/lib/admin-api";
import { productsApi, categoriesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { Sparkles } from "lucide-react";

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
    isFeatured: product?.isFeatured || false,
    isFeaturedInHero: product?.isFeaturedInHero || false,
    isFlashDeal: (product as any)?.isFlashDeal || false,
    basePrice: (product as any)?.basePrice || product?.price || 0,
    minCommissionPrice: (product as any)?.minCommissionPrice || product?.price || 0,
    categoryId: product?.category || "", // Keep for backward compatibility
    categoryIds: product?.categoryIds || (product?.category ? [product.category] : []),
    images: product?.images || [],
    tags: product?.tags?.join(", ") || "",
    stockQuantity: 100, // Default stock
    affiliateCommission: product?.affiliateCommission || 8,
    colors: (product as any)?.colors?.join(", ") || "",
    sizes: (product as any)?.sizes?.join(", ") || "",
    verificationVideo: (product as any)?.verificationVideo || "",
    approvalStatus: (product as any)?.approvalStatus || "pending",
    mediaLinks: (product as any)?.mediaLinks || [],
  });

  // Inventory management state
  const [colorSizeInventory, setColorSizeInventory] = useState<Array<{ color: string, size: string, quantity: number }>>(() => {
    try {
      const existing = (product as any)?.colorSizeInventory;
      return existing ? JSON.parse(existing) : [];
    } catch {
      return [];
    }
  });

  const [isImproving, setIsImproving] = useState(false);

  const handleImproveDescription = async () => {
    if (!formData.name) {
      alert("يرجى إدخال اسم المنتج أولاً");
      return;
    }

    setIsImproving(true);
    try {
      const result = await aiContentApi.improveDescription(
        formData.name,
        formData.description
      );

      setFormData(prev => ({
        ...prev,
        description: result.description,
        mediaLinks: [...new Set([...prev.mediaLinks, ...result.mediaLinks])]
      }));

      if (result.mediaLinks.length > 0) {
        alert(`✨ تم تحسين الوصف واستخراج ${result.mediaLinks.length} رابط ميديا!`);
      } else {
        alert("✨ تم تحسين الوصف بنجاح!");
      }
    } catch (error: any) {
      console.error("Error improving description:", error);
      alert(error.message || "فشل في تحسين الوصف");
    } finally {
      setIsImproving(false);
    }
  };

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
    const inventoryData: Array<{ color: string, size: string, quantity: number }> = [];

    if (colorsArray.length > 0 && sizesArray.length > 0) {
      // Use inventory from colorSizeInventory state
      inventoryData.push(...colorSizeInventory);
    }

    // Calculate total stock from inventory
    const totalStock = inventoryData.reduce((sum, item) => sum + item.quantity, 0);

    console.log('📦 Inventory data being saved:', inventoryData);
    console.log('📊 Total stock calculated:', totalStock);

    // Use inventory total if available, otherwise use stockQuantity, default to 100 for new products
    const finalStock = totalStock > 0 ? totalStock : (formData.stockQuantity || 100);

    const submitData = {
      ...formData,
      description: (formData.description || '').substring(0, 2000), // Truncate to Appwrite limit
      images: formData.images,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      colors: colorsArray,
      sizes: sizesArray,
      colorSizeInventory: JSON.stringify(inventoryData),
      stock: finalStock, // Use total from inventory or stockQuantity
      stockQuantity: finalStock, // Also set stockQuantity
      inStock: true, // Always set to true for products with stock
      isActive: true, // Always activate new products (admin can deactivate manually)
      categoryIds: formData.categoryIds, // Include multiple categories
      mediaLinks: formData.mediaLinks,
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
      const newInventory: Array<{ color: string, size: string, quantity: number }> = [];

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
          <Label>الفئات</Label>
          <div className="border rounded-md p-4 h-48 overflow-y-auto space-y-2 bg-background">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={formData.categoryIds.includes(category.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => {
                      const newCategoryIds = checked
                        ? [...prev.categoryIds, category.id]
                        : prev.categoryIds.filter((id) => id !== category.id);

                      // Update primary categoryId (first selected)
                      const newCategoryId = newCategoryIds.length > 0 ? newCategoryIds[0] : "";

                      return {
                        ...prev,
                        categoryIds: newCategoryIds,
                        categoryId: newCategoryId
                      };
                    });
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">يمكنك اختيار أكثر من فئة</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">الوصف</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleImproveDescription}
            disabled={isImproving || !formData.name}
            className="h-6 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className={`w-3 h-3 me-1 ${isImproving ? 'animate-spin' : ''}`} />
            {isImproving ? 'جاري التحسين...' : 'تحسين الوصف بالذكاء الاصطناعي'}
          </Button>
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">السعر للعرض (ج.م)</Label>
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
          <p className="text-xs text-muted-foreground">السعر الذي سيظهر للعملاء</p>
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
          <p className="text-xs text-muted-foreground">السعر قبل الخصم (اختياري)</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 border p-4 rounded-lg bg-muted/20">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isFeatured: checked as boolean }))
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="isFeatured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              منتج مميز (Featured)
            </Label>
            <p className="text-xs text-muted-foreground">
              سيظهر هذا المنتج في قسم "منتجات مميزة" في الصفحة الرئيسية
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="isFeaturedInHero"
            checked={formData.isFeaturedInHero}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isFeaturedInHero: checked as boolean }))
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="isFeaturedInHero"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              منتج Hero (الواجهة الرئيسية)
            </Label>
            <p className="text-xs text-muted-foreground">
              سيظهر هذا المنتج في القسم العلوي الكبير (Hero Section) في الصفحة الرئيسية
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="isFlashDeal"
            checked={(formData as any).isFlashDeal}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isFlashDeal: checked as boolean }))
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="isFlashDeal"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              عرض فلاش (Flash Deal) ⚡
            </Label>
            <p className="text-xs text-muted-foreground">
              سيظهر هذا المنتج في قسم العروض الخاصة (Flash Sales)
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-primary">⚙️ إعدادات العمولة للمسوقين</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="basePrice">السعر الأساسي (قبل العمولة)</Label>
            <Input
              id="basePrice"
              type="number"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  basePrice: Number(e.target.value),
                }))
              }
              min="0"
              step="0.01"
              required
            />
            <p className="text-xs text-muted-foreground">
              السعر الذي ستحصل عليه (بدون عمولة المسوق)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minCommissionPrice">الحد الأدنى للسعر (شامل العمولة)</Label>
            <Input
              id="minCommissionPrice"
              type="number"
              value={formData.minCommissionPrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  minCommissionPrice: Number(e.target.value),
                }))
              }
              min={formData.basePrice}
              step="0.01"
              required
            />
            <p className="text-xs text-muted-foreground">
              أقل سعر يمكن للمسوق بيع المنتج به
            </p>
          </div>
        </div>

        {formData.basePrice > 0 && formData.minCommissionPrice > 0 && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>الحد الأدنى للعمولة:</strong>{" "}
              {(formData.minCommissionPrice - formData.basePrice).toFixed(2)} ج.م
              {" "}({((formData.minCommissionPrice - formData.basePrice) / formData.basePrice * 100).toFixed(1)}%)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              المسوق يمكنه إضافة أي قيمة أعلى من {formData.minCommissionPrice.toFixed(2)} ج.م
            </p>
          </div>
        )}
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

      {/* Video Verification */}
      <div className="space-y-2">
        <VideoUploader
          value={formData.verificationVideo}
          onChange={(url) =>
            setFormData((prev) => ({ ...prev, verificationVideo: url }))
          }
          label="فيديو التحقق من المنتج"
          required={!product}
        />
      </div>

      {/* Media Links Section */}
      <div className="space-y-2">
        <Label>روابط الميديا (Google Drive)</Label>
        <div className="space-y-2">
          {formData.mediaLinks.map((link: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={link}
                onChange={(e) => {
                  const newLinks = [...formData.mediaLinks];
                  newLinks[index] = e.target.value;
                  setFormData(prev => ({ ...prev, mediaLinks: newLinks }));
                }}
                placeholder="https://drive.google.com/..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newLinks = formData.mediaLinks.filter((_: any, i: number) => i !== index);
                  setFormData(prev => ({ ...prev, mediaLinks: newLinks }));
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFormData(prev => ({ ...prev, mediaLinks: [...prev.mediaLinks, ""] }))}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> إضافة رابط ميديا
          </Button>
        </div>
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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getAll({ page, limit }),
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
        setTotalProducts(productsData.total);
        setTotalPages(Math.ceil(productsData.total / limit));
        setCategories(categoriesData.categories as any);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [user, page, limit]);

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

      // If merchant is editing, set status back to pending for re-approval
      const updateData = { ...data };
      if (!isAdmin && isMerchantOwner) {
        updateData.status = 'pending';
        alert("✅ تم تحديث المنتج بنجاح! سيتم مراجعته من قبل الإدارة قبل نشره.");
      }

      const updatedProduct = await adminProductsApi.update(updateData);
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
      alert("فشل في تحديث المنتج: " + (error as any).message);
    }
  };



  const handleToggleFlashDeal = async (product: Product) => {
    try {
      const newStatus = !(product as any).isFlashDeal;
      await adminProductsApi.update({
        id: product.id,
        isFlashDeal: newStatus,
      } as any);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? ({ ...p, isFlashDeal: newStatus } as any)
            : p
        )
      );
    } catch (error) {
      console.error("Error toggling flash deal:", error);
      alert("فشل في تحديث حالة العرض الفلاش");
    }
  };

  const handleUpdateCategories = async (product: Product, newCategoryIds: string[]) => {
    try {
      // Determine primary category (first one or empty)
      const primaryCategoryId = newCategoryIds.length > 0 ? newCategoryIds[0] : "";

      await adminProductsApi.update({
        id: product.id,
        categoryIds: newCategoryIds,
        categoryId: primaryCategoryId, // Sync for backward compatibility
      } as any);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? ({ ...p, categoryIds: newCategoryIds, category: primaryCategoryId } as any)
            : p
        )
      );
    } catch (error) {
      console.error("Error updating categories:", error);
      alert("فشل في تحديث الفئات");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      return;
    }

    try {
      // Admin can delete any product, no permission check needed
      await adminProductsApi.delete(productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));

      alert("تم حذف المنتج بنجاح");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("فشل في حذف المنتج: " + (error as any).message);
    }
  };

  // Bulk delete products
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert("الرجاء اختيار منتجات أولاً");
      return;
    }

    if (!confirm(`هل أنت متأكد من حذف ${selectedProducts.length} منتج؟ لا يمكن التراجع عن هذا الإجراء!`)) {
      return;
    }

    setBulkUpdating(true);
    let deletedCount = 0;

    try {
      for (const productId of selectedProducts) {
        try {
          await adminProductsApi.delete(productId);
          deletedCount++;
        } catch (error) {
          console.error(`Error deleting product ${productId}:`, error);
        }
      }

      setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      alert(`تم حذف ${deletedCount} منتج بنجاح`);
    } catch (error) {
      console.error("Error bulk deleting:", error);
      alert("حدث خطأ أثناء الحذف");
    } finally {
      setBulkUpdating(false);
    }
  };

  // Bulk Auto Categorize
  const handleBulkAutoCategorize = async () => {
    if (selectedProducts.length === 0) return;

    setBulkUpdating(true);
    const toastId = toast.loading("جاري التصنيف التلقائي...");

    try {
      // 1. Get categories for context
      const categoriesList = categories.map(c => ({ id: c.id, name: c.name }));

      let successCount = 0;
      let failedCount = 0;

      for (const productId of selectedProducts) {
        try {
          const product = products.find(p => p.id === productId);
          if (!product) continue;

          // Suggest category
          const suggestedCategoryId = await aiContentApi.suggestCategory(
            product.name,
            product.description,
            categoriesList
          );

          if (suggestedCategoryId) {
            // Update product
            await adminProductsApi.update({
              id: productId,
              categoryId: suggestedCategoryId
            } as AdminProductUpdate);

            successCount++;

            // Update local state immediately
            setProducts((prev) => prev.map((p) =>
              p.id === productId ? { ...p, category: suggestedCategoryId } : p
            ));
          } else {
            failedCount++;
          }
        } catch (err) {
          console.error(`Failed to categorize product ${productId}`, err);
          failedCount++;
        }
      }

      toast.success(`تم تصنيف ${successCount} منتج بنجاح! ${failedCount > 0 ? `(فشل ${failedCount})` : ''}`, { id: toastId });
      setSelectedProducts([]);

    } catch (error) {
      console.error('Bulk categorize error:', error);
      toast.error('حدث خطأ أثناء التصنيف التلقائي', { id: toastId });
    } finally {
      setBulkUpdating(false);
    }
  };

  // Bulk update product status
  const handleBulkStatusUpdate = async (inStock: boolean) => {
    if (selectedProducts.length === 0) {
      alert("الرجاء اختيار منتجات أولاً");
      return;
    }

    setBulkUpdating(true);
    let updatedCount = 0;

    try {
      for (const productId of selectedProducts) {
        try {
          const product = products.find(p => p.id === productId);
          if (product) {
            await adminProductsApi.update({
              id: productId,
              inStock,
            } as AdminProductUpdate);
            updatedCount++;
          }
        } catch (error) {
          console.error(`Error updating product ${productId}:`, error);
        }
      }

      setProducts((prev) => prev.map((p) =>
        selectedProducts.includes(p.id) ? { ...p, inStock } : p
      ));
      setSelectedProducts([]);
      alert(`تم تحديث ${updatedCount} منتج بنجاح`);
    } catch (error) {
      console.error("Error bulk updating:", error);
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setBulkUpdating(false);
    }
  };

  // Bulk update category
  const handleBulkCategoryUpdate = async (categoryId: string) => {
    if (selectedProducts.length === 0) {
      alert("الرجاء اختيار منتجات أولاً");
      return;
    }

    setBulkUpdating(true);
    let updatedCount = 0;

    try {
      for (const productId of selectedProducts) {
        try {
          await adminProductsApi.update({
            id: productId,
            categoryId,
          } as AdminProductUpdate);
          updatedCount++;
        } catch (error) {
          console.error(`Error updating product ${productId}:`, error);
        }
      }

      setProducts((prev) => prev.map((p) =>
        selectedProducts.includes(p.id) ? { ...p, category: categoryId } : p
      ));
      setSelectedProducts([]);
      alert(`تم تحديث ${updatedCount} منتج بنجاح`);
    } catch (error) {
      console.error("Error bulk updating category:", error);
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setBulkUpdating(false);
    }
  };

  // Bulk AI Improve Description
  const handleBulkImproveDescription = async () => {
    if (selectedProducts.length === 0) {
      toast.error("الرجاء اختيار منتجات أولاً");
      return;
    }

    if (!confirm(`هل أنت متأكد من تحسين وصف ${selectedProducts.length} منتج باستخدام الذكاء الاصطناعي؟`)) {
      return;
    }

    setBulkUpdating(true);
    const toastId = toast.loading("جاري تحسين الوصف...");
    let updatedCount = 0;
    let failedCount = 0;

    try {
      // Get active key first to fail fast
      await aiContentApi.improveDescription("test", "test");

      for (const productId of selectedProducts) {
        try {
          const product = products.find(p => p.id === productId);
          if (!product) continue;

          const improvedDescription = await aiContentApi.improveDescription(
            product.name,
            product.description
          );

          await adminProductsApi.update({
            id: productId,
            description: improvedDescription
          } as AdminProductUpdate);

          updatedCount++;

          setProducts((prev) => prev.map((p) =>
            p.id === productId ? { ...p, description: improvedDescription } : p
          ));

        } catch (error) {
          console.error(`Error improving product ${productId}:`, error);
          failedCount++;
        }
      }

      setSelectedProducts([]);
      toast.success(`تم تحسين وصف ${updatedCount} منتج بنجاح! ${failedCount > 0 ? `(فشل ${failedCount})` : ''}`, { id: toastId });
    } catch (error) {
      console.error("Error bulk improving:", error);
      toast.error("حدث خطأ أثناء التحسين الجماعي", { id: toastId });
    } finally {
      setBulkUpdating(false);
    }
  };

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Toggle all products
  const toggleAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  // Helper function to check if product is available based on inventory
  const isProductAvailable = (product: any): boolean => {
    // Try to get stock from colorSizeInventory first
    if (product.colorSizeInventory) {
      try {
        const inventory = JSON.parse(product.colorSizeInventory);
        if (Array.isArray(inventory) && inventory.length > 0) {
          const totalStock = inventory.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
          return totalStock > 0;
        }
      } catch (e) {
        console.error('Error parsing inventory for product:', product.id, e);
      }
    }

    // Fallback: check if product has colors/sizes (assume available)
    if (product.colors?.length > 0 || product.sizes?.length > 0) {
      return true;
    }

    // Fallback: check stock field
    if (product.stock !== undefined && product.stock > 0) {
      return true;
    }

    // Fallback: check inStock field
    if (product.inStock !== undefined) {
      return product.inStock;
    }

    // Default: assume available
    return true;
  };

  if (loading) {
    return (
      <AdminLayout>
        <PageLoader message="جاري تحميل المنتجات..." />
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
                {products.filter((p) => isProductAvailable(p)).length}
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
                {products.filter((p) => !isProductAvailable(p)).length}
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

        {/* Bulk Actions Bar */}
        {selectedProducts.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    تم اختيار {selectedProducts.length} منتج
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProducts([])}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    إلغاء التحديد
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkAutoCategorize}
                    disabled={bulkUpdating} // Assuming isRewriting is similar to bulkUpdating for disabling
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    تصنيف تلقائي (AI)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate(true)}
                    disabled={bulkUpdating}
                  >
                    تعيين كمتاح
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate(false)}
                    disabled={bulkUpdating}
                  >
                    تعيين كغير متاح
                  </Button>
                  <Select
                    onValueChange={handleBulkCategoryUpdate}
                    disabled={bulkUpdating}
                  >
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue placeholder="تغيير الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={bulkUpdating}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف المحدد
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkImproveDescription}
                    disabled={bulkUpdating}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                  >
                    <Sparkles className="h-4 w-4 ml-2" />
                    تحسين الوصف (AI)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                  <TableHead className="w-12">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleAllProducts}
                      className="h-8 w-8 p-0"
                    >
                      {selectedProducts.length === filteredProducts.length && filteredProducts.length > 0 ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>المنتج</TableHead>
                  <TableHead>الفئات</TableHead>
                  <TableHead>فلاش ⚡</TableHead>
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
                  const isSelected = selectedProducts.includes(product.id);
                  return (
                    <TableRow key={product.id} className={isSelected ? "bg-blue-50" : ""}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleProductSelection(product.id)}
                          className="h-8 w-8 p-0"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <div className="font-bold text-lg flex items-center gap-2 flex-wrap">
                              <a href={`/#/product/${product.id}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary transition-colors">
                                {product.name}
                              </a>
                              {product.isFeatured && <Badge variant="secondary" className="text-[10px] h-5 px-1 bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm">مميز</Badge>}
                              {product.isFeaturedInHero && <Badge variant="secondary" className="text-[10px] h-5 px-1 bg-purple-100 text-purple-800 border-purple-200 shadow-sm">Hero</Badge>}
                              {(product as any).isFlashDeal && <Badge variant="secondary" className="text-[10px] h-5 px-1 bg-red-100 text-red-800 border-red-200 shadow-sm">Flash ⚡</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2 max-w-[300px] mt-1 leading-relaxed">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-[180px] justify-between h-auto min-h-[2rem] py-1 px-2 text-xs"
                            >
                              <div className="flex flex-wrap gap-1 items-center text-right">
                                {product.categoryIds && product.categoryIds.length > 0 ? (
                                  <>
                                    <span className="truncate max-w-[100px]">
                                      {categories.find((c) => c.id === product.categoryIds![0])?.name || "فئة غير معروفة"}
                                    </span>
                                    {product.categoryIds.length > 1 && (
                                      <Badge variant="secondary" className="text-[10px] px-1 h-4">
                                        +{product.categoryIds.length - 1}
                                      </Badge>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">اختر الفئات</span>
                                )}
                              </div>
                              <ChevronsUpDown className="mr-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="بحث عن فئة..." />
                              <CommandList>
                                <CommandEmpty>لا توجد فئات.</CommandEmpty>
                                <CommandGroup>
                                  {categories.map((category) => {
                                    const isSelected = product.categoryIds?.includes(category.id);
                                    return (
                                      <CommandItem
                                        key={category.id}
                                        value={category.name}
                                        onSelect={() => {
                                          const currentIds = product.categoryIds || [];
                                          const newIds = isSelected
                                            ? currentIds.filter((id) => id !== category.id)
                                            : [...currentIds, category.id];
                                          handleUpdateCategories(product, newIds);
                                        }}
                                      >
                                        <div
                                          className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            isSelected
                                              ? "bg-primary text-primary-foreground"
                                              : "opacity-50 [&_svg]:invisible"
                                          )}
                                        >
                                          <Check className={cn("h-4 w-4")} />
                                        </div>
                                        <span>{category.name}</span>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFlashDeal(product)}
                          className={cn(
                            "h-8 w-8 p-0 transition-colors",
                            (product as any).isFlashDeal
                              ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                              : "text-gray-300 hover:text-yellow-500"
                          )}
                          title={(product as any).isFlashDeal ? "إزالة من العروض" : "إضافة للعروض"}
                        >
                          <Zap className={cn("h-5 w-5", (product as any).isFlashDeal && "fill-current")} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (!confirm(`هل تريد تحسين وصف المنتج "${product.name}"؟`)) return;
                            try {
                              const improved = await aiContentApi.improveDescription(product.name, product.description);
                              await adminProductsApi.update({ id: product.id, description: improved } as AdminProductUpdate);
                              setProducts(prev => prev.map(p => p.id === product.id ? { ...p, description: improved } : p));
                              alert("✨ تم تحسين الوصف بنجاح!");
                            } catch (e: any) {
                              alert(e.message || "فشل التحسين");
                            }
                          }}
                          className="h-8 w-8 p-0 text-gray-300 hover:text-purple-600 hover:bg-purple-50"
                          title="تحسين الوصف بالذكاء الاصطناعي"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-bold text-base text-green-600">{product.price.toLocaleString()} ج.م</div>
                          {product.originalPrice && (
                            <div className="text-xs text-red-400 line-through">
                              {product.originalPrice.toLocaleString()} ج.م
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
                          className={cn(
                            "px-2 py-1 text-xs font-medium border",
                            product.inStock
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          )}
                          variant="outline"
                        >
                          {product.inStock ? "متاح" : "غير متاح"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">{product.affiliateCommission}%</TableCell>
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4 border-t pt-4">
              <div className="text-sm text-muted-foreground">
                صفحة {page} من {totalPages} ({totalProducts} منتج)
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={limit.toString()}
                  onValueChange={(val) => {
                    setLimit(Number(val));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  السابق
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  التالي
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
