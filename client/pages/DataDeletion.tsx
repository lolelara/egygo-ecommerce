import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, AlertTriangle, CheckCircle, Mail, User } from 'lucide-react';

export default function DataDeletion() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Send deletion request
      const response = await fetch('/api/data-deletion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reason,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setReason('');
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (err) {
      setError('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            طلب حذف البيانات
          </h1>
          <p className="text-gray-600">
            Data Deletion Request
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>تم إرسال طلبك بنجاح!</strong>
              <br />
              سنقوم بمعالجة طلب حذف بياناتك خلال 30 يوماً. ستصلك رسالة تأكيد على بريدك الإلكتروني.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">حذف بيانات المستخدم</CardTitle>
            <CardDescription>
              إذا كنت ترغب في حذف بياناتك من EgyGo، يرجى ملء النموذج أدناه. سنقوم بحذف جميع بياناتك الشخصية خلال 30 يوماً.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Information */}
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>ما الذي سيتم حذفه:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>معلومات الحساب (الاسم، البريد الإلكتروني، رقم الهاتف)</li>
                  <li>سجل الطلبات والمشتريات</li>
                  <li>العناوين المحفوظة</li>
                  <li>قائمة المفضلة</li>
                  <li>بيانات تسجيل الدخول عبر Facebook</li>
                  <li>جميع البيانات الشخصية الأخرى</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-left"
                  dir="ltr"
                />
                <p className="text-sm text-gray-500">
                  البريد الإلكتروني المرتبط بحسابك على EgyGo
                </p>
              </div>

              {/* Reason (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  سبب الحذف (اختياري)
                </Label>
                <Textarea
                  id="reason"
                  placeholder="يمكنك إخبارنا بسبب رغبتك في حذف بياناتك (اختياري)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    إرسال طلب الحذف
                  </div>
                )}
              </Button>
            </form>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">
                طرق بديلة للتواصل:
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  📧 البريد الإلكتروني:{' '}
                  <a href="mailto:privacy@egygo.com" className="text-blue-600 hover:underline">
                    privacy@egygo.com
                  </a>
                </p>
                <p>
                  📱 واتساب:{' '}
                  <a href="https://wa.me/201234567890" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    +20 123 456 7890
                  </a>
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  * سيتم حذف بياناتك بشكل نهائي خلال 30 يوماً من تاريخ الطلب
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mt-6 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">معلومات إضافية</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>
              • سيتم حذف جميع بياناتك الشخصية بشكل نهائي ولا يمكن استرجاعها.
            </p>
            <p>
              • قد نحتفظ ببعض البيانات لأغراض قانونية أو محاسبية لمدة محدودة.
            </p>
            <p>
              • إذا كان لديك طلبات نشطة، سيتم إلغاؤها تلقائياً.
            </p>
            <p>
              • لن تتمكن من تسجيل الدخول بنفس الحساب بعد الحذف.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
