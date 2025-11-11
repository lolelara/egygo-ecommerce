import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink, TrendingUp, Eye } from 'lucide-react';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function VendoorProductsCard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    loading: true
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total Vendoor products
      const totalResp: any = await databases.listDocuments(
        DATABASE_ID,
        'products',
        [Query.equal('source', 'vendoor'), Query.limit(1)]
      );

      // Get published count
      const publishedResp: any = await databases.listDocuments(
        DATABASE_ID,
        'products',
        [Query.equal('source', 'vendoor'), Query.equal('status', 'approved'), Query.limit(1)]
      );

      setStats({
        total: totalResp.total || 0,
        published: publishedResp.total || 0,
        draft: (totalResp.total || 0) - (publishedResp.total || 0),
        loading: false
      });
    } catch (error) {
      console.error('Error fetching Vendoor stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <Link to="/admin/vendoor-products">
      <Card className="hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-red-500 cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">منتجات Vendoor</h3>
                <p className="text-sm text-gray-500">المستوردة من Vendoor</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          </div>

          {stats.loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Total Products */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">إجمالي المنتجات</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{stats.total}</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">منشور</p>
                    <p className="text-lg font-bold text-green-600">{stats.published}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">مسودة</p>
                    <p className="text-lg font-bold text-gray-700">{stats.draft}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">اضغط لعرض التفاصيل</span>
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                    جديد
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
