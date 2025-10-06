import { useState } from "react";
import { Shield, Lock, Eye, Edit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type Permission = "read" | "write" | "delete" | "admin";
type Resource = "products" | "orders" | "users" | "analytics" | "settings";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<Resource, Permission[]>;
  userCount: number;
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: Resource;
  resourceId?: string;
  timestamp: Date;
  ipAddress: string;
  status: "success" | "failed";
  details?: string;
}

export function RBACSystem() {
  const [roles] = useState<Role[]>([
    {
      id: "admin",
      name: "المدير",
      description: "صلاحيات كاملة على النظام",
      permissions: {
        products: ["read", "write", "delete", "admin"],
        orders: ["read", "write", "delete", "admin"],
        users: ["read", "write", "delete", "admin"],
        analytics: ["read", "write", "delete", "admin"],
        settings: ["read", "write", "delete", "admin"],
      },
      userCount: 3,
    },
    {
      id: "merchant",
      name: "التاجر",
      description: "إدارة المنتجات والطلبات",
      permissions: {
        products: ["read", "write", "delete"],
        orders: ["read", "write"],
        users: [],
        analytics: ["read"],
        settings: ["read"],
      },
      userCount: 45,
    },
    {
      id: "affiliate",
      name: "المسوق",
      description: "عرض وتتبع الحملات",
      permissions: {
        products: ["read"],
        orders: ["read"],
        users: [],
        analytics: ["read"],
        settings: [],
      },
      userCount: 128,
    },
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      userId: "user_123",
      userName: "أحمد محمد",
      action: "تعديل منتج",
      resource: "products",
      resourceId: "prod_456",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      ipAddress: "197.45.123.45",
      status: "success",
      details: "تحديث السعر من 1299 إلى 1199",
    },
    {
      id: "2",
      userId: "user_789",
      userName: "سارة أحمد",
      action: "حذف مستخدم",
      resource: "users",
      resourceId: "user_111",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      ipAddress: "197.45.123.46",
      status: "failed",
      details: "صلاحيات غير كافية",
    },
  ]);

  const getPermissionBadge = (permission: Permission) => {
    const variants = {
      read: { color: "bg-blue-100 text-blue-800", label: "قراءة", icon: Eye },
      write: { color: "bg-green-100 text-green-800", label: "كتابة", icon: Edit },
      delete: { color: "bg-red-100 text-red-800", label: "حذف", icon: Trash2 },
      admin: { color: "bg-purple-100 text-purple-800", label: "إدارة", icon: Shield },
    };
    const config = variants[permission];
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 ml-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <div>
              <CardTitle>نظام الصلاحيات المتقدم (RBAC)</CardTitle>
              <CardDescription>إدارة الأدوار والصلاحيات مع سجل التدقيق</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="roles">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">الأدوار والصلاحيات</TabsTrigger>
          <TabsTrigger value="audit">سجل التدقيق</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{role.userCount} مستخدم</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(Object.entries(role.permissions) as [Resource, Permission[]][]).map(
                    ([resource, permissions]) => (
                      <div key={resource} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {
                              {
                                products: "المنتجات",
                                orders: "الطلبات",
                                users: "المستخدمين",
                                analytics: "التحليلات",
                                settings: "الإعدادات",
                              }[resource]
                            }
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {permissions.length === 0 ? (
                            <Badge variant="secondary">لا توجد صلاحيات</Badge>
                          ) : (
                            permissions.map((perm) => <div key={perm}>{getPermissionBadge(perm)}</div>)
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>سجل التدقيق</CardTitle>
              <CardDescription>جميع العمليات الحساسة مع التفاصيل</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex gap-4 p-4 rounded-lg border hover:bg-muted/50">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          log.status === "success" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {log.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{log.action}</p>
                          <Badge variant={log.status === "success" ? "default" : "destructive"}>
                            {log.status === "success" ? "نجح" : "فشل"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          بواسطة: {log.userName} • {log.ipAddress}
                        </p>
                        {log.details && <p className="text-sm text-muted-foreground">{log.details}</p>}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {log.timestamp.toLocaleString("ar-EG")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
