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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Search,
  Check,
  X,
  Clock,
  TrendingUp,
  Users,
  CreditCard,
} from "lucide-react";
import type { Commission } from "@/shared/api";

// Mock commissions data
const mockCommissions: (Commission & {
  affiliate: { name: string; email: string; affiliateCode: string };
  order: { orderNumber: string };
  product?: { name: string };
})[] = [
  {
    id: "1",
    amount: 47.92,
    percentage: 8,
    status: "PENDING",
    description: "عمولة من بيع سماعات بلوتوث",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    affiliateId: "1",
    orderId: "1",
    affiliate: {
      name: "سارة أحمد",
      email: "sarah@example.com",
      affiliateCode: "SARAH2024",
    },
    order: {
      orderNumber: "ORD-2024-001",
    },
    product: {
      name: "سماعات بلوتوث لاسلكية",
    },
  },
  {
    id: "2",
    amount: 129.9,
    percentage: 10,
    status: "APPROVED",
    description: "عمولة من بيع ساعة ذكية",
    createdAt: "2024-01-14T15:20:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    affiliateId: "2",
    orderId: "2",
    affiliate: {
      name: "محمد خالد",
      email: "mohamed@example.com",
      affiliateCode: "MOHAMED2024",
    },
    order: {
      orderNumber: "ORD-2024-002",
    },
    product: {
      name: "ساعة ذكية رياضية",
    },
  },
  {
    id: "3",
    amount: 71.92,
    percentage: 8,
    status: "PAID",
    description: "عمولة من بيع جهاز لوحي",
    createdAt: "2024-01-13T11:45:00Z",
    updatedAt: "2024-01-14T16:30:00Z",
    affiliateId: "1",
    orderId: "3",
    affiliate: {
      name: "سارة أحمد",
      email: "sarah@example.com",
      affiliateCode: "SARAH2024",
    },
    order: {
      orderNumber: "ORD-2024-003",
    },
    product: {
      name: "جهاز لوحي 10 بوصة",
    },
  },
  {
    id: "4",
    amount: 23.96,
    percentage: 8,
    status: "CANCELLED",
    description: "عمولة ملغية - إرجاع المنتج",
    createdAt: "2024-01-12T14:15:00Z",
    updatedAt: "2024-01-13T10:20:00Z",
    affiliateId: "3",
    orderId: "4",
    affiliate: {
      name: "أحمد محمود",
      email: "ahmed@example.com",
      affiliateCode: "AHMED2024",
    },
    order: {
      orderNumber: "ORD-2024-004",
    },
  },
];

const CommissionStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: {
      label: "في الانتظار",
      variant: "secondary" as const,
      icon: Clock,
    },
    APPROVED: {
      label: "موافق عليها",
      variant: "default" as const,
      icon: Check,
    },
    PAID: { label: "مدفوعة", variant: "secondary" as const, icon: CreditCard },
    CANCELLED: { label: "ملغية", variant: "destructive" as const, icon: X },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default function AdminCommissions() {
  const [commissions, setCommissions] = useState(mockCommissions);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCommissions = commissions.filter((commission) => {
    const matchesSearch =
      commission.affiliate.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      commission.affiliate.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      commission.affiliate.affiliateCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      commission.order.orderNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || commission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateCommissionStatus = (
    commissionId: string,
    newStatus: string,
  ) => {
    setCommissions((prev) =>
      prev.map((commission) =>
        commission.id === commissionId
          ? {
              ...commission,
              status: newStatus as Commission["status"],
              updatedAt: new Date().toISOString(),
            }
          : commission,
      ),
    );
  };

  // Statistics
  const totalCommissions = commissions.length;
  const pendingCommissions = commissions.filter((c) => c.status === "PENDING");
  const approvedCommissions = commissions.filter(
    (c) => c.status === "APPROVED",
  );
  const paidCommissions = commissions.filter((c) => c.status === "PAID");

  const totalCommissionAmount = commissions.reduce(
    (sum, commission) => sum + commission.amount,
    0,
  );
  const pendingAmount = pendingCommissions.reduce(
    (sum, commission) => sum + commission.amount,
    0,
  );
  const approvedAmount = approvedCommissions.reduce(
    (sum, commission) => sum + commission.amount,
    0,
  );
  const paidAmount = paidCommissions.reduce(
    (sum, commission) => sum + commission.amount,
    0,
  );

  const uniqueAffiliates = new Set(commissions.map((c) => c.affiliateId)).size;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">إدارة العمولات</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              دفع العمولات المعتمدة
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي العمولات
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCommissions}</div>
              <p className="text-xs text-muted-foreground">
                {totalCommissionAmount.toLocaleString()} ج.م إجمالي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingCommissions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {pendingAmount.toLocaleString()} ج.م
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معتمدة</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {approvedCommissions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {approvedAmount.toLocaleString()} ج.م جاهزة للدفع
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مدفوعة</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidCommissions.length}</div>
              <p className="text-xs text-muted-foreground">
                {paidAmount.toLocaleString()} ج.م مدفوعة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الشركاء النشطين
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueAffiliates}</div>
              <p className="text-xs text-muted-foreground">
                لديهم عمولات هذا الشهر
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                متوسط العمولة
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCommissions > 0
                  ? (totalCommissionAmount / totalCommissions).toFixed(2)
                  : "0"}{" "}
                ج.م
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                معدل الموافقة
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCommissions > 0
                  ? Math.round(
                      ((approvedCommissions.length + paidCommissions.length) /
                        totalCommissions) *
                        100,
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="البحث في العمولات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="حالة العمولة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="PENDING">في الانتظار</SelectItem>
              <SelectItem value="APPROVED">معتمدة</SelectItem>
              <SelectItem value="PAID">مدفوعة</SelectItem>
              <SelectItem value="CANCELLED">ملغية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Commissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>العمولات ({filteredCommissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الشريك</TableHead>
                  <TableHead>الطلب</TableHead>
                  <TableHead>المنتج</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>النسبة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {commission.affiliate.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {commission.affiliate.affiliateCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {commission.order.orderNumber}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {commission.product?.name || "غير محدد"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {commission.amount.toFixed(2)} ج.م
                      </div>
                    </TableCell>
                    <TableCell>{commission.percentage}%</TableCell>
                    <TableCell>
                      <CommissionStatusBadge status={commission.status} />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(commission.createdAt).toLocaleDateString(
                          "ar-EG",
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(commission.createdAt).toLocaleTimeString(
                          "ar-EG",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {commission.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateCommissionStatus(
                                  commission.id,
                                  "APPROVED",
                                )
                              }
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateCommissionStatus(
                                  commission.id,
                                  "CANCELLED",
                                )
                              }
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}

                        {commission.status === "APPROVED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateCommissionStatus(
                                commission.id,
                                "PAID",
                              )
                            }
                          >
                            <CreditCard className="h-4 w-4" />
                            دفع
                          </Button>
                        )}

                        {commission.status === "PAID" && (
                          <Badge variant="secondary">تم الدفع</Badge>
                        )}

                        {commission.status === "CANCELLED" && (
                          <Badge variant="destructive">ملغية</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
