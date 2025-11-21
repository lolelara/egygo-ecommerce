import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Edit, Trash2, Search, FolderOpen, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@shared/api";
import { adminCategoriesApi } from "@/lib/admin-api";
import { categoriesApi } from "@/lib/api";
import { placeholder } from "@/lib/placeholder";

const CategoryForm = ({
  category,
  onSubmit,
  onCancel,
}: {
  category?: Category;
  onSubmit: (data: Omit<Category, "id" | "productCount">) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || "",
    isActive: category?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[أ-ي]/g, (match) => {
        const arabicToEnglish: { [key: string]: string } = {
          أ: "a",
          ب: "b",
          ت: "t",
          ث: "th",
          ج: "j",
          ح: "h",
          خ: "kh",
          د: "d",
          ذ: "dh",
          ر: "r",
          ز: "z",
          س: "s",
          ش: "sh",
          ص: "s",
          ض: "d",
          ط: "t",
          ظ: "dh",
          ع: "a",
          غ: "gh",
          ف: "f",
          ق: "q",
          ك: "k",
          ل: "l",
          م: "m",
          ن: "n",
          ه: "h",
          و: "w",
          ي: "y",
        };
        return arabicToEnglish[match] || match;
      })
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !category ? generateSlug(name) : prev.slug, // Only auto-generate for new categories
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">اسم الفئة</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">الرابط (Slug)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, slug: e.target.value }))
          }
          placeholder="electronics"
          required
        />
        <p className="text-xs text-muted-foreground">
          سيكون الرابط: /category/{formData.slug}
        </p>
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
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">رابط الصورة</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, image: e.target.value }))
          }
          placeholder="رابط الصورة"
        />
      </div>

      <div className="flex items-center space-x-2 flex-row-reverse space-x-reverse">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isActive: checked }))
          }
        />
        <Label htmlFor="isActive">نشط (ظاهر في الموقع)</Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">
          {category ? "تحديث الفئة" : "إضافة الفئة"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default function AdminCategories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await categoriesApi.getAll();
        setCategories(categoriesData.categories as any);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddCategory = async (data: Omit<Category, "id" | "productCount">) => {
    try {
      console.log("Creating category with data:", data);
      const newCategory = await adminCategoriesApi.create(data);
      console.log("Category created successfully:", newCategory);
      setCategories((prev) => [newCategory as any, ...prev]);
      setIsAddDialogOpen(false);
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الفئة بنجاح",
      });
    } catch (error: any) {
      console.error("Error adding category:", error);
      const errorMessage = error?.message || error?.toString() || "فشل في إضافة الفئة";
      toast({
        variant: "destructive",
        title: "خطأ",
        description: errorMessage,
      });
    }
  };

  const handleUpdateCategory = async (
    data: Omit<Category, "id" | "productCount">,
  ) => {
    if (!editingCategory) return;

    try {
      const updatedCategory = await adminCategoriesApi.update(editingCategory.id, data);
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id
            ? { ...category, ...updatedCategory }
            : category,
        ),
      );
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
      alert("فشل في تحديث الفئة");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;

    try {
      await adminCategoriesApi.delete(categoryId);
      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryId),
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("فشل في حذف الفئة");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">إدارة الفئات</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">إدارة الفئات</h1>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إضافة فئة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة فئة جديدة</DialogTitle>
                <DialogDescription>أدخل تفاصيل الفئة الجديدة</DialogDescription>
              </DialogHeader>
              <CategoryForm
                onSubmit={handleAddCategory}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الفئات
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المنتجات
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                متوسط المنتجات
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories.length > 0
                  ? Math.round(
                    categories.reduce(
                      (sum, cat) => sum + cat.productCount,
                      0,
                    ) / categories.length,
                  )
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="البحث في الفئات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>الفئات ({filteredCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الفئة</TableHead>
                  <TableHead>الرابط</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead className="text-center">الحالة</TableHead>
                  <TableHead>عدد المنتجات</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={category.image || placeholder.category(category.name)}
                          alt={category.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {category.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        /category/{category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate text-sm text-muted-foreground">
                        {category.description || "لا يوجد وصف"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <span className="font-medium">
                          {category.productCount}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-center">
                        <Dialog
                          open={editingCategory?.id === category.id}
                          onOpenChange={(open) =>
                            !open && setEditingCategory(null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>تعديل الفئة</DialogTitle>
                              <DialogDescription>
                                تعديل تفاصيل الفئة
                              </DialogDescription>
                            </DialogHeader>
                            {editingCategory && (
                              <CategoryForm
                                category={editingCategory}
                                onSubmit={handleUpdateCategory}
                                onCancel={() => setEditingCategory(null)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
                              handleDeleteCategory(category.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
