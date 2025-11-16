/**
 * AI Service for Product Enhancement
 * Provides AI-powered features for product descriptions and marketing suggestions
 */

interface ProductData {
  name: string;
  description?: string;
  category?: string;
  price?: number;
  images?: string[];
}

interface MarketingSuggestion {
  platform: string;
  strategy: string;
  targetAudience: string;
  estimatedReach: string;
  tips: string[];
}

interface EnhancedDescription {
  original: string;
  enhanced: string;
  seoKeywords: string[];
  highlights: string[];
}

class ProductAIService {
  constructor() {
    // Get API key from environment or use empty string
    console.log('ProductAIService initialized, using backend AI APIs');
  }

  /**
   * Enhance product description using AI
   */
  async enhanceProductDescription(product: ProductData): Promise<EnhancedDescription> {
    try {
      console.log('🚀 Calling backend AI API for product description enhancement...');
      const response = await fetch('/api/ai/product/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Backend AI Error:', response.status, errorData);
        throw new Error(errorData.error || `AI API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        original: product.description || '',
        enhanced: data.enhanced,
        seoKeywords: data.seoKeywords || [],
        highlights: data.highlights || []
      };
    } catch (error) {
      console.error('Error enhancing product description:', error);
      throw error;
    }
  }

  /**
   * Get marketing suggestions for a product
   */
  async getMarketingSuggestions(product: ProductData): Promise<MarketingSuggestion[]> {
    try {
      const response = await fetch('/api/ai/product/marketing-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `AI API error: ${response.status}`);
      }

      const suggestions = await response.json();
      return suggestions as MarketingSuggestion[];
    } catch (error) {
      console.error('Error getting marketing suggestions:', error);
      throw error;
    }
  }

  /**
   * Generate product tags using AI
   */
  async generateProductTags(product: ProductData): Promise<string[]> {
    try {
      const response = await fetch('/api/ai/product/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `AI API error: ${response.status}`);
      }

      const tags = await response.json();
      return tags as string[];
    } catch (error) {
      console.error('Error generating product tags:', error);
      throw error;
    }
  }
}

export const productAIService = new ProductAIService();
export type { ProductData, MarketingSuggestion, EnhancedDescription };
