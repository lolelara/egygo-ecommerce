import { Client, Account, Databases, Storage, Functions, OAuthProvider, ID } from 'appwrite';
import notificationService from './notification-service';

// Re-export ID for convenience
export { ID };

// Appwrite configuration
export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || '',
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45',
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID || 'product-images',
  
  // Collection IDs (will be created in Appwrite dashboard)
  collections: {
    users: import.meta.env.VITE_APPWRITE_USERS_COLLECTION || 'users',
    products: import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION || 'products',
    categories: import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION || 'categories',
    orders: import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION || 'orders',
    orderItems: import.meta.env.VITE_APPWRITE_ORDER_ITEMS_COLLECTION || 'order_items',
    reviews: import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION || 'reviews',
    affiliates: import.meta.env.VITE_APPWRITE_AFFILIATES_COLLECTION || 'affiliates',
    notifications: import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION || 'notifications',
    // New collections for enhanced features
    favorites: 'favorites',
    productViews: 'product_views',
    affiliateActivities: 'affiliate_activities',
    affiliateClicks: 'affiliate_clicks',
    affiliateStats: 'affiliate_stats',
    withdrawalRequests: 'withdrawal_requests',
    userPreferences: 'user_preferences',
    referrals: 'referrals',
    referral_earnings: 'referral_earnings',
    offers: 'offers',  // Collection for promotional offers/announcements
    landing_pages: 'landing_pages',  // Collection for affiliate landing pages
    affiliate_links: 'affiliate_links'  // Collection for affiliate product links
  }
};

// Initialize Appwrite client
export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Helper functions for common operations
export class AppwriteService {
  // Check if Appwrite is configured
  static isConfigured(): boolean {
    return !!appwriteConfig.projectId;
  }

  // Authentication methods
  static async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      console.log('No active session', error);
      return null;
    }
  }

  static async login(email: string, password: string) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(email: string, password: string, name: string) {
    try {
      const newAccount = await account.create('unique()', email, password, name);
      if (newAccount) {
        return await this.login(email, password);
      }
      return newAccount;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // OAuth methods
  static async loginWithGoogle() {
    try {
      // Use the actual deployed URL for HashRouter compatibility
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/#/`;
      const failureUrl = `${baseUrl}/#/login`;
      
      return await account.createOAuth2Session(
        OAuthProvider.Google,
        successUrl,
        failureUrl
      );
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  static async loginWithFacebook() {
    try {
      // Use the actual deployed URL for HashRouter compatibility
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/#/`;
      const failureUrl = `${baseUrl}/#/login`;
      
      return await account.createOAuth2Session(
        OAuthProvider.Facebook,
        successUrl,
        failureUrl
      );
    } catch (error) {
      console.error('Facebook login error:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Database methods
  static async getProducts(filters?: { categoryId?: string; search?: string; limit?: number }) {
    try {
      const queries = [];
      
      if (filters?.categoryId) {
        queries.push(`categoryId="${filters.categoryId}"`);
      }
      
      if (filters?.search) {
        queries.push(`name~"${filters.search}"`);
      }

      return await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.products,
        queries
      );
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async getProduct(id: string) {
    try {
      return await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.products,
        id
      );
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  static async getCategories() {
    try {
      return await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.categories
      );
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // User preferences methods (better than separate collection)
  static async updateUserPreferences(userData: any) {
    try {
      return await account.updatePrefs(userData);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // User document methods (kept for backward compatibility if needed)
  static async getUserDocument(userId: string) {
    try {
      return await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        userId
      );
    } catch (error) {
      console.error('Error fetching user document:', error);
      throw error;
    }
  }

  static async createUserDocument(userData: any) {
    try {
      return await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        userData.userId,
        userData
      );
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  static async updateUserDocument(userId: string, userData: any) {
    try {
      return await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.users,
        userId,
        userData
      );
    } catch (error) {
      console.error('Error updating user document:', error);
      throw error;
    }
  }

  static async createOrder(orderData: any) {
    try {
      const order = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.orders,
        'unique()',
        orderData
      );

      // Send notification to user about order confirmation
      try {
        await notificationService.notifyOrderStatus(
          orderData.userId,
          order.$id,
          'confirmed'
        );
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
        // Don't fail order creation if notification fails
      }

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async getUserOrders(userId: string) {
    try {
      return await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.orders,
        [
          // Query to filter orders by user ID
        ]
      );
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  // Storage methods
  static async uploadFile(file: File) {
    try {
      return await storage.createFile(
        appwriteConfig.storageId,
        'unique()',
        file
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  static getFilePreview(fileId: string) {
    try {
      return storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        400, // width
        400, // height
        'center' as any, // gravity
        100 // quality
      );
    } catch (error) {
      console.error('Error getting file preview:', error);
      throw error;
    }
  }
}

export default AppwriteService;