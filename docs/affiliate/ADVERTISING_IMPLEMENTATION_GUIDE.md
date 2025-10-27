# 🎯 دليل تطبيق نظام الإعلانات - الأجزاء المتبقية

## ✅ تم إنشاؤه

1. ✅ **AdminAdvertisementsManager.tsx** - صفحة الأدمن
2. ✅ **AdBanner.tsx** - مكون البانرات
3. ✅ **SponsoredProductCard.tsx** - كارت المنتج المدعوم

---

## 📋 التطبيقات المطلوبة

### 1️⃣ دمج في Index.tsx (الصفحة الرئيسية)

أضف في بداية الملف:
```tsx
import { AdBanner } from '@/components/ads/AdBanner';
import { SponsoredProductCard } from '@/components/ads/SponsoredProductCard';
import { adsManager } from '@/lib/ads-manager';
import { useState, useEffect } from 'react';
```

أضف state للإعلانات:
```tsx
const [featuredAds, setFeaturedAds] = useState([]);

useEffect(() => {
  loadFeaturedAds();
}, []);

const loadFeaturedAds = async () => {
  const ads = await adsManager.getActiveAds('homepage_featured', 4);
  setFeaturedAds(ads);
  // Track impressions
  ads.forEach(ad => adsManager.trackImpression(ad.$id));
};

const handleAdClick = (adId: string) => {
  adsManager.trackClick(adId);
};
```

أضف البانر بعد الـ Hero Section:
```tsx
{/* Ad Banner */}
<AdBanner adType="homepage_banner" />

{/* Sponsored Products Section */}
{featuredAds.length > 0 && (
  <section className="my-12">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">منتجات مميزة</h2>
      <Badge className="bg-yellow-500">إعلانات</Badge>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredAds.map((ad) => (
        <SponsoredProductCard
          key={ad.$id}
          ad={ad}
          onImpression={(id) => {}}
          onClick={handleAdClick}
        />
      ))}
    </div>
  </section>
)}
```

---

### 2️⃣ دمج في CategoryPage / Products Page

أضف في الأعلى:
```tsx
import { adsManager } from '@/lib/ads-manager';
import { SponsoredProductCard } from '@/components/ads/SponsoredProductCard';

const [sponsoredAds, setSponsoredAds] = useState([]);

useEffect(() => {
  loadSponsoredAds();
}, [category]);

const loadSponsoredAds = async () => {
  const ads = await adsManager.getActiveAds('category_top', 3);
  setSponsoredAds(ads);
  ads.forEach(ad => adsManager.trackImpression(ad.$id));
};
```

أضف قبل عرض المنتجات:
```tsx
{/* Sponsored Ads */}
{sponsoredAds.length > 0 && (
  <div className="mb-8">
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <p className="text-sm text-yellow-800 flex items-center gap-2">
        <Sparkles className="h-4 w-4" />
        إعلانات مدعومة
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sponsoredAds.map((ad) => (
        <SponsoredProductCard
          key={ad.$id}
          ad={ad}
          onImpression={() => {}}
          onClick={(id) => adsManager.trackClick(id)}
        />
      ))}
    </div>
    <div className="border-t my-8"></div>
  </div>
)}
```

---

### 3️⃣ دمج في SearchPage / نتائج البحث

```tsx
import { adsManager } from '@/lib/ads-manager';
import { SponsoredProductCard } from '@/components/ads/SponsoredProductCard';

const [searchAds, setSearchAds] = useState([]);

useEffect(() => {
  if (searchQuery) {
    loadSearchAds();
  }
}, [searchQuery]);

const loadSearchAds = async () => {
  const ads = await adsManager.getActiveAds('search_sponsored', 2);
  setSearchAds(ads);
  ads.forEach(ad => adsManager.trackImpression(ad.$id));
};
```

عرض الإعلانات أعلى النتائج:
```tsx
{/* Search Results */}
<div>
  <p className="text-muted-foreground mb-6">
    {products.length} نتيجة للبحث عن "{searchQuery}"
  </p>

  {/* Sponsored Results */}
  {searchAds.length > 0 && (
    <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-sm text-blue-800 mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4" />
        نتائج مدعومة
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searchAds.map((ad) => (
          <SponsoredProductCard
            key={ad.$id}
            ad={ad}
            onImpression={() => {}}
            onClick={(id) => adsManager.trackClick(id)}
          />
        ))}
      </div>
    </div>
  )}

  {/* Regular Results */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {products.map(product => ...)}
  </div>
</div>
```

