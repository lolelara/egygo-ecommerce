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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1
  });
  
  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/vendoor-products?page=${pagination.page}&limit=${pagination.limit}&status=${statusFilter}`
      );
      const data = await response.json();
      
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('فشل تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/vendoor-settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };
  
  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, [pagination.page, statusFilter]);
  
  // Apply profit margin to all products
  const handleApplyProfitMargin = async () => {
    if (!confirm(`هل أنت متأكد من تطبيق ${settings.profitValue}${settings.profitType === 'percentage' ? '%' : ' جنيه'} على جميع منتجات Vendoor؟`)) {
      return;
    }
    
    try {
      setApplying(true);
      const response = await fetch('/api/apply-profit-margin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profitType: settings.profitType,
          profitValue: settings.profitValue
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(`تم تحديث ${result.updatedCount} منتج بنجاح!`);
        fetchProducts();
      } else {
        toast.error('حدث خطأ أثناء التحديث');
      }
    } catch (error) {
      console.error('Error applying profit margin:', error);
      toast.error('فشل تطبيق هامش الربح');
    } finally {
      setApplying(false);
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
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('فشل حفظ الإعدادات');
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
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(`تم تحديث ${result.updatedCount} منتج`);
        setSelectedProducts([]);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('فشل تحديث الحالة');
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
