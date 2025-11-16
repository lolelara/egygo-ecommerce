/**
 * AI Test Page - للتأكد من عمل API
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function TestAI() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [lastStatus, setLastStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const testAPI = async () => {
    setTesting(true);
    setError('');
    setResult(null);
    setLastStatus('idle');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'أنت مساعد بسيط لاختبار الاتصال فقط. أجب بجملة قصيرة.'
            },
            {
              role: 'user',
              content: 'قل مرحباً بالعربية'
            }
          ]
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Chat API Response:', data);
      
      setResult(data);
      setLastStatus('success');
    } catch (err: any) {
      console.error('Test failed:', err);
      setError(err.message);
      setLastStatus('error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 اختبار اتصال AI عبر الباك إند</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Key Info */}
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">حالة الاتصال بالذكاء الاصطناعي:</span>
                  <span
                    className={
                      lastStatus === 'success'
                        ? 'text-green-600'
                        : lastStatus === 'error'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }
                  >
                    {lastStatus === 'success'
                      ? '✅ الاتصال ناجح (الباك إند يعمل)'
                      : lastStatus === 'error'
                      ? '❌ فشل الاختبار، راجع إعدادات السيرفر ومفاتيح OpenAI في لوحة التحكم'
                      : 'اضغط زر الاختبار للتحقق من الاتصال'}
                  </span>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Test Button */}
          <Button
            onClick={testAPI}
            disabled={testing}
            className="w-full"
            size="lg"
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الاختبار...
              </>
            ) : (
              '🚀 اختبار API'
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">❌ فشل الاختبار</div>
                <div className="text-sm font-mono bg-red-50 p-2 rounded">
                  {error}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {result && !error && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <div className="font-semibold mb-2 text-green-900">✅ نجح الاختبار!</div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">الرسالة:</span>
                    <div className="bg-white p-2 rounded mt-1 border">
                      {result.message || result.choices?.[0]?.message?.content || 'لا يوجد محتوى'}
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <Alert>
            <AlertDescription className="text-sm">
              <div className="font-semibold mb-2">📝 ملاحظات:</div>
              <ul className="list-disc list-inside space-y-1">
                <li>تأكد أن سيرفر الباك إند يعمل وأن مسار <code className="bg-gray-100 px-1 rounded">/api/chat</code> متاح</li>
                <li>أضف مفاتيح OpenAI من لوحة التحكم &gt; الإعدادات المتقدمة &gt; مفاتيح OpenAI</li>
                <li>استخدم صفحة إدارة المفاتيح لاختبار كل مفتاح وتعيين المفتاح الافتراضي</li>
                <li>هذه الصفحة تختبر أن مسار الشات في الباك إند قادر على الرد بنجاح</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Console */}
          <div className="mt-4 p-3 bg-gray-900 text-gray-100 rounded-lg text-xs font-mono">
            <div className="text-green-400 mb-1">Console Output:</div>
            <div>افتح Developer Console (F12) لرؤية التفاصيل</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
