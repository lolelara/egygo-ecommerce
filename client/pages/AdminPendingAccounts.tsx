import { useState, useEffect } from "react";
import { PageSkeleton, StatsCardSkeleton, TableSkeleton } from "@/components/LoadingSkeletons";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig, account } from "@/lib/appwrite";
import { Query, ID } from "appwrite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, XCircle, Phone, Mail, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface PendingUser {
  $id: string;
  name: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  accountStatus: 'pending' | 'approved' | 'rejected';
  isAffiliate: boolean;
  isMerchant: boolean;
  affiliateCode?: string;
  $createdAt: string;
}

export default function AdminPendingAccounts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'merchant' | 'affiliate'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rejection dialog state
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Details dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPendingUsers();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [pendingUsers, filter, searchQuery]);

  const fetchPendingUsers = async () => {
    try {
      setIsLoading(true);
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        [
          Query.equal('accountStatus', 'pending'),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );

      console.log('Pending users fetched:', response.documents);
      setPendingUsers(response.documents as any);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الحسابات المعلقة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pendingUsers];

    // Filter by type
    if (filter === 'merchant') {
      filtered = filtered.filter(u => u.isMerchant);
    } else if (filter === 'affiliate') {
      filtered = filtered.filter(u => u.isAffiliate);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone.includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const approveAccount = async (userId: string, userName: string) => {
    try {
      // Data for users collection (has all fields)
      const usersApprovalData = {
        accountStatus: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: user?.$id,
        isActive: true,
      };

      // Data for userPreferences (only has accountStatus)
      const prefsApprovalData = {
        accountStatus: 'approved',
      };

      // Update in users collection
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        userId,
        usersApprovalData
      );

      // CRITICAL: Also update userPreferences collection
      try {
        // Find userPreferences document by userId
        const prefsResponse = await databases.listDocuments(
          appwriteConfig.databaseId,
          'userPreferences',
          [Query.equal('userId', userId)]
        );

        if (prefsResponse.documents.length > 0) {
          const prefsDoc = prefsResponse.documents[0];
          await databases.updateDocument(
            appwriteConfig.databaseId,
            'userPreferences',
            prefsDoc.$id,
            prefsApprovalData
          );
          console.log('✅ Updated userPreferences for:', userId);
        }
      } catch (prefsError) {
        console.error('Error updating userPreferences:', prefsError);
        // Continue anyway - users collection is updated
      }

      // Note: user_updates collection is optional
      // User will see changes after logout/login

      // Create notification for approved user
      try {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.notifications || 'notifications',
          'unique()',
          {
            userId: userId,
            title: '🎉 تمت الموافقة على حسابك',
            message: 'مرحباً بك! تم قبول حسابك. يرجى تسجيل الخروج ثم الدخول مرة أخرى لتفعيل حسابك والوصول إلى لوحة التحكم.',
            type: 'tip',
            isRead: false,
          }
        );
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }

      toast({
        title: "✅ تمت الموافقة",
        description: `تم قبول حساب ${userName} بنجاح. يرجى إخبار المستخدم بتسجيل الخروج والدخول مرة أخرى.`,
      });

      // Refresh list
      fetchPendingUsers();
      
      // TODO: Send approval email
      // await sendApprovalEmail(userId);
    } catch (error) {
      console.error('Error approving account:', error);
      toast({
        title: "خطأ",
        description: "فشل في الموافقة على الحساب",
        variant: "destructive",
      });
    }
  };

  const rejectAccount = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      toast({
        title: "خطأ",
        description: "يجب إدخال سبب الرفض",
        variant: "destructive",
      });
      return;
    }

    try {
      // Data for users collection (has all fields)
      const usersRejectionData = {
        accountStatus: 'rejected',
        rejectionReason: rejectionReason,
        isActive: false,
      };

      // Data for userPreferences (only accountStatus)
      const prefsRejectionData = {
        accountStatus: 'rejected',
      };

      // Update in users collection
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        selectedUser.$id,
        usersRejectionData
      );

      // Also update userPreferences
      try {
        const prefsResponse = await databases.listDocuments(
          appwriteConfig.databaseId,
          'userPreferences',
          [Query.equal('userId', selectedUser.$id)]
        );

        if (prefsResponse.documents.length > 0) {
          await databases.updateDocument(
            appwriteConfig.databaseId,
            'userPreferences',
            prefsResponse.documents[0].$id,
            prefsRejectionData
          );
        }
      } catch (prefsError) {
        console.error('Error updating userPreferences:', prefsError);
      }

      // Create notification for rejected user
      try {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.notifications || 'notifications',
          'unique()',
          {
            userId: selectedUser.$id,
            title: 'تحديث حول طلب حسابك',
            message: `عذراً، لم يتم قبول حسابك. السبب: ${rejectionReason}`,
            type: 'warning',
            isRead: false,
          }
        );
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }

      toast({
        title: "تم الرفض",
        description: `تم رفض حساب ${selectedUser.name}`,
      });

      // Close dialog and refresh
      setRejectDialogOpen(false);
      setSelectedUser(null);
      setRejectionReason('');
      fetchPendingUsers();
      
      // TODO: Send rejection email
      // await sendRejectionEmail(selectedUser.$id, rejectionReason);
    } catch (error) {
      console.error('Error rejecting account:', error);
      toast({
        title: "خطأ",
        description: "فشل في رفض الحساب",
        variant: "destructive",
      });
    }
  };

  const openRejectDialog = (user: PendingUser) => {
    setSelectedUser(user);
    setRejectDialogOpen(true);
  };

  const openDetailsDialog = (user: PendingUser) => {
    setSelectedUser(user);
    setDetailsDialogOpen(true);
  };

  const getAccountTypeBadge = (user: PendingUser) => {
    if (user.isMerchant) {
      return <Badge className="bg-brand-purple">🏪 تاجر</Badge>;
    }
    if (user.isAffiliate) {
      return <Badge className="bg-brand-orange">💰 مسوق</Badge>;
    }
    return <Badge variant="secondary">عميل</Badge>;
  };

  const getWhatsAppLink = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  if (isLoading) {
    return (
      <PageSkeleton>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <tbody>
              <TableSkeleton rows={8} cols={7} />
            </tbody>
          </table>
        </div>
      </PageSkeleton>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">الحسابات المعلقة</h1>
        <p className="text-muted-foreground">
          مراجعة والموافقة على حسابات التجار والمسوقين الجدد
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المعلقة
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              التجار
            </CardTitle>
            <User className="h-4 w-4 text-brand-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingUsers.filter(u => u.isMerchant).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              المسوقون
            </CardTitle>
            <User className="h-4 w-4 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingUsers.filter(u => u.isAffiliate).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">بحث</Label>
              <Input
                id="search"
                placeholder="ابحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="filter">الفلتر</Label>
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger id="filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="merchant">التجار فقط</SelectItem>
                  <SelectItem value="affiliate">المسوقون فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">لا توجد حسابات معلقة</h3>
              <p className="text-muted-foreground">
                جميع الحسابات الجديدة تمت مراجعتها
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>التواصل</TableHead>
                    <TableHead>تاريخ التسجيل</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.$id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getAccountTypeBadge(user)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <a
                            href={getWhatsAppLink(user.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 hover:underline flex items-center gap-1"
                          >
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </a>
                          {user.alternativePhone && (
                            <a
                              href={getWhatsAppLink(user.alternativePhone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                            >
                              <Phone className="h-3 w-3" />
                              {user.alternativePhone}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(user.$createdAt), {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDetailsDialog(user)}
                          >
                            عرض
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => approveAccount(user.$id, user.name)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            موافقة
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openRejectDialog(user)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            رفض
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفض الحساب</DialogTitle>
            <DialogDescription>
              يرجى توضيح سبب رفض حساب {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">سبب الرفض</Label>
            <Textarea
              id="reason"
              placeholder="اكتب السبب بوضوح..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={rejectAccount}>
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الحساب</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">الاسم</Label>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">نوع الحساب</Label>
                  <div className="mt-1">{getAccountTypeBadge(selectedUser)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">البريد الإلكتروني</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">رقم الهاتف</Label>
                  <a
                    href={getWhatsAppLink(selectedUser.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-green-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-4 w-4" />
                    {selectedUser.phone}
                  </a>
                </div>
                {selectedUser.alternativePhone && (
                  <div>
                    <Label className="text-muted-foreground">رقم بديل</Label>
                    <a
                      href={getWhatsAppLink(selectedUser.alternativePhone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-green-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="h-4 w-4" />
                      {selectedUser.alternativePhone}
                    </a>
                  </div>
                )}
                {selectedUser.affiliateCode && (
                  <div>
                    <Label className="text-muted-foreground">كود المسوق</Label>
                    <p className="font-medium font-mono">{selectedUser.affiliateCode}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">تاريخ التسجيل</Label>
                  <p className="font-medium">
                    {new Date(selectedUser.$createdAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    approveAccount(selectedUser.$id, selectedUser.name);
                    setDetailsDialogOpen(false);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  موافقة
                </Button>
                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    openRejectDialog(selectedUser);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  رفض
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
