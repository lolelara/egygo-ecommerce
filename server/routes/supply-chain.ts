import { RequestHandler } from 'express';
import { listDocuments, Query } from '../lib/appwrite';

// ============================================
// Supply Chain, Inventory, Search, Loyalty APIs
// ============================================

// ===== SUPPLY CHAIN =====

// GET /api/supply/offers - مقارنة عروض الموردين
export const getSupplyOffers: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.query;
    
    // جلب من Appwrite database
    const queries: any[] = [];
    if (productId) queries.push(Query.equal('productId', String(productId)));
    const result = await listDocuments('supply_offers', queries);
    res.json(result.documents);
  } catch (error) {
    console.error('Error fetching supply offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
};

// POST /api/supply/compare - مقارنة مفصلة
export const compareSuppliers: RequestHandler = async (req, res) => {
  try {
    const { supplierIds } = req.body;
    
    if (!supplierIds || !Array.isArray(supplierIds)) {
      return res.status(400).json({ error: 'supplierIds array is required' });
    }
    
    // TODO: حساب مفصل للتكاليف
    const comparison = {
      suppliers: supplierIds.map((id, index) => ({
        id,
        name: `مورد ${String.fromCharCode(65 + index)}`,
        totalCost: 4500 + index * 200,
        unitCost: 45 + index * 2,
        deliveryTime: 7 + index * 3,
        reliability: 95 - index * 5,
        recommendation: index === 0
      })),
      bestPrice: supplierIds[1],
      fastestDelivery: supplierIds[0],
      bestValue: supplierIds[0]
    };
    
    res.json(comparison);
  } catch (error) {
    console.error('Error comparing suppliers:', error);
    res.status(500).json({ error: 'Failed to compare suppliers' });
  }
};

// POST /api/bundles - إنشاء حزمة منتجات
export const createBundle: RequestHandler = async (req, res) => {
  try {
    const { name, products, discountPercentage } = req.body;
    
    if (!name || !products || !Array.isArray(products)) {
      return res.status(400).json({ 
        error: 'name and products array are required' 
      });
    }
    
    // Calculate bundle price
    const totalPrice = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const bundlePrice = totalPrice * (1 - (discountPercentage || 0) / 100);
    
    const bundle = {
      id: Date.now().toString(),
      name,
      products,
      originalPrice: totalPrice,
      discountPercentage: discountPercentage || 0,
      bundlePrice,
      savings: totalPrice - bundlePrice,
      createdAt: new Date()
    };
    
    // حفظ في Appwrite database
    try {
      const { createDocument } = require('../lib/appwrite');
      const created = await createDocument('bundles', {
        name,
        products,
        originalPrice: totalPrice,
        discountPercentage: discountPercentage || 0,
        bundlePrice,
        savings: totalPrice - bundlePrice,
        createdAt: new Date().toISOString()
      });
      res.status(201).json(created);
    } catch (dbError) {
      console.error('Error saving bundle to DB:', dbError);
      res.status(500).json({ error: 'Failed to save bundle to database' });
    }
  } catch (error) {
    console.error('Error creating bundle:', error);
    res.status(500).json({ error: 'Failed to create bundle' });
  }
};

// GET /api/price/simulate - محاكي التسعير
export const simulatePrice: RequestHandler = async (req, res) => {
  try {
    const { productId, basePrice } = req.query;
    
    const price = Number(basePrice) || 100;
    
    // Simulate 3 scenarios
    const scenarios = [
      {
        name: 'سعر منخفض',
        price: price * 0.85,
        estimatedSales: 150,
        estimatedRevenue: price * 0.85 * 150,
        margin: 25,
        marketPosition: 'تنافسي جداً'
      },
      {
        name: 'سعر متوسط',
        price: price,
        estimatedSales: 100,
        estimatedRevenue: price * 100,
        margin: 35,
        marketPosition: 'متوازن',
        recommended: true
      },
      {
        name: 'سعر مرتفع',
        price: price * 1.20,
        estimatedSales: 60,
        estimatedRevenue: price * 1.20 * 60,
        margin: 50,
        marketPosition: 'premium'
      }
    ];
    
    res.json({ productId, scenarios });
  } catch (error) {
    console.error('Error simulating price:', error);
    res.status(500).json({ error: 'Failed to simulate price' });
  }
};

// ===== INVENTORY =====

// GET /api/inventory/alerts - تنبيهات المخزون
export const getInventoryAlerts: RequestHandler = async (req, res) => {
  try {
    const { severity, merchantId } = req.query;
    
    // جلب من Appwrite database
    const queries: any[] = [];
    if (severity) queries.push(Query.equal('severity', String(severity)));
    if (merchantId) queries.push(Query.equal('merchantId', String(merchantId)));
    const result = await listDocuments('inventory_alerts', queries);
    res.json(result.documents);
  } catch (error) {
    console.error('Error fetching inventory alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

// POST /api/inventory/reorder - إعادة طلب
export const reorderInventory: RequestHandler = async (req, res) => {
  try {
    const { productId, quantity, supplierId } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ 
        error: 'productId and quantity are required' 
      });
    }
    
    const reorder = {
      id: Date.now().toString(),
      productId,
      quantity,
      supplierId,
      status: 'pending',
      estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      createdAt: new Date()
    };
    
    // حفظ في Appwrite database وإشعار المورد
    try {
      const { createDocument } = require('../lib/appwrite');
      const created = await createDocument('reorders', {
        productId,
        quantity,
        supplierId,
        status: 'pending',
        estimatedArrival: reorder.estimatedArrival.toISOString(),
        createdAt: new Date().toISOString()
      });
      // إشعار المورد (اختياري)
      // TODO: send notification to supplier if needed
      res.status(201).json(created);
    } catch (dbError) {
      console.error('Error saving reorder to DB:', dbError);
      res.status(500).json({ error: 'Failed to save reorder to database' });
    }
  } catch (error) {
    console.error('Error creating reorder:', error);
    res.status(500).json({ error: 'Failed to create reorder' });
  }
};

// GET /api/inventory/predictions - توقعات المخزون
export const getInventoryPredictions: RequestHandler = async (req, res) => {
  try {
    const { productId, days = 30 } = req.query;
    
    // TODO: ML model للتوقع
    const predictions = {
      productId,
      currentStock: 100,
      predictions: [
        { day: 7, estimatedStock: 85, confidence: 0.92 },
        { day: 14, estimatedStock: 68, confidence: 0.88 },
        { day: 21, estimatedStock: 52, confidence: 0.82 },
        { day: 30, estimatedStock: 35, confidence: 0.75 }
      ],
      recommendedActions: [
        { action: 'reorder', date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18), quantity: 100 }
      ]
    };
    
    res.json(predictions);
  } catch (error) {
    console.error('Error getting predictions:', error);
    res.status(500).json({ error: 'Failed to get predictions' });
  }
};

