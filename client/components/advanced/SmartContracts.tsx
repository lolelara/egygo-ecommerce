import { FileSignature, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SmartContract {
  id: string;
  type: "affiliate" | "merchant";
  partyName: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "pending" | "expired";
  terms: {
    commissionRate: number;
    minOrders: number;
    paymentSchedule: string;
    performanceBonus?: number;
  };
  performance: {
    ordersCompleted: number;
    totalRevenue: number;
    commissionPaid: number;
  };
}

export function SmartContracts() {
  const contracts: SmartContract[] = [
    {
      id: "1",
      type: "affiliate",
      partyName: "أحمد المسوق",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      status: "active",
      terms: {
        commissionRate: 15,
        minOrders: 100,
        paymentSchedule: "شهري",
        performanceBonus: 5,
      },
      performance: {
        ordersCompleted: 87,
        totalRevenue: 125000,
        commissionPaid: 18750,
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileSignature className="h-6 w-6" />
            <div>
              <CardTitle>العقود الذكية</CardTitle>
              <CardDescription>إدارة اتفاقيات المسوقين والتجار تلقائياً</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {contracts.map((contract) => (
        <Card key={contract.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{contract.partyName}</CardTitle>
                <CardDescription>
                  {contract.type === "affiliate" ? "مسوق" : "تاجر"} • {contract.terms.paymentSchedule}
                </CardDescription>
              </div>
              <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                {contract.status === "active" ? "نشط" : "معلق"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg border">
                <p className="text-sm text-muted-foreground">نسبة العمولة</p>
                <p className="text-2xl font-bold">{contract.terms.commissionRate}%</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold">{contract.performance.totalRevenue.toLocaleString()} جنيه</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-sm text-muted-foreground">العمولة المدفوعة</p>
                <p className="text-2xl font-bold">{contract.performance.commissionPaid.toLocaleString()} جنيه</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>التقدم نحو الحد الأدنى</span>
                <span>
                  {contract.performance.ordersCompleted} / {contract.terms.minOrders}
                </span>
              </div>
              <Progress value={(contract.performance.ordersCompleted / contract.terms.minOrders) * 100} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Customer Experience Center
export function CustomerExperienceCenter() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>مركز تجربة العميل</CardTitle>
          <CardDescription>VoC • NPS • CSAT • Heatmaps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">NPS Score</p>
                  <p className="text-4xl font-bold text-green-600">+45</p>
                  <Badge variant="default">ممتاز</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">CSAT</p>
                  <p className="text-4xl font-bold">4.6/5</p>
                  <Progress value={92} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Voice of Customer</p>
                  <p className="text-4xl font-bold">328</p>
                  <p className="text-xs text-muted-foreground">تعليق هذا الشهر</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
