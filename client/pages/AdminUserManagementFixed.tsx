import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Users, Edit, Trash2, Search, UserPlus } from 'lucide-react';
import { databases } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export default function AdminUserManagementFixed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
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
        'userPreferences',
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
      const updateData: any = {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone || '',
        role: editFormData.role,
        isAdmin: editFormData.role === 'admin',
        isAffiliate: editFormData.role === 'affiliate',
        isMerchant: editFormData.role === 'merchant',
        isIntermediary: editFormData.role === 'intermediary',
        accountStatus: 'approved'
      };

      // Update role-specific data
      if (editFormData.role !== editingUser.role) {
        updateData.affiliateCode = editFormData.role === 'affiliate' ? `AFF${Date.now()}` : '';
        updateData.intermediaryCode = editFormData.role === 'intermediary' ? `INT${Date.now()}` : '';
        updateData.defaultMarkupPercentage = editFormData.role === 'intermediary' ? 20 : 0;
        updateData.commissionRate = editFormData.role === 'affiliate' ? 10 : 0;
      }

      await databases.updateDocument(
        DATABASE_ID,
        'userPreferences',
        editingUser.$id,
        updateData
      );

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
        'userPreferences',
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
    <div className="container mx-auto p-6">
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

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
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
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.phone || '-'}</td>
                      <td className="p-2">{getRoleBadge(u.role)}</td>
                      <td className="p-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {u.affiliateCode || u.intermediaryCode || '-'}
                        </code>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          {/* Activate Intermediary Button */}
                          {u.role === 'customer' && !u.isIntermediary && (
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
    </div>
  );
}
