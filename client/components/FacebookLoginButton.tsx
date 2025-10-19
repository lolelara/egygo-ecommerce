import { useState } from 'react';
import { account } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Facebook } from 'lucide-react';

export function FacebookLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      
      // Create OAuth2 session with Facebook
      account.createOAuth2Session(
        'facebook' as any, // Facebook OAuth provider
        `${window.location.origin}/auth/callback`, // Success redirect
        `${window.location.origin}/login?error=facebook_failed` // Failure redirect
      );
    } catch (error) {
      console.error('Facebook login error:', error);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFacebookLogin}
      disabled={loading}
      variant="outline"
      className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white border-0"
    >
      <Facebook className="w-5 h-5" />
      {loading ? 'جاري الاتصال...' : 'تسجيل الدخول بـ Facebook'}
    </Button>
  );
}
