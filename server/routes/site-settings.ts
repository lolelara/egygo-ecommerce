import { Router } from 'express';
import { COLLECTIONS, listDocuments, createDocument, updateDocument, Query } from '../lib/appwrite';
import { validateAPIKey } from '../middleware/security';

const router = Router();

// هيكل الإعدادات كما سيظهر للفرونت
interface SiteSettingsPayload {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  timezone: string;
  language: string;
  taxRate: number;
  shippingCost: number;
  freeShippingThreshold: number;
  features: Record<string, boolean>;
  security: Record<string, any>;
  notifications: Record<string, boolean>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    googleAnalyticsId: string;
    facebookPixelId: string;
    enableSitemap: boolean;
  };
}

// GET /api/admin/site-settings
router.get('/admin/site-settings', validateAPIKey, async (_req, res) => {
  try {
    const result = await listDocuments(COLLECTIONS.SITE_SETTINGS, [Query.limit(1)]);

    if (result.total === 0) {
      // لا يوجد إعدادات بعد - نرجع قيم افتراضية للفرونت
      const empty: SiteSettingsPayload = {
        siteName: 'إيجي جو',
        siteDescription: 'منصة التجارة الإلكترونية الرائدة',
        logo: '',
        favicon: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#f59e0b',
        accentColor: '#10b981',
        contactEmail: 'info@egygo.com',
        contactPhone: '+201234567890',
        address: 'القاهرة، مصر',
        currency: 'EGP',
        timezone: 'Africa/Cairo',
        language: 'ar',
        taxRate: 14,
        shippingCost: 50,
        freeShippingThreshold: 500,
        features: {},
        security: {},
        notifications: {},
        seo: {
          metaTitle: 'إيجي جو - منصة التجارة الإلكترونية',
          metaDescription: 'تسوق آمن وسريع مع إيجي جو',
          metaKeywords: 'تسوق، إلكتروني، مصر',
          googleAnalyticsId: '',
          facebookPixelId: '',
          enableSitemap: true,
        },
      };
      return res.json({ settings: empty, id: null });
    }

    const doc = result.documents[0] as any;
    const payload: SiteSettingsPayload = {
      siteName: doc.siteName || 'إيجي جو',
      siteDescription: doc.siteDescription || 'منصة التجارة الإلكترونية الرائدة',
      logo: doc.logo || '',
      favicon: doc.favicon || '',
      primaryColor: doc.primaryColor || '#3b82f6',
      secondaryColor: doc.secondaryColor || '#f59e0b',
      accentColor: doc.accentColor || '#10b981',
      contactEmail: doc.contactEmail || 'info@egygo.com',
      contactPhone: doc.contactPhone || '+201234567890',
      address: doc.address || 'القاهرة، مصر',
      currency: doc.currency || 'EGP',
      timezone: doc.timezone || 'Africa/Cairo',
      language: doc.language || 'ar',
      taxRate: typeof doc.taxRate === 'number' ? doc.taxRate : 14,
      shippingCost: typeof doc.shippingCost === 'number' ? doc.shippingCost : 50,
      freeShippingThreshold: typeof doc.freeShippingThreshold === 'number' ? doc.freeShippingThreshold : 500,
      features: doc.features || {},
      security: doc.security || {},
      notifications: doc.notifications || {},
      seo: {
        metaTitle: doc.metaTitle || 'إيجي جو - منصة التجارة الإلكترونية',
        metaDescription: doc.metaDescription || 'تسوق آمن وسريع مع إيجي جو',
        metaKeywords: doc.metaKeywords || 'تسوق، إلكتروني، مصر',
        googleAnalyticsId: doc.googleAnalyticsId || '',
        facebookPixelId: doc.facebookPixelId || '',
        enableSitemap: doc.enableSitemap ?? true,
      },
    };

    return res.json({ settings: payload, id: doc.$id });
  } catch (error) {
    console.error('Error loading site settings:', error);
    return res.status(500).json({ error: 'فشل في تحميل إعدادات الموقع' });
  }
});

// PUT /api/admin/site-settings
router.put('/admin/site-settings', validateAPIKey, async (req, res) => {
  try {
    const body = req.body as { id?: string | null; settings: SiteSettingsPayload };
    const { id, settings } = body;

    if (!settings) {
      return res.status(400).json({ error: 'settings مطلوب' });
    }

    const data = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      logo: settings.logo,
      favicon: settings.favicon,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      accentColor: settings.accentColor,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      address: settings.address,
      currency: settings.currency,
      timezone: settings.timezone,
      language: settings.language,
      taxRate: settings.taxRate,
      shippingCost: settings.shippingCost,
      freeShippingThreshold: settings.freeShippingThreshold,
      features: settings.features,
      security: settings.security,
      notifications: settings.notifications,
      metaTitle: settings.seo.metaTitle,
      metaDescription: settings.seo.metaDescription,
      metaKeywords: settings.seo.metaKeywords,
      googleAnalyticsId: settings.seo.googleAnalyticsId,
      facebookPixelId: settings.seo.facebookPixelId,
      enableSitemap: settings.seo.enableSitemap,
    };

    let saved;
    if (id) {
      saved = await updateDocument(COLLECTIONS.SITE_SETTINGS, id, data);
    } else {
      saved = await createDocument(COLLECTIONS.SITE_SETTINGS, data);
    }

    return res.json({ success: true, id: saved.$id });
  } catch (error) {
    console.error('Error saving site settings:', error);
    return res.status(500).json({ error: 'فشل في حفظ إعدادات الموقع' });
  }
});

export default router;
