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
  Filter
} from 'lucide-react';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';

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
            } catch {}
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
      } catch {}
    }
  };
  
  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, [pagination.page, statusFilter]);
  
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
  
  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">إدارة منتجات Vendoor</h1>
            </div>
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث
            </button>
          </div>
          
          {/* Profit Margin Settings */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">إعدادات هامش الربح</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Profit Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الهامش
                </label>
                <select
                  value={settings.profitType}
                  onChange={(e) => setSettings({
                    ...settings,
                    profitType: e.target.value as 'percentage' | 'fixed'
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (جنيه)</option>
                </select>
              </div>
              
              {/* Profit Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قيمة الهامش
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={settings.profitValue}
                    onChange={(e) => setSettings({
                      ...settings,
                      profitValue: Number(e.target.value)
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    min="0"
                    step="0.1"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {settings.profitType === 'percentage' ? (
                      <Percent className="w-4 h-4 text-gray-400" />
                    ) : (
                      <DollarSign className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-end gap-2">
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  حفظ الإعدادات
                </button>
                <button
                  onClick={handleApplyProfitMargin}
                  disabled={applying}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {applying ? 'جاري التطبيق...' : 'تطبيق على الكل'}
                </button>
              </div>
            </div>
            
            {/* Preview */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                مثال: منتج بسعر <strong>100 جنيه</strong> سيصبح{' '}
                <strong className="text-red-600">
                  {settings.profitType === 'percentage'
                    ? Math.round(100 * (1 + settings.profitValue / 100))
                    : 100 + settings.profitValue}{' '}
                  جنيه
                </strong>
              </p>
            </div>
          </div>
        </div>
        
        {/* Filters & Bulk Actions */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">جميع المنتجات</option>
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
              </select>
            </div>
            
            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  تم اختيار {selectedProducts.length} منتج
                </span>
                <button
                  onClick={() => handleBulkStatus('published')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  نشر المحدد
                </button>
                <button
                  onClick={() => handleBulkStatus('draft')}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
                >
                  إخفاء المحدد
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={statusUpdating}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف المحدد
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              لا توجد منتجات من Vendoor
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-right">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length}
                        onChange={toggleAllProducts}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      صورة
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      اسم المنتج
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      السعر الأصلي
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      الهامش
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      السعر النهائي
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      المخزون
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.$id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.$id)}
                          onChange={() => toggleProductSelection(product.$id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={product.images[0] || 'https://via.placeholder.com/50'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-gray-600">
                          {product.sku}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900">
                          {product.originalPrice || product.price} ج
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-red-600">
                          +{product.profitMargin || settings.profitValue}
                          {(product.profitType || settings.profitType) === 'percentage' ? '%' : ' ج'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-green-600">
                          {calculateDisplayPrice(product)} ج
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {product.totalStock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {product.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            <Check className="w-3 h-3" />
                            منشور
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            <Eye className="w-3 h-3" />
                            مسودة
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                صفحة {pagination.page} من {pagination.pages} ({pagination.total} منتج)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  السابق
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
