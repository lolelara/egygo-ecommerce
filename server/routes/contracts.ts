import { RequestHandler } from 'express';

// ============================================
// Smart Contracts APIs
// ============================================

export interface SmartContract {
  id: string;
  userId: string;
  type: 'affiliate' | 'merchant';
  terms: {
    commissionRate: number;
    paymentSchedule: string;
    minimumSales?: number;
    bonusThreshold?: number;
  };
  performance: {
    totalSales: number;
    commissionsEarned: number;
    ordersCompleted: number;
    conversionRate: number;
  };
  status: 'active' | 'pending' | 'suspended' | 'terminated';
  createdAt: Date;
  updatedAt: Date;
}

// GET /api/contracts - قائمة جميع العقود
export const getContracts: RequestHandler = async (req, res) => {
  try {
    const { userId, type, status } = req.query;
    
    // TODO: جلب من Appwrite database
    const contracts: SmartContract[] = [
      {
        id: '1',
        userId: 'user-123',
        type: 'affiliate',
        terms: {
          commissionRate: 10,
          paymentSchedule: 'monthly',
          minimumSales: 1000,
          bonusThreshold: 5000
        },
        performance: {
          totalSales: 15000,
          commissionsEarned: 1500,
          ordersCompleted: 45,
          conversionRate: 3.2
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        userId: 'user-456',
        type: 'merchant',
        terms: {
          commissionRate: 5,
          paymentSchedule: 'weekly'
        },
        performance: {
          totalSales: 50000,
          commissionsEarned: 2500,
          ordersCompleted: 120,
          conversionRate: 4.5
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Filter
    let filtered = contracts;
    if (userId) {
      filtered = filtered.filter(c => c.userId === userId);
    }
    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }
    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }
    
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
};

// POST /api/contracts - إنشاء عقد جديد
export const createContract: RequestHandler = async (req, res) => {
  try {
    const { userId, type, terms } = req.body;
    
    // Validation
    if (!userId || !type || !terms) {
      return res.status(400).json({ 
        error: 'userId, type, and terms are required' 
      });
    }
    
    if (!['affiliate', 'merchant'].includes(type)) {
      return res.status(400).json({ 
        error: 'type must be either "affiliate" or "merchant"' 
      });
    }
    
    if (!terms.commissionRate || !terms.paymentSchedule) {
      return res.status(400).json({ 
        error: 'commissionRate and paymentSchedule are required in terms' 
      });
    }
    
    const newContract: SmartContract = {
      id: Date.now().toString(),
      userId,
      type,
      terms: {
        commissionRate: terms.commissionRate,
        paymentSchedule: terms.paymentSchedule,
        minimumSales: terms.minimumSales || 0,
        bonusThreshold: terms.bonusThreshold
      },
      performance: {
        totalSales: 0,
        commissionsEarned: 0,
        ordersCompleted: 0,
        conversionRate: 0
      },
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // TODO: حفظ في Appwrite database
    
    res.status(201).json(newContract);
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ error: 'Failed to create contract' });
  }
};

// PUT /api/contracts/:id - تحديث عقد
export const updateContract: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { terms, status } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Contract ID is required' });
    }
    
    // TODO: جلب العقد الحالي من database وتحديثه
    
    const updatedContract: SmartContract = {
      id,
      userId: 'user-123',
      type: 'affiliate',
      terms: terms || {
        commissionRate: 10,
        paymentSchedule: 'monthly'
      },
      performance: {
        totalSales: 15000,
        commissionsEarned: 1500,
        ordersCompleted: 45,
        conversionRate: 3.2
      },
      status: status || 'active',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
      updatedAt: new Date()
    };
    
    res.json(updatedContract);
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Failed to update contract' });
  }
};

// GET /api/contracts/performance/:id - أداء العقد
export const getContractPerformance: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { period = '30d' } = req.query; // 7d, 30d, 90d, 1y
    
    if (!id) {
      return res.status(400).json({ error: 'Contract ID is required' });
    }
    
    // TODO: حساب الأداء من database
    const performance = {
      contractId: id,
      period,
      metrics: {
        totalSales: 15000,
        commissionsEarned: 1500,
        ordersCompleted: 45,
        conversionRate: 3.2,
        averageOrderValue: 333.33,
        returnRate: 2.1
      },
      trends: {
        salesGrowth: 15.5, // percentage
        orderGrowth: 12.3,
        conversionImprovement: 0.5
      },
      milestones: [
        {
          name: 'First Sale',
          achievedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
          value: 100
        },
        {
          name: '$10K Sales',
          achievedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
          value: 10000
        }
      ],
      projections: {
        nextMonth: {
          estimatedSales: 18000,
          estimatedCommissions: 1800
        },
        bonusEligible: true,
        bonusAmount: 500
      }
    };
    
    res.json(performance);
  } catch (error) {
    console.error('Error fetching contract performance:', error);
    res.status(500).json({ error: 'Failed to fetch performance' });
  }
};
