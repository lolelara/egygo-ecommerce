import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  Package,
  DollarSign,
  Percent,
  Check,
  X,
  Trash2,
  Eye,
  RefreshCw,
  Settings,
  Filter,
  Search,
  ExternalLink,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VendoorProduct {
  $id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  profitMargin?: number;
  profitType?: 'percentage' | 'fixed';
  status: string;
  totalStock: number;
  images: string[];
  $createdAt: string;
}

interface VendoorSettings {
  profitType: 'percentage' | 'fixed';
  profitValue: number;
  autoApply: boolean;
}

export default function VendoorProducts() {
  const [products, setProducts] = useState<VendoorProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState<VendoorSettings>({
    profitType: 'percentage',
    profitValue: 5,
    autoApply: false
  });
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1
  });
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Fallback: Fetch products directly from Appwrite when /api is unavailable
  const fetchProductsFromAppwrite = async () => {
    const queries = [
      Query.equal('source', 'vendoor'),
      Query.limit(pagination.limit),
      Query.offset((pagination.page - 1) * pagination.limit),
      Query.orderDesc('$createdAt')
    ];
    if (statusFilter !== 'all') {
      queries.push(Query.equal('status', statusFilter));
    }
    const resp: any = await databases.listDocuments(DATABASE_ID, 'products', queries);
    const total = resp.total ?? (resp.documents?.length || 0);
    setProducts(resp.documents || []);
    setPagination(prev => ({
      ...prev,
      total,
      pages: Math.max(1, Math.ceil(total / prev.limit))
    }));
  };

  // Fallback: Fetch settings directly from Appwrite
  const fetchSettingsFromAppwrite = async () => {
    const resp: any = await databases.listDocuments(DATABASE_ID, 'vendoor_settings', [Query.limit(1)]);
    if (resp.documents && resp.documents.length > 0) {
      const s = resp.documents[0];
      setSettings({
        profitType: (s.profitType as 'percentage' | 'fixed') ?? 'percentage',
        profitValue: Number(s.profitValue ?? 5),
        autoApply: Boolean(s.autoApply ?? false)
      });
    }
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const updateWithRetry = async (collection: string, id: string, data: any, maxRetries = 5) => {
    let attempt = 0;
    let delay = 500;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        return await databases.updateDocument(DATABASE_ID, collection, id, data);
      } catch (e: any) {
        const code = (e && (e.code || e.response?.status)) || 0;
        if (code === 429 && attempt < maxRetries) {
          await sleep(delay);
          delay = Math.min(delay * 2, 4000);
          attempt++;
          continue;
        }
        throw e;
      }
    }
  };

  // Update settings directly in Appwrite
  const updateSettingsInAppwrite = async () => {
    const list: any = await databases.listDocuments(DATABASE_ID, 'vendoor_settings', [Query.limit(1)]);
    const payload = {
      profitType: settings.profitType,
      profitValue: Number(settings.profitValue),
      autoApply: Boolean(settings.autoApply)
    } as any;
    if (list.documents && list.documents.length > 0) {
      const id = list.documents[0].$id;
      await databases.updateDocument(DATABASE_ID, 'vendoor_settings', id, payload);
    } else {
      await databases.createDocument(DATABASE_ID, 'vendoor_settings', 'default', payload);
    }
  };

  // Bulk delete products directly in Appwrite
  const bulkDeleteInAppwrite = async () => {
    setStatusUpdating(true);
    let deleted = 0;
    let counter = 0;
    for (const id of selectedProducts) {
      try {
        await databases.deleteDocument(DATABASE_ID, 'products', id);
        deleted++;
      } catch (e) {
        // ignore individual failures
      }
      counter++;
      await sleep(500);
      if (counter % 10 === 0) {
        await sleep(2000);
      }
    }
    toast.success(`تم حذف ${deleted} منتج`);
    await fetchProductsFromAppwrite();
    setSelectedProducts([]);
    setStatusUpdating(false);
  };

  // Bulk update product status directly in Appwrite
  const bulkUpdateStatusInAppwrite = async (status: string) => {
    setStatusUpdating(true);
    let updated = 0;
    let counter = 0;
    for (const id of selectedProducts) {
      try {
        await updateWithRetry('products', id, { status });
        updated++;
      } catch (e) {
        // ignore individual failures
      }
      counter++;
      await sleep(500);
      if (counter % 10 === 0) {
        await sleep(2000);
      }
    }
    toast.success(`تم تحديث ${updated} منتج`);
    await fetchProductsFromAppwrite();
    setSelectedProducts([]);
    setStatusUpdating(false);
  };

  // Apply profit margin to all Vendoor products in Appwrite
  const applyProfitMarginInAppwrite = async (ids?: string[]) => {
    setApplying(true);
    const limit = 50;
    let offset = 0;
    let total = 0;
    let updated = 0;
    try {
      do {
        let docs: any[] = [];
        if (ids && ids.length > 0) {
          const slice = ids.slice(offset, offset + limit);
          // Fetch specific documents by ID in small batches
          for (const docId of slice) {
            try {
              const d: any = await databases.getDocument(DATABASE_ID, 'products', docId);
              docs.push(d);
              await sleep(200);
            } catch { }
          }
          total = ids.length;
        } else {
          const resp: any = await databases.listDocuments(DATABASE_ID, 'products', [
            Query.equal('source', 'vendoor'),
            Query.limit(limit),
            Query.offset(offset)
          ]);
          docs = resp.documents || [];
          total = resp.total ?? (offset + docs.length);
        }
        for (const doc of docs) {
          const basePrice = Number(doc.originalPrice ?? doc.price ?? 0);
          if (!basePrice || basePrice <= 0) continue;
          const newPrice = settings.profitType === 'percentage'
            ? Math.round(basePrice * (1 + Number(settings.profitValue) / 100))
            : Math.round(basePrice + Number(settings.profitValue));
          // Skip if already up-to-date
          const already = Number(doc.price) === newPrice
            && Number(doc.originalPrice ?? doc.price) === Number(doc.originalPrice ?? doc.price)
            && Number(doc.profitMargin ?? -1) === Number(settings.profitValue)
            && String(doc.profitType ?? '') === String(settings.profitType);
          if (!already) {
            try {
              await updateWithRetry('products', doc.$id, {
                price: newPrice,
                originalPrice: basePrice,
                profitMargin: Number(settings.profitValue),
                profitType: settings.profitType
              });
              updated++;
            } catch (e) {
              // ignore single update failure
            }
          }
          await sleep(500);
        }
        offset += docs.length;
        await sleep(1500);
      } while (offset < total);
      toast.success(`تم تحديث الأسعار لـ ${updated} منتج`);
      await fetchProductsFromAppwrite();
    } finally {
      setApplying(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/vendoor-products?page=${pagination.page}&limit=${pagination.limit}&status=${statusFilter}`
      );
      if (!response.ok) {
        // Fallback to Appwrite if API is not available in production
        await fetchProductsFromAppwrite();
        return;
      }
      const data = await response.json();
      if (!data || !data.products) {
        await fetchProductsFromAppwrite();
        return;
      }
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback quietly to Appwrite on failures
      try {
        await fetchProductsFromAppwrite();
      } catch (e) {
        toast.error('فشل تحميل المنتجات');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/vendoor-settings');
      if (!response.ok) {
        await fetchSettingsFromAppwrite();
        return;
      }
      const data = await response.json();
      if (!data) {
        await fetchSettingsFromAppwrite();
        return;
      }
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      try {
        await fetchSettingsFromAppwrite();
      } catch { }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, [pagination.page, statusFilter]);

  // Update pagination when itemsPerPage changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      page: 1,
      limit: itemsPerPage === -1 ? 99999 : itemsPerPage
    }));
  }, [itemsPerPage]);

  // Apply profit margin to all products
  const handleApplyProfitMargin = async () => {
    const applyOnSelected = selectedProducts.length > 0;
    const confirmText = applyOnSelected
      ? `هل أنت متأكد من تطبيق ${settings.profitValue}${settings.profitType === 'percentage' ? '%' : ' جنيه'} على ${selectedProducts.length} منتج محدد؟`
      : `هل أنت متأكد من تطبيق ${settings.profitValue}${settings.profitType === 'percentage' ? '%' : ' جنيه'} على جميع منتجات Vendoor؟`;
    if (!confirm(confirmText)) {
      return;
    }

    try {
      setApplying(true);
      const response = await fetch('/api/apply-profit-margin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profitType: settings.profitType,
          profitValue: settings.profitValue,
          productIds: applyOnSelected ? selectedProducts : undefined
        })
      });

      if (!response.ok) {
        // Fallback to Appwrite direct updates
        await applyProfitMarginInAppwrite(applyOnSelected ? selectedProducts : undefined);
        return;
      }
      const result = await response.json();
      if (result && result.success) {
        toast.success(`تم تحديث ${result.updatedCount} منتج بنجاح!`);
        fetchProducts();
      } else {
        await applyProfitMarginInAppwrite(applyOnSelected ? selectedProducts : undefined);
      }
    } catch (error) {
      console.error('Error applying profit margin:', error);
      await applyProfitMarginInAppwrite(applyOnSelected ? selectedProducts : undefined);
    } finally {
      // set by applyProfitMarginInAppwrite or above
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/vendoor-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('تم حفظ الإعدادات!');
      } else {
        await updateSettingsInAppwrite();
        toast.success('تم حفظ الإعدادات مباشرة في Appwrite');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      try {
        await updateSettingsInAppwrite();
        toast.success('تم حفظ الإعدادات مباشرة في Appwrite');
      } catch {
        toast.error('فشل حفظ الإعدادات');
      }
    }
  };

  // Bulk status update
  const handleBulkStatus = async (status: string) => {
    if (selectedProducts.length === 0) {
      toast.error('الرجاء اختيار منتجات أولاً');
      return;
    }

    try {
      const response = await fetch('/api/vendoor-products/bulk-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedProducts,
          status
        })
      });

      if (!response.ok) {
        await bulkUpdateStatusInAppwrite(status);
        return;
      }
      const result = await response.json();
      if (result && result.success) {
        toast.success(`تم تحديث ${result.updatedCount} منتج`);
        setSelectedProducts([]);
        fetchProducts();
      } else {
        await bulkUpdateStatusInAppwrite(status);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      await bulkUpdateStatusInAppwrite(status);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('الرجاء اختيار منتجات أولاً');
      return;
    }

    if (!confirm(`هل أنت متأكد من حذف ${selectedProducts.length} منتج؟ لا يمكن التراجع عن هذا الإجراء!`)) {
      return;
    }

    try {
      const response = await fetch('/api/vendoor-products/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedProducts
        })
      });

      if (!response.ok) {
        await bulkDeleteInAppwrite();
        return;
      }
      const result = await response.json();
      if (result && result.success) {
        toast.success(`تم حذف ${result.deletedCount} منتج`);
        setSelectedProducts([]);
        fetchProducts();
      } else {
        await bulkDeleteInAppwrite();
      }
    } catch (error) {
      console.error('Error deleting products:', error);
      await bulkDeleteInAppwrite();
    }
  };

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Toggle all products
  const toggleAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.$id));
    }
  };

  // Calculate display price
  const calculateDisplayPrice = (product: VendoorProduct) => {
    const basePrice = product.originalPrice || product.price;
    const margin = product.profitMargin || settings.profitValue;
    const type = product.profitType || settings.profitType;

    if (type === 'percentage') {
      return Math.round(basePrice * (1 + margin / 100));
    } else {
      return Math.round(basePrice + margin);
    }
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term)
    );
  });

  // Calculate stats
  const stats = {
    total: products.length,
    value: products.reduce((sum, p) => sum + (p.price * p.totalStock), 0),
    published: products.filter(p => p.status === 'published' || p.status === 'approved').length,
    draft: products.filter(p => p.status !== 'published' && p.status !== 'approved').length
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header & Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white shadow-sm border-none">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">إجمالي المنتجات</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-none">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">قيمة المخزون</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.value.toLocaleString()} ج.م</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-none">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">منشور</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.published}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-none">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">مسودة</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.draft}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">

          {/* Sidebar Settings */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <h2 className="font-semibold text-gray-900">إعدادات التسعير</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع الهامش
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSettings({ ...settings, profitType: 'percentage' })}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${settings.profitType === 'percentage'
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        نسبة %
                      </button>
                      <button
                        onClick={() => setSettings({ ...settings, profitType: 'fixed' })}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${settings.profitType === 'fixed'
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        مبلغ ثابت
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      قيمة الهامش
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.profitValue}
                        onChange={(e) => setSettings({ ...settings, profitValue: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {settings.profitType === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1">مثال للسعر:</p>
                      <div className="flex items-center justify-between text-sm">
                        <span>100 ج.م</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-green-600">
                          {settings.profitType === 'percentage'
                            ? Math.round(100 * (1 + settings.profitValue / 100))
                            : 100 + settings.profitValue} ج.م
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium mb-2"
                    >
                      حفظ الإعدادات
                    </button>

                    <button
                      onClick={handleApplyProfitMargin}
                      disabled={applying}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {applying ? 'جاري التطبيق...' : 'تطبيق على الكل'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products List */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="بحث باسم المنتج أو SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="published">منشور</option>
                      <option value="draft">مسودة</option>
                    </select>

                    <button
                      onClick={fetchProducts}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="تحديث"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg mb-4 animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm font-medium">{selectedProducts.length} منتج محدد</span>
                    <div className="h-4 w-px bg-blue-200" />
                    <button onClick={() => handleBulkStatus('published')} className="text-sm hover:underline">نشر</button>
                    <button onClick={() => handleBulkStatus('draft')} className="text-sm hover:underline">إخفاء</button>
                    <button onClick={handleBulkDelete} className="text-sm text-red-600 hover:underline">حذف</button>
                    <div className="flex-1" />
                    <button onClick={() => setSelectedProducts([])} className="text-sm opacity-70 hover:opacity-100">إلغاء</button>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 text-right">
                        <th className="py-3 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                            onChange={toggleAllProducts}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-500">المنتج</th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-500">السعر</th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-500">المخزون</th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-500">الحالة</th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-500">التاريخ</th>
                        <th className="py-3 px-4 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                            جاري التحميل...
                          </td>
                        </tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-500">
                            لا توجد منتجات مطابقة للبحث
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr key={product.$id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.$id)}
                                onChange={() => toggleProductSelection(product.$id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                  <img
                                    src={product.images[0] || 'https://via.placeholder.com/50'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 truncate max-w-[200px]" title={product.name}>
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-500 font-mono">{product.sku}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-900">{calculateDisplayPrice(product)} ج.م</span>
                                <span className="text-xs text-gray-400 line-through">{product.originalPrice || product.price} ج.م</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={product.totalStock > 0 ? 'secondary' : 'destructive'} className="font-normal">
                                {product.totalStock} قطعة
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {product.status === 'published' || product.status === 'approved' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                  منشور
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                  مسودة
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">
                              {new Date(product.$createdAt).toLocaleDateString('ar-EG')}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500">
                    عرض {filteredProducts.length} من أصل {pagination.total} منتج
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      السابق
                    </button>
                    <button
                      onClick={() => setPagination(p => ({ ...p, page: Math.min(pagination.pages, p.page + 1) }))}
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