// ===== SEARCH =====

// GET /api/search - بحث شامل
export const universalSearch: RequestHandler = async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }
    
    const query = String(q).toLowerCase();
    
    // بحث في Appwrite database
    const { searchDocuments } = require('../lib/appwrite');
    const results: any = {};
    if (type === 'all' || type === 'products') {
      results.products = (await searchDocuments('products', 'name', query)).documents;
    }
    if (type === 'all' || type === 'orders') {
      results.orders = (await searchDocuments('orders', 'id', query)).documents;
    }
    if (type === 'all' || type === 'pages') {
      results.pages = (await searchDocuments('pages', 'title', query)).documents;
    }
    res.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

// GET /api/search/suggestions - اقتراحات البحث
export const getSearchSuggestions: RequestHandler = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json([]);
    }
    
    // جلب من Appwrite database بناءً على popularity
    const { listDocuments, Query } = require('../lib/appwrite');
    const result = await listDocuments('products', [
      Query.orderDesc('popularity'),
      Query.limit(5)
    ]);
    const suggestions = result.documents.map((doc: any) => doc.name);
    res.json(suggestions);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
};

// ===== LOYALTY & CURRENCY =====

// GET /api/loyalty/tiers - مستويات الولاء
export const getLoyaltyTiers: RequestHandler = async (req, res) => {
  try {
    const tiers = [
      {
        id: 'silver',
        name: 'فضي',
        minPoints: 0,
        benefits: ['شحن مجاني على طلبات +500 جنيه', 'خصم 5% على الطلب الثالث'],
        color: '#C0C0C0'
      },
      {
        id: 'gold',
        name: 'ذهبي',
        minPoints: 1000,
        benefits: ['شحن مجاني دائماً', 'خصم 10%', 'دعم أولوية'],
        color: '#FFD700'
      },
      {
        id: 'platinum',
        name: 'بلاتيني',
        minPoints: 5000,
        benefits: ['كل مميزات الذهبي', 'خصم 15%', 'وصول مبكر للمنتجات', 'هدايا حصرية'],
        color: '#E5E4E2'
      }
    ];
    
    res.json(tiers);
  } catch (error) {
    console.error('Error fetching tiers:', error);
    res.status(500).json({ error: 'Failed to fetch tiers' });
  }
};

