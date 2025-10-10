import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = appwriteConfig.databaseId;

export interface UserContextData {
  isAffiliate: boolean;
  totalOrders: number;
  totalRevenue: number;
  totalCommissions: number;
  pendingCommissions: number;
  recentOrders: any[];
  affiliateStats?: {
    clicks: number;
    conversions: number;
    conversionRate: number;
  };
}

export interface AdminContextData {
  totalUsers: number;
  totalAffiliates: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  topProducts: any[];
  topAffiliates: any[];
  revenueGrowth: number;
  systemHealth: {
    activeUsers: number;
    errorRate: number;
    avgResponseTime: number;
  };
}

/**
 * Build context for AI based on user data
 */
export async function buildUserContext(userId: string): Promise<string> {
  try {
    // Fetch user data
    const userDoc = await databases.getDocument(DATABASE_ID, appwriteConfig.collections.users, userId);
    
    // Fetch user orders
    const orders = await databases.listDocuments(DATABASE_ID, appwriteConfig.collections.orders, [
      Query.equal('userId', userId),
      Query.limit(10),
      Query.orderDesc('$createdAt')
    ]);

    // Build context summary
    let context = `معلومات المستخدم:\n`;
    context += `- الاسم: ${userDoc.name}\n`;
    context += `- عدد الطلبات: ${orders.total}\n`;
    
    if (userDoc.isAffiliate) {
      // Fetch affiliate data
      const commissions = await databases.listDocuments(DATABASE_ID, 'commissions', [
        Query.equal('affiliateId', userId),
        Query.limit(100)
      ]);

      const totalCommissions = commissions.documents.reduce((sum: number, c: any) => {
        return sum + (c.amount || 0);
      }, 0);

      const pendingCommissions = commissions.documents
        .filter((c: any) => c.status === 'pending')
        .reduce((sum: number, c: any) => sum + (c.amount || 0), 0);

      context += `- مسوق بالعمولة: نعم\n`;
      context += `- إجمالي العمولات: ${totalCommissions} جنيه\n`;
      context += `- العمولات المعلقة: ${pendingCommissions} جنيه\n`;
      context += `- عدد الإحالات: ${commissions.total}\n`;
    }

    // Add recent activity
    if (orders.total > 0) {
      context += `\nآخر الطلبات:\n`;
      orders.documents.slice(0, 3).forEach((order: any, idx: number) => {
        context += `${idx + 1}. طلب ${order.orderNumber} - ${order.status} - ${order.totalAmount} جنيه\n`;
      });
    }

    return context;
  } catch (error) {
    console.error('Error building user context:', error);
    return 'لا توجد بيانات كافية حالياً.';
  }
}

/**
 * Build comprehensive admin context
 */
