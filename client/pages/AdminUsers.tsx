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
import type { User, AffiliateUser } from "@/shared/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for users and affiliates
const mockUsers: User[] = [
  {
    id: "1",
    email: "ahmed@example.com",
    name: "أحمد محمد",
    avatar: "",
    role: "USER",
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    email: "fatima@example.com",
    name: "فاطمة علي",
    avatar: "",
    role: "USER",
    isActive: true,
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "3",
    email: "omar@example.com",
    name: "عمر حسن",
    avatar: "",
    role: "ADMIN",
    isActive: true,
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
  },
];

const mockAffiliates: (AffiliateUser & { user: User })[] = [
  {
    id: "1",
    email: "affiliate1@example.com",
    name: "سارة أحمد",
    affiliateCode: "SARAH2024",
    commissionRate: 10,
    totalEarnings: 2450,
    pendingEarnings: 340,
    referralCount: 23,
    joinedAt: "2024-01-05T08:00:00Z",
    user: {
      id: "4",
      email: "affiliate1@example.com",
      name: "سارة أحمد",
      avatar: "",
      role: "USER",
      isActive: true,
      createdAt: "2024-01-05T08:00:00Z",
      updatedAt: "2024-01-15T08:00:00Z",
    },
  },
  {
    id: "2",
    email: "affiliate2@example.com",
    name: "محمد خالد",
    affiliateCode: "MOHAMED2024",
    commissionRate: 8,
    totalEarnings: 1890,
    pendingEarnings: 280,
    referralCount: 18,
    joinedAt: "2024-01-08T12:30:00Z",
    user: {
      id: "5",
      email: "affiliate2@example.com",
      name: "محمد خالد",
      avatar: "",
      role: "USER",
      isActive: true,
      createdAt: "2024-01-08T12:30:00Z",
      updatedAt: "2024-01-15T12:30:00Z",
    },
  },
];

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
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [affiliates, setAffiliates] =
    useState<(AffiliateUser & { user: User })[]>(mockAffiliates);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [affiliateSearchTerm, setAffiliateSearchTerm] = useState("");

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

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user,
      ),
    );
  };

  const handleChangeUserRole = (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole as User["role"] } : user,
      ),
    );
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
            {/* Users Search */}
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

            {/* Users Table */}
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
      </div>
    </AdminLayout>
  );
}