---

### 4️⃣ إضافة Routes في App.tsx

```tsx
import AdminAdvertisementsManager from '@/pages/AdminAdvertisementsManager';
import MerchantAdvertising from '@/pages/MerchantAdvertising';

// Admin Routes
<Route path="/admin/advertisements" element={<AdminAdvertisementsManager />} />

// Merchant Routes
<Route path="/merchant/advertising" element={<MerchantAdvertising />} />
```

---

### 5️⃣ إضافة في قائمة الأدمن

```tsx
<Link to="/admin/advertisements" className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg">
  <TrendingUp className="h-4 w-4" />
  <span>إدارة الإعلانات</span>
  {pendingAdsCount > 0 && (
    <Badge className="bg-red-500">{pendingAdsCount}</Badge>
  )}
</Link>
```

---

### 6️⃣ إضافة في قائمة التاجر

```tsx
<Link to="/merchant/advertising" className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg">
  <Megaphone className="h-4 w-4" />
  <span>الإعلانات</span>
</Link>
```

---

## 🔔 نظام الإشعارات

### إنشاء ملف: `client/lib/ad-notifications.ts`

```typescript
import { databases, appwriteConfig } from './appwrite';
import { ID } from 'appwrite';

export async function notifyAdCreated(adminId: string, ad: any) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      'notifications',
      ID.unique(),
      {
        userId: adminId,
        title: '📢 إعلان جديد قيد المراجعة',
        message: `${ad.merchantName} أنشأ إعلان لـ ${ad.productName}`,
        type: 'info',
        read: false,
        relatedId: ad.$id,
        metadata: JSON.stringify({ type: 'ad_pending', adId: ad.$id })
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export async function notifyAdApproved(merchantId: string, ad: any) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      'notifications',
      ID.unique(),
      {
        userId: merchantId,
        title: '✅ تمت الموافقة على إعلانك',
        message: `تم تفعيل إعلان ${ad.productName} بنجاح`,
        type: 'success',
        read: false,
        relatedId: ad.$id,
        metadata: JSON.stringify({ type: 'ad_approved', adId: ad.$id })
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export async function notifyAdRejected(merchantId: string, ad: any, reason: string) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      'notifications',
      ID.unique(),
      {
        userId: merchantId,
        title: '❌ تم رفض إعلانك',
        message: `تم رفض إعلان ${ad.productName}. السبب: ${reason}`,
        type: 'alert',
        read: false,
        relatedId: ad.$id,
        metadata: JSON.stringify({ type: 'ad_rejected', adId: ad.$id, reason })
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export async function notifyAdExpiringSoon(merchantId: string, ad: any, daysLeft: number) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      'notifications',
      ID.unique(),
      {
        userId: merchantId,
        title: '⏰ إعلانك ينتهي قريباً',
        message: `إعلان ${ad.productName} سينتهي خلال ${daysLeft} أيام. هل تريد التجديد؟`,
        type: 'info',
        read: false,
        relatedId: ad.$id,
        metadata: JSON.stringify({ type: 'ad_expiring', adId: ad.$id, daysLeft })
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
```

### استخدام الإشعارات

في `MerchantAdvertising.tsx` عند الإنشاء:
```tsx
import { notifyAdCreated } from '@/lib/ad-notifications';

const handleCreate = async () => {
  // ... create ad code
  await notifyAdCreated('admin', createdAd);
};
```

في `AdminAdvertisementsManager.tsx` عند المراجعة:
```tsx
import { notifyAdApproved, notifyAdRejected } from '@/lib/ad-notifications';

const handleReview = async () => {
  if (reviewAction === 'approve') {
    await adsManager.approveAd(selectedAd.$id);
    await notifyAdApproved(selectedAd.merchantId, selectedAd);
  } else {
    await adsManager.rejectAd(selectedAd.$id, rejectionReason);
    await notifyAdRejected(selectedAd.merchantId, selectedAd, rejectionReason);
  }
};
```

---

## 💳 نظام الدفع

### إنشاء صفحة: `client/pages/AdPaymentPage.tsx`

```tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/appwrite';
import { ID } from 'appwrite';

export default function AdPaymentPage({ ad }: { ad: Advertisement }) {
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!paymentProof) return;

    try {
      setUploading(true);

      // Upload to Appwrite Storage
      const file = await storage.createFile(
        'payment-proofs',
        ID.unique(),
        paymentProof
      );

      // Update ad with payment proof
      await databases.updateDocument(
        appwriteConfig.databaseId,
        'advertisements',
        ad.$id,
        { paymentProof: file.$id }
      );

      toast({
        title: 'تم الرفع',
        description: 'تم رفع إثبات الدفع بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في رفع الملف',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>دفع الإعلان</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-4">تفاصيل الدفع</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>المبلغ:</span>
              <span className="font-bold">{ad.price} ج.م</span>
            </div>
            <div className="flex justify-between">
              <span>المدة:</span>
              <span>{ad.duration} يوم</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="font-semibold mb-3">طرق الدفع:</h4>
          <div className="space-y-2 text-sm bg-muted p-4 rounded-lg">
            <p>📱 <strong>Vodafone Cash:</strong> 01034324551</p>
            <p>💳 <strong>InstaPay:</strong> ebank_hema@instapay</p>
            <p>🏦 <strong>تحويل بنكي:</strong> (اطلب التفاصيل)</p>
          </div>
        </div>

        {/* Upload Payment Proof */}
        <div>
          <Label>رفع إثبات الدفع</Label>
          <Input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            صورة أو PDF (حد أقصى 5MB)
          </p>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!paymentProof || uploading}
          className="w-full"
        >
          {uploading ? 'جاري الرفع...' : 'رفع إثبات الدفع'}
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## 🤖 Cron Job للإدارة التلقائية

### إنشاء ملف: `server/cron/ads-manager.ts`

```typescript
import { adsManager } from '../lib/ads-manager';
import { notifyAdExpiringSoon } from '../lib/ad-notifications';

// Run daily
export async function checkAdsStatus() {
  console.log('🔍 Checking ads status...');

  // Check expired ads
  await adsManager.checkExpiredAds();

  // Check ads expiring in 3 days
  const activeAds = await adsManager.getActiveAds();
  const now = Date.now();
  const threeDays = 3 * 24 * 60 * 60 * 1000;

  for (const ad of activeAds) {
    const endDate = new Date(ad.endDate).getTime();
    const timeLeft = endDate - now;

    if (timeLeft > 0 && timeLeft <= threeDays) {
      const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));
      await notifyAdExpiringSoon(ad.merchantId, ad, daysLeft);
    }
  }

  console.log('✅ Ads status check complete');
}
```

استخدم في `server/index.ts`:
```typescript
import { checkAdsStatus } from './cron/ads-manager';

// Run once on startup
checkAdsStatus();

// Run every 24 hours
setInterval(() => {
  checkAdsStatus();
}, 24 * 60 * 60 * 1000);
```

---

## ✅ خطوات التفعيل السريع

### 1. إضافة Routes
```bash
# في App.tsx أضف:
- /admin/advertisements
- /merchant/advertising
```

### 2. دمج الإعلانات
```bash
# حدث:
- Index.tsx (بانر + منتجات مميزة)
- Products.tsx (إعلانات التصنيف)
- Search.tsx (نتائج مدعومة)
```

### 3. تفعيل الإشعارات
```bash
# أنشئ:
- client/lib/ad-notifications.ts
# واستخدمه في الصفحات
```

### 4. نظام الدفع (اختياري للبداية)
```bash
# يمكن البدء بدون والإضافة لاحقاً
```

---

## 🎯 الأولويات

**فوري (اليوم):**
1. ✅ إضافة Routes
2. ✅ دمج AdBanner في Index.tsx
3. ✅ دمج SponsoredProductCard في Index.tsx

**خلال أسبوع:**
4. ⏳ دمج في Products.tsx
5. ⏳ دمج في Search.tsx
6. ⏳ نظام الإشعارات

**خلال أسبوعين:**
7. ⏳ نظام الدفع
8. ⏳ Cron Jobs
9. ⏳ تحسينات الأداء

---

## 📊 المتوقع بعد التطبيق

```
قبل: 0 ج.م/شهر من الإعلانات
بعد: 10,000 - 50,000 ج.م/شهر

معدل التحويل المتوقع:
- 5-10 تجار يعلنون شهرياً
- متوسط 2,000 ج.م لكل تاجر
```

---

**🎉 النظام جاهز للتطبيق! ابدأ بالخطوات الفورية أولاً.**
