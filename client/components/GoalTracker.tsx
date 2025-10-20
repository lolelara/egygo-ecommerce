import { useState, useEffect } from 'react';
import { Target, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { ID, Query } from 'appwrite';
import { useAuth } from '@/contexts/AppwriteAuthContext';

interface Goal {
  $id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  type: 'sales' | 'earnings' | 'clicks';
  status: 'active' | 'completed' | 'failed';
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    target: '',
    deadline: '',
    type: 'earnings' as 'sales' | 'earnings' | 'clicks'
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        'affiliate_goals',
        [Query.equal('userId', user.$id), Query.orderDesc('$createdAt')]
      );
      setGoals(response.documents as any);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.target || !formData.deadline) {
      toast({ title: 'خطأ', description: 'الرجاء ملء جميع الحقول', variant: 'destructive' });
      return;
    }

    try {
      await databases.createDocument(DATABASE_ID, 'affiliate_goals', ID.unique(), {
        userId: user?.$id,
        title: formData.title,
        target: parseFloat(formData.target),
        current: 0,
        deadline: formData.deadline,
        type: formData.type,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      toast({ title: 'تم الإنشاء', description: 'تم إنشاء الهدف بنجاح' });
      setOpen(false);
      setFormData({ title: '', target: '', deadline: '', type: 'earnings' });
      loadGoals();
    } catch (error) {
      toast({ title: 'خطأ', description: 'فشل إنشاء الهدف', variant: 'destructive' });
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sales': return 'مبيعات';
      case 'earnings': return 'أرباح';
      case 'clicks': return 'نقرات';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">أهدافي</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          هدف جديد
        </Button>
      </div>

      <div className="grid gap-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <Card key={goal.$id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{goal.title}</h3>
                      <Badge>{getTypeLabel(goal.type)}</Badge>
                      {goal.status === 'completed' && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 ml-1" />
                          مكتمل
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.type === 'earnings' ? 'ج.م' : ''}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{daysLeft > 0 ? `${daysLeft} يوم` : 'انتهى'}</p>
                    <p className="text-xs text-muted-foreground">متبقي</p>
                  </div>
                </div>

                <Progress value={Math.min(progress, 100)} className="h-3 mb-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{progress.toFixed(1)}% مكتمل</span>
                  <span className="text-muted-foreground">
                    الموعد: {new Date(goal.deadline).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {goals.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد أهداف بعد</p>
              <Button onClick={() => setOpen(true)} className="mt-4">
                أنشئ هدفك الأول
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إنشاء هدف جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>عنوان الهدف</Label>
              <Input
                placeholder="مثال: الوصول لـ 5000 ج.م هذا الشهر"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>نوع الهدف</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="earnings">أرباح (ج.م)</option>
                <option value="sales">مبيعات (عدد)</option>
                <option value="clicks">نقرات (عدد)</option>
              </select>
            </div>
            <div>
              <Label>الهدف المطلوب</Label>
              <Input
                type="number"
                placeholder="5000"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              />
            </div>
            <div>
              <Label>الموعد النهائي</Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            <Button onClick={handleCreate} className="w-full">
              <Plus className="h-4 w-4 ml-2" />
              إنشاء الهدف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
