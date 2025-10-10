/**
 * Customer Account API - Real Data from Appwrite
 */

import { databases, DATABASE_ID, account } from './appwrite-client';
import { Query, ID } from 'appwrite';

// Collection IDs
const USERS_COLLECTION_ID = 'users';
const ORDERS_COLLECTION_ID = 'orders';
const WISHLIST_COLLECTION_ID = 'wishlist';
const ADDRESSES_COLLECTION_ID = 'addresses';
const REVIEWS_COLLECTION_ID = 'reviews';
const PRODUCTS_COLLECTION_ID = 'products';

export const customerApi = {
  // User Profile
  async getUserProfile(email: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('email', email)]
      );
      return response.documents[0] || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  async updateUserProfile(userId: string, data: any) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        data
      );
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Orders
  async getUserOrders(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(20)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  async getOrderDetails(orderId: string) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        orderId
      );
      return response;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  },

  // Wishlist
  async getUserWishlist(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        WISHLIST_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt')
        ]
      );
      
      // Fetch product details for each wishlist item
      const wishlistWithProducts = await Promise.all(
        response.documents.map(async (item) => {
          try {
            const product = await databases.getDocument(
              DATABASE_ID,
              PRODUCTS_COLLECTION_ID,
              item.productId
            );
            return {
              ...item,
              productName: product.name,
              productPrice: product.price,
              productImage: product.images?.[0] || product.image,
              inStock: product.stock > 0
            };
          } catch {
            return item;
          }
        })
      );
      
      return wishlistWithProducts;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }
  },

  async addToWishlist(userId: string, productId: string) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        WISHLIST_COLLECTION_ID,
        ID.unique(),
        {
          userId,
          productId,
          createdAt: new Date().toISOString()
        }
      );
      return response;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  async removeFromWishlist(itemId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        WISHLIST_COLLECTION_ID,
        itemId
      );
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Addresses
  async getUserAddresses(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ADDRESSES_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('isDefault')
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
  },

  async addAddress(userId: string, address: any) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        ADDRESSES_COLLECTION_ID,
        ID.unique(),
        {
          userId,
          ...address,
          createdAt: new Date().toISOString()
        }
      );
      return response;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  },

  async updateAddress(addressId: string, data: any) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        ADDRESSES_COLLECTION_ID,
        addressId,
        data
      );
      return response;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  async deleteAddress(addressId: string) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        ADDRESSES_COLLECTION_ID,
        addressId
      );
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  // Statistics
  async getUserStats(userId: string) {
    try {
      // Get orders
      const orders = await this.getUserOrders(userId);
      
      // Get wishlist
      const wishlist = await this.getUserWishlist(userId);
      
      // Calculate stats
      const totalOrders = orders.length;
      const activeOrders = orders.filter(o => 
        ['pending', 'processing', 'shipped'].includes(o.status?.toLowerCase())
      ).length;
      const completedOrders = orders.filter(o => 
        o.status?.toLowerCase() === 'delivered'
      ).length;
      const totalSpent = orders.reduce((sum, order) => 
        sum + (order.total || order.totalAmount || 0), 0
      );
      
      return {
        totalOrders,
        activeOrders,
        completedOrders,
        totalSpent,
        savedItems: wishlist.length,
        reviews: 0 // Will be calculated when reviews are implemented
      };
    } catch (error) {
      console.error('Error calculating user stats:', error);
      return {
        totalOrders: 0,
        activeOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
        savedItems: 0,
        reviews: 0
      };
    }
  }
};
