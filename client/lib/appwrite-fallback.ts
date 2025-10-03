import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Appwrite configuration - will be updated with real project details
export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || '',
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45',
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID || 'product-images',
  
  // Collection IDs (will be created in Appwrite dashboard)
  collections: {
    users: 'users',
    products: 'products',
    categories: 'categories',
    orders: 'orders',
    orderItems: 'order_items',
    reviews: 'reviews',
    affiliates: 'affiliates'
  }
};

// Initialize Appwrite client only if project ID is available
let client: Client | null = null;
let account: Account | null = null;
let databases: Databases | null = null;
let storage: Storage | null = null;
let functions: Functions | null = null;

if (appwriteConfig.projectId) {
  client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  account = new Account(client);
  databases = new Databases(client);
  storage = new Storage(client);
  functions = new Functions(client);
}

// Helper functions for common operations
export class AppwriteService {
  // Check if Appwrite is configured
  static isConfigured(): boolean {
    return !!appwriteConfig.projectId && !!client;
  }

  // Authentication methods
  static async getCurrentUser() {
    if (!this.isConfigured() || !account) {
      console.log('Appwrite not configured, returning null user');
      return null;
    }

    try {
      return await account.get();
    } catch (error) {
      console.log('No active session', error);
      return null;
    }
  }

  static async login(email: string, password: string) {
    if (!this.isConfigured() || !account) {
      throw new Error('Appwrite not configured');
    }

    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(email: string, password: string, name: string) {
    if (!this.isConfigured() || !account) {
      throw new Error('Appwrite not configured');
    }

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

  static async logout() {
    if (!this.isConfigured() || !account) {
      throw new Error('Appwrite not configured');
    }

    try {
      return await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Database methods
  static async getProducts(filters?: { categoryId?: string; search?: string; limit?: number }) {
    if (!this.isConfigured() || !databases) {
      // Return mock data for testing
      return {
        documents: [],
        total: 0
      };
    }

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
    if (!this.isConfigured() || !databases) {
      throw new Error('Appwrite not configured');
    }

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
    if (!this.isConfigured() || !databases) {
      return {
        documents: [],
        total: 0
      };
    }

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

  // User document methods
  static async getUserDocument(userId: string) {
    if (!this.isConfigured() || !databases) {
      throw new Error('Appwrite not configured');
    }

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
    if (!this.isConfigured() || !databases) {
      throw new Error('Appwrite not configured');
    }

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
    if (!this.isConfigured() || !databases) {
      throw new Error('Appwrite not configured');
    }

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
    if (!this.isConfigured() || !databases) {
      throw new Error('Appwrite not configured');
    }

    try {
      return await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.orders,
        'unique()',
        orderData
      );
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async getUserOrders(userId: string) {
    if (!this.isConfigured() || !databases) {
      return {
        documents: [],
        total: 0
      };
    }

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
    if (!this.isConfigured() || !storage) {
      throw new Error('Appwrite not configured');
    }

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
    if (!this.isConfigured() || !storage) {
      throw new Error('Appwrite not configured');
    }

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

export { client, account, databases, storage, functions };
export default AppwriteService;