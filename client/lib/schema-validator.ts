/**
 * Schema Validation System
 * يمنع إرسال بيانات غير متطابقة مع Appwrite schema
 */

// Notification Types (من schema الفعلي)
export const NOTIFICATION_TYPES = [
  'order',
  'shipping',
  'delivery',
  'alert',
  'info',
  'commission',
  'affiliate'
] as const;

export type NotificationType = typeof NOTIFICATION_TYPES[number];

// Notification Schema
export interface NotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead?: boolean;
  link?: string;
  colorSizeInventory?: string;
  targetAudience?: string;
  channels?: string;
  status?: 'draft' | 'sent' | 'scheduled' | 'failed';
}

// UserPreferences Schema (الحقول المسموح تحديثها)
export interface UserPreferencesUpdateData {
  accountStatus?: 'pending' | 'approved' | 'rejected';
  email?: string;
  name?: string;
  phone?: string;
  role?: string;
  isAdmin?: boolean;
  isAffiliate?: boolean;
  isMerchant?: boolean;
  isIntermediary?: boolean;
  affiliateCode?: string;
  intermediaryCode?: string;
  defaultMarkupPercentage?: number;
  commissionRate?: number;
  businessName?: string;
  businessAddress?: string;
  taxId?: string;
}

// Users Schema (الحقول المسموح تحديثها)
export interface UsersUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  isAffiliate?: boolean;
  affiliateCode?: string;
  commissionRate?: number;
  alternativePhone?: string;
  accountStatus?: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  avatar?: string;
  isMerchant?: boolean;
  isAdmin?: boolean;
  userName?: string;
  profileImage?: string;
  status?: string;
  isIntermediary?: boolean;
  isActive?: boolean;
  role?: string;
  totalEarnings?: number;
  pendingEarnings?: number;
  referralCount?: number;
}

/**
 * Validate Notification Data
 */
export function validateNotification(data: any): NotificationData {
  // Required fields
  if (!data.userId || typeof data.userId !== 'string') {
    throw new Error('userId is required and must be a string');
  }
  
  if (!data.type || !NOTIFICATION_TYPES.includes(data.type)) {
    throw new Error(`type must be one of: ${NOTIFICATION_TYPES.join(', ')}`);
  }
  
  if (!data.title || typeof data.title !== 'string') {
    throw new Error('title is required and must be a string');
  }
  
  if (!data.message || typeof data.message !== 'string') {
    throw new Error('message is required and must be a string');
  }

  // Size validation
  if (data.title.length > 500) {
    throw new Error('title must be less than 500 characters');
  }
  
  if (data.message.length > 2000) {
    throw new Error('message must be less than 2000 characters');
  }

  // Build valid object with only allowed fields
  const validData: NotificationData = {
    userId: data.userId,
    type: data.type,
    title: data.title,
    message: data.message,
  };

  // Optional fields
  if (data.isRead !== undefined) validData.isRead = Boolean(data.isRead);
  if (data.link) validData.link = String(data.link).substring(0, 500);
  if (data.colorSizeInventory) validData.colorSizeInventory = String(data.colorSizeInventory).substring(0, 5000);
  if (data.targetAudience) validData.targetAudience = String(data.targetAudience).substring(0, 50);
  if (data.channels) validData.channels = String(data.channels).substring(0, 500);
  if (data.status) validData.status = data.status;

  return validData;
}

/**
 * Validate UserPreferences Update Data
 */
export function validateUserPreferencesUpdate(data: any): UserPreferencesUpdateData {
  const validData: UserPreferencesUpdateData = {};

  // Only include fields that exist in schema
  if (data.accountStatus !== undefined) {
    if (!['pending', 'approved', 'rejected'].includes(data.accountStatus)) {
      throw new Error('accountStatus must be pending, approved, or rejected');
    }
    validData.accountStatus = data.accountStatus;
  }
  
  if (data.email !== undefined) validData.email = String(data.email).substring(0, 255);
  if (data.name !== undefined) validData.name = String(data.name).substring(0, 255);
  if (data.phone !== undefined) validData.phone = String(data.phone).substring(0, 50);
  if (data.role !== undefined) validData.role = String(data.role).substring(0, 50);
  if (data.isAdmin !== undefined) validData.isAdmin = Boolean(data.isAdmin);
  if (data.isAffiliate !== undefined) validData.isAffiliate = Boolean(data.isAffiliate);
  if (data.isMerchant !== undefined) validData.isMerchant = Boolean(data.isMerchant);
  if (data.isIntermediary !== undefined) validData.isIntermediary = Boolean(data.isIntermediary);
  if (data.affiliateCode !== undefined) validData.affiliateCode = String(data.affiliateCode).substring(0, 100);
  if (data.intermediaryCode !== undefined) validData.intermediaryCode = String(data.intermediaryCode).substring(0, 100);
  if (data.defaultMarkupPercentage !== undefined) validData.defaultMarkupPercentage = Number(data.defaultMarkupPercentage);
  if (data.commissionRate !== undefined) validData.commissionRate = Number(data.commissionRate);
  if (data.businessName !== undefined) validData.businessName = String(data.businessName).substring(0, 255);
  if (data.businessAddress !== undefined) validData.businessAddress = String(data.businessAddress).substring(0, 500);
  if (data.taxId !== undefined) validData.taxId = String(data.taxId).substring(0, 100);

  return validData;
}

