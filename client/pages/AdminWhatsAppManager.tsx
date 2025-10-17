/**
 * Admin WhatsApp Manager
 * 
 * إدارة رسائل الواتساب:
 * - إرسال رسائل فردية
 * - إرسال رسائل جماعية
 * - عرض قوالب الرسائل
 * - إحصائيات الرسائل
 */

import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  MessageCircle,
  Send,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload,
  FileText,
} from 'lucide-react';
import {
  sendWhatsAppMessage,
  sendOrderConfirmation,
  sendAccountApprovalNotification,
  sendAccountRejectionNotification,
  sendCommissionNotification,
  sendBulkMessages,
  formatPhoneNumber,
} from '@/lib/whatsapp-service';

export default function AdminWhatsAppManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Single Message State
  const [singlePhone, setSinglePhone] = useState('');
  const [singleMessage, setSingleMessage] = useState('');

  // Bulk Message State
  const [bulkRecipients, setBulkRecipients] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');
  const [bulkDelay, setBulkDelay] = useState('1000');

  // Template State
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Message Templates
  const templates = {
    welcome: {
      ar: '🎉 مرحباً بك في EgyGo!\n\nشكراً لانضمامك إلينا. نحن سعداء بوجودك معنا.\n\nاستمتع بتجربة تسوق فريدة!',
      en: '🎉 Welcome to EgyGo!\n\nThank you for joining us. We are happy to have you.\n\nEnjoy a unique shopping experience!',
    },
    orderShipped: {
      ar: '📦 تم شحن طلبك!\n\nرقم الطلب: {orderId}\nرقم التتبع: {trackingNumber}\n\nيمكنك تتبع شحنتك الآن.',
      en: '📦 Your order has been shipped!\n\nOrder: {orderId}\nTracking: {trackingNumber}\n\nYou can track your shipment now.',
    },
    flashSale: {
      ar: '🔥 عرض خاص لـ 24 ساعة فقط!\n\nخصم يصل لـ 50% على منتجات مختارة.\n\nلا تفوت الفرصة!',
      en: '🔥 Special offer for 24 hours only!\n\nUp to 50% off on selected products.\n\nDon\'t miss out!',
    },
    paymentReminder: {
      ar: '💳 تذكير بالدفع\n\nرقم الطلب: {orderId}\nالمبلغ: {amount} ج.م\n\nيرجى إتمام الدفع لإكمال طلبك.',
      en: '💳 Payment Reminder\n\nOrder: {orderId}\nAmount: {amount} EGP\n\nPlease complete payment to finalize your order.',
    },
  };

  // Send Single Message
  const handleSendSingle = async () => {
    if (!singlePhone || !singleMessage) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال رقم الهاتف والرسالة',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const success = await sendWhatsAppMessage(singlePhone, singleMessage);
      
      if (success) {
        toast({
          title: 'تم الإرسال',
          description: 'تم إرسال الرسالة بنجاح',
        });
        setSingleMessage('');
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في إرسال الرسالة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Send Bulk Messages
  const handleSendBulk = async () => {
    if (!bulkRecipients || !bulkMessage) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال أرقام الهواتف والرسالة',
        variant: 'destructive',
      });
      return;
    }

    const phones = bulkRecipients
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (phones.length === 0) {
      toast({
        title: 'خطأ',
        description: 'لا توجد أرقام صالحة',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const recipients = phones.map(phone => ({
        phone,
        message: bulkMessage,
      }));

      const result = await sendBulkMessages(recipients, parseInt(bulkDelay));

      toast({
        title: 'اكتمل الإرسال',
        description: `تم إرسال ${result.success} رسالة بنجاح، فشل ${result.failed}`,
      });

      setBulkRecipients('');
      setBulkMessage('');
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في إرسال الرسائل',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply Template
  const applyTemplate = (templateKey: string, isBulk: boolean = false) => {
    const template = templates[templateKey as keyof typeof templates];
    if (template) {
      if (isBulk) {
        setBulkMessage(template.ar);
      } else {
        setSingleMessage(template.ar);
      }
      toast({
        title: 'تم التطبيق',
        description: 'تم تطبيق القالب',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">إدارة WhatsApp</h1>
          <p className="text-muted-foreground">
            إرسال وإدارة رسائل واتساب للعملاء
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">رسائل اليوم</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12% من الأمس</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نسبة النجاح</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">معدل التوصيل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستلمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">إجمالي العملاء</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="single" className="space-y-4">
          <TabsList>
            <TabsTrigger value="single">رسالة فردية</TabsTrigger>
            <TabsTrigger value="bulk">رسالة جماعية</TabsTrigger>
            <TabsTrigger value="templates">القوالب</TabsTrigger>
            <TabsTrigger value="history">السجل</TabsTrigger>
          </TabsList>

          {/* Single Message Tab */}
          <TabsContent value="single" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إرسال رسالة فردية</CardTitle>
                <CardDescription>
                  أرسل رسالة واتساب لعميل واحد
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="singlePhone">رقم الهاتف</Label>
                  <Input
                    id="singlePhone"
                    placeholder="01234567890"
                    value={singlePhone}
                    onChange={(e) => setSinglePhone(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    سيتم إضافة كود مصر (+20) تلقائياً
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="singleMessage">الرسالة</Label>
                  <Textarea
                    id="singleMessage"
                    placeholder="اكتب رسالتك هنا..."
                    rows={6}
                    value={singleMessage}
                    onChange={(e) => setSingleMessage(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {singleMessage.length} حرف
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>قوالب سريعة</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(templates).map((key) => (
                      <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        onClick={() => applyTemplate(key, false)}
                      >
                        <FileText className="h-4 w-4 ml-2" />
                        {key === 'welcome' && 'ترحيب'}
                        {key === 'orderShipped' && 'شحن الطلب'}
                        {key === 'flashSale' && 'عرض خاص'}
                        {key === 'paymentReminder' && 'تذكير بالدفع'}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSendSingle}
                  disabled={loading || !singlePhone || !singleMessage}
                  className="w-full"
                >
                  <Send className="h-4 w-4 ml-2" />
                  {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bulk Message Tab */}
          <TabsContent value="bulk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إرسال رسالة جماعية</CardTitle>
                <CardDescription>
                  أرسل نفس الرسالة لعدة عملاء دفعة واحدة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulkRecipients">أرقام الهواتف</Label>
                  <Textarea
                    id="bulkRecipients"
                    placeholder="01234567890&#10;01098765432&#10;01555555555"
                    rows={6}
                    value={bulkRecipients}
                    onChange={(e) => setBulkRecipients(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    أدخل رقم واحد في كل سطر (
                    {bulkRecipients.split('\n').filter(p => p.trim()).length} رقم)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulkMessage">الرسالة</Label>
                  <Textarea
                    id="bulkMessage"
                    placeholder="اكتب رسالتك هنا..."
                    rows={6}
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulkDelay">التأخير بين الرسائل (ميلي ثانية)</Label>
                  <Input
                    id="bulkDelay"
                    type="number"
                    value={bulkDelay}
                    onChange={(e) => setBulkDelay(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    موصى به: 1000-2000 لتجنب الحظر
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>قوالب سريعة</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(templates).map((key) => (
                      <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        onClick={() => applyTemplate(key, true)}
                      >
                        <FileText className="h-4 w-4 ml-2" />
                        {key === 'welcome' && 'ترحيب'}
                        {key === 'orderShipped' && 'شحن الطلب'}
                        {key === 'flashSale' && 'عرض خاص'}
                        {key === 'paymentReminder' && 'تذكير بالدفع'}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSendBulk}
                  disabled={loading || !bulkRecipients || !bulkMessage}
                  className="w-full"
                >
                  <Send className="h-4 w-4 ml-2" />
                  {loading ? 'جاري الإرسال...' : 'إرسال للجميع'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>قوالب الرسائل</CardTitle>
                <CardDescription>
                  قوالب جاهزة يمكنك استخدامها
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(templates).map(([key, template]) => (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {key === 'welcome' && '🎉 رسالة ترحيب'}
                        {key === 'orderShipped' && '📦 شحن الطلب'}
                        {key === 'flashSale' && '🔥 عرض خاص'}
                        {key === 'paymentReminder' && '💳 تذكير بالدفع'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="bg-muted p-3 rounded-md font-mono text-sm whitespace-pre-wrap">
                        {template.ar}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyTemplate(key, false)}
                        >
                          استخدام في رسالة فردية
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyTemplate(key, true)}
                        >
                          استخدام في رسالة جماعية
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>سجل الرسائل</CardTitle>
                <CardDescription>
                  آخر الرسائل المرسلة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">+20 123 456 789{i}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          مرحباً! طلبك رقم #{1000 + i} في الطريق إليك...
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 ml-1" />
                            منذ {i} ساعة
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            تم التوصيل
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