// POST /api/loyalty/calculate - حساب النقاط
export const calculateLoyaltyPoints: RequestHandler = async (req, res) => {
  try {
    const { userId, orderValue } = req.body;
    
    if (!userId || !orderValue) {
      return res.status(400).json({ 
        error: 'userId and orderValue are required' 
      });
    }
    
    // 1 point per 10 EGP
    const pointsEarned = Math.floor(orderValue / 10);
    // جلب النقاط الحالية من Appwrite database
    let currentPoints = 0;
    try {
      const { listDocuments, Query } = require('../lib/appwrite');
      const result = await listDocuments('loyalty_points', [Query.equal('userId', userId), Query.limit(1)]);
      if (result.documents.length > 0) {
        currentPoints = result.documents[0].points || 0;
      }
    } catch (e) {
      console.error('Error fetching loyalty points from DB:', e);
    }
    const newTotal = currentPoints + pointsEarned;
    // Determine tier
    let tier = 'silver';
    if (newTotal >= 5000) tier = 'platinum';
    else if (newTotal >= 1000) tier = 'gold';
    res.json({
      userId,
      pointsEarned,
      currentPoints: newTotal,
      tier,
      nextTier: tier === 'silver' ? 'gold' : tier === 'gold' ? 'platinum' : null,
      pointsToNextTier: tier === 'silver' ? 1000 - newTotal : tier === 'gold' ? 5000 - newTotal : 0
    });
  } catch (error) {
    console.error('Error calculating points:', error);
    res.status(500).json({ error: 'Failed to calculate points' });
  }
};

// GET /api/currency/rates - أسعار العملات
export const getCurrencyRates: RequestHandler = async (req, res) => {
  try {
    // TODO: ربط مع Exchange Rate API
    const rates = {
      base: 'EGP',
      date: new Date(),
      rates: {
        USD: 0.032,
        EUR: 0.029,
        GBP: 0.025,
        SAR: 0.12,
        AED: 0.12,
        KWD: 0.010
      }
    };
    
    res.json(rates);
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ error: 'Failed to fetch rates' });
  }
};

// POST /api/currency/convert - تحويل العملة
export const convertCurrency: RequestHandler = async (req, res) => {
  try {
    const { amount, from = 'EGP', to } = req.body;
    
    if (!amount || !to) {
      return res.status(400).json({ 
        error: 'amount and to currency are required' 
      });
    }
    
    // TODO: استخدام أسعار حقيقية
    const rates: Record<string, number> = {
      'EGP_USD': 0.032,
      'EGP_EUR': 0.029,
      'EGP_SAR': 0.12
    };
    
    const rate = rates[`${from}_${to}`] || 1;
    const converted = amount * rate;
    
    res.json({
      from,
      to,
      amount,
      converted,
      rate
    });
  } catch (error) {
    console.error('Error converting currency:', error);
    res.status(500).json({ error: 'Failed to convert currency' });
  }
};
