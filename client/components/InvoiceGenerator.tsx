import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface InvoiceProps {
  invoiceNumber?: string;
  type: 'commission' | 'withdrawal' | 'merchant_payment';
  date: Date;
  customer: {
    name: string;
    id: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    description: string;
    amount: number;
    details?: string;
  }>;
  totalAmount: number;
  platformFee?: number;
  commission?: number;
  notes?: string;
}

export function InvoiceGenerator({
  invoiceNumber = `INV-${Date.now()}`,
  type,
  date,
  customer,
  items,
  totalAmount,
  platformFee,
  commission,
  notes
}: InvoiceProps) {
  const [printing, setPrinting] = useState(false);

  const getInvoiceTitle = () => {
    switch (type) {
      case 'commission':
        return 'فاتورة عمولة مسوق';
      case 'withdrawal':
        return 'إيصال سحب أرباح';
      case 'merchant_payment':
        return 'فاتورة دفع تاجر';
      default:
        return 'فاتورة';
    }
  };

  const getInvoiceIcon = () => {
    switch (type) {
      case 'commission':
        return '💰';
      case 'withdrawal':
        return '💸';
      case 'merchant_payment':
        return '🏪';
      default:
        return '📄';
    }
  };

  const handlePrint = () => {
    setPrinting(true);
    window.print();
    setTimeout(() => setPrinting(false), 1000);
  };

  const handleDownloadPDF = () => {
    // Create printable version
    const printContent = document.getElementById('invoice-content');
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=800,width=800');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>${getInvoiceTitle()} - ${invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            background: white;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
          }
          .invoice-header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .invoice-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .invoice-number {
            font-size: 18px;
            opacity: 0.9;
          }
          .invoice-body {
            padding: 30px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 12px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .info-label {
            color: #6b7280;
            font-weight: 500;
          }
          .info-value {
            font-weight: 600;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .items-table th {
            background: #f9fafb;
            padding: 12px;
            text-align: right;
            font-weight: 600;
            border-bottom: 2px solid #e5e7eb;
          }
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #f3f4f6;
          }
          .total-section {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 18px;
          }
          .total-row.grand-total {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            border-top: 2px solid #1e40af;
            padding-top: 15px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background: #f9fafb;
            color: #6b7280;
            font-size: 14px;
          }
          .notes {
            background: #fef3c7;
            border-right: 4px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
          }
          @media print {
            body { padding: 0; }
            .invoice-container { border: none; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          معاينة الفاتورة
        </CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            طباعة
          </Button>
          <Button size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            تحميل PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div id="invoice-content" className="invoice-container border-2 border-gray-200 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
            <div className="text-4xl mb-2">{getInvoiceIcon()}</div>
            <h1 className="text-3xl font-bold mb-2">{getInvoiceTitle()}</h1>
            <p className="text-lg opacity-90">رقم الفاتورة: {invoiceNumber}</p>
            <p className="text-sm opacity-80 mt-2">
              {format(date, 'PPP', { locale: ar })}
            </p>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Company Info */}
            <div className="section mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-3 border-b-2 border-gray-200 pb-2">
                منصة EgyGo
              </h3>
              <div className="text-sm space-y-1 text-gray-600">
                <p>📧 البريد الإلكتروني: support@egygo.me</p>
                <p>📱 الهاتف: 01034324551 (Vodafone Cash)</p>
                <p>💳 InstaPay: ebank_hema@instapay</p>
                <p>🌐 الموقع: egygo.me</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="section mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-3 border-b-2 border-gray-200 pb-2">
                معلومات العميل
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">الاسم:</span>
                  <span className="font-semibold">{customer.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">معرف المستخدم:</span>
                  <span className="font-mono text-sm">{customer.id}</span>
                </div>
                {customer.email && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">البريد الإلكتروني:</span>
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">الهاتف:</span>
                    <span className="font-mono">{customer.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="section mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-3 border-b-2 border-gray-200 pb-2">
                تفاصيل الفاتورة
              </h3>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-right p-3 font-semibold border-b-2 border-gray-200">الوصف</th>
                    <th className="text-left p-3 font-semibold border-b-2 border-gray-200">المبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="p-3">
                        <div className="font-medium">{item.description}</div>
                        {item.details && (
                          <div className="text-sm text-gray-500 mt-1">{item.details}</div>
                        )}
                      </td>
                      <td className="p-3 text-left font-bold">{item.amount.toFixed(2)} ج.م</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 p-6 rounded-lg">
              {platformFee && (
                <div className="flex justify-between items-center py-2 text-lg">
                  <span className="text-gray-600">رسوم المنصة (10%):</span>
                  <span className="font-bold text-red-600">{platformFee.toFixed(2)} ج.م</span>
                </div>
              )}
              {commission && (
                <div className="flex justify-between items-center py-2 text-lg">
                  <span className="text-gray-600">العمولة:</span>
                  <span className="font-bold text-orange-600">{commission.toFixed(2)} ج.م</span>
                </div>
              )}
              <Separator className="my-4" />
              <div className="flex justify-between items-center py-3 text-2xl border-t-2 border-blue-600 pt-4">
                <span className="font-bold text-blue-600">المجموع الكلي:</span>
                <span className="font-bold text-blue-600">{totalAmount.toFixed(2)} ج.م</span>
              </div>
            </div>

            {/* Notes */}
            {notes && (
              <div className="mt-6 bg-yellow-50 border-r-4 border-yellow-500 p-4 rounded">
                <h4 className="font-bold text-yellow-800 mb-2">📝 ملاحظات:</h4>
                <p className="text-gray-700">{notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center border-t-2 border-gray-200">
            <p className="text-gray-600 text-sm mb-2">
              شكراً لاستخدامك منصة EgyGo
            </p>
            <p className="text-gray-500 text-xs">
              هذه الفاتورة تم إنشاؤها إلكترونياً ولا تحتاج إلى توقيع
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-xs">
                تم الإنشاء: {format(new Date(), 'PPpp', { locale: ar })}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for generating invoices from data
export function GenerateInvoice({
  withdrawalData,
  paymentData,
  commissionData
}: {
  withdrawalData?: any;
  paymentData?: any;
  commissionData?: any;
}) {
  if (withdrawalData) {
    return (
      <InvoiceGenerator
        type="withdrawal"
        date={new Date(withdrawalData.createdAt)}
        customer={{
          name: withdrawalData.userName,
          id: withdrawalData.userId,
        }}
        items={[
          {
            description: 'سحب أرباح من المنصة',
            amount: withdrawalData.amount,
            details: `طريقة السحب: ${withdrawalData.method}`
          }
        ]}
        totalAmount={withdrawalData.amount}
        notes={withdrawalData.notes}
      />
    );
  }

  if (paymentData) {
    return (
      <InvoiceGenerator
        type="merchant_payment"
        date={new Date(paymentData.createdAt)}
        customer={{
          name: paymentData.merchantName,
          id: paymentData.merchantId,
        }}
        items={[
          {
            description: `دفعة للطلب رقم ${paymentData.orderId}`,
            amount: paymentData.totalAmount,
          }
        ]}
        totalAmount={paymentData.totalAmount}
        platformFee={paymentData.platformFee}
        commission={paymentData.commissionAmount}
        notes={paymentData.notes}
      />
    );
  }

  if (commissionData) {
    return (
      <InvoiceGenerator
        type="commission"
        date={new Date(commissionData.createdAt)}
        customer={{
          name: commissionData.affiliateName,
          id: commissionData.affiliateId,
        }}
        items={[
          {
            description: `عمولة من الطلب رقم ${commissionData.orderId}`,
            amount: commissionData.commissionAmount,
            details: `نسبة العمولة: ${(commissionData.commissionRate * 100).toFixed(0)}%`
          }
        ]}
        totalAmount={commissionData.commissionAmount}
        commission={commissionData.commissionAmount}
      />
    );
  }

  return null;
}
