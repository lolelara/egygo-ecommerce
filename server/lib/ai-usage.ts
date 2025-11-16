import { COLLECTIONS, createDocument, listDocuments, Query } from './appwrite';

export interface AIUsageEvent {
  feature: string; // مثال: 'chat', 'product_enhance', 'price_analysis'
  route: string;   // مثال: '/api/chat'
  model?: string;
  tokensPrompt?: number;
  tokensCompletion?: number;
  tokensTotal?: number;
  userId?: string | null;
  metadata?: any;
}

/**
 * تسجيل استخدام AI في Appwrite
 */
export async function logAIUsage(event: AIUsageEvent): Promise<void> {
  try {
    await createDocument(COLLECTIONS.AI_USAGE, {
      feature: event.feature,
      route: event.route,
      model: event.model || '',
      tokensPrompt: event.tokensPrompt ?? null,
      tokensCompletion: event.tokensCompletion ?? null,
      tokensTotal: event.tokensTotal ?? null,
      userId: event.userId || null,
      metadata: event.metadata ? JSON.stringify(event.metadata) : null,
    });
  } catch (error) {
    console.error('Failed to log AI usage:', error);
  }
}

export interface AIUsageSummaryItem {
  feature: string;
  count: number;
  tokensTotal: number;
}

export interface AIUsageSummary {
  from: string;
  to: string;
  items: AIUsageSummaryItem[];
  totalTokens: number;
}

/**
 * تجميع استخدام AI لفترة زمنية (يوم، أسبوع أو شهر)
 */
export async function getAIUsageSummary(
  period: 'day' | 'week' | 'month' = 'month',
): Promise<AIUsageSummary> {
  const now = new Date();
  const from = new Date(now);

  if (period === 'day') {
    from.setDate(now.getDate() - 1);
  } else if (period === 'week') {
    from.setDate(now.getDate() - 7);
  } else {
    from.setMonth(now.getMonth() - 1);
  }

  try {
    const result = await listDocuments(COLLECTIONS.AI_USAGE, [
      Query.greaterThan('$createdAt', from.toISOString()),
      Query.limit(1000),
    ]);

    const buckets: Record<string, AIUsageSummaryItem> = {};
    let totalTokens = 0;

    for (const doc of result.documents as any[]) {
      const feature = (doc.feature as string) || 'unknown';
      const tokensTotal = typeof doc.tokensTotal === 'number' ? doc.tokensTotal : 0;

      if (!buckets[feature]) {
        buckets[feature] = {
          feature,
          count: 0,
          tokensTotal: 0,
        };
      }

      buckets[feature].count += 1;
      buckets[feature].tokensTotal += tokensTotal;
      totalTokens += tokensTotal;
    }

    return {
      from: from.toISOString(),
      to: now.toISOString(),
      items: Object.values(buckets),
      totalTokens,
    };
  } catch (error) {
    console.error('Failed to load AI usage summary:', error);
    return {
      from: from.toISOString(),
      to: now.toISOString(),
      items: [],
      totalTokens: 0,
    };
  }
}
