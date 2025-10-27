/**
 * Banners API
 * API للتعامل مع البانرات
 */

import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';

export interface Banner {
  $id?: string;
  title: string;
  imageUrl: string;
  link?: string;
  location: 'offers' | 'products' | 'affiliate';
  isActive: boolean;
  order: number;
  createdAt?: string;
}

export interface BannerSettings {
  $id?: string;
  location: string;
  autoPlayInterval: number;
  showControls: boolean;
  height: string;
}

const BANNERS_COLLECTION = appwriteConfig.collections.banners || 'banners';
const BANNER_SETTINGS_COLLECTION = appwriteConfig.collections.bannerSettings || 'bannerSettings';

/**
 * Get active banners for a specific location
 */
export async function getBannersByLocation(
  location: 'offers' | 'products' | 'affiliate'
): Promise<Banner[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      BANNERS_COLLECTION,
      [
        Query.equal('location', location),
        Query.equal('isActive', true),
        Query.orderAsc('order')
      ]
    );

    return response.documents as unknown as Banner[];
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}

/**
 * Get banner settings for a specific location
 */
export async function getBannerSettings(
  location: string
): Promise<BannerSettings> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      BANNER_SETTINGS_COLLECTION,
      [
        Query.equal('location', location),
        Query.limit(1)
      ]
    );

    if (response.documents.length > 0) {
      return response.documents[0] as unknown as BannerSettings;
    }

    // Default settings if not found
    return {
      location,
      autoPlayInterval: 5,
      showControls: true,
      height: '300px'
    };
  } catch (error) {
    console.error('Error fetching banner settings:', error);
    return {
      location,
      autoPlayInterval: 5,
      showControls: true,
      height: '300px'
    };
  }
}

/**
 * Get all banners (admin only)
 */
export async function getAllBanners(): Promise<Banner[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      BANNERS_COLLECTION,
      [Query.orderAsc('order')]
    );

    return response.documents as unknown as Banner[];
  } catch (error) {
    console.error('Error fetching all banners:', error);
    return [];
  }
}
