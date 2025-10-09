import { RequestHandler } from 'express';

// ============================================
// RBAC & Security APIs
// ============================================

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  success: boolean;
  timestamp: Date;
}

// GET /api/rbac/roles - قائمة جميع الأدوار
export const getRoles: RequestHandler = async (req, res) => {
  try {
    // جلب الأدوار من Appwrite database
    const { listDocuments } = require('../lib/appwrite');
    const result = await listDocuments('roles');
    res.json(result.documents);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

// POST /api/rbac/roles - إنشاء دور جديد
export const createRole: RequestHandler = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    
    // Validation
    if (!name || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ 
        error: 'Name and permissions array are required' 
      });
    }
    
    // Validate permission types
    const validPermissions = ['read', 'write', 'delete', 'admin'];
    const invalidPerms = permissions.filter(p => !validPermissions.includes(p));
    
    if (invalidPerms.length > 0) {
      return res.status(400).json({ 
        error: `Invalid permissions: ${invalidPerms.join(', ')}` 
      });
    }
    
    // حفظ الدور في Appwrite database
    let created;
    try {
      const { createDocument } = require('../lib/appwrite');
      created = await createDocument('roles', {
        name,
        permissions,
        createdAt: new Date().toISOString()
      });
    } catch (dbError) {
      console.error('Error saving role to DB:', dbError);
      await logAudit({
        userId: req.headers['x-user-id'] as string || 'system',
        action: 'create',
        resource: 'role',
        ipAddress: req.ip || 'unknown',
        success: false
      });
      return res.status(500).json({ error: 'Failed to save role to database' });
    }
    // Log audit
    await logAudit({
      userId: req.headers['x-user-id'] as string || 'system',
      action: 'create',
      resource: 'role',
      ipAddress: req.ip || 'unknown',
      success: true
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating role:', error);
    
    await logAudit({
      userId: req.headers['x-user-id'] as string || 'system',
      action: 'create',
      resource: 'role',
      ipAddress: req.ip || 'unknown',
      success: false
    });
    
    res.status(500).json({ error: 'Failed to create role' });
  }
};

// PUT /api/rbac/roles/:id - تحديث دور
export const updateRole: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Role ID is required' });
    }
    
    // تحديث الدور في Appwrite database
    let updated;
    try {
      const { updateDocument } = require('../lib/appwrite');
      updated = await updateDocument('roles', id, {
        name,
        permissions
      });
    } catch (dbError) {
      console.error('Error updating role in DB:', dbError);
      await logAudit({
        userId: req.headers['x-user-id'] as string || 'system',
        action: 'update',
        resource: 'role',
        ipAddress: req.ip || 'unknown',
        success: false
      });
      return res.status(500).json({ error: 'Failed to update role in database' });
    }
    await logAudit({
      userId: req.headers['x-user-id'] as string || 'system',
      action: 'update',
      resource: 'role',
      ipAddress: req.ip || 'unknown',
      success: true
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating role:', error);
    
    await logAudit({
      userId: req.headers['x-user-id'] as string || 'system',
      action: 'update',
      resource: 'role',
      ipAddress: req.ip || 'unknown',
      success: false
    });
    
    res.status(500).json({ error: 'Failed to update role' });
  }
};

// GET /api/rbac/audit-logs - سجل التدقيق
export const getAuditLogs: RequestHandler = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, action, resource } = req.query;
    
    // جلب سجل التدقيق من Appwrite database مع الفلترة
    const { listDocuments, Query } = require('../lib/appwrite');
    const queries: any[] = [];
    if (userId) queries.push(Query.equal('userId', String(userId)));
    if (action) queries.push(Query.equal('action', String(action)));
    if (resource) queries.push(Query.equal('resource', String(resource)));
    queries.push(Query.orderDesc('timestamp'));
    queries.push(Query.limit(Number(limit)));
    queries.push(Query.offset((Number(page) - 1) * Number(limit)));
    const result = await listDocuments('audit_logs', queries);
    res.json({
      logs: result.documents,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

// POST /api/rbac/check-permission - فحص الصلاحيات
export const checkPermission: RequestHandler = async (req, res) => {
  try {
    const { userId, resource, action } = req.body;
    
    if (!userId || !resource || !action) {
      return res.status(400).json({ 
        error: 'userId, resource, and action are required' 
      });
    }
    
    // فحص الصلاحيات من Appwrite database
    let hasPermission = false;
    try {
      const { listDocuments, Query } = require('../lib/appwrite');
      // جلب دور المستخدم
      const userResult = await listDocuments('users', [Query.equal('userId', userId), Query.limit(1)]);
      let userRole = '';
      if (userResult.documents.length > 0) {
        userRole = userResult.documents[0].role;
      }
      // جلب صلاحيات الدور
      let permissions: string[] = [];
      if (userRole) {
        const roleResult = await listDocuments('roles', [Query.equal('name', userRole), Query.limit(1)]);
        if (roleResult.documents.length > 0) {
          permissions = roleResult.documents[0].permissions;
        }
      }
      hasPermission = permissions.includes(action) || userRole === 'admin';
    } catch (e) {
      console.error('Error checking permission from DB:', e);
    }
    await logAudit({
      userId,
      action: 'check-permission',
      resource,
      ipAddress: req.ip || 'unknown',
      success: hasPermission
    });
    res.json({ 
      hasPermission,
      userId,
      resource,
      action,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error checking permission:', error);
    res.status(500).json({ error: 'Permission check failed' });
  }
};

// Helper function للـ audit logging
async function logAudit(data: Omit<AuditLog, 'id' | 'timestamp'>) {
  try {
    const { createDocument } = require('../lib/appwrite');
    await createDocument('audit_logs', {
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
}
