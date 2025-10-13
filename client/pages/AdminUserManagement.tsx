import { useState, useEffect } from 'react';
import { TableSkeleton } from '@/components/LoadingSkeletons';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Users, UserPlus, Edit, Trash2, Search, Filter, AlertCircle } from 'lucide-react';
import { databases, account } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export default function AdminUserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Create User Dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'customer' as 'customer' | 'affiliate' | 'merchant' | 'admin',
    defaultMarkupPercentage: '20'
  });

  // Activate Intermediary Dialog
  const [activateIntermediaryOpen, setActivateIntermediaryOpen] = useState(false);
  const [selectedUserForIntermediary, setSelectedUserForIntermediary] = useState<any>(null);
  const [intermediaryMarkup, setIntermediaryMarkup] = useState('20');

  // Edit User Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer' as 'customer' | 'affiliate' | 'merchant' | 'admin' | 'intermediary',
    defaultMarkupPercentage: '20'
  });
  
  // Role Change Confirmation Dialog
  const [roleChangeConfirmOpen, setRoleChangeConfirmOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    console.log('📊 Edit Dialog State Changed:', editDialogOpen);
    console.log('👤 Editing User:', editingUser);
    if (editDialogOpen && editingUser) {
      console.log('✅ Dialog should be visible now');
      console.log('📝 Edit User Data:', editUserData);
    }
  }, [editDialogOpen, editingUser, editUserData]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // In a real application, you'd need a server-side endpoint to list all users
      // For now, we'll get user preferences from the database
      const response = await databases.listDocuments(
        DATABASE_ID,
        'userPreferences',
        [Query.limit(100), Query.orderDesc('$createdAt')]
      );
      
      console.log('📥 Loaded users:', response.documents.length);
      console.log('📋 First user sample:', response.documents[0]);
      
      // Count users by role
      const roleCounts = response.documents.reduce((acc: any, u: any) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
      }, {});
      console.log('📊 Users by role:', roleCounts);
      
      // Count customers who are not intermediaries
      const eligibleForIntermediary = response.documents.filter((u: any) => 
        u.role === 'customer' && !u.isIntermediary
      );
      console.log('🟣 Customers eligible for intermediary:', eligibleForIntermediary.length);
      if (eligibleForIntermediary.length > 0) {
        console.log('📝 Sample eligible customer:', eligibleForIntermediary[0]);
      }
      
      setUsers(response.documents);
    } catch (error) {
      console.error('❌ Error loading users:', error);
      toast({
        title: "خطأ",
        description: "فشل تحميل المستخدمين",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.name) {
      toast({
        title: "تحذير",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create account
      const userId = ID.unique();
      
      // Note: Intermediary role removed from here - can only be activated for existing customers
      // In production, this should be done server-side
      // For now, we'll just create the preferences document
      await databases.createDocument(
        DATABASE_ID,
        'userPreferences',
        userId,
        {
          userId: userId,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone || '',
          role: newUser.role,
          isAdmin: newUser.role === 'admin',
          isAffiliate: newUser.role === 'affiliate',
          isMerchant: newUser.role === 'merchant',
          isIntermediary: false, // Always false on creation
          affiliateCode: newUser.role === 'affiliate' ? `AFF${Date.now()}` : '',
          intermediaryCode: '', // Empty on creation
          defaultMarkupPercentage: 0,
          commissionRate: newUser.role === 'affiliate' ? 10 : 0
        }
      );

      toast({
        title: "نجح!",
        description: `تم إنشاء حساب ${newUser.name} بنجاح`,
      });

      setCreateDialogOpen(false);
      setNewUser({
        email: '',
        password: '',
        name: '',
        phone: '',
        role: 'customer',
        defaultMarkupPercentage: '20'
      });
      
      loadUsers();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل إنشاء الحساب",
        variant: "destructive"
      });
    }
  };

  const handleActivateIntermediary = async () => {
    if (!selectedUserForIntermediary || !intermediaryMarkup) {
      return;
    }

    try {
      const intermediaryCode = `INT${Date.now()}`;
      
      await databases.updateDocument(
        DATABASE_ID,
        'userPreferences',
        selectedUserForIntermediary.$id,
        {
          role: 'intermediary',
          isIntermediary: true,
          intermediaryCode: intermediaryCode,
          defaultMarkupPercentage: parseFloat(intermediaryMarkup)
        }
      );

      toast({
        title: "تم التفعيل!",
        description: `تم تفعيل دور الوسيط لـ ${selectedUserForIntermediary.name}`,
      });

      setActivateIntermediaryOpen(false);
      setSelectedUserForIntermediary(null);
      setIntermediaryMarkup('20');
      
      loadUsers();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل تفعيل دور الوسيط",
        variant: "destructive"
      });
    }
  };

  const openActivateIntermediaryDialog = (userToActivate: any) => {
    setSelectedUserForIntermediary(userToActivate);
    setActivateIntermediaryOpen(true);
  };

  const openEditUserDialog = (userToEdit: any) => {
    console.log('🔍 Opening edit dialog for user:', userToEdit);
    setEditingUser(userToEdit);
    setEditUserData({
      name: userToEdit.name || '',
      email: userToEdit.email || '',
      phone: userToEdit.phone || '',
      role: userToEdit.role || 'customer',
      defaultMarkupPercentage: userToEdit.defaultMarkupPercentage?.toString() || '20'
    });
    setEditDialogOpen(true);
    console.log('✅ Edit dialog state set to true');
  };

  const handleRoleChangeRequest = (newRole: string) => {
    // Check if role is actually changing
    if (newRole !== editingUser?.role) {
      setPendingRoleChange(newRole);
      setRoleChangeConfirmOpen(true);
    } else {
      setEditUserData({ ...editUserData, role: newRole as any });
    }
  };

  const confirmRoleChange = () => {
    if (pendingRoleChange) {
      setEditUserData({ ...editUserData, role: pendingRoleChange as any });
      setRoleChangeConfirmOpen(false);
      setPendingRoleChange(null);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !editUserData.name || !editUserData.email) {
      toast({
        title: "تحذير",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare update data based on new role
      const updateData: any = {
        name: editUserData.name,
        email: editUserData.email,
        phone: editUserData.phone || '',
        role: editUserData.role,
        isAdmin: editUserData.role === 'admin',
        isAffiliate: editUserData.role === 'affiliate',
        isMerchant: editUserData.role === 'merchant',
        isIntermediary: editUserData.role === 'intermediary',
        accountStatus: 'approved' // Auto-approve on role change
      };

      // Reset role-specific data if role changed
      if (editUserData.role !== editingUser.role) {
        // Clear old role data
        updateData.affiliateCode = editUserData.role === 'affiliate' ? `AFF${Date.now()}` : '';
        updateData.intermediaryCode = editUserData.role === 'intermediary' ? `INT${Date.now()}` : '';
        updateData.defaultMarkupPercentage = editUserData.role === 'intermediary' ? parseFloat(editUserData.defaultMarkupPercentage) : 0;
        updateData.commissionRate = editUserData.role === 'affiliate' ? 10 : 0;
      } else {
        // Keep existing data if role didn't change
        updateData.defaultMarkupPercentage = editingUser.isIntermediary 
          ? parseFloat(editUserData.defaultMarkupPercentage) 
          : editingUser.defaultMarkupPercentage || 0;
      }

      await databases.updateDocument(
        DATABASE_ID,
        'userPreferences',
        editingUser.$id,
        updateData
      );

      toast({
        title: "نجح!",
        description: `تم تحديث ${editUserData.name} بنجاح`,
      });

      setEditDialogOpen(false);
      setEditingUser(null);
      
      loadUsers();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل تحديث المستخدم",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`هل أنت متأكد من حذف ${userName}؟`)) {
      return;
    }

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        'userPreferences',
        userId
      );

      toast({
        title: "تم الحذف",
        description: `تم حذف ${userName}`,
      });

      loadUsers();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف المستخدم",
        variant: "destructive"
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      intermediary: 'bg-purple-100 text-purple-800',
      merchant: 'bg-blue-100 text-blue-800',
      affiliate: 'bg-green-100 text-green-800',
      customer: 'bg-gray-100 text-gray-800'
    };

    const roleNames: Record<string, string> = {
      admin: 'مدير',
      intermediary: 'وسيط',
      merchant: 'تاجر',
      affiliate: 'مسوق',
      customer: 'عميل'
    };

    return (
      <Badge className={roleColors[role] || roleColors.customer}>
        {roleNames[role] || role}
      </Badge>
    );
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              إدارة المستخدمين
            </h1>
            <p className="text-muted-foreground">
              إدارة حسابات المستخدمين والوسطاء
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <UserPlus className="h-4 w-4 ml-2" />
            إضافة مستخدم
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>بحث</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث بالاسم، البريد، أو الهاتف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              
              <div>
                <Label>تصفية حسب الدور</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="admin">مدير</SelectItem>
                    <SelectItem value="intermediary">وسيط</SelectItem>
                    <SelectItem value="merchant">تاجر</SelectItem>
                    <SelectItem value="affiliate">مسوق</SelectItem>
                    <SelectItem value="customer">عميل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              المستخدمون ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton rows={8} cols={7} />
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد نتائج
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الهاتف</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>الكود</TableHead>
                      <TableHead>تاريخ الإنشاء</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u: any) => (
                      <TableRow key={u.$id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.phone || '-'}</TableCell>
                        <TableCell>{getRoleBadge(u.role)}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {u.affiliateCode || u.intermediaryCode || '-'}
                          </code>
                        </TableCell>
                        <TableCell>
                          {new Date(u.$createdAt).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 items-center">
                            {/* Show "Activate Intermediary" button only for customers */}
                            {u.role === 'customer' && !u.isIntermediary && (
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log('🟣 Activating intermediary for:', u.name);
                                  openActivateIntermediaryDialog(u);
                                }}
                              >
                                تفعيل وسيط
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('✏️ Edit button clicked for:', u.name);
                                console.log('User data:', u);
                                openEditUserDialog(u);
                              }}
                              title="تعديل المستخدم"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteUser(u.$id, u.name);
                              }}
                              title="حذف المستخدم"
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* Create User Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة مستخدم جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات المستخدم الجديد
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">الهاتف</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">الدور *</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(v: any) => setNewUser({ ...newUser, role: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">عميل</SelectItem>
                    <SelectItem value="affiliate">مسوق</SelectItem>
                    <SelectItem value="merchant">تاجر</SelectItem>
                    <SelectItem value="admin">مدير</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  ملاحظة: دور الوسيط يمكن تفعيله للعملاء من خلال الجدول
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleCreateUser}>
                إنشاء الحساب
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Activate Intermediary Dialog */}
        <Dialog open={activateIntermediaryOpen} onOpenChange={setActivateIntermediaryOpen}>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle>تفعيل دور الوسيط</DialogTitle>
              <DialogDescription>
                تفعيل دور الوسيط لـ {selectedUserForIntermediary?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm text-purple-900 dark:text-purple-100">
                  <strong>العميل:</strong> {selectedUserForIntermediary?.name}
                </p>
                <p className="text-sm text-purple-900 dark:text-purple-100">
                  <strong>البريد:</strong> {selectedUserForIntermediary?.email}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intermediary-markup">نسبة الترميز الافتراضية (%)</Label>
                <Input
                  id="intermediary-markup"
                  type="number"
                  min="0"
                  max="100"
                  value={intermediaryMarkup}
                  onChange={(e) => setIntermediaryMarkup(e.target.value)}
                  placeholder="مثال: 20"
                />
                <p className="text-xs text-muted-foreground">
                  النسبة التي سيتم إضافتها على سعر المنتج الأصلي
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  ℹ️ سيتم توليد كود وسيط فريد تلقائياً
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  ℹ️ سيتمكن الوسيط من إضافة المنتجات من روابط خارجية
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setActivateIntermediaryOpen(false);
                  setSelectedUserForIntermediary(null);
                  setIntermediaryMarkup('20');
                }}
              >
                إلغاء
              </Button>
              <Button 
                onClick={handleActivateIntermediary}
                className="bg-purple-600 hover:bg-purple-700"
              >
                تفعيل الوسيط
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={(open) => {
          console.log('🔄 Dialog onOpenChange called:', open);
          setEditDialogOpen(open);
        }}>
          <DialogContent className="max-w-md" onOpenAutoFocus={() => {
            console.log('🎯 Dialog content rendered and focused');
          }}>
            <DialogHeader>
              <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات المستخدم وحفظ التغييرات
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">الاسم</Label>
                <Input
                  id="edit-name"
                  value={editUserData.name}
                  onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                  placeholder="أدخل اسم المستخدم"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">البريد الإلكتروني</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">رقم الهاتف</Label>
                <Input
                  id="edit-phone"
                  value={editUserData.phone}
                  onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
                  placeholder="+20 123 456 7890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">الدور</Label>
                <select
                  id="edit-role"
                  className="w-full p-2 border rounded-md bg-background"
                  value={editUserData.role}
                  onChange={(e) => handleRoleChangeRequest(e.target.value)}
                >
                  <option value="customer">عميل</option>
                  <option value="affiliate">مسوق بالعمولة</option>
                  <option value="merchant">تاجر</option>
                  <option value="intermediary">وسيط</option>
                  <option value="admin">مدير</option>
                </select>
                {editUserData.role !== editingUser?.role && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    سيتم تطبيق الدور الجديد فوراً بدون مراجعة
                  </p>
                )}
              </div>

              {editingUser?.isIntermediary && (
                <div className="space-y-2">
                  <Label htmlFor="edit-markup">نسبة الهامش الربحي الافتراضية (%)</Label>
                  <Input
                    id="edit-markup"
                    type="number"
                    min="0"
                    max="100"
                    value={editUserData.defaultMarkupPercentage}
                    onChange={(e) => setEditUserData({ ...editUserData, defaultMarkupPercentage: e.target.value })}
                    placeholder="20"
                  />
                  <p className="text-xs text-muted-foreground">
                    النسبة التي سيتم إضافتها على سعر المنتج الأصلي
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditDialogOpen(false);
                  setEditingUser(null);
                }}
              >
                إلغاء
              </Button>
              <Button 
                onClick={handleUpdateUser}
                className="bg-blue-600 hover:bg-blue-700"
              >
                حفظ التعديلات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Role Change Confirmation Dialog */}
        <Dialog open={roleChangeConfirmOpen} onOpenChange={setRoleChangeConfirmOpen}>
          <DialogContent className="sm:max-w-[500px]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-orange-600">
                <AlertCircle className="h-6 w-6" />
                تحذير: تغيير الدور
              </DialogTitle>
              <DialogDescription>
                يرجى قراءة التحذير التالي بعناية قبل المتابعة
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 p-4 rounded-lg">
                <h3 className="font-bold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  تحذير هام
                </h3>
                <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>سيفقد المستخدم جميع البيانات المرتبطة بالدور القديم</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>سيتم حذف المنتجات، الطلبات، والإحصائيات القديمة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>لا يمكن التراجع عن هذا الإجراء</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>سيتم تطبيق الدور الجديد فوراً بدون مراجعة</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">
                  التغيير المطلوب:
                </h3>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">الدور الحالي</p>
                    <Badge className="text-base px-4 py-1">
                      {editingUser?.role === 'customer' && 'عميل'}
                      {editingUser?.role === 'affiliate' && 'مسوق'}
                      {editingUser?.role === 'merchant' && 'تاجر'}
                      {editingUser?.role === 'intermediary' && 'وسيط'}
                      {editingUser?.role === 'admin' && 'مدير'}
                    </Badge>
                  </div>
                  <div className="text-2xl text-muted-foreground">→</div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">الدور الجديد</p>
                    <Badge className="text-base px-4 py-1 bg-green-100 text-green-800">
                      {pendingRoleChange === 'customer' && 'عميل'}
                      {pendingRoleChange === 'affiliate' && 'مسوق'}
                      {pendingRoleChange === 'merchant' && 'تاجر'}
                      {pendingRoleChange === 'intermediary' && 'وسيط'}
                      {pendingRoleChange === 'admin' && 'مدير'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ℹ️ <strong>ملاحظة:</strong> سيتم تفعيل الحساب تلقائياً بالدور الجديد دون الحاجة لمراجعة الأدمن
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setRoleChangeConfirmOpen(false);
                  setPendingRoleChange(null);
                }}
              >
                إلغاء
              </Button>
              <Button 
                onClick={confirmRoleChange}
                className="bg-red-600 hover:bg-red-700"
              >
                تأكيد التغيير
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
