// ============================================
// Appwrite Helper Library
// ============================================

import { Client, Databases, ID, Query } from 'node-appwrite';

// ===== CONFIGURATION =====

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

export const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'egygo_database';

export const COLLECTIONS = {
  ROLES: 'roles',
  AUDIT_LOGS: 'audit_logs',
  SMART_CONTRACTS: 'smart_contracts',
  AB_TESTS: 'ab_tests',
  FAMILY_GROUPS: 'family_groups',
  FAMILY_MEMBERS: 'family_members',
  AR_MODELS: 'ar_models',
  CHAT_MESSAGES: 'chat_messages',
  BUNDLES: 'bundles'
};

// ===== HELPER FUNCTIONS =====

/**
 * Create a document with auto-generated ID
 */
export async function createDocument(
  collectionId: string,
  data: any,
  permissions?: string[]
) {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      collectionId,
      ID.unique(),
      data,
      permissions
    );
  } catch (error) {
    console.error(`Error creating document in ${collectionId}:`, error);
    throw error;
  }
}

/**
 * Get a document by ID
 */
export async function getDocument(collectionId: string, documentId: string) {
  try {
    return await databases.getDocument(DATABASE_ID, collectionId, documentId);
  } catch (error) {
    console.error(`Error getting document ${documentId} from ${collectionId}:`, error);
    throw error;
  }
}

/**
 * Update a document
 */
