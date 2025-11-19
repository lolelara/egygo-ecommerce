
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Trash2, Users, User } from "lucide-react";
import { notificationsApi, type Notification } from "@/lib/cms-api";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "warning" | "error",
    targetUser: "",
    link: "",
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsApi.getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const newNotification = await notificationsApi.sendNotification({
        ...formData,
        targetUser: formData.targetUser || undefined, // Convert empty string to undefined
      });

      setNotifications([newNotification, ...notifications]);
      setFormData({
        title: "",
        message: "",
        type: "info",
        targetUser: "",
        link: "",
      });
      alert("تم إرسال الإشعار بنجاح");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("فشل إرسال الإشعار");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإشعار؟")) return;

    try {
      await notificationsApi.deleteNotification(id);
      setNotifications(notifications.filter((n) => n.$id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("فشل حذف الإشعار");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مركز الإشعارات</h1>
          <p className="text-muted-foreground">
            إرسال تنبيهات وإشعارات للمستخدمين
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Notification Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>إرسال إشعار جديد</CardTitle>
                <CardDescription>
                  قم بإرسال إشعار لجميع المستخدمين أو لمستخدم محدد
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان الإشعار</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="مثال: خصم خاص لك!"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">نص الرسالة</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="اكتب رسالتك هنا..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">نوع الإشعار</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: any) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">معلومة (أزرق)</SelectItem>
                        <SelectItem value="success">نجاح (أخضر)</SelectItem>
                        <SelectItem value="warning">تنبيه (أصفر)</SelectItem>
                        <SelectItem value="error">خطأ (أحمر)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetUser">المستخدم المستهدف (اختياري)</Label>
                    <Input
                      id="targetUser"
                      value={formData.targetUser}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          targetUser: e.target.value,
                        }))
                      }
                      placeholder="User ID (اتركه فارغاً للجميع)"
                    />
                    <p className="text-xs text-muted-foreground">
                      اترك الحقل فارغاً لإرسال الإشعار لجميع المستخدمين
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link">رابط التوجيه (اختياري)</Label>
                    <Input
                      id="link"
                      value={formData.link}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, link: e.target.value }))
                      }
                      placeholder="/products/123"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={sending}>
                    {sending ? (
                      "جاري الإرسال..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 ml-2" />
                        إرسال الإشعار
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Notifications History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>سجل الإشعارات</CardTitle>
                <CardDescription>آخر الإشعارات التي تم إرسالها</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-10">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">لا توجد إشعارات سابقة</h3>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>العنوان</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>المستهدف</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead className="text-left">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.map((notification) => (
                        <TableRow key={notification.$id}>
                          <TableCell className="font-medium">
                            {notification.title}
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {notification.message}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                notification.type === "error"
                                  ? "destructive"
                                  : notification.type === "warning"
                                    ? "secondary" // Using secondary for warning as outline is default
                                    : notification.type === "success"
                                      ? "default" // Green usually
                                      : "outline"
                              }
                              className={
                                notification.type === "success"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : notification.type === "warning"
                                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                    : ""
                              }
                            >
                              {notification.type === "info" && "معلومة"}
                              {notification.type === "success" && "نجاح"}
                              {notification.type === "warning" && "تنبيه"}
                              {notification.type === "error" && "خطأ"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {notification.targetUser ? (
                              <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded w-fit">
                                <User className="h-3 w-3" />
                                مستخدم محدد
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded w-fit">
                                <Users className="h-3 w-3" />
                                الجميع
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(notification.$createdAt), "PP p", {
                              locale: ar,
                            })}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDelete(notification.$id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
