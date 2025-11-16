/**
 * AI Dashboard Component
 * Central hub for all AI features and analytics
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  TrendingUp, 
  Brain,
  Zap,
  Target,
  BarChart3,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  MessageCircle,
  Image,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';

interface AIMetric {
  label: string;
  value: number;
  change: number;
  icon: any;
}

interface AIUsage {
  feature: string;
  count: number;
  limit: number;
  cost: number;
}

export function AIDashboard() {
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<
    | { status: 'ok' | 'warning' | 'error'; totalKeys: number; activeKeys: number; errorKeys: number; inactiveKeys: number; hasEnvFallback: boolean }
    | null
  >(null);
  const [statusError, setStatusError] = useState<string>('');
  const [metrics, setMetrics] = useState<AIMetric[]>([
    { label: 'وصف محسّن', value: 142, change: 12, icon: FileText },
    { label: 'صور مولّدة', value: 67, change: -5, icon: Image },
    { label: 'تحليلات منافسة', value: 34, change: 8, icon: Target },
    { label: 'محادثات AI', value: 289, change: 23, icon: MessageCircle },
  ]);

  const [usage, setUsage] = useState<AIUsage[]>([
    { feature: 'تحسين الوصف', count: 142, limit: 500, cost: 4.26 },
    { feature: 'توليد الصور', count: 67, limit: 100, cost: 2.68 },
    { feature: 'تحليل المنافسة', count: 34, limit: 200, cost: 1.70 },
    { feature: 'محادثات AI', count: 289, limit: 1000, cost: 2.89 },
  ]);

  const totalCost = usage.reduce((sum, u) => sum + u.cost, 0);
  const apiKeyConfigured = aiStatus ? (aiStatus.status !== 'error') : false;

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      setLoading(true);
      setStatusError('');
      try {
        const res = await fetch('/api/ai/status');
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!isMounted) return;
        setAiStatus(data);
      } catch (err: any) {
        console.error('Failed to load AI status', err);
        if (!isMounted) return;
        setStatusError(err.message || 'فشل في جلب حالة AI');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            لوحة تحكم الذكاء الاصطناعي
          </h2>
          <p className="text-muted-foreground mt-1">
            مراقبة وإدارة جميع ميزات الذكاء الاصطناعي
          </p>
        </div>
        <div className="flex items-center gap-3">
          {apiKeyConfigured ? (
            <Badge className={
              aiStatus?.status === 'warning'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : 'bg-green-100 text-green-800 border-green-200'
            }>
              <CheckCircle className="h-3 w-3 mr-1" />
              {aiStatus?.status === 'warning'
                ? 'متصل مع بعض المفاتيح المعطّلة'
                : 'API متصل'}
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              API غير مُعد
            </Badge>
          )}
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={() => {
              // إعادة تحميل الحالة فقط
              window.location.reload();
            }}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? '...جاري التحديث' : 'تحديث البيانات'}
          </Button>
        </div>
      </div>

      {statusError && (
        <div className="mb-2 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {statusError}
        </div>
      )}

      {aiStatus && !statusError && (
        <div className="mb-4 text-xs text-muted-foreground flex flex-wrap gap-4">
          <div>
            <span className="font-semibold">المفاتيح الفعّالة:</span>{' '}
            <span className="text-green-700">{aiStatus.activeKeys}</span>
          </div>
          <div>
            <span className="font-semibold">المفاتيح المعطّلة:</span>{' '}
            <span className="text-red-700">{aiStatus.errorKeys}</span>
          </div>
          <div>
            <span className="font-semibold">المفاتيح غير المجرَّبة/غير النشطة:</span>{' '}
            <span className="text-gray-700">{aiStatus.inactiveKeys}</span>
          </div>
          <div>
            <span className="font-semibold">إجمالي المفاتيح:</span>{' '}
            <span>{aiStatus.totalKeys}</span>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;
          
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Badge 
                        variant={isPositive ? 'default' : 'destructive'} 
                        className="text-xs"
                      >
                        {isPositive ? '↑' : '↓'} {Math.abs(metric.change)}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        هذا الأسبوع
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="usage">الاستخدام</TabsTrigger>
          <TabsTrigger value="insights">رؤى ذكية</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  استخدام الميزات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {usage.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.feature}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} / {item.limit}
                      </span>
                    </div>
                    <Progress 
                      value={(item.count / item.limit) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  تحليل التكلفة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      التكلفة الإجمالية هذا الشهر
                    </p>
                    <p className="text-3xl font-bold text-purple-900">
                      ${totalCost.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {usage.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm">{item.feature}</span>
                        <span className="text-sm font-medium">
                          ${item.cost.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    عرض التفاصيل الكاملة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                النشاط الأخير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'تحسين وصف منتج', product: 'ساعة ذكية رياضية', time: 'منذ 5 دقائق', icon: FileText },
                  { action: 'توليد صورة', product: 'سماعات بلوتوث', time: 'منذ 12 دقيقة', icon: Image },
                  { action: 'تحليل منافسة', product: 'كاميرا مراقبة', time: 'منذ ساعة', icon: Target },
                  { action: 'محادثة AI', product: 'لابتوب جيمنج', time: 'منذ ساعتين', icon: MessageCircle },
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Icon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.product}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الاستخدام التفصيلية</CardTitle>
              <CardDescription>
                تفاصيل استخدام كل ميزة من ميزات الذكاء الاصطناعي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Usage Stats Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-right p-3 text-sm font-medium">الميزة</th>
                        <th className="text-center p-3 text-sm font-medium">اليوم</th>
                        <th className="text-center p-3 text-sm font-medium">الأسبوع</th>
                        <th className="text-center p-3 text-sm font-medium">الشهر</th>
                        <th className="text-center p-3 text-sm font-medium">التكلفة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3 font-medium">تحسين الوصف</td>
                        <td className="p-3 text-center">23</td>
                        <td className="p-3 text-center">142</td>
                        <td className="p-3 text-center">487</td>
                        <td className="p-3 text-center text-green-600">$14.61</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">توليد الصور</td>
                        <td className="p-3 text-center">8</td>
                        <td className="p-3 text-center">67</td>
                        <td className="p-3 text-center">234</td>
                        <td className="p-3 text-center text-green-600">$9.36</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">تحليل المنافسة</td>
                        <td className="p-3 text-center">5</td>
                        <td className="p-3 text-center">34</td>
                        <td className="p-3 text-center">98</td>
                        <td className="p-3 text-center text-green-600">$4.90</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">محادثات AI</td>
                        <td className="p-3 text-center">45</td>
                        <td className="p-3 text-center">289</td>
                        <td className="p-3 text-center">1023</td>
                        <td className="p-3 text-center text-green-600">$10.23</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Recommendations */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 توصيات لتقليل التكلفة</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• استخدم GPT-3.5 بدلاً من GPT-4 للمهام البسيطة</li>
                    <li>• فعّل التخزين المؤقت للاستعلامات المتكررة</li>
                    <li>• قلل حجم الصور المولدة عند الإمكان</li>
                    <li>• استخدم الأسئلة المحددة في المحادثات</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                رؤى ذكية
              </CardTitle>
              <CardDescription>
                تحليلات وتوصيات مبنية على البيانات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  type: 'success',
                  title: 'أداء ممتاز في تحسين الأوصاف',
                  description: 'المنتجات المحسّنة حققت زيادة 34% في المشاهدات',
                  action: 'عرض التفاصيل'
                },
                {
                  type: 'warning',
                  title: 'فرصة لتحسين الصور',
                  description: '67% من المنتجات تحتاج صور أفضل جودة',
                  action: 'بدء التحسين'
                },
                {
                  type: 'info',
                  title: 'اقتراح: استخدم التحليل التنافسي',
                  description: 'المنافسون يستخدمون كلمات مفتاحية جديدة',
                  action: 'تحليل المنافسين'
                },
              ].map((insight, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    insight.type === 'success' ? 'bg-green-50 border-green-200' :
                    insight.type === 'warning' ? 'bg-orange-50 border-orange-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-semibold mb-1 ${
                        insight.type === 'success' ? 'text-green-900' :
                        insight.type === 'warning' ? 'text-orange-900' :
                        'text-blue-900'
                      }`}>
                        {insight.title}
                      </h4>
                      <p className={`text-sm ${
                        insight.type === 'success' ? 'text-green-700' :
                        insight.type === 'warning' ? 'text-orange-700' :
                        'text-blue-700'
                      }`}>
                        {insight.description}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      {insight.action}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الذكاء الاصطناعي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">OpenAI Model</p>
                    <p className="text-sm text-muted-foreground">اختر النموذج المناسب</p>
                  </div>
                  <select className="px-3 py-1 border rounded-md">
                    <option>GPT-4 (أفضل جودة)</option>
                    <option>GPT-3.5 (أسرع وأرخص)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">التخزين المؤقت</p>
                    <p className="text-sm text-muted-foreground">حفظ النتائج لتقليل التكلفة</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">حد الاستخدام اليومي</p>
                    <p className="text-sm text-muted-foreground">تحديد الحد الأقصى للطلبات</p>
                  </div>
                  <input 
                    type="number" 
                    defaultValue="100" 
                    className="w-20 px-2 py-1 border rounded-md text-center"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">الإشعارات</p>
                    <p className="text-sm text-muted-foreground">تنبيهات الاستخدام والتكلفة</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
