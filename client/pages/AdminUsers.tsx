import { useState, useEffect } from 'react';
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Users, Edit, Trash2, Search, UserPlus, CheckSquare, Square, Trash, UserCog } from 'lucide-react';
import { databases, appwriteConfig } from '@/lib/appwrite';
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

export default function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
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

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        'users',
        [Query.limit(100), Query.orderDesc('$createdAt')]
      );
      
      console.log('✅ Loaded users:', response.documents.length);
      setUsers(response.documents);
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
  };

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
      // تحديث بيانات المستخدم في users collection
      const updateData: any = {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone || '',
      };

      // تحديث الأدوار
      updateData.isAffiliate = editFormData.role === 'affiliate';
      updateData.isMerchant = editFormData.role === 'merchant';
      updateData.isIntermediary = editFormData.role === 'intermediary';

      await databases.updateDocument(
        DATABASE_ID,
        'users',
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

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`هل أنت متأكد من حذف ${userName}؟`)) return;

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        'users',
        userId
      );

      toast({
        title: "نجح",
        description: "تم حذف المستخدم بنجاح"
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

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm);
    
    // تحديد الدور الفعلي للمستخدم
    let userRole = 'customer';
    if (u.isAffiliate) userRole = 'affiliate';
    if (u.isMerchant) userRole = 'merchant';
    if (u.isIntermediary) userRole = 'intermediary';
    if (u.email === 'admin@egygo.com') userRole = 'admin';
    
    const matchesRole = roleFilter === 'all' || userRole === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
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
