import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('جاري معالجة تسجيل الدخول...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get current user
      const user = await account.get();
      console.log('✅ User logged in:', user);

      // Check if user preferences exist
      const userPrefs = await databases.listDocuments(
        DATABASE_ID,
        'userPreferences',
        [Query.equal('userId', user.$id)]
      );

      if (userPrefs.documents.length === 0) {
        // Create user preferences for new Facebook user
        await databases.createDocument(
          DATABASE_ID,
          'userPreferences',
          ID.unique(),
          {
            userId: user.$id,
            name: user.name || 'مستخدم Facebook',
            email: user.email || '',
            phone: user.phone || '',
            role: 'customer',
            isAffiliate: false,
            isMerchant: false,
            isIntermediary: false,
            isAdmin: false,
            isPending: false,
            isApproved: true,
            createdAt: new Date().toISOString(),
          }
        );
        console.log('✅ User preferences created');

        // Send welcome notification
        try {
          await databases.createDocument(
            DATABASE_ID,
            'notifications',
            ID.unique(),
            {
              userId: user.$id,
              title: '🎉 مرحباً بك في EgyGo!',
              message: `أهلاً ${user.name}! تم تسجيل دخولك بنجاح عبر Facebook.`,
              type: 'success',
              read: false,
              relatedId: user.$id,
              metadata: JSON.stringify({
                source: 'facebook_login',
                userName: user.name
              })
            }
          );
        } catch (notifError) {
          console.error('Error creating notification:', notifError);
        }
      }

      setStatus('success');
      setMessage('تم تسجيل الدخول بنجاح! جاري التحويل...');
      
      // Redirect based on role
      setTimeout(() => {
        const userPref = userPrefs.documents[0];
        if (userPref?.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (userPref?.role === 'merchant') {
          navigate('/merchant/dashboard');
        } else if (userPref?.role === 'affiliate') {
          navigate('/affiliate/dashboard');
        } else {
          navigate('/');
        }
      }, 1500);

    } catch (error: any) {
      console.error('Callback error:', error);
      setStatus('error');
      setMessage('حدث خطأ في تسجيل الدخول. جاري التحويل...');
      
      setTimeout(() => {
        navigate('/login?error=callback_failed');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              جاري المعالجة...
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              نجح! ✅
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              خطأ ❌
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
