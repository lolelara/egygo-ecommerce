import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '@/contexts/AppwriteAuthContext';

export default function ProfileCompletionProgress() {
  const { user } = useAuth();

  const completionSteps = useMemo(() => {
    if (!user) return [];

    return [
      {
        label: 'الاسم الكامل',
        completed: !!user.name && user.name.length > 3
      },
      {
        label: 'البريد الإلكتروني',
        completed: !!user.email
      },
      {
        label: 'رقم الهاتف',
        completed: !!user.phone
      },
      {
        label: 'الصورة الشخصية',
        completed: !!user.avatar
      },
      {
        label: 'العنوان',
        completed: !!user.address
      },
      {
        label: 'المدينة',
        completed: !!user.city
      },
      {
        label: 'تاريخ الميلاد',
        completed: !!user.birthdate
      },
      {
        label: 'الجنس',
        completed: !!user.gender
      }
    ];
  }, [user]);

  const completedCount = completionSteps.filter(step => step.completed).length;
  const totalCount = completionSteps.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  if (!user) return null;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">اكتمال الملف الشخصي</h3>
            <span className="text-2xl font-bold text-primary">{percentage}%</span>
          </div>
          
          <Progress value={percentage} className="h-2" />
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            {completionSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 ${
                  step.completed ? 'text-green-600' : 'text-muted-foreground'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span>{step.label}</span>
              </div>
            ))}
          </div>
          
          {percentage < 100 && (
            <p className="text-sm text-muted-foreground text-center pt-2">
              أكمل ملفك الشخصي للحصول على تجربة أفضل
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
