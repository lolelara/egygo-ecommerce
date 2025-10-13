import { RequestHandler } from 'express';
import { Client, Users, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const users = new Users(client);
const databases = new Databases(client);

export const updateUserRole: RequestHandler = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(400).json({ error: 'userId and newRole are required' });
    }

    console.log(`📝 Updating user ${userId} to role: ${newRole}`);

    // 1. Update Auth labels
    const labelMap: Record<string, string> = {
      customer: 'customer',
      merchant: 'merchant',
      affiliate: 'affiliate',
      intermediary: 'intermediary',
      admin: 'admin'
    };

    const newLabel = labelMap[newRole] || 'customer';
    
    // Get current user to preserve other labels
    const user = await users.get(userId);
    const currentLabels = user.labels || [];
    
    // Remove old role labels and add new one
    const roleLabels = ['customer', 'merchant', 'affiliate', 'intermediary', 'admin'];
    const nonRoleLabels = currentLabels.filter(label => !roleLabels.includes(label));
    const updatedLabels = [...nonRoleLabels, newLabel];

    await users.updateLabels(userId, updatedLabels);
    console.log(`✅ Updated Auth labels for user ${userId}`);

    // 2. Update userPreferences
    const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';
    
    // Find user preferences document
    const prefs = await databases.listDocuments(databaseId, 'userPreferences', [
      `equal("userId", "${userId}")`
    ]);

    if (prefs.documents.length > 0) {
      const prefDoc = prefs.documents[0];
      
      const updateData: any = {
        role: newRole,
        isAdmin: newRole === 'admin',
        isAffiliate: newRole === 'affiliate',
        isMerchant: newRole === 'merchant',
        isIntermediary: newRole === 'intermediary',
        accountStatus: 'approved'
      };

      // Add role-specific codes
      if (newRole === 'affiliate' && !prefDoc.affiliateCode) {
        updateData.affiliateCode = `AFF${Date.now()}`;
        updateData.commissionRate = 10;
      }
      if (newRole === 'intermediary' && !prefDoc.intermediaryCode) {
        updateData.intermediaryCode = `INT${Date.now()}`;
        updateData.defaultMarkupPercentage = 20;
      }

      await databases.updateDocument(
        databaseId,
        'userPreferences',
        prefDoc.$id,
        updateData
      );
      console.log(`✅ Updated userPreferences for user ${userId}`);
    }

    res.json({ 
      success: true, 
      message: 'User role updated successfully',
      newRole,
      labels: updatedLabels
    });
  } catch (error: any) {
    console.error('❌ Error updating user role:', error);
    res.status(500).json({ 
      error: 'Failed to update user role',
      details: error.message 
    });
  }
};
