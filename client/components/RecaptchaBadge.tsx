/**
 * reCAPTCHA Badge Component
 * 
 * يعرض شارة "محمي بـ reCAPTCHA" في الفورم
 */

import { Shield } from 'lucide-react';

interface RecaptchaBadgeProps {
  className?: string;
}

export function RecaptchaBadge({ className = '' }: RecaptchaBadgeProps) {
  return (
    <div className={`flex items-center justify-center gap-2 text-xs text-muted-foreground ${className}`}>
      <Shield className="h-3 w-3" />
      <span>
        محمي بواسطة{' '}
        <a
          href="https://www.google.com/recaptcha/about/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          reCAPTCHA
        </a>
      </span>
    </div>
  );
}

export default RecaptchaBadge;
