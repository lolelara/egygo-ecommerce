import { RequestHandler } from 'express';

// ============================================
// A/B Testing & Experiments APIs
// ============================================

export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: {
    id: string;
    name: string;
    trafficPercentage: number;
    conversionRate: number;
    visitors: number;
    conversions: number;
    revenue: number;
  }[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  winner?: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
}

// GET /api/ab-tests - قائمة جميع الاختبارات
export const getABTests: RequestHandler = async (req, res) => {
  try {
    const { status, includeArchived = 'false' } = req.query;
    
    // TODO: جلب من Appwrite database
    const tests: ABTest[] = [
      {
        id: '1',
        name: 'Homepage Banner Test',
        description: 'Testing different banner designs',
        variants: [
          {
            id: 'variant-a',
            name: 'Original',
            trafficPercentage: 50,
            conversionRate: 3.2,
            visitors: 1000,
            conversions: 32,
            revenue: 1600
          },
          {
            id: 'variant-b',
            name: 'New Design',
            trafficPercentage: 50,
            conversionRate: 4.5,
            visitors: 1000,
            conversions: 45,
            revenue: 2250
          }
        ],
        status: 'running',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
      },
      {
        id: '2',
        name: 'Checkout Flow Test',
        description: 'Testing one-page vs multi-step checkout',
        variants: [
          {
            id: 'variant-a',
            name: 'One Page',
            trafficPercentage: 50,
            conversionRate: 5.1,
            visitors: 500,
            conversions: 25,
            revenue: 1875
          },
          {
            id: 'variant-b',
            name: 'Multi Step',
            trafficPercentage: 50,
            conversionRate: 6.8,
            visitors: 500,
            conversions: 34,
            revenue: 2550
          }
        ],
        status: 'completed',
        winner: 'variant-b',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35)
      }
    ];
    
    // Filter
    let filtered = tests;
    if (status && status !== 'all') {
      filtered = filtered.filter(t => t.status === status);
    }
    if (includeArchived === 'false') {
      filtered = filtered.filter(t => t.status !== 'completed');
    }
    
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching A/B tests:', error);
    res.status(500).json({ error: 'Failed to fetch A/B tests' });
  }
};

// POST /api/ab-tests - إنشاء اختبار جديد
export const createABTest: RequestHandler = async (req, res) => {
  try {
    const { name, description, variants } = req.body;
    
    // Validation
    if (!name || !variants || !Array.isArray(variants) || variants.length < 2) {
      return res.status(400).json({ 
        error: 'name and at least 2 variants are required' 
      });
    }
    
    // Validate traffic percentage adds up to 100
    const totalTraffic = variants.reduce((sum, v) => sum + (v.trafficPercentage || 0), 0);
    if (Math.abs(totalTraffic - 100) > 0.01) {
      return res.status(400).json({ 
        error: 'Traffic percentages must add up to 100' 
      });
    }
    
    const newTest: ABTest = {
      id: Date.now().toString(),
      name,
      description: description || '',
      variants: variants.map(v => ({
        id: `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: v.name,
        trafficPercentage: v.trafficPercentage,
        conversionRate: 0,
        visitors: 0,
        conversions: 0,
        revenue: 0
      })),
      status: 'draft',
      startDate: new Date(),
      createdAt: new Date()
    };
    
    // TODO: حفظ في Appwrite database
    
    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error creating A/B test:', error);
    res.status(500).json({ error: 'Failed to create A/B test' });
  }
};

// PUT /api/ab-tests/:id/winner - تعيين الفائز
export const setABTestWinner: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { variantId } = req.body;
    
    if (!id || !variantId) {
      return res.status(400).json({ 
        error: 'Test ID and variant ID are required' 
      });
    }
    
    // TODO: تحديث في database
    const updatedTest: ABTest = {
      id,
      name: 'Homepage Banner Test',
      description: 'Testing different banner designs',
      variants: [
        {
          id: 'variant-a',
          name: 'Original',
          trafficPercentage: 50,
          conversionRate: 3.2,
          visitors: 1000,
          conversions: 32,
          revenue: 1600
        },
        {
          id: 'variant-b',
          name: 'New Design',
          trafficPercentage: 50,
          conversionRate: 4.5,
          visitors: 1000,
          conversions: 45,
          revenue: 2250
        }
      ],
      status: 'completed',
      winner: variantId,
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      endDate: new Date(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
    };
    
    res.json(updatedTest);
  } catch (error) {
    console.error('Error setting winner:', error);
    res.status(500).json({ error: 'Failed to set winner' });
  }
};

// GET /api/ab-tests/:id/results - نتائج الاختبار
export const getABTestResults: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Test ID is required' });
    }
    
    // TODO: حساب النتائج من database
    const results = {
      testId: id,
      testName: 'Homepage Banner Test',
      duration: {
        days: 7,
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        endDate: new Date()
      },
      variants: [
        {
          id: 'variant-a',
          name: 'Original',
          metrics: {
            visitors: 1000,
            conversions: 32,
            conversionRate: 3.2,
            revenue: 1600,
            averageOrderValue: 50,
            bounceRate: 45.2
          },
          confidence: 95.3,
          isWinner: false
        },
        {
          id: 'variant-b',
          name: 'New Design',
          metrics: {
            visitors: 1000,
            conversions: 45,
            conversionRate: 4.5,
            revenue: 2250,
            averageOrderValue: 50,
            bounceRate: 38.7
          },
          confidence: 98.1,
          isWinner: true
        }
      ],
      analysis: {
        significantDifference: true,
        pValue: 0.023,
        liftPercentage: 40.6, // (4.5 - 3.2) / 3.2 * 100
        recommendedAction: 'Deploy variant-b to 100% of traffic',
        estimatedImpact: {
          monthlyRevenue: 10000,
          annualRevenue: 120000
        }
      }
    };
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};
