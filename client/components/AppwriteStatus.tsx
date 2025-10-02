import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Settings, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppwriteService from '@/lib/appwrite';

export const AppwriteStatus: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAppwriteStatus();
  }, []);

  const checkAppwriteStatus = async () => {
    setChecking(true);
    try {
      const configured = AppwriteService.isConfigured();
      setIsConfigured(configured);
      
      if (configured) {
        // Try to get current user to test connection
        await AppwriteService.getCurrentUser();
      }
      
      // Get project ID from env
      const pid = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
      setProjectId(pid);
    } catch (error) {
      console.error('Error checking Appwrite status:', error);
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>جاري فحص اتصال Appwrite...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          حالة اتصال Appwrite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConfigured && projectId ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>متصل بنجاح!</strong>
                  <br />
                  معرف المشروع: <code>{projectId}</code>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  متصل
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div>
                  <strong>غير متصل بـ Appwrite</strong>
                  <br />
                  يرجى إعداد المشروع أولاً
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    onClick={() => window.open('https://cloud.appwrite.io/', '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    إنشاء مشروع
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open('/APPWRITE_REAL_SETUP.md', '_blank')}
                  >
                    دليل الإعداد
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>خطوات الإعداد:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mr-4">
            <li>إنشاء مشروع في Appwrite Cloud</li>
            <li>إضافة localhost كمنصة ويب</li>
            <li>إنشاء قاعدة البيانات والمجموعات</li>
            <li>تحديث VITE_APPWRITE_PROJECT_ID في ملف .env</li>
            <li>إعادة تشغيل الخادم</li>
          </ol>
        </div>

        <Button 
          onClick={checkAppwriteStatus}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          إعادة فحص الاتصال
        </Button>
      </CardContent>
    </Card>
  );
};