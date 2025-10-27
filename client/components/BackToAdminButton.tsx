/**
 * Back to Admin Dashboard Button
 * زر العودة للوحة التحكم
 */

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface BackToAdminButtonProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'link';
  to?: string;
  label?: string;
}

export default function BackToAdminButton({
  className = '',
  variant = 'ghost',
  to = '/admin',
  label = 'العودة للوحة التحكم'
}: BackToAdminButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      variant={variant}
      onClick={() => navigate(to)}
      className={`mb-4 ${className}`}
    >
      <ArrowRight className="h-4 w-4 ml-2" />
      {label}
    </Button>
  );
}
