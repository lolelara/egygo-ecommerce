import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  GripVertical,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Tag,
  Search,
  ArrowUp,
  ArrowDown,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query, ID } from "appwrite";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getImageUrl } from "@/lib/storage";

interface FeaturedDeal {
  $id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice: number;
  discount: number;
  order: number;
  active: boolean;
  createdAt: string;
}

interface Product {
  $id: string;  // Appwrite uses $id
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: Array<{ url: string }>;
  stockQuantity?: number;
}

function SortableRow({ deal, onToggle, onRemove }: { deal: FeaturedDeal; onToggle: (id: string) => void; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.$id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'bg-muted' : ''}>
      <TableCell className="w-8">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="w-12">
        <span className="font-mono text-sm text-muted-foreground">#{deal.order}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <img
            src={getImageUrl(deal.productImage)}
            alt={deal.productName}
            className="w-12 h-12 object-cover rounded border"
          />
          <div>
            <div className="font-medium">{deal.productName}</div>
            <div className="text-xs text-muted-foreground">{deal.productId.slice(0, 8)}...</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{deal.price.toFixed(2)} ج.م</span>
            {deal.originalPrice && (
              <span className="text-sm line-through text-muted-foreground">
                {deal.originalPrice.toFixed(2)} ج.م
              </span>
            )}
          </div>
          <Badge className="bg-red-500 text-white">
            -{deal.discount}%
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={deal.active ? 'default' : 'secondary'}>
          {deal.active ? (
            <>
              <Eye className="h-3 w-3 mr-1" />
              مفعل
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              معطل
            </>
          )}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggle(deal.$id)}
          >
            {deal.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemove(deal.$id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AdminDealsManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<FeaturedDeal[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Add Dialog
  const [addDialog, setAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDeals();
      fetchProducts();
    }
  }, [user]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        'featuredDeals',
        [Query.orderAsc('order'), Query.limit(100)]
      );
      setDeals(response.documents as any);
    } catch (error: any) {
      // Collection might not exist yet
      if (error.code === 404) {
        console.log('Featured deals collection not created yet');
        setDeals([]);
      } else {
        console.error('Error fetching deals:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل العروض",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.products,
        [Query.limit(500)]
      );
      setAllProducts(response.documents as any);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setDeals((items) => {
        const oldIndex = items.findIndex((item) => item.$id === active.id);
        const newIndex = items.findIndex((item) => item.$id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update order in database
        updateOrders(newItems);

        return newItems;
      });
    }
  };

  const updateOrders = async (newDeals: FeaturedDeal[]) => {
    try {
      // Update each deal with new order
      for (let i = 0; i < newDeals.length; i++) {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          'featuredDeals',
          newDeals[i].$id,
          { order: i + 1 }
        );
      }
      toast({
        title: "تم التحديث",
        description: "تم تحديث ترتيب العروض بنجاح",
      });
    } catch (error) {
      console.error('Error updating orders:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الترتيب",
        variant: "destructive",
      });
    }
  };

  const handleAddDeal = async () => {
    if (!selectedProduct) return;

    try {
      setAdding(true);

      const discount = selectedProduct.originalPrice
        ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
        : 0;

      await databases.createDocument(
        appwriteConfig.databaseId,
        'featuredDeals',
        ID.unique(),
        {
          productId: selectedProduct.$id,
          productName: selectedProduct.name,
          productImage: selectedProduct.images?.[0]?.url || selectedProduct.image || '',
          price: selectedProduct.price,
          originalPrice: selectedProduct.originalPrice || selectedProduct.price,
          discount,
          order: deals.length + 1,
          active: true,
          createdAt: new Date().toISOString()
        }
      );

      toast({
        title: "تمت الإضافة",
        description: `تم إضافة ${selectedProduct.name} للعروض`,
      });

      setAddDialog(false);
      setSelectedProduct(null);
      setSearchQuery('');
      fetchDeals();
    } catch (error) {
      console.error('Error adding deal:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة العرض",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleToggleActive = async (dealId: string) => {
    try {
      const deal = deals.find(d => d.$id === dealId);
      if (!deal) return;

      await databases.updateDocument(
        appwriteConfig.databaseId,
        'featuredDeals',
        dealId,
        { active: !deal.active }
      );

      setDeals(deals.map(d =>
        d.$id === dealId ? { ...d, active: !d.active } : d
      ));

      toast({
        title: "تم التحديث",
        description: `تم ${!deal.active ? 'تفعيل' : 'تعطيل'} العرض`,
      });
    } catch (error) {
      console.error('Error toggling deal:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث العرض",
        variant: "destructive",
      });
    }
  };

  const handleRemoveDeal = async (dealId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return;

    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        'featuredDeals',
        dealId
      );

      toast({
        title: "تم الحذف",
        description: "تم حذف العرض بنجاح",
      });

      fetchDeals();
    } catch (error) {
      console.error('Error removing deal:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف العرض",
        variant: "destructive",
      });
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newDeals = [...deals];
    [newDeals[index - 1], newDeals[index]] = [newDeals[index], newDeals[index - 1]];
    setDeals(newDeals);
    await updateOrders(newDeals);
  };

  const moveDown = async (index: number) => {
    if (index === deals.length - 1) return;
    const newDeals = [...deals];
    [newDeals[index], newDeals[index + 1]] = [newDeals[index + 1], newDeals[index]];
    setDeals(newDeals);
    await updateOrders(newDeals);
  };

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !deals.some(deal => deal.productId === product.$id)
  );

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">غير مصرح</h3>
            <p className="text-muted-foreground">هذه الصفحة متاحة للأدمن فقط</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">إدارة العروض الخاصة</h1>
        <p className="text-muted-foreground">
          اختر وترتيب المنتجات التي تظهر في صفحة العروض
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي العروض</p>
                <p className="text-2xl font-bold">{deals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">العروض المفعلة</p>
                <p className="text-2xl font-bold">{deals.filter(d => d.active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <EyeOff className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">العروض المعطلة</p>
                <p className="text-2xl font-bold">{deals.filter(d => !d.active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <Button onClick={() => setAddDialog(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          إضافة عرض جديد
        </Button>
      </div>

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>العروض الحالية</CardTitle>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">لا توجد عروض</h3>
              <p className="text-muted-foreground mb-4">ابدأ بإضافة منتجات للعروض الخاصة</p>
              <Button onClick={() => setAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة أول عرض
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead className="w-12">الترتيب</TableHead>
                      <TableHead>المنتج</TableHead>
                      <TableHead>السعر والخصم</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext items={deals.map(d => d.$id)} strategy={verticalListSortingStrategy}>
                      {deals.map((deal) => (
                        <SortableRow
                          key={deal.$id}
                          deal={deal}
                          onToggle={handleToggleActive}
                          onRemove={handleRemoveDeal}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </DndContext>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Deal Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إضافة عرض جديد</DialogTitle>
            <DialogDescription>
              اختر منتج لإضافته إلى صفحة العروض
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div>
              <Label>بحث عن منتج</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث بالاسم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Products List */}
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  {searchQuery ? 'لا توجد منتجات تطابق البحث' : 'لا توجد منتجات متاحة'}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredProducts.map((product) => {
                    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                    const discount = hasDiscount
                      ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                      : 0;

                    return (
                      <div
                        key={product.$id}
                        className={`p-4 hover:bg-muted cursor-pointer transition-colors ${selectedProduct?.$id === product.$id ? 'bg-primary/10 border-l-4 border-primary' : ''
                          }`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={getImageUrl(product.images?.[0] || product.image)}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{product.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold text-primary">{product.price.toFixed(2)} ج.م</span>
                              {hasDiscount && (
                                <>
                                  <span className="text-sm line-through text-muted-foreground">
                                    {product.originalPrice!.toFixed(2)} ج.م
                                  </span>
                                  <Badge className="bg-red-500 text-white">
                                    -{discount}%
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                          {selectedProduct?.$id === product.$id && (
                            <CheckCircle className="h-6 w-6 text-primary" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)} disabled={adding}>
              إلغاء
            </Button>
            <Button onClick={handleAddDeal} disabled={!selectedProduct || adding}>
              {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              إضافة العرض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
