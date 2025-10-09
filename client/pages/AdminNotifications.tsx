import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Bell, Send, Users, UserCheck, ShoppingBag, TrendingUp,
  AlertCircle, CheckCircle, Clock, Eye, BellRing, Mail,
  MessageSquare, Smartphone, Trash2, Calendar, Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { notificationsApi, type NotificationTemplate } from "@/lib/notifications-api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion';
  targetAudience: 'all' | 'customers' | 'affiliates' | 'merchants' | 'specific';
  specificUsers?: string[];
  channels: ('inApp' | 'email' | 'sms' | 'push')[];
  status: 'draft' | 'sent' | 'scheduled';
  sentAt?: string;
  readCount: number;
  totalRecipients: number;
  createdAt: string;
}

export default function AdminNotifications() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'عرض خاص لنهاية الأسبوع',
      message: 'خصم 20% على جميع المنتجات',
      type: 'promotion',
      targetAudience: 'all',
      channels: ['inApp', 'email'],
      status: 'sent',
      sentAt: new Date().toISOString(),
      readCount: 450,
      totalRecipients: 1200,
      createdAt: new Date().toISOString()
    }
  ]);

  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [scheduledNotifications, setScheduledNotifications] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<Notification['type']>('info');
  const [targetAudience, setTargetAudience] = useState<Notification['targetAudience']>('all');
  const [channels, setChannels] = useState<string[]>(['inApp']);
  const [specificEmails, setSpecificEmails] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    loadTemplates();
    loadScheduledNotifications();
  }, []);

  const loadTemplates = async () => {
    try {
      const templatesData = await notificationsApi.getNotificationTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadScheduledNotifications = async () => {
    try {
      const scheduled = await notificationsApi.getScheduledNotifications();
      setScheduledNotifications(scheduled);
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    }
  };

  const handleSendNotification = async (scheduled = false) => {
    if (!title || !message) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة"
      });
      return;
    }

    if (scheduled && (!scheduleDate || !scheduleTime)) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى تحديد تاريخ ووقت الإرسال"
      });
      return;
    }

    setLoading(true);
    try {
      if (scheduled) {
        const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`);
        await notificationsApi.scheduleNotification({
          title,
          message,
          type,
          targetAudience,
          specificUsers: targetAudience === 'specific' ? specificEmails.split(',').map(e => e.trim()) : undefined,
          channels: channels as any[],
          isRead: false,
          totalRecipients: 0
        }, scheduledFor);

        toast({
          title: "تم الجدولة بنجاح",
          description: `سيتم إرسال الإشعار في ${scheduledFor.toLocaleString('ar-EG')}`,
        });

        loadScheduledNotifications();
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newNotification: Notification = {
          id: Date.now().toString(),
          title,
          message,
          type,
          targetAudience,
          specificUsers: targetAudience === 'specific' ? specificEmails.split(',').map(e => e.trim()) : undefined,
          channels: channels as any[],
          status: 'sent',
          sentAt: new Date().toISOString(),
          readCount: 0,
          totalRecipients: targetAudience === 'all' ? 1200 : 120,
          createdAt: new Date().toISOString()
        };

        setNotifications([newNotification, ...notifications]);

        toast({
          title: "تم الإرسال بنجاح",
          description: `تم إرسال الإشعار إلى ${newNotification.totalRecipients} مستخدم`,
        });
      }

      setTitle('');
      setMessage('');
      setType('info');
      setTargetAudience('all');
      setChannels(['inApp']);
      setSpecificEmails('');
      setScheduleDate('');
      setScheduleTime('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في إرسال الإشعار"
      });
    } finally {
      setLoading(false);
    }
  };

  const useTemplate = (template: NotificationTemplate) => {
    setTitle(template.title);
    setMessage(template.message);
    setType(template.type);
    setTargetAudience(template.targetAudience);
    setChannels(template.channels);
    
    toast({
      title: "تم تطبيق القالب",
      description: `تم تطبيق قالب "${template.name}"`,
    });
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'promotion': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">إدارة الإشعارات</h1>
            <p className="text-muted-foreground mt-1">
              أرسل إشعارات للمستخدمين وتابع حالة الإشعارات المرسلة
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Bell className="h-4 w-4" />
            {notifications.length} إشعار
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإشعارات</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
              <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل القراءة</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">من إجمالي المرسل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نشط اليوم</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">مستخدم نشط</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل التفاعل</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45%</div>
              <p className="text-xs text-muted-foreground">+5% من الأسبوع الماضي</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="send" className="space-y-4">
          <TabsList>
            <TabsTrigger value="send">إرسال إشعار جديد</TabsTrigger>
            <TabsTrigger value="templates">القوالب</TabsTrigger>
            <TabsTrigger value="scheduled">المجدولة</TabsTrigger>
            <TabsTrigger value="history">سجل الإشعارات</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إرسال إشعار جديد</CardTitle>
                <CardDescription>
                  أرسل إشعارات مخصصة للمستخدمين عبر قنوات متعددة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الإشعار *</Label>
                  <Input
                    id="title"
                    placeholder="أدخل عنوان الإشعار"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">نص الرسالة *</Label>
                  <Textarea
                    id="message"
                    placeholder="أدخل نص الرسالة..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    {message.length}/500 حرف
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>نوع الإشعار</Label>
                  <RadioGroup value={type} onValueChange={(value) => setType(value as any)}>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="info" id="info" />
                      <Label htmlFor="info" className="flex items-center gap-2 cursor-pointer">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        معلومات
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="success" id="success" />
                      <Label htmlFor="success" className="flex items-center gap-2 cursor-pointer">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        نجاح
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="warning" id="warning" />
                      <Label htmlFor="warning" className="flex items-center gap-2 cursor-pointer">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        تحذير
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="promotion" id="promotion" />
                      <Label htmlFor="promotion" className="flex items-center gap-2 cursor-pointer">
                        <ShoppingBag className="h-4 w-4 text-purple-500" />
                        عرض ترويجي
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>الجمهور المستهدف</Label>
                  <Select value={targetAudience} onValueChange={(value) => setTargetAudience(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجمهور المستهدف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المستخدمين</SelectItem>
                      <SelectItem value="customers">العملاء فقط</SelectItem>
                      <SelectItem value="affiliates">المسوقين بالعمولة</SelectItem>
                      <SelectItem value="merchants">التجار</SelectItem>
                      <SelectItem value="specific">مستخدمين محددين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {targetAudience === 'specific' && (
                  <div className="space-y-2">
                    <Label htmlFor="emails">البريد الإلكتروني للمستخدمين</Label>
                    <Textarea
                      id="emails"
                      placeholder="أدخل البريد الإلكتروني مفصولاً بفاصلة..."
                      rows={3}
                      value={specificEmails}
                      onChange={(e) => setSpecificEmails(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>قنوات الإرسال</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox
                        id="inApp"
                        checked={channels.includes('inApp')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setChannels([...channels, 'inApp']);
                          } else {
                            setChannels(channels.filter(c => c !== 'inApp'));
                          }
                        }}
                      />
                      <Label htmlFor="inApp" className="flex items-center gap-2 cursor-pointer">
                        <BellRing className="h-4 w-4" />
                        داخل التطبيق
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Checkbox
                        id="email"
                        checked={channels.includes('email')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setChannels([...channels, 'email']);
                          } else {
                            setChannels(channels.filter(c => c !== 'email'));
                          }
                        }}
                      />
                      <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                        <Mail className="h-4 w-4" />
                        البريد الإلكتروني
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="space-y-2">
                  <Label>جدولة الإرسال (اختياري)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                  {scheduleDate && scheduleTime && (
                    <p className="text-sm text-muted-foreground">
                      سيتم الإرسال في: {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString('ar-EG')}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setPreviewOpen(true)}
                    disabled={!title || !message}
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    معاينة
                  </Button>
                  <div className="space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" onClick={() => {
                      setTitle('');
                      setMessage('');
                      setType('info');
                      setTargetAudience('all');
                      setChannels(['inApp']);
                      setSpecificEmails('');
                    }}>
                      إلغاء
                    </Button>
                    <Button onClick={() => handleSendNotification(false)} disabled={loading}>
                      {loading ? (
                        <>جاري الإرسال...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 ml-2" />
                          إرسال فوراً
                        </>
                      )}
                    </Button>
                    <Button variant="secondary" onClick={() => handleSendNotification(true)} disabled={loading}>
                      {loading ? (
                        <>جاري الجدولة...</>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 ml-2" />
                          جدولة للإرسال
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>سجل الإشعارات المرسلة</CardTitle>
                <CardDescription>
                  عرض جميع الإشعارات المرسلة سابقاً
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>النوع</TableHead>
                      <TableHead>العنوان</TableHead>
                      <TableHead>الجمهور</TableHead>
                      <TableHead>القنوات</TableHead>
                      <TableHead>المستلمين</TableHead>
                      <TableHead>معدل القراءة</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <Badge className={`${getTypeColor(notification.type)} text-white`}>
                            {notification.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>
                          {notification.targetAudience === 'all' && 'الجميع'}
                          {notification.targetAudience === 'customers' && 'العملاء'}
                          {notification.targetAudience === 'affiliates' && 'المسوقين'}
                          {notification.targetAudience === 'merchants' && 'التجار'}
                          {notification.targetAudience === 'specific' && 'محدد'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {notification.channels.includes('inApp') && <BellRing className="h-4 w-4" />}
                            {notification.channels.includes('email') && <Mail className="h-4 w-4" />}
                          </div>
                        </TableCell>
                        <TableCell>{notification.totalRecipients}</TableCell>
                        <TableCell>
                          {Math.round((notification.readCount / notification.totalRecipients) * 100)}%
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(notification.sentAt || notification.createdAt).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>قوالب الإشعارات الجاهزة</CardTitle>
                <CardDescription>
                  استخدم القوالب الجاهزة للإشعارات الشائعة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card key={template.$id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Badge className={`${getTypeColor(template.type)} text-white`}>
                            {template.type}
                          </Badge>
                          {template.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold">{template.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{template.message}</p>
                        </div>
                        {template.variables && template.variables.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground">المتغيرات:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.variables.map((variable) => (
                                <Badge key={variable} variant="outline" className="text-xs">
                                  {`{${variable}}`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-4">
                          <Badge variant="secondary">{template.targetAudience}</Badge>
                          <Button size="sm" onClick={() => useTemplate(template)}>
                            <Copy className="h-4 w-4 ml-2" />
                            استخدام
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Notifications Tab */}
          <TabsContent value="scheduled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الإشعارات المجدولة</CardTitle>
                <CardDescription>
                  الإشعارات المقرر إرسالها لاحقاً
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledNotifications.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>العنوان</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الجمهور</TableHead>
                        <TableHead>موعد الإرسال</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduledNotifications.map((notification) => (
                        <TableRow key={notification.id || notification.$id}>
                          <TableCell className="font-medium">{notification.title}</TableCell>
                          <TableCell>
                            <Badge className={`${getTypeColor(notification.type)} text-white`}>
                              {notification.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{notification.targetAudience}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(notification.scheduledFor).toLocaleString('ar-EG')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">مجدول</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm('هل تريد إلغاء هذا الإشعار المجدول?')) {
                                  notificationsApi.cancelScheduledNotification(notification.id || notification.$id);
                                  loadScheduledNotifications();
                                  toast({
                                    title: "تم الإلغاء",
                                    description: "تم إلغاء الإشعار المجدول"
                                  });
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد إشعارات مجدولة حالياً</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>معاينة الإشعار</DialogTitle>
              <DialogDescription>
                هكذا سيظهر الإشعار للمستخدمين
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getTypeColor(type)} text-white`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{title || 'عنوان الإشعار'}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{message || 'نص الرسالة'}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
