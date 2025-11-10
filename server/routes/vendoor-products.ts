import { Router, Request, Response } from 'express';
import { databases, Query } from '../lib/appwrite';

const router = Router();

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const PRODUCTS_COLLECTION_ID = 'products';
const VENDOOR_SETTINGS_COLLECTION_ID = 'vendoor_settings';

// Get all Vendoor products
router.get('/vendoor-products', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, status = 'all' } = req.query;
    
    const queries = [
      Query.equal('source', 'vendoor'),
      Query.orderDesc('$createdAt'),
      Query.limit(Number(limit)),
      Query.offset((Number(page) - 1) * Number(limit))
    ];
    
    if (status !== 'all') {
      queries.push(Query.equal('status', status as string));
    }
    
    const products = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      queries
    );
    
    // Count total
    const totalQueries = [Query.equal('source', 'vendoor')];
    if (status !== 'all') {
      totalQueries.push(Query.equal('status', status as string));
    }
    
    const total = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      totalQueries
    );
    
    res.json({
      products: products.documents,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total.total,
        pages: Math.ceil(total.total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Error fetching Vendoor products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Vendoor settings (profit margin)
router.get('/vendoor-settings', async (req: Request, res: Response) => {
  try {
    const settings = await databases.listDocuments(
      DATABASE_ID,
      VENDOOR_SETTINGS_COLLECTION_ID,
      [Query.limit(1)]
    );
    
    if (settings.documents.length > 0) {
      res.json(settings.documents[0]);
    } else {
      // Create default settings
      const defaultSettings = await databases.createDocument(
        DATABASE_ID,
        VENDOOR_SETTINGS_COLLECTION_ID,
        'default',
        {
          profitType: 'percentage', // 'percentage' or 'fixed'
          profitValue: 5, // 5% or 5 EGP
          autoApply: false
        }
      );
      res.json(defaultSettings);
    }
  } catch (error: any) {
    console.error('Error fetching Vendoor settings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update Vendoor settings
router.put('/vendoor-settings', async (req: Request, res: Response) => {
  try {
    const { profitType, profitValue, autoApply } = req.body;
    
    const settings = await databases.listDocuments(
      DATABASE_ID,
      VENDOOR_SETTINGS_COLLECTION_ID,
      [Query.limit(1)]
    );
    
    let settingsId = 'default';
    if (settings.documents.length > 0) {
      settingsId = settings.documents[0].$id;
    }
    
    const updated = await databases.updateDocument(
      DATABASE_ID,
      VENDOOR_SETTINGS_COLLECTION_ID,
      settingsId,
      {
        profitType,
        profitValue: Number(profitValue),
        autoApply
      }
    );
    
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating Vendoor settings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Apply profit margin to all Vendoor products
router.post('/apply-profit-margin', async (req: Request, res: Response) => {
  try {
    const { profitType, profitValue } = req.body;
    
    if (!profitType || profitValue === undefined) {
      return res.status(400).json({ error: 'Missing profitType or profitValue' });
    }
    
    // Get all Vendoor products
    const products = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [Query.equal('source', 'vendoor')]
    );
    
    let updatedCount = 0;
    const errors: any[] = [];
    
    for (const product of products.documents) {
      try {
        // Get original price from description or use current price
        const originalPrice = product.originalPrice || product.price;
        
        let newPrice = originalPrice;
        if (profitType === 'percentage') {
          newPrice = originalPrice * (1 + profitValue / 100);
        } else {
          newPrice = originalPrice + profitValue;
        }
        
        await databases.updateDocument(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          product.$id,
          {
            price: Math.round(newPrice),
            originalPrice: originalPrice,
            profitMargin: profitValue,
            profitType: profitType
          }
        );
        
        updatedCount++;
      } catch (error: any) {
        errors.push({
          productId: product.$id,
          productName: product.name,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      updatedCount,
      totalProducts: products.documents.length,
      errors
    });
  } catch (error: any) {
    console.error('Error applying profit margin:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update individual product price
router.put('/vendoor-products/:id/price', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    const updated = await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      id,
      { price: Number(price) }
    );
    
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating product price:', error);
    res.status(500).json({ error: error.message });
  }
});

// Publish/unpublish Vendoor products (bulk)
router.post('/vendoor-products/bulk-status', async (req: Request, res: Response) => {
  try {
    const { productIds, status } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || !status) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    
    let updatedCount = 0;
    const errors: any[] = [];
    
    for (const id of productIds) {
      try {
        await databases.updateDocument(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          id,
          { status }
        );
        updatedCount++;
      } catch (error: any) {
        errors.push({ productId: id, error: error.message });
      }
    }
    
    res.json({
      success: true,
      updatedCount,
      totalRequested: productIds.length,
      errors
    });
  } catch (error: any) {
    console.error('Error bulk updating status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Vendoor products (bulk)
router.delete('/vendoor-products/bulk-delete', async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    
    let deletedCount = 0;
    const errors: any[] = [];
    
    for (const id of productIds) {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          id
        );
        deletedCount++;
      } catch (error: any) {
        errors.push({ productId: id, error: error.message });
      }
    }
    
    res.json({
      success: true,
      deletedCount,
      totalRequested: productIds.length,
      errors
    });
  } catch (error: any) {
    console.error('Error bulk deleting products:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
