/**
 * AI Test Page - للتأكد من عمل API
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { env } from '@/lib/env';

export default function TestAI() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testAPI = async () => {
    setTesting(true);
    setError('');
    setResult(null);

    try {
      console.log('🔍 Testing OpenAI API...');
      console.log('API Key present:', !!env.OPENAI_API_KEY);
      console.log('API Key length:', env.OPENAI_API_KEY?.length);
      console.log('API Key preview:', env.OPENAI_API_KEY?.substring(0, 15) + '...');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'قل مرحباً بالعربية'
            }
          ],
          max_tokens: 50
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      setResult(data);
    } catch (err: any) {
      console.error('Test failed:', err);
      setError(err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 اختبار OpenAI API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Key Info */}
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">حالة API Key:</span>
                  <span className={env.OPENAI_API_KEY ? 'text-green-600' : 'text-red-600'}>
                    {env.OPENAI_API_KEY ? '✅ موجود' : '❌ غير موجود'}
                  </span>
                </div>
                {env.OPENAI_API_KEY && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-semibold">الطول:</span>
                      <span>{env.OPENAI_API_KEY.length} حرف</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">المعاينة:</span>
                      <span className="font-mono text-xs">
                        {env.OPENAI_API_KEY.substring(0, 20)}...
                      </span>
                    </div>
                  </>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* Test Button */}
          <Button
            onClick={testAPI}
            disabled={testing || !env.OPENAI_API_KEY}
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
                      {result.choices?.[0]?.message?.content || 'لا يوجد محتوى'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>Model: {result.model}</div>
                    <div>Tokens used: {result.usage?.total_tokens}</div>
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
                <li>تأكد من وجود ملف <code className="bg-gray-100 px-1 rounded">.env</code></li>
                <li>تأكد من صحة المتغير: <code className="bg-gray-100 px-1 rounded">VITE_OPENAI_API_KEY</code></li>
                <li>تأكد من أن API Key يبدأ بـ <code className="bg-gray-100 px-1 rounded">sk-</code></li>
                <li>أعد تشغيل السيرفر بعد تعديل <code className="bg-gray-100 px-1 rounded">.env</code></li>
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
