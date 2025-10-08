import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "68de037e003bd03c4d45";

const COLLECTIONS = {
  USERS: import.meta.env.VITE_APPWRITE_COLLECTION_USERS_ID || "users",
  ORDERS: import.meta.env.VITE_APPWRITE_COLLECTION_ORDERS_ID || "orders",
  COMMISSIONS: import.meta.env.VITE_APPWRITE_COLLECTION_COMMISSIONS_ID || "commissions",
  PRODUCTS: import.meta.env.VITE_APPWRITE_COLLECTION_PRODUCTS_ID || "products",
};

export const affiliateApi = {
  // Get affiliate stats and performance
  getStats: async (userId: string): Promise<any> => {
    try {
      // Get affiliate user data
      const userDoc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId
      );

      // Get all commissions for this affiliate
      const commissionsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMMISSIONS,
        [Query.equal("affiliateId", userId), Query.orderDesc("$createdAt")]
      );

      const commissions = commissionsResponse.documents;

      // Calculate earnings
      const totalEarnings = commissions
        .filter((c: any) => c.status === "paid")
        .reduce((sum: number, c: any) => sum + c.amount, 0);

      const pendingEarnings = commissions
        .filter((c: any) => c.status === "pending")
        .reduce((sum: number, c: any) => sum + c.amount, 0);

      // Get orders using this affiliate code
      const ordersResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.equal("affiliateCode", userDoc.affiliateCode || ""), Query.limit(1000)]
      );

      const orders = ordersResponse.documents;
      const referralCount = orders.length;

      // Calculate monthly earnings
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const thisMonthEarnings = commissions
        .filter((c: any) => new Date(c.$createdAt) >= thisMonthStart)
        .reduce((sum: number, c: any) => sum + c.amount, 0);

      // Get recent commissions
      const recentCommissions = commissions.slice(0, 10).map((c: any) => ({
        id: c.$id,
        orderId: c.orderId,
        amount: c.amount,
        status: c.status,
        createdAt: c.$createdAt,
      }));

      return {
        affiliateCode: userDoc.affiliateCode || `AFF${userId.substring(0, 6).toUpperCase()}`,
        commissionRate: userDoc.commissionRate || 10,
        totalEarnings,
        pendingEarnings,
        thisMonthEarnings,
        referralCount,
        recentCommissions,
        clicks: userDoc.clicks || 0,
        conversions: orders.length,
        conversionRate: userDoc.clicks ? (orders.length / userDoc.clicks * 100).toFixed(2) : 0,
      };
    } catch (error) {
      console.error("Error fetching affiliate stats:", error);
      throw error;
    }
  },

  // Get withdrawal requests for affiliate
  getWithdrawals: async (userId: string): Promise<any[]> => {
    try {
      // For now, return empty array. Will implement when withdrawals collection is created
      return [];
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      return [];
    }
  },

  // Request withdrawal
  requestWithdrawal: async (userId: string, amount: number, method: string, details: any): Promise<any> => {
    try {
      // TODO: Create withdrawal document when collection is ready
      throw new Error("سيتم تفعيل طلبات السحب قريباً");
    } catch (error: any) {
      throw new Error(error.message || "فشل في إنشاء طلب السحب");
    }
  },
};
