import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserCheck,
  Search,
  Edit,
  Ban,
  CheckCircle,
  DollarSign,
  Calendar,
} from "lucide-react";
import { TableSkeleton, StatsCardSkeleton } from "@/components/LoadingSkeletons";
import type { User, AffiliateUser } from "@shared/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminUsersApi } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";

const RoleBadge = ({ role }: { role: string }) => {
  const roleConfig = {
    USER: { label: "مستخدم", variant: "secondary" as const },
    ADMIN: { label: "مدير", variant: "default" as const },
    SUPER_ADMIN: { label: "مدير عام", variant: "destructive" as const },
  };

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <Badge variant={isActive ? "default" : "secondary"}>
    {isActive ? "نشط" : "معطل"}
  </Badge>
);

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [affiliates, setAffiliates] =
    useState<(AffiliateUser & { user: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [affiliateSearchTerm, setAffiliateSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Starting to fetch users and affiliates...");
      
      const [usersData, affiliatesData] = await Promise.all([
        adminUsersApi.getAll().catch(err => {
          console.error("Failed to fetch users:", err);
          return [];
        }),
        adminUsersApi.getAllAffiliates().catch(err => {
          console.error("Failed to fetch affiliates:", err);
          return [];
        }),
      ]);
      
      console.log("Users data:", usersData);
      console.log("Affiliates data:", affiliatesData);
      
      setUsers(usersData);
      setAffiliates(affiliatesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في تحميل البيانات",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredAffiliates = affiliates.filter(
    (affiliate) =>
      affiliate.name
        .toLowerCase()
        .includes(affiliateSearchTerm.toLowerCase()) ||
      affiliate.email
        .toLowerCase()
        .includes(affiliateSearchTerm.toLowerCase()) ||
      affiliate.affiliateCode
        .toLowerCase()
        .includes(affiliateSearchTerm.toLowerCase()),
  );

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      await adminUsersApi.updateStatus(userId, !user.isActive);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive: !user.isActive } : user,
        ),
      );
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة المستخدم بنجاح",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "فشل في تحديث حالة المستخدم",
      });
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      await adminUsersApi.updateRole(userId, newRole);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole as User["role"] } : user,
        ),
      );
      toast({
        title: "تم التحديث",
        description: "تم تحديث دور المستخدم بنجاح",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "فشل في تحديث دور المستخدم",
      });
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminUsers = users.filter(
    (u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN",
  ).length;
  const totalAffiliates = affiliates.length;
  const totalAffiliateEarnings = affiliates.reduce(
    (sum, a) => sum + a.totalEarnings,
    0,
  );
  const totalPendingEarnings = affiliates.reduce(
    (sum, a) => sum + a.pendingEarnings,
    0,
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            إدارة المستخدمين والشركاء
          </h1>
        </div>

        {loading ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <tbody>
                  <TableSkeleton rows={8} cols={7} />
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي المستخدمين
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <p className="text-xs text-muted-foreground">{activeUsers} نشط</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">المديرين</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي الشركاء
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAffiliates}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalAffiliateEarnings.toLocaleString()} ج.م إجمالي الأرباح
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    الأرباح المعلقة
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalPendingEarnings.toLocaleString()} ج.م
                  </div>
                </CardContent>
              </Card>
            </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">المستخدمين ({totalUsers})</TabsTrigger>
            <TabsTrigger value="affiliates">
              الشركاء ({totalAffiliates})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {/* Info Message */}
            {users.length === 0 && !loading && (
              <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                          ⚠️ لا يمكن عرض بيانات المستخدمين
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                          لعرض المستخدمين الحقيقيين، يجب إنشاء collection في Appwrite Database:
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-amber-200">
                      <h4 className="font-semibold mb-2">خطوات الإعداد:</h4>
                      <ol className="text-sm space-y-2 list-decimal list-inside">
                        <li>افتح <a href="https://cloud.appwrite.io/console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Appwrite Console</a></li>
                        <li>اذهب إلى Database → أنشئ collection اسمه <code className="bg-gray-100 px-2 py-1 rounded">users</code></li>
                        <li>أضف Attributes التالية:
                          <ul className="mt-1 mr-6 space-y-1 list-disc list-inside text-xs">
                            <li><code>email</code> (string, required)</li>
                            <li><code>name</code> (string)</li>
                            <li><code>avatar</code> (string)</li>
                            <li><code>role</code> (string, default: "USER")</li>
                            <li><code>isActive</code> (boolean, default: true)</li>
                            <li><code>isAffiliate</code> (boolean)</li>
                            <li><code>isMerchant</code> (boolean)</li>
                          </ul>
                        </li>
                        <li>اضبط Permissions للقراءة والكتابة</li>
                        <li>أضف مستخدمين للـ collection</li>
                      </ol>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      💡 <strong>ملاحظة:</strong> يمكنك أيضاً استخدام Appwrite Functions لمزامنة Auth Users مع الـ collection تلقائياً.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Users Search */}
            {users.length > 0 && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="البحث في المستخدمين..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Users Table */}
            {users.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>المستخدمين ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستخدم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تاريخ التسجيل</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name?.charAt(0) || user.email.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.name || "غير محدد"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge isActive={user.isActive} />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.isActive ? (
                                <Ban className="h-4 w-4 text-red-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            )}
          </TabsContent>

          <TabsContent value="affiliates" className="space-y-4">
            {/* Info Message */}
            {affiliates.length === 0 && !loading && (
              <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <UserCheck className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                          ⚠️ لا يوجد شركاء تسويق حالياً
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                          لعرض المسوقين بالعمولة، تأكد من:
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-amber-200">
                      <ul className="text-sm space-y-2 list-disc list-inside">
                        <li>وجود collection <code className="bg-gray-100 px-2 py-1 rounded">users</code> في قاعدة البيانات</li>
                        <li>وجود attribute <code className="bg-gray-100 px-2 py-1 rounded">isAffiliate</code> (boolean)</li>
                        <li>تعيين <code className="bg-gray-100 px-2 py-1 rounded">isAffiliate = true</code> للمستخدمين المسوقين</li>
                        <li>إضافة attributes للعمولات:
                          <ul className="mt-1 mr-6 space-y-1 list-circle list-inside text-xs">
                            <li><code>affiliateCode</code> (string)</li>
                            <li><code>commissionRate</code> (number, مثال: 15)</li>
                            <li><code>totalEarnings</code> (number)</li>
                            <li><code>pendingEarnings</code> (number)</li>
                            <li><code>referralCount</code> (number)</li>
                          </ul>
                        </li>
                      </ul>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      💡 <strong>نصيحة:</strong> يمكن للمستخدمين التسجيل كمسوقين من صفحة <code>/affiliate</code>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Affiliates Search */}
            {affiliates.length > 0 && (
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="البحث في الشركاء..."
                    value={affiliateSearchTerm}
                    onChange={(e) => setAffiliateSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            )}

            {/* Affiliates Table */}
            {affiliates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>الشركاء ({filteredAffiliates.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الشريك</TableHead>
                      <TableHead>كود الشريك</TableHead>
                      <TableHead>نسبة العمولة</TableHead>
                      <TableHead>إجمالي الأرباح</TableHead>
                      <TableHead>الأرباح المعلقة</TableHead>
                      <TableHead>عدد الإحالات</TableHead>
                      <TableHead>تاريخ الانضمام</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAffiliates.map((affiliate) => (
                      <TableRow key={affiliate.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={affiliate.user.avatar} />
                              <AvatarFallback>
                                {affiliate.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {affiliate.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {affiliate.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {affiliate.affiliateCode}
                          </Badge>
                        </TableCell>
                        <TableCell>{affiliate.commissionRate}%</TableCell>
                        <TableCell>
                          {affiliate.totalEarnings.toLocaleString()} ج.م
                        </TableCell>
                        <TableCell>
                          {affiliate.pendingEarnings.toLocaleString()} ج.م
                        </TableCell>
                        <TableCell>{affiliate.referralCount}</TableCell>
                        <TableCell>
                          {new Date(affiliate.joinedAt).toLocaleDateString(
                            "ar-EG",
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <DollarSign className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            )}
          </TabsContent>
        </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
