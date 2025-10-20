import { Router } from 'express';
import { databases, appwriteConfig } from '../lib/appwrite';
import { ID } from 'node-appwrite';

const router = Router();

// Store analytics events
router.post('/analytics', async (req, res) => {
  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'Invalid events data' });
    }

    // Store each event in Appwrite database
    const promises = events.map(async (event: any) => {
      try {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.analyticsCollectionId,
          ID.unique(),
          {
            category: event.category,
            action: event.action,
            label: event.label || '',
            value: event.value || 0,
            timestamp: event.timestamp || Date.now(),
            userAgent: req.headers['user-agent'] || '',
            ip: req.ip || req.headers['x-forwarded-for'] || '',
          }
        );
      } catch (error) {
        console.error('Failed to store event:', error);
      }
    });

    await Promise.allSettled(promises);

    res.json({ success: true, stored: events.length });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to store analytics' });
  }
});

// Get analytics data (for admin dashboard)
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    // Build query filters
    const queries: string[] = [];
    
    if (startDate) {
      queries.push(`timestamp>=${startDate}`);
    }
    if (endDate) {
      queries.push(`timestamp<=${endDate}`);
    }
    if (category) {
      queries.push(`category="${category}"`);
    }

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.analyticsCollectionId,
      queries as any
    );

    res.json(response);
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get analytics summary
router.get('/analytics/summary', async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    // Calculate date range
    const now = Date.now();
    const periodMs = period === '7d' ? 7 * 24 * 60 * 60 * 1000 :
                     period === '30d' ? 30 * 24 * 60 * 60 * 1000 :
                     24 * 60 * 60 * 1000;
    
    const startDate = now - periodMs;

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.analyticsCollectionId,
      [`timestamp>=${startDate}`] as any
    );

    // Aggregate data
    const summary = {
      totalEvents: response.total,
      pageViews: 0,
      productViews: 0,
      addToCarts: 0,
      purchases: 0,
      searches: 0,
      clicks: 0,
    };

    response.documents.forEach((doc: any) => {
      if (doc.category === 'Page' && doc.action === 'view') summary.pageViews++;
      if (doc.category === 'Product' && doc.action === 'view') summary.productViews++;
      if (doc.category === 'Ecommerce' && doc.action === 'add_to_cart') summary.addToCarts++;
      if (doc.category === 'Ecommerce' && doc.action === 'purchase') summary.purchases++;
      if (doc.category === 'Search') summary.searches++;
      if (doc.category === 'Click') summary.clicks++;
    });

    res.json(summary);
  } catch (error) {
    console.error('Failed to fetch analytics summary:', error);
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

export default router;
