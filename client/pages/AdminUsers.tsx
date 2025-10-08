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
  Loader2,
} from "lucide-react";
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
    {isActive ? "نشط" : "معط��"}
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
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
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
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">
                        لا يوجد مستخدمين حالياً
                      </h3>
                      <p className="text-sm text-blue-700">
                        المستخدمين سيظهرون هنا تلقائياً عند تسجيل حسابات جديدة.
                        يمكنك أيضاً إدارة المستخدمين من{" "}
                        <a
                          href="https://cloud.appwrite.io/console"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium"
                        >
                          Appwrite Console
                        </a>
                      </p>
                    </div>
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
            {/* Affiliates Search */}
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

            {/* Affiliates Table */}
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
          </TabsContent>
        </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
