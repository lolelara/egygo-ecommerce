import { Router } from 'express';
import { getAIUsageSummary } from '../lib/ai-usage';

const router = Router();

// GET /api/ai/usage-summary?period=day|week|month
router.get('/ai/usage-summary', async (req, res) => {
  try {
    const periodParam = (req.query.period as string) || 'month';
    let period: 'day' | 'week' | 'month' = 'month';

    if (periodParam === 'day') {
      period = 'day';
    } else if (periodParam === 'week') {
      period = 'week';
    }

    const summary = await getAIUsageSummary(period);
    res.json(summary);
  } catch (error) {
    console.error('Error fetching AI usage summary:', error);
    res.status(500).json({ error: 'فشل في جلب إحصائيات استخدام الذكاء الاصطناعي' });
  }
});

export default router;
