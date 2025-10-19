import { useState, useEffect, useMemo, useCallback } from 'react';
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Users, Edit, Trash2, Search, UserPlus, CheckSquare, Square, Trash, UserCog, ChevronLeft, ChevronRight, TrendingUp, UserCheck, UserX, Shield } from 'lucide-react';
import { databases, appwriteConfig, account } from '@/lib/appwrite';
import { Client, Users as AppwriteUsers } from 'appwrite';
import { Query, ID } from 'appwrite';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

// Initialize Appwrite Users API for admin operations
const adminClient = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

const usersAPI = new AppwriteUsers(adminClient);

export default function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const USERS_PER_PAGE = 25;
  
  // Bulk Selection State
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>('');
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [bulkRoleChange, setBulkRoleChange] = useState<string>('customer');
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer'
  });

  // Intermediary Modal State
  const [showIntermediaryModal, setShowIntermediaryModal] = useState(false);
  const [selectedUserForIntermediary, setSelectedUserForIntermediary] = useState<any>(null);
  const [intermediaryMarkup, setIntermediaryMarkup] = useState('20');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadUsers();
  }, [currentPage, debouncedSearch, roleFilter]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const queries = [
        Query.limit(USERS_PER_PAGE),
        Query.offset((currentPage - 1) * USERS_PER_PAGE),
        Query.orderDesc('$createdAt')
      ];

      const response = await databases.listDocuments(
        DATABASE_ID,
        'userPreferences',
        queries
      );
      
      console.log('✅ Loaded users:', response.documents.length);
      setUsers(response.documents);
      setTotalUsers(response.total);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "خطأ",
        description: "فشل تحميل المستخدمين",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, roleFilter]);

  const openEditModal = (user: any) => {
    console.log('Opening edit modal for:', user.name);
    setEditingUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'customer'
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      role: 'customer'
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      // 1. تحديث في Auth أولاً (إذا تغير الاسم أو البريد أو الهاتف)
      if (editingUser.userId) {
        try {
          const authUpdates: any = {};
          
          if (editFormData.name !== editingUser.name) {
            authUpdates.name = editFormData.name;
          }
          
          if (editFormData.email !== editingUser.email) {
            authUpdates.email = editFormData.email;
          }
          
          if (editFormData.phone !== editingUser.phone) {
            authUpdates.phone = editFormData.phone;
          }

          // Update in Auth if there are changes
          if (Object.keys(authUpdates).length > 0) {
            // Note: This requires Admin API key which should be handled server-side
            // For now, we'll log it and handle it in userPreferences only
            console.log('⚠️ Auth update needed (requires server-side API):', authUpdates);
          }
        } catch (authError) {
          console.error('Error updating Auth:', authError);
        }
      }

      // 2. تحديث بيانات المستخدم في userPreferences collection
      const updateData: any = {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone || '',
        role: editFormData.role,
      };

      // تحديث الأدوار
      updateData.isAffiliate = editFormData.role === 'affiliate';
      updateData.isMerchant = editFormData.role === 'merchant';
      updateData.isIntermediary = editFormData.role === 'intermediary';
      updateData.isAdmin = editFormData.role === 'admin';

      await databases.updateDocument(
        DATABASE_ID,
        'userPreferences',
        editingUser.$id,
        updateData
      );

      // Send notification if role changed
      if (editFormData.role !== editingUser.role) {
        const roleNames: Record<string, string> = {
          customer: 'عميل',
          merchant: 'تاجر',
          affiliate: 'مسوق',
          intermediary: 'وسيط',
          admin: 'مدير'
        };

        const oldRoleName = roleNames[editingUser.role] || editingUser.role;
        const newRoleName = roleNames[editFormData.role] || editFormData.role;

        try {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.notifications,
            ID.unique(),
            {
              userId: editingUser.userId,
              title: '🎉 تم تحديث دورك بنجاح',
              message: `تم تغيير دورك من ${oldRoleName} إلى ${newRoleName}. يمكنك الآن الوصول إلى المميزات الجديدة!`,
              type: 'success',
              isRead: false,
              link: editFormData.role === 'merchant' ? '/merchant/dashboard' :
                    editFormData.role === 'affiliate' ? '/affiliate/dashboard' :
                    editFormData.role === 'intermediary' ? '/intermediary/dashboard' :
                    editFormData.role === 'admin' ? '/admin/dashboard' : '/'
            }
          );
          console.log('✅ Role change notification sent');
        } catch (notifError) {
          console.error('Error sending notification:', notifError);
        }
      }

      toast({
        title: "نجح",
        description: "تم تحديث بيانات المستخدم بنجاح"
      });

      closeEditModal();
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "خطأ",
        description: "فشل تحديث بيانات المستخدم",
        variant: "destructive"
      });
    }
  };

  const openIntermediaryModal = (user: any) => {
    console.log('Opening intermediary modal for:', user.name);
    setSelectedUserForIntermediary(user);
    setShowIntermediaryModal(true);
  };

  const closeIntermediaryModal = () => {
    setShowIntermediaryModal(false);
    setSelectedUserForIntermediary(null);
    setIntermediaryMarkup('20');
  };

  const handleActivateIntermediary = async () => {
    if (!selectedUserForIntermediary) return;

    try {
      // تحديث المستخدم في users collection
      const intermediaryCode = `INT${Date.now()}`;
      
      await databases.updateDocument(
        DATABASE_ID,
        'users',
        selectedUserForIntermediary.$id,
        {
          isIntermediary: true,
          affiliateCode: intermediaryCode,
          commissionRate: parseFloat(intermediaryMarkup) / 100
        }
      );
      
      console.log('✅ Intermediary activated');

      // Send notification to user
      try {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.notifications,
          ID.unique(),
          {
            userId: selectedUserForIntermediary.userId,
            title: '🎉 مبروك! تم تفعيلك كوسيط',
            message: `تم تفعيل حسابك كوسيط بنجاح! كود الوسيط الخاص بك: ${intermediaryCode}. نسبة الهامش الافتراضية: ${intermediaryMarkup}%. يمكنك الآن إنشاء روابط خاصة بك وإضافة هامش ربح على المنتجات.`,
            type: 'success',
            isRead: false,
            link: '/intermediary/dashboard'
          }
        );
        console.log('✅ Intermediary activation notification sent');
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
      }

      toast({
        title: "نجح",
        description: `تم تفعيل ${selectedUserForIntermediary.name} كوسيط بنجاح`,
      });

      closeIntermediaryModal();
      loadUsers();
    } catch (error) {
      console.error('Error activating intermediary:', error);
      toast({
        title: "خطأ",
        description: "فشل تفعيل الوسيط",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (documentId: string, userName: string) => {
    if (!confirm(`هل أنت متأكد من حذف ${userName}؟ سيتم حذف جميع بياناته بشكل نهائي من النظام والمصادقة.`)) return;

    try {
      // Get user data first to find userId
      const userDoc = await databases.getDocument(
        DATABASE_ID,
        'userPreferences',
        documentId
      );

      const userId = (userDoc as any).userId;

      // 1. حذف الإشعارات
      try {
        const notifications = await databases.listDocuments(
          DATABASE_ID,
          'notifications',
          [
            Query.equal('userId', userId),
            Query.limit(100)
          ]
        );
        
        for (const notif of notifications.documents) {
          await databases.deleteDocument(DATABASE_ID, 'notifications', notif.$id);
        }
        console.log(`✅ Deleted ${notifications.documents.length} notifications`);
      } catch (notifError) {
        console.error('Error deleting notifications:', notifError);
      }

      // 2. حذف الإحالات
      try {
        const referrals = await databases.listDocuments(
          DATABASE_ID,
          'referrals',
          [
            Query.equal('referredUserId', userId),
            Query.limit(100)
          ]
        );
        
        for (const ref of referrals.documents) {
          await databases.deleteDocument(DATABASE_ID, 'referrals', ref.$id);
        }
        console.log(`✅ Deleted ${referrals.documents.length} referrals`);
      } catch (refError) {
        console.error('Error deleting referrals:', refError);
      }

      // 3. حذف من userPreferences collection
      await databases.deleteDocument(
        DATABASE_ID,
        'userPreferences',
        documentId
      );
      console.log('✅ Deleted from userPreferences');

      // 4. حذف من Auth (يتطلب Admin API - يجب أن يتم من السيرفر)
      // Note: This requires server-side implementation with Admin API key
      console.log('⚠️ Auth deletion requires server-side API with Admin key');
      console.log(`   User ID to delete from Auth: ${userId}`);

      toast({
        title: "نجح",
        description: "تم حذف المستخدم من قاعدة البيانات. ملاحظة: قد يحتاج الحذف من Auth إلى عملية يدوية."
      });

      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "خطأ",
        description: "فشل حذف المستخدم",
        variant: "destructive"
      });
    }
  };

  // Bulk Selection Functions
  const toggleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.$id)));
    }
  };

  const handleBulkAction = async () => {
    if (selectedUsers.size === 0) {
      toast({
        title: "تنبيه",
        description: "الرجاء اختيار مستخدم واحد على الأقل",
        variant: "destructive"
      });
      return;
    }

    if (!bulkAction) {
      toast({
        title: "تنبيه",
        description: "الرجاء اختيار إجراء",
        variant: "destructive"
      });
      return;
    }

    if (bulkAction === 'delete') {
      if (!confirm(`هل أنت متأكد من حذف ${selectedUsers.size} مستخدم؟`)) return;
      
      let successCount = 0;
      let failCount = 0;

      for (const userId of selectedUsers) {
        try {
          await databases.deleteDocument(DATABASE_ID, 'users', userId);
          successCount++;
        } catch (error) {
          console.error('Error deleting user:', userId, error);
          failCount++;
        }
      }

      toast({
        title: "تم",
        description: `تم حذف ${successCount} مستخدم، فشل ${failCount}`
      });

      setSelectedUsers(new Set());
      loadUsers();
    } else if (bulkAction === 'change_role') {
      setShowBulkActionModal(true);
    }
  };

  const handleBulkRoleChange = async () => {
    let successCount = 0;
    let failCount = 0;

    for (const userId of selectedUsers) {
      try {
        // تحديث الأدوار في users collection
        const updateData: any = {
          isAffiliate: bulkRoleChange === 'affiliate',
          isMerchant: bulkRoleChange === 'merchant',
          isIntermediary: bulkRoleChange === 'intermediary',
        };

        await databases.updateDocument(
          DATABASE_ID,
          'users',
          userId,
          updateData
        );

        successCount++;
      } catch (error) {
        console.error('Error updating user role:', userId, error);
        failCount++;
      }
    }

    toast({
      title: "تم",
      description: `تم تحديث ${successCount} مستخدم، فشل ${failCount}`
    });

    setSelectedUsers(new Set());
    setShowBulkActionModal(false);
    setBulkAction('');
    loadUsers();
  };

  const getRoleBadge = (user: any) => {
    // تحديد الدور بناءً على الحقول
    let role = 'customer';
    let roleName = 'عميل';
    let roleColor = 'bg-gray-100 text-gray-800';
    
    if (user.isAffiliate) {
      role = 'affiliate';
      roleName = 'مسوق';
      roleColor = 'bg-green-100 text-green-800';
    }
    if (user.isMerchant) {
      role = 'merchant';
      roleName = 'تاجر';
      roleColor = 'bg-blue-100 text-blue-800';
    }
    if (user.isIntermediary) {
      role = 'intermediary';
      roleName = 'وسيط';
      roleColor = 'bg-purple-100 text-purple-800';
    }
    // Admin يتم تحديده من email أو حقل خاص
    if (user.email === 'admin@egygo.com' || user.role === 'admin') {
      role = 'admin';
      roleName = 'مدير';
      roleColor = 'bg-red-100 text-red-800';
    }

    return (
      <Badge className={roleColor}>
        {roleName}
      </Badge>
    );
  };

  // استخدام useMemo للبيانات المحسوبة
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.phone?.includes(debouncedSearch);
      
      // تحديد الدور الفعلي للمستخدم
      let userRole = 'customer';
      if (u.isAffiliate) userRole = 'affiliate';
      if (u.isMerchant) userRole = 'merchant';
      if (u.isIntermediary) userRole = 'intermediary';
      if (u.email === 'admin@egygo.com') userRole = 'admin';
      
      const matchesRole = roleFilter === 'all' || userRole === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, debouncedSearch, roleFilter]);

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  // Calculate statistics from filtered users
  const stats = useMemo(() => {
    const totalCount = totalUsers;
    const customerCount = users.filter(u => u.role === 'customer').length;
    const affiliateCount = users.filter(u => u.isAffiliate).length;
    const merchantCount = users.filter(u => u.isMerchant).length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const pendingCount = users.filter(u => u.accountStatus === 'pending').length;
    const approvedCount = users.filter(u => u.accountStatus === 'approved').length;
    
    return {
      total: totalCount,
      customer: customerCount,
      affiliate: affiliateCount,
      merchant: merchantCount,
      admin: adminCount,
      pending: pendingCount,
      approved: approvedCount,
    };
  }, [users, totalUsers]);

  return (
    <AdminLayout>
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.approved} موافق عليه، {stats.pending} معلق
            </p>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.customer}</div>
            <p className="text-xs text-muted-foreground mt-1">
              المستخدمين العاديين
            </p>
          </CardContent>
        </Card>

        {/* Affiliates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المسوقين</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.affiliate}</div>
            <p className="text-xs text-muted-foreground mt-1">
              الشركاء المسوقين
            </p>
          </CardContent>
        </Card>

        {/* Merchants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التجار</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.merchant}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.admin > 0 && `+ ${stats.admin} مدير`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            إدارة المستخدمين والشركاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="بحث بالاسم أو البريد أو الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div>
              <select
                className="w-full p-2 border rounded-md"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">جميع الأدوار</option>
                <option value="customer">عملاء</option>
                <option value="merchant">تجار</option>
                <option value="affiliate">مسوقين</option>
                <option value="intermediary">وسطاء</option>
                <option value="admin">مدراء</option>
              </select>
            </div>

            <Button 
              onClick={() => loadUsers()}
              variant="outline"
            >
              تحديث القائمة
            </Button>
          </div>

          {/* Bulk Actions Bar */}
          {selectedUsers.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-blue-900">
                    تم اختيار {selectedUsers.size} مستخدم
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUsers(new Set())}
                  >
                    إلغاء الاختيار
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="اختر إجراء..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="change_role">تغيير الدور</SelectItem>
                      <SelectItem value="delete">حذف المستخدمين</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    تطبيق
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-center p-2 w-12">
                      <Checkbox
                        checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-right p-2">الاسم</th>
                    <th className="text-right p-2">البريد</th>
                    <th className="text-right p-2">الهاتف</th>
                    <th className="text-right p-2">الدور</th>
                    <th className="text-right p-2">الكود</th>
                    <th className="text-right p-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.$id} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-center">
                        <Checkbox
                          checked={selectedUsers.has(u.$id)}
                          onCheckedChange={() => toggleSelectUser(u.$id)}
                        />
                      </td>
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.phone || '-'}</td>
                      <td className="p-2">{getRoleBadge(u)}</td>
                      <td className="p-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {u.affiliateCode || '-'}
                        </code>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          {/* Activate Intermediary Button */}
                          {!u.isIntermediary && !u.isMerchant && !u.isAffiliate && (
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              onClick={() => openIntermediaryModal(u)}
                            >
                              تفعيل وسيط
                            </Button>
                          )}
                          
                          {/* Edit Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(u)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {/* Delete Button */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(u.$id, u.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    عرض {((currentPage - 1) * USERS_PER_PAGE) + 1} إلى {Math.min(currentPage * USERS_PER_PAGE, totalUsers)} من {totalUsers} مستخدم
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                      السابق
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      التالي
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">تعديل بيانات المستخدم</h2>
            
            <div className="space-y-4">
              <div>
                <Label>الاسم</Label>
                <Input
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                />
              </div>
              
              <div>
                <Label>رقم الهاتف</Label>
                <Input
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                />
              </div>
              
              <div>
                <Label>الدور</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                >
                  <option value="customer">عميل</option>
                  <option value="merchant">تاجر</option>
                  <option value="affiliate">مسوق</option>
                  <option value="intermediary">وسيط</option>
                  <option value="admin">مدير</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={closeEditModal} variant="outline">
                إلغاء
              </Button>
              <Button onClick={handleUpdateUser}>
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Intermediary Modal */}
      {showIntermediaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">تفعيل دور الوسيط</h2>
            
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <p className="text-sm">
                <strong>العميل:</strong> {selectedUserForIntermediary?.name}
              </p>
              <p className="text-sm">
                <strong>البريد:</strong> {selectedUserForIntermediary?.email}
              </p>
            </div>
            
            <div className="mb-4">
              <Label>نسبة الهامش الافتراضية (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={intermediaryMarkup}
                onChange={(e) => setIntermediaryMarkup(e.target.value)}
                placeholder="20"
              />
              <p className="text-xs text-gray-500 mt-1">
                النسبة التي سيتم إضافتها على سعر المنتج الأصلي
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={closeIntermediaryModal} variant="outline">
                إلغاء
              </Button>
              <Button 
                onClick={handleActivateIntermediary}
                className="bg-purple-600 hover:bg-purple-700"
              >
                تفعيل الوسيط
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Role Change Modal */}
      {showBulkActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserCog className="h-6 w-6" />
              تغيير الدور لـ {selectedUsers.size} مستخدم
            </h2>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-900">
                سيتم تغيير دور جميع المستخدمين المحددين إلى الدور الجديد
              </p>
            </div>
            
            <div className="mb-4">
              <Label>الدور الجديد</Label>
              <Select value={bulkRoleChange} onValueChange={setBulkRoleChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">عميل</SelectItem>
                  <SelectItem value="merchant">تاجر</SelectItem>
                  <SelectItem value="affiliate">مسوق</SelectItem>
                  <SelectItem value="intermediary">وسيط</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowBulkActionModal(false)} 
                variant="outline"
              >
                إلغاء
              </Button>
              <Button 
                onClick={handleBulkRoleChange}
                className="bg-blue-600 hover:bg-blue-700"
              >
                تطبيق التغيير
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
