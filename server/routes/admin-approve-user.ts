import { RequestHandler } from 'express';
import { Client, Users } from 'node-appwrite';

const client = new Client();
const users = new Users(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

export const approveUser: RequestHandler = async (req, res) => {
  try {
    const { userId, accountStatus, approvedAt, approvedBy } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Update user preferences using Admin API
    await users.updatePrefs(userId, {
      accountStatus,
      approvedAt,
      approvedBy,
      isActive: true,
    });

    res.json({ 
      success: true, 
      message: 'User preferences updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ 
      error: 'Failed to update user preferences',
      details: error.message 
    });
  }
};
