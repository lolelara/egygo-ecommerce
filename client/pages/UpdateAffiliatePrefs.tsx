import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function UpdateAffiliatePrefs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [currentPrefs, setCurrentPrefs] = useState<any>(null);

  useEffect(() => {
    loadCurrentPrefs();
  }, []);

  const loadCurrentPrefs = async () => {
    try {
      const user = await account.get();
      setCurrentPrefs(user.prefs);
    } catch (error) {
      console.error('Error loading prefs:', error);
    }
  };

  const updatePreferences = async () => {
    try {
      setLoading(true);
      setMessage(null);

      await account.updatePrefs({
        isAffiliate: true,
        role: 'affiliate',
        commissionRate: 15
      });

      setMessage({
        type: 'success',
        text: '✅ تم تحديث الإعدادات بنجاح! قم بتحديث الصفحة لرؤية التغييرات.'
      });

      // Reload preferences
      await loadCurrentPrefs();
      
      // Navigate after 2 seconds
      setTimeout(() => {
        navigate('/affiliate/dashboard');
      }, 2000);

    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `❌ خطأ: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">تحديث إعدادات المسوق</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Preferences */}
          {currentPrefs && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">الإعدادات الحالية:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(currentPrefs, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="font-semibold">هذه الصفحة ستقوم بـ:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>تفعيل حساب المسوق (isAffiliate: true)</li>
              <li>تعيين الدور كـ "affiliate"</li>
              <li>تعيين نسبة العمولة 15%</li>
            </ul>
          </div>

          {/* Message */}
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Update Button */}
          <Button
            onClick={updatePreferences}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'جاري التحديث...' : 'تحديث الإعدادات'}
          </Button>

          {/* Manual Instructions */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">أو استخدم Console المتصفح:</h3>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto">
              <code>
{`// افتح Console (F12) ونفذ:
import('https://cdn.jsdelivr.net/npm/appwrite@14.0.1').then(async (Appwrite) => {
  const client = new Appwrite.Client()
    .setEndpoint('${import.meta.env.VITE_APPWRITE_ENDPOINT}')
    .setProject('${import.meta.env.VITE_APPWRITE_PROJECT_ID}');
  
  const account = new Appwrite.Account(client);
  
  await account.updatePrefs({
    isAffiliate: true,
    role: 'affiliate',
    commissionRate: 15
  });
  
  console.log('✅ تم التحديث!');
  location.reload();
});`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