export async function updateDocument(
  collectionId: string,
  documentId: string,
  data: any,
  permissions?: string[]
) {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      collectionId,
      documentId,
      data,
      permissions
    );
  } catch (error) {
    console.error(`Error updating document ${documentId} in ${collectionId}:`, error);
    throw error;
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(collectionId: string, documentId: string) {
  try {
    return await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
  } catch (error) {
    console.error(`Error deleting document ${documentId} from ${collectionId}:`, error);
    throw error;
  }
}

/**
 * List documents with optional queries
 */
export async function listDocuments(
  collectionId: string,
  queries: string[] = []
) {
  try {
    return await databases.listDocuments(DATABASE_ID, collectionId, queries);
  } catch (error) {
    console.error(`Error listing documents from ${collectionId}:`, error);
    throw error;
  }
}

// ===== SPECIFIC HELPERS =====

/**
 * RBAC: Get role by name
 */
export async function getRoleByName(name: string) {
  const result = await listDocuments(COLLECTIONS.ROLES, [
    Query.equal('name', name),
    Query.limit(1)
  ]);
  return result.documents[0] || null;
}

/**
 * RBAC: Create audit log
 */
export async function createAuditLog(data: {
  userId: string;
  action: string;
  resource: string;
  ipAddress?: string;
  success: boolean;
  metadata?: any;
}) {
  return await createDocument(COLLECTIONS.AUDIT_LOGS, {
    userId: data.userId,
    action: data.action,
    resource: data.resource,
    ipAddress: data.ipAddress || '',
    success: data.success,
    metadata: JSON.stringify(data.metadata || {})
  });
}

/**
 * Smart Contracts: Get user contracts
 */
export async function getUserContracts(userId: string, type?: string, status?: string) {
  const queries = [Query.equal('userId', userId)];
  
  if (type) queries.push(Query.equal('type', type));
  if (status) queries.push(Query.equal('status', status));
  
  return await listDocuments(COLLECTIONS.SMART_CONTRACTS, queries);
}

/**
 * A/B Tests: Get active tests
 */
export async function getActiveABTests() {
  return await listDocuments(COLLECTIONS.AB_TESTS, [
    Query.equal('status', 'running'),
    Query.orderDesc('$createdAt')
  ]);
}

/**
 * Family: Get family group with members
 */
export async function getFamilyGroupWithMembers(groupId: string) {
  const group = await getDocument(COLLECTIONS.FAMILY_GROUPS, groupId);
  
  const membersResult = await listDocuments(COLLECTIONS.FAMILY_MEMBERS, [
    Query.equal('groupId', groupId)
  ]);
  
  return {
    ...group,
    members: membersResult.documents
  };
}

/**
 * AR Models: Get product AR models
 */
export async function getProductARModels(productId: string) {
  return await listDocuments(COLLECTIONS.AR_MODELS, [
    Query.equal('productId', productId)
  ]);
}

/**
 * Chat: Get user chat history
 */
export async function getUserChatHistory(userId: string, limit: number = 50) {
  return await listDocuments(COLLECTIONS.CHAT_MESSAGES, [
    Query.equal('userId', userId),
    Query.orderDesc('$createdAt'),
    Query.limit(limit)
  ]);
}

/**
 * Bundles: Get active bundles
 */
export async function getActiveBundles() {
  return await listDocuments(COLLECTIONS.BUNDLES, [
    Query.equal('active', true)
  ]);
}

// ===== PAGINATION HELPER =====

/**
 * Get paginated documents
 */
export async function getPaginatedDocuments(
  collectionId: string,
  page: number = 1,
  limit: number = 20,
  additionalQueries: string[] = []
) {
  const offset = (page - 1) * limit;
  
  const queries = [
    Query.limit(limit),
    Query.offset(offset),
    ...additionalQueries
  ];
  
  const result = await listDocuments(collectionId, queries);
  
  return {
    documents: result.documents,
    total: result.total,
    page,
    limit,
    totalPages: Math.ceil(result.total / limit)
  };
}

// ===== SEARCH HELPER =====

/**
 * Search documents by text (works on indexed string fields)
 */
export async function searchDocuments(
  collectionId: string,
  searchKey: string,
  searchValue: string
) {
  return await listDocuments(collectionId, [
    Query.search(searchKey, searchValue)
  ]);
}

// ===== BATCH OPERATIONS =====

/**
 * Create multiple documents (Note: Appwrite doesn't support batch, so we loop)
 */
export async function createMultipleDocuments(
  collectionId: string,
  dataArray: any[]
) {
  const promises = dataArray.map(data => createDocument(collectionId, data));
  return await Promise.all(promises);
}

/**
 * Update multiple documents
 */
export async function updateMultipleDocuments(
  collectionId: string,
  updates: Array<{ documentId: string; data: any }>
) {
  const promises = updates.map(({ documentId, data }) =>
    updateDocument(collectionId, documentId, data)
  );
  return await Promise.all(promises);
}

// ===== SEED DATA =====

/**
 * Seed default roles (run once)
 */
export async function seedDefaultRoles() {
  const defaultRoles = [
    {
      name: 'admin',
      permissions: ['read', 'write', 'delete', 'admin'],
      description: 'Full system access'
    },
    {
      name: 'merchant',
      permissions: ['read', 'write'],
      description: 'Manage products and orders'
    },
    {
      name: 'affiliate',
      permissions: ['read', 'write'],
      description: 'Create affiliate links and track performance'
    },
    {
      name: 'customer',
      permissions: ['read'],
      description: 'Browse and purchase products'
    }
  ];
  
  try {
    for (const role of defaultRoles) {
      const existing = await getRoleByName(role.name);
      if (!existing) {
        await createDocument(COLLECTIONS.ROLES, {
          ...role,
          permissions: JSON.stringify(role.permissions)
        });
        console.log(`✅ Created role: ${role.name}`);
      } else {
        console.log(`⏭️  Role already exists: ${role.name}`);
      }
    }
    console.log('✅ Default roles seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
  }
}

// ===== EXPORT =====

export { Query, ID };

// ===== USAGE EXAMPLES =====

/**
 * Example 1: Create a role
 * 
 * import { createDocument, COLLECTIONS } from '@/lib/appwrite';
 * 
 * const role = await createDocument(COLLECTIONS.ROLES, {
 *   name: 'moderator',
 *   permissions: JSON.stringify(['read', 'write']),
 *   description: 'Moderator role'
 * });
 */

/**
 * Example 2: Get audit logs with pagination
 * 
 * import { getPaginatedDocuments, COLLECTIONS, Query } from '@/lib/appwrite';
 * 
 * const logs = await getPaginatedDocuments(
 *   COLLECTIONS.AUDIT_LOGS,
 *   1,
 *   20,
 *   [Query.equal('userId', 'user123'), Query.orderDesc('$createdAt')]
 * );
 */

/**
 * Example 3: Create smart contract
 * 
 * import { createDocument, COLLECTIONS } from '@/lib/appwrite';
 * 
 * const contract = await createDocument(COLLECTIONS.SMART_CONTRACTS, {
 *   userId: 'user123',
 *   type: 'affiliate',
 *   terms: JSON.stringify({
 *     commissionRate: 10,
 *     paymentSchedule: 'monthly'
 *   }),
 *   status: 'active'
 * });
 */

/**
 * Example 4: Update A/B test winner
 * 
 * import { updateDocument, COLLECTIONS } from '@/lib/appwrite';
 * 
 * await updateDocument(COLLECTIONS.AB_TESTS, testId, {
 *   winner: 'variant_a',
 *   status: 'completed'
 * });
 */

/**
 * Example 5: Search chat messages
 * 
 * import { searchDocuments, COLLECTIONS } from '@/lib/appwrite';
 * 
 * const results = await searchDocuments(
 *   COLLECTIONS.CHAT_MESSAGES,
 *   'message',
 *   'laptop'
 * );
 */