/**
 * Validate Users Update Data
 */
export function validateUsersUpdate(data: any): UsersUpdateData {
  const validData: UsersUpdateData = {};

  // Validate and include only schema fields
  if (data.name !== undefined) validData.name = String(data.name).substring(0, 255);
  if (data.email !== undefined) validData.email = String(data.email).substring(0, 255);
  if (data.phone !== undefined) validData.phone = String(data.phone).substring(0, 20);
  if (data.address !== undefined) validData.address = String(data.address).substring(0, 500);
  if (data.isAffiliate !== undefined) validData.isAffiliate = Boolean(data.isAffiliate);
  if (data.affiliateCode !== undefined) validData.affiliateCode = String(data.affiliateCode).substring(0, 10);
  if (data.commissionRate !== undefined) validData.commissionRate = Number(data.commissionRate);
  if (data.alternativePhone !== undefined) validData.alternativePhone = String(data.alternativePhone).substring(0, 255);
  
  if (data.accountStatus !== undefined) {
    if (!['pending', 'approved', 'rejected'].includes(data.accountStatus)) {
      throw new Error('accountStatus must be pending, approved, or rejected');
    }
    validData.accountStatus = data.accountStatus;
  }
  
  if (data.approvedAt !== undefined) validData.approvedAt = String(data.approvedAt);
  if (data.approvedBy !== undefined) validData.approvedBy = String(data.approvedBy).substring(0, 255);
  if (data.rejectionReason !== undefined) validData.rejectionReason = String(data.rejectionReason).substring(0, 1000);
  if (data.avatar !== undefined) validData.avatar = String(data.avatar).substring(0, 2000);
  if (data.isMerchant !== undefined) validData.isMerchant = Boolean(data.isMerchant);
  if (data.isAdmin !== undefined) validData.isAdmin = Boolean(data.isAdmin);
  if (data.userName !== undefined) validData.userName = String(data.userName).substring(0, 255);
  if (data.profileImage !== undefined) validData.profileImage = String(data.profileImage).substring(0, 2000);
  if (data.status !== undefined) validData.status = String(data.status).substring(0, 50);
  if (data.isIntermediary !== undefined) validData.isIntermediary = Boolean(data.isIntermediary);
  if (data.isActive !== undefined) validData.isActive = Boolean(data.isActive);
  if (data.role !== undefined) validData.role = String(data.role);
  if (data.totalEarnings !== undefined) validData.totalEarnings = Number(data.totalEarnings);
  if (data.pendingEarnings !== undefined) validData.pendingEarnings = Number(data.pendingEarnings);
  if (data.referralCount !== undefined) validData.referralCount = Number(data.referralCount);

  return validData;
}

/**
 * Safe Database Update - validates before sending
 */
export async function safeUpdateDocument(
  databases: any,
  databaseId: string,
  collectionId: string,
  documentId: string,
  data: any
): Promise<any> {
  let validatedData: any;

  // Validate based on collection
  switch (collectionId) {
    case 'userPreferences':
      validatedData = validateUserPreferencesUpdate(data);
      break;
    case 'users':
      validatedData = validateUsersUpdate(data);
      break;
    default:
      validatedData = data; // No validation for unknown collections
  }

  console.log(`✅ Validated data for ${collectionId}:`, validatedData);

  return databases.updateDocument(databaseId, collectionId, documentId, validatedData);
}

/**
 * Safe Notification Create - validates before sending
 */
export async function safeCreateNotification(
  databases: any,
  databaseId: string,
  collectionId: string,
  documentId: string,
  data: any
): Promise<any> {
  const validatedData = validateNotification(data);
  
  console.log('✅ Validated notification:', validatedData);

  return databases.createDocument(databaseId, collectionId, documentId, validatedData);
}
