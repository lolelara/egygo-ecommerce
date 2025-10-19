/**
 * Enhanced Reviews System
 * Multi-aspect ratings with verification and moderation
 */

import { databases } from './appwrite';
import { Query, ID } from 'appwrite';

export interface Review {
  $id: string;
  productId: string;
  productName: string;
  orderId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  
  // Multi-aspect ratings
  overallRating: number;
  qualityRating: number;
  valueRating: number;
  deliveryRating: number;
  merchantRating: number;
  
  // Review content
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
  
  // Verification
  verified: boolean;
  helpful: number;
  notHelpful: number;
  
  // Moderation
  status: 'pending' | 'approved' | 'rejected';
  moderationNotes?: string;
  
  // Merchant response
  merchantResponse?: string;
  merchantResponseDate?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  verifiedPercentage: number;
  qualityAverage: number;
  valueAverage: number;
  deliveryAverage: number;
  merchantAverage: number;
}

class EnhancedReviewsSystem {
  private readonly DATABASE_ID = '68de037e003bd03c4d45';
  private readonly COLLECTION_ID = 'reviews';

  /**
   * Create a new review
   */
  async createReview(review: Omit<Review, '$id' | 'helpful' | 'notHelpful' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    try {
      const created = await databases.createDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        ID.unique(),
        {
          ...review,
          helpful: 0,
          notHelpful: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      return created as Review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  /**
   * Get product reviews
   */
  async getProductReviews(productId: string, limit: number = 20, offset: number = 0): Promise<Review[]> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [
          Query.equal('productId', productId),
          Query.equal('status', 'approved'),
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );

      return response.documents as Review[];
    } catch (error) {
      console.error('Error getting product reviews:', error);
      return [];
    }
  }

  /**
   * Get review statistics for a product
   */
  async getReviewStats(productId: string): Promise<ReviewStats> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [
          Query.equal('productId', productId),
          Query.equal('status', 'approved'),
          Query.limit(1000),
        ]
      );

      const reviews = response.documents as Review[];
      const totalReviews = reviews.length;

      if (totalReviews === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          verifiedPercentage: 0,
          qualityAverage: 0,
          valueAverage: 0,
          deliveryAverage: 0,
          merchantAverage: 0,
        };
      }

      // Calculate averages
      const averageRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews;
      const qualityAverage = reviews.reduce((sum, r) => sum + r.qualityRating, 0) / totalReviews;
      const valueAverage = reviews.reduce((sum, r) => sum + r.valueRating, 0) / totalReviews;
      const deliveryAverage = reviews.reduce((sum, r) => sum + r.deliveryRating, 0) / totalReviews;
      const merchantAverage = reviews.reduce((sum, r) => sum + r.merchantRating, 0) / totalReviews;

      // Rating distribution
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(r => {
        const rating = Math.round(r.overallRating);
        ratingDistribution[rating as keyof typeof ratingDistribution]++;
      });

      // Verified percentage
      const verifiedCount = reviews.filter(r => r.verified).length;
      const verifiedPercentage = (verifiedCount / totalReviews) * 100;

      return {
        totalReviews,
        averageRating,
        ratingDistribution,
        verifiedPercentage,
        qualityAverage,
        valueAverage,
        deliveryAverage,
        merchantAverage,
      };
    } catch (error) {
      console.error('Error getting review stats:', error);
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        verifiedPercentage: 0,
        qualityAverage: 0,
        valueAverage: 0,
        deliveryAverage: 0,
        merchantAverage: 0,
      };
    }
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId: string): Promise<void> {
    try {
      const review = await databases.getDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        reviewId
      ) as Review;

      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        reviewId,
        { helpful: review.helpful + 1 }
      );
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  }

  /**
   * Mark review as not helpful
   */
  async markNotHelpful(reviewId: string): Promise<void> {
    try {
      const review = await databases.getDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        reviewId
      ) as Review;

      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        reviewId,
        { notHelpful: review.notHelpful + 1 }
      );
    } catch (error) {
      console.error('Error marking review as not helpful:', error);
    }
  }

  /**
   * Add merchant response
   */
  async addMerchantResponse(reviewId: string, response: string): Promise<void> {
    try {
      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        reviewId,
        {
          merchantResponse: response,
          merchantResponseDate: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error adding merchant response:', error);
      throw error;
    }
  }

  /**
   * Approve review (Admin/Auto)
   */
  async approveReview(reviewId: string): Promise<void> {
    try {
      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        reviewId,
        {
          status: 'approved',
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error approving review:', error);
      throw error;
    }
  }

  /**
   * Reject review (Admin)
   */
  async rejectReview(reviewId: string, notes: string): Promise<void> {
    try {
      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        reviewId,
        {
          status: 'rejected',
          moderationNotes: notes,
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error rejecting review:', error);
      throw error;
    }
  }

  /**
   * Get pending reviews (Admin)
   */
  async getPendingReviews(): Promise<Review[]> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [
          Query.equal('status', 'pending'),
          Query.orderDesc('$createdAt'),
        ]
      );

      return response.documents as Review[];
    } catch (error) {
      console.error('Error getting pending reviews:', error);
      return [];
    }
  }

  /**
   * Check if user can review product
   */
  async canUserReview(userId: string, productId: string): Promise<boolean> {
    try {
      // Check if user has purchased and received the product
      const orders = await databases.listDocuments(
        this.DATABASE_ID,
        'orders',
        [
          Query.equal('userId', userId),
          Query.equal('status', 'delivered'),
        ]
      );

      const hasPurchased = orders.documents.some((order: any) => 
        order.items?.some((item: any) => item.productId === productId)
      );

      if (!hasPurchased) return false;

      // Check if user already reviewed this product
      const existingReviews = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.equal('productId', productId),
        ]
      );

      return existingReviews.documents.length === 0;
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      return false;
    }
  }

  /**
   * Get user's reviews
   */
  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
        ]
      );

      return response.documents as Review[];
    } catch (error) {
      console.error('Error getting user reviews:', error);
      return [];
    }
  }

  /**
   * Get merchant reviews (for all their products)
   */
  async getMerchantReviews(merchantId: string): Promise<Review[]> {
    try {
      // First get all merchant products
      const products = await databases.listDocuments(
        this.DATABASE_ID,
        'products',
        [Query.equal('merchantId', merchantId)]
      );

      const productIds = products.documents.map(p => p.$id);

      // Get reviews for all products
      const reviews: Review[] = [];
      for (const productId of productIds) {
        const productReviews = await this.getProductReviews(productId, 100);
        reviews.push(...productReviews);
      }

      return reviews.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error getting merchant reviews:', error);
      return [];
    }
  }
}

export const enhancedReviews = new EnhancedReviewsSystem();