export async function buildAdminContext(): Promise<string> {
  try {
    // Fetch all collections data
    const [users, orders, products, commissions] = await Promise.all([
      databases.listDocuments(DATABASE_ID, appwriteConfig.collections.users, [Query.limit(1000)]),
      databases.listDocuments(DATABASE_ID, appwriteConfig.collections.orders, [Query.limit(1000)]),
      databases.listDocuments(DATABASE_ID, appwriteConfig.collections.products, [Query.limit(1000)]),
      databases.listDocuments(DATABASE_ID, 'commissions', [Query.limit(1000)])
    ]);

    // Calculate statistics
    const totalRevenue = orders.documents.reduce((sum: number, o: any) => {
      return o.status === 'delivered' ? sum + (o.totalAmount || 0) : sum;
    }, 0);

    const pendingOrders = orders.documents.filter((o: any) => 
      o.status === 'pending' || o.status === 'processing'
    ).length;

    const affiliates = users.documents.filter((u: any) => u.isAffiliate);
    
    const totalCommissionsPaid = commissions.documents
      .filter((c: any) => c.status === 'paid')
      .reduce((sum: number, c: any) => sum + (c.amount || 0), 0);

    // Top products by sales
    const productSales = new Map();
    orders.documents.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const current = productSales.get(item.productId) || { count: 0, revenue: 0, name: item.name };
        current.count += item.quantity || 1;
        current.revenue += (item.price || 0) * (item.quantity || 1);
        productSales.set(item.productId, current);
      });
    });

    const topProducts = Array.from(productSales.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5);

    // Top affiliates
    const affiliateRevenue = new Map();
    commissions.documents.forEach((c: any) => {
      const current = affiliateRevenue.get(c.affiliateId) || 0;
      affiliateRevenue.set(c.affiliateId, current + (c.amount || 0));
    });

    const topAffiliates = Array.from(affiliateRevenue.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Build comprehensive report
    let context = `📊 تقرير شامل عن الموقع:\n\n`;
    
    context += `📈 إحصائيات عامة:\n`;
    context += `- إجمالي المستخدمين: ${users.total}\n`;
    context += `- المسوقين بالعمولة: ${affiliates.length}\n`;
    context += `- إجمالي الطلبات: ${orders.total}\n`;
    context += `- الطلبات المعلقة: ${pendingOrders}\n`;
    context += `- إجمالي الإيرادات: ${totalRevenue.toFixed(2)} جنيه\n`;
    context += `- إجمالي العمولات المدفوعة: ${totalCommissionsPaid.toFixed(2)} جنيه\n\n`;

    context += `🏆 أفضل المنتجات:\n`;
    topProducts.forEach(([id, data], idx) => {
      context += `${idx + 1}. ${data.name} - ${data.count} مبيعة - ${data.revenue.toFixed(2)} جنيه\n`;
    });

    context += `\n💼 أفضل المسوقين:\n`;
    for (let i = 0; i < Math.min(topAffiliates.length, 5); i++) {
      const [affiliateId, revenue] = topAffiliates[i];
      const affiliate = users.documents.find((u: any) => u.$id === affiliateId);
      context += `${i + 1}. ${affiliate?.name || 'مستخدم'} - ${revenue.toFixed(2)} جنيه عمولات\n`;
    }

    context += `\n📦 حالة المخزون:\n`;
    const lowStock = products.documents.filter((p: any) => (p.stock || 0) < 10);
    context += `- منتجات منخفضة المخزون: ${lowStock.length}\n`;
    if (lowStock.length > 0) {
      context += `المنتجات:\n`;
      lowStock.slice(0, 5).forEach((p: any) => {
        context += `  • ${p.name} - ${p.stock || 0} قطعة\n`;
      });
    }

    // Growth analysis (last 30 days vs previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentOrders = orders.documents.filter((o: any) => 
      new Date(o.$createdAt) > thirtyDaysAgo
    );
    const previousOrders = orders.documents.filter((o: any) => {
      const date = new Date(o.$createdAt);
      return date > sixtyDaysAgo && date <= thirtyDaysAgo;
    });

    const recentRevenue = recentOrders.reduce((sum: number, o: any) => 
      sum + (o.totalAmount || 0), 0
    );
    const previousRevenue = previousOrders.reduce((sum: number, o: any) => 
      sum + (o.totalAmount || 0), 0
    );

    const growth = previousRevenue > 0 
      ? ((recentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
      : '∞';

    context += `\n📊 النمو (آخر 30 يوم):\n`;
    context += `- الطلبات: ${recentOrders.length} (السابق: ${previousOrders.length})\n`;
    context += `- الإيرادات: ${recentRevenue.toFixed(2)} جنيه (السابق: ${previousRevenue.toFixed(2)} جنيه)\n`;
    context += `- معدل النمو: ${growth}%\n`;

    return context;
  } catch (error) {
    console.error('Error building admin context:', error);
    return 'حدث خطأ في جمع بيانات الموقع.';
  }
}

/**
 * Generate smart suggestions based on user context
 */
export function generateUserSuggestions(contextData: any): string[] {
  const suggestions: string[] = [];

  if (contextData.isAffiliate) {
    if (contextData.totalCommissions === 0) {
      suggestions.push('🎯 ابدأ بمشاركة رابط الإحالة الخاص بك لكسب أول عمولة!');
    } else if (contextData.pendingCommissions > 100) {
      suggestions.push(`💰 لديك ${contextData.pendingCommissions} جنيه عمولات معلقة قيد المراجعة`);
    }

    if (contextData.affiliateStats && contextData.affiliateStats.conversionRate < 2) {
      suggestions.push('📈 جرب تحسين محتواك الترويجي لزيادة معدل التحويل');
    }
  }

  if (contextData.totalOrders === 0) {
    suggestions.push('🛍️ اطلب أول منتج من موقعنا واحصل على خصم خاص!');
  } else if (contextData.totalOrders > 10) {
    suggestions.push('🌟 أنت من عملائنا المميزين! شكراً لثقتك');
  }

  return suggestions;
}

/**
 * Generate admin recommendations
 */
export function generateAdminRecommendations(contextData: any): string[] {
  const recommendations: string[] = [];

  if (contextData.pendingOrders > 10) {
    recommendations.push(`⚠️ لديك ${contextData.pendingOrders} طلب معلق - راجعهم بسرعة`);
  }

  if (contextData.revenueGrowth < 0) {
    recommendations.push('📉 الإيرادات في انخفاض - فكر في حملة تسويقية جديدة');
  } else if (contextData.revenueGrowth > 20) {
    recommendations.push('🚀 نمو ممتاز! استمر على هذا الأداء');
  }

  if (contextData.totalAffiliates < 5) {
    recommendations.push('💼 قم بتوظيف المزيد من المسوقين لزيادة المبيعات');
  }

  return recommendations;
}
