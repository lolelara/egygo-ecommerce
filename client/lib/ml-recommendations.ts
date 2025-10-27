/**
 * ML-based Product Recommendations
 * توصيات المنتجات باستخدام التعلم الآلي
 */

interface Product {
  $id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  tags?: string[];
  viewCount?: number;
  purchaseCount?: number;
}

interface UserBehavior {
  viewedProducts: string[];
  purchasedProducts: string[];
  searchQueries: string[];
  categories: string[];
}

export class MLRecommendationEngine {
  private productEmbeddings: Map<string, number[]> = new Map();
  private userProfile: number[] = [];
  
  /**
   * تحويل النص إلى embedding بسيط (TF-IDF like)
   */
  private textToEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(100).fill(0);
    
    words.forEach((word, index) => {
      const hash = this.hashString(word) % 100;
      embedding[hash] += 1;
    });
    
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / (magnitude || 1));
  }
  
  /**
   * Hash function بسيطة
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  /**
   * حساب التشابه بين منتجين
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }
    
    return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2) || 1);
  }
  
  /**
   * بناء embedding للمنتج
   */
  buildProductEmbedding(product: Product): number[] {
    const text = `${product.name} ${product.description} ${product.category} ${product.tags?.join(' ') || ''}`;
    const textEmbedding = this.textToEmbedding(text);
    
    // إضافة features إضافية
    const priceFeature = Math.log(product.price + 1) / 10; // Normalize price
    const popularityFeature = (product.viewCount || 0) / 1000;
    const purchaseFeature = (product.purchaseCount || 0) / 100;
    
    // دمج الـ features
    const embedding = [...textEmbedding, priceFeature, popularityFeature, purchaseFeature];
    
    this.productEmbeddings.set(product.$id, embedding);
    return embedding;
  }
  
  /**
   * بناء ملف المستخدم من سلوكه
   */
  buildUserProfile(behavior: UserBehavior, products: Product[]): number[] {
    if (behavior.viewedProducts.length === 0) {
      return new Array(103).fill(0);
    }
    
    const relevantProducts = products.filter(p => 
      behavior.viewedProducts.includes(p.$id) || 
      behavior.purchasedProducts.includes(p.$id)
    );
    
    // متوسط embeddings المنتجات التي تفاعل معها
    const embeddings = relevantProducts.map(p => {
      if (!this.productEmbeddings.has(p.$id)) {
        this.buildProductEmbedding(p);
      }
      return this.productEmbeddings.get(p.$id)!;
    });
    
    const avgEmbedding = new Array(103).fill(0);
    embeddings.forEach(emb => {
      emb.forEach((val, i) => {
        avgEmbedding[i] += val;
      });
    });
    
    const count = embeddings.length || 1;
    this.userProfile = avgEmbedding.map(val => val / count);
    
    return this.userProfile;
  }
  
  /**
   * الحصول على توصيات مخصصة
   */
  getPersonalizedRecommendations(
    userBehavior: UserBehavior,
    allProducts: Product[],
    excludeIds: string[] = [],
    limit: number = 10
  ): Array<{ product: Product; score: number; reason: string }> {
    // بناء embeddings للمنتجات
    allProducts.forEach(product => {
      if (!this.productEmbeddings.has(product.$id)) {
        this.buildProductEmbedding(product);
      }
    });
    
    // بناء ملف المستخدم
    if (userBehavior.viewedProducts.length > 0) {
      this.buildUserProfile(userBehavior, allProducts);
    }
    
    // حساب scores
    const recommendations = allProducts
      .filter(p => !excludeIds.includes(p.$id))
      .map(product => {
        const productEmb = this.productEmbeddings.get(product.$id)!;
        
        let score = 0;
        let reason = '';
        
        // Content-based similarity
        if (this.userProfile.length > 0) {
          const contentScore = this.cosineSimilarity(this.userProfile, productEmb);
          score += contentScore * 0.4;
          reason = 'مشابه لاهتماماتك';
        }
        
        // Category preference
        if (userBehavior.categories.includes(product.category)) {
          score += 0.2;
          reason = reason ? `${reason} • من فئة مفضلة` : 'من فئة مفضلة';
        }
        
        // Popularity boost
        const popularityScore = (product.viewCount || 0) / 10000;
        score += Math.min(popularityScore, 0.2);
        
        // Purchase history boost
        const purchaseScore = (product.purchaseCount || 0) / 1000;
        score += Math.min(purchaseScore, 0.2);
        
        if (product.purchaseCount && product.purchaseCount > 50) {
          reason = reason ? `${reason} • الأكثر مبيعاً` : 'الأكثر مبيعاً';
        }
        
        return {
          product,
          score,
          reason: reason || 'موصى به لك'
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return recommendations;
  }
  
  /**
   * منتجات مشابهة لمنتج معين
   */
  getSimilarProducts(
    targetProduct: Product,
    allProducts: Product[],
    limit: number = 6
  ): Array<{ product: Product; score: number; reason: string }> {
    // بناء embedding للمنتج المستهدف
    if (!this.productEmbeddings.has(targetProduct.$id)) {
      this.buildProductEmbedding(targetProduct);
    }
    const targetEmb = this.productEmbeddings.get(targetProduct.$id)!;
    
    // حساب التشابه مع باقي المنتجات
    const similar = allProducts
      .filter(p => p.$id !== targetProduct.$id)
      .map(product => {
        if (!this.productEmbeddings.has(product.$id)) {
          this.buildProductEmbedding(product);
        }
        const productEmb = this.productEmbeddings.get(product.$id)!;
        
        const similarity = this.cosineSimilarity(targetEmb, productEmb);
        
        let reason = '';
        if (product.category === targetProduct.category) {
          reason = 'نفس الفئة';
        }
        if (Math.abs(product.price - targetProduct.price) < targetProduct.price * 0.3) {
          reason = reason ? `${reason} • سعر مشابه` : 'سعر مشابه';
        }
        
        return {
          product,
          score: similarity,
          reason: reason || 'منتج مشابه'
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return similar;
  }
  
  /**
   * Trending products (الأكثر رواجاً)
   */
  getTrendingProducts(
    allProducts: Product[],
    timeWindow: number = 7 * 24 * 60 * 60 * 1000, // 7 days
    limit: number = 10
  ): Product[] {
    return allProducts
      .filter(p => p.viewCount && p.viewCount > 0)
      .sort((a, b) => {
        // حساب معدل النمو
        const scoreA = (a.viewCount || 0) + (a.purchaseCount || 0) * 10;
        const scoreB = (b.viewCount || 0) + (b.purchaseCount || 0) * 10;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }
  
  /**
   * Collaborative filtering بسيط (users who bought this also bought)
   */
  getCollaborativeRecommendations(
    productId: string,
    purchaseHistory: Array<{ productIds: string[] }>,
    allProducts: Product[],
    limit: number = 6
  ): Product[] {
    // إيجاد الطلبات التي تحتوي على هذا المنتج
    const relatedOrders = purchaseHistory.filter(order => 
      order.productIds.includes(productId)
    );
    
    // عد المنتجات الأخرى في هذه الطلبات
    const productCounts = new Map<string, number>();
    relatedOrders.forEach(order => {
      order.productIds.forEach(id => {
        if (id !== productId) {
          productCounts.set(id, (productCounts.get(id) || 0) + 1);
        }
      });
    });
    
    // ترتيب حسب التكرار
    const recommendedIds = Array.from(productCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);
    
    return allProducts.filter(p => recommendedIds.includes(p.$id));
  }
}

// Singleton instance
export const mlRecommendations = new MLRecommendationEngine();
