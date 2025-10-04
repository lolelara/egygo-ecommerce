import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = appwriteConfig.databaseId;
const COLLECTIONS = appwriteConfig.collections;

// Review Types
export interface Review {
  $id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  $createdAt: string;
  $updatedAt: string;
}

export interface CreateReviewData {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  images?: string[];
}

/**
 * Create a new review
 */
export async function createReview(data: CreateReviewData): Promise<Review> {
  try {
    // Check if user already reviewed this product
    const existingReviews = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.reviews,
      [
        Query.equal('productId', data.productId),
        Query.equal('userId', data.userId)
      ]
    );

    if (existingReviews.documents.length > 0) {
      throw new Error('لقد قمت بتقييم هذا المنتج مسبقاً');
    }

    // Create the review
    const review = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.reviews,
      'unique()',
      {
        productId: data.productId,
        userId: data.userId,
        rating: data.rating,
        comment: data.comment,
        images: data.images || [],
        verified: false,
        helpful: 0,
      }
    );

    // Update product rating
    await updateProductRating(data.productId);

    return review as unknown as Review;
  } catch (error: any) {
    console.error('Error creating review:', error);
    throw new Error(error.message || 'فشل في إضافة التقييم');
  }
}

/**
 * Get reviews for a product
 */
export async function getProductReviews(productId: string, limit: number = 10): Promise<Review[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.reviews,
      [
        Query.equal('productId', productId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    );

    // Fetch user details for each review
    const reviews = await Promise.all(
      response.documents.map(async (review: any) => {
        try {
          const user = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.users,
            review.userId
          );

          return {
            ...review,
            userName: user.name || user.email?.split('@')[0] || 'مستخدم',
            userEmail: user.email,
          } as Review;
        } catch (error) {
          return {
            ...review,
            userName: 'مستخدم',
            userEmail: undefined,
          } as Review;
        }
      })
    );

    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

/**
 * Update a review
 */
export async function updateReview(reviewId: string, data: Partial<CreateReviewData>): Promise<Review> {
  try {
    const review = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.reviews,
      reviewId,
      {
        rating: data.rating,
        comment: data.comment,
        images: data.images,
      }
    );

    // Update product rating if rating changed
    if (data.rating !== undefined) {
      const reviewDoc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.reviews,
        reviewId
      );
      await updateProductRating(reviewDoc.productId);
    }

    return review as unknown as Review;
  } catch (error: any) {
    console.error('Error updating review:', error);
    throw new Error(error.message || 'فشل في تحديث التقييم');
  }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string): Promise<void> {
  try {
    // Get review to update product rating after deletion
    const review = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.reviews,
      reviewId
    );

    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.reviews,
      reviewId
    );

    // Update product rating
    await updateProductRating(review.productId);
  } catch (error: any) {
    console.error('Error deleting review:', error);
    throw new Error(error.message || 'فشل في حذف التقييم');
  }
}

/**
 * Mark review as helpful
 */
export async function markReviewHelpful(reviewId: string): Promise<void> {
  try {
    const review = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.reviews,
      reviewId
    );

    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.reviews,
      reviewId,
      {
        helpful: (review.helpful || 0) + 1,
      }
    );
  } catch (error: any) {
    console.error('Error marking review as helpful:', error);
    throw new Error(error.message || 'فشل في تسجيل التقييم');
  }
}

/**
 * Get user's reviews
 */
export async function getUserReviews(userId: string): Promise<Review[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.reviews,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]
    );

    return response.documents as unknown as Review[];
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return [];
  }
}

/**
 * Get review statistics for a product
 */
export async function getProductReviewStats(productId: string) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.reviews,
      [
        Query.equal('productId', productId),
        Query.limit(1000)
      ]
    );

    const reviews = response.documents;
    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    reviews.forEach((review: any) => {
      const rating = review.rating || 0;
      totalRating += rating;
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating as keyof typeof ratingDistribution]++;
      }
    });

    const averageRating = totalRating / totalReviews;

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
      ratingDistribution,
    };
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
}

/**
 * Update product rating (helper function)
 */
async function updateProductRating(productId: string): Promise<void> {
  try {
    const stats = await getProductReviewStats(productId);

    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.products,
      productId,
      {
        rating: stats.averageRating,
        reviewCount: stats.totalReviews,
      }
    );
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}
