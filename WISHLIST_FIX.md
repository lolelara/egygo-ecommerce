# 🔧 إصلاح زر المفضلة (Wishlist)

## ❌ المشكلة:
زر إضافة المنتج للمفضلة لا يعمل في صفحة ProductDetail.

## 🔍 التشخيص:
كان ProductDetail.tsx يستخدم فقط **state محلي** بدون حفظ البيانات إلى قاعدة البيانات!

### الكود القديم (لا يعمل):
```typescript
const [isWishlisted, setIsWishlisted] = useState(false);

const handleToggleWishlist = () => {
  setIsWishlisted(!isWishlisted);  // ❌ state محلي فقط!
  toast({ title: "تمت الإضافة للمفضلة" });
};
```

## ✅ الحل المطبق:

### 1. **استخدام wishlistApi من `/lib/api.ts`**
```typescript
import { wishlistApi, queryKeys } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
```

### 2. **إضافة Query للتحقق من المفضلة**
```typescript
// Check if product is in wishlist
const { data: wishlistItems = [] } = useQuery({
  queryKey: queryKeys.wishlist(user?.$id || ""),
  queryFn: () => wishlistApi.getUserWishlist(user?.$id || ""),
  enabled: !!user?.$id,
});

const isWishlisted = useMemo(() => {
  return wishlistItems.some((item: any) => item.productId === id);
}, [wishlistItems, id]);
```

### 3. **إضافة Mutations للإضافة والإزالة**
```typescript
// Add to wishlist mutation
const addToWishlist = useMutation({
  mutationFn: () => wishlistApi.addToWishlist(user?.$id || "", id || ""),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.wishlist(user?.$id || "") });
    toast({ title: "✅ تمت الإضافة للمفضلة" });
  },
  onError: (error: any) => {
    toast({
      title: "خطأ",
      description: error.message,
      variant: "destructive",
    });
  },
});

// Remove from wishlist mutation
const removeFromWishlist = useMutation({
  mutationFn: () => wishlistApi.removeFromWishlist(wishlistItem?.id || "", user?.$id || ""),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.wishlist(user?.$id || "") });
    toast({ title: "تمت الإزالة" });
  },
});
```

### 4. **تحديث دالة الـ Handler**
```typescript
const handleToggleWishlist = () => {
  if (!user) {
    toast({
      title: "يجب تسجيل الدخول",
      description: "يرجى تسجيل الدخول لإضافة المنتجات إلى المفضلة",
      variant: "destructive",
    });
    return;
  }

  if (isWishlisted) {
    removeFromWishlist.mutate();
  } else {
    addToWishlist.mutate();
  }
};
```

### 5. **تحسين UI للزر**
```tsx
<Button
  size="lg"
  variant={isWishlisted ? "default" : "outline"}
  onClick={handleToggleWishlist}
  disabled={addToWishlist.isPending || removeFromWishlist.isPending}
>
  {addToWishlist.isPending || removeFromWishlist.isPending ? (
    <Loader2 className="h-5 w-5 animate-spin" />
  ) : (
    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
  )}
</Button>
```

---

## 📋 Appwrite Setup المطلوب:

### يجب إنشاء Collection باسم `wishlist` في Appwrite:

#### Attributes:
```json
{
  "userId": {
    "type": "string",
    "size": 255,
    "required": true
  },
  "productId": {
    "type": "string",
    "size": 255,
    "required": true
  }
}
```

#### Indexes:
```json
[
  {
    "key": "userId_productId",
    "type": "unique",
    "attributes": ["userId", "productId"]
  },
  {
    "key": "userId",
    "type": "key",
    "attributes": ["userId"]
  }
]
```

#### Permissions:
- **Create**: `users` role
- **Read**: Owner (userId matches)
- **Update**: Owner (userId matches)
- **Delete**: Owner (userId matches)

---

## ⚠️ ملاحظة مهمة: نظامان للمفضلة!

تم اكتشاف أن المشروع يحتوي على **نظامين منفصلين** للمفضلة:

### 1. `wishlistApi` في `/lib/api.ts`:
- يستخدم collection: `"wishlist"`
- يُستخدم في: `ProductDetail.tsx`, `Wishlist.tsx`

### 2. `FavoritesContext` في `/contexts/FavoritesContext.tsx`:
- يستخدم collection: `"favorites"`
- يُستخدم في: `EnhancedProductCard.tsx`
- يدعم أيضاً localStorage للـ guests

### 🔧 التوصية:
يُفضل **توحيد النظامين** لاستخدام نفس الـ collection. الخيارات:

#### الخيار A: استخدام `wishlistApi` في كل مكان
```typescript
// في EnhancedProductCard.tsx
// استبدل useFavorites() بـ:
import { wishlistApi, queryKeys } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
```

#### الخيار B: استخدام `FavoritesContext` في كل مكان
```typescript
// في ProductDetail.tsx
// استبدل wishlistApi بـ:
import { useFavorites } from "@/contexts/FavoritesContext";
const { addFavorite, removeFavorite, isFavorite } = useFavorites();
```

#### الخيار C: تحديث `FavoritesContext` ليستخدم collection `wishlist`
```typescript
// في FavoritesContext.tsx
// غيّر:
appwriteConfig.collections.favorites
// إلى:
'wishlist'
```

---

## 🎯 المزايا الجديدة:

### ✅ يعمل الآن:
- ✅ حفظ المفضلة في Appwrite
- ✅ تحميل المفضلة عند فتح الصفحة
- ✅ مزامنة بين الأجهزة
- ✅ يتطلب تسجيل دخول

### ✅ تحسينات UI:
- ⏳ Loading spinner أثناء الإضافة/الإزالة
- 🔒 Disabled button أثناء العملية
- 💬 Toast notifications
- ❤️ Heart icon يتغير لونه
- 🎨 Variant يتغير (default/outline)

---

## 🧪 للاختبار:

### 1. بدون تسجيل دخول:
```
1. افتح صفحة منتج
2. اضغط على زر القلب
3. يجب أن يظهر: "يجب تسجيل الدخول"
```

### 2. مع تسجيل دخول:
```
1. سجل دخول
2. افتح صفحة منتج
3. اضغط على زر القلب
4. يجب أن يظهر: "✅ تمت الإضافة للمفضلة"
5. reload الصفحة
6. يجب أن يظل القلب ممتلئاً (filled)
7. اذهب إلى /wishlist
8. يجب أن ترى المنتج هناك
```

### 3. الإزالة:
```
1. اضغط على القلب مرة أخرى
2. يجب أن يظهر: "تمت الإزالة"
3. يجب أن يصبح القلب فارغاً
```

---

## 📁 الملفات المعدلة:

### ✅ `client/pages/ProductDetail.tsx`
- إضافة `useMutation` و `useQueryClient`
- إضافة `wishlistApi` import
- حذف `isWishlisted` state المحلي
- إضافة `useQuery` للمفضلة
- إضافة `addToWishlist` mutation
- إضافة `removeFromWishlist` mutation
- تحديث `handleToggleWishlist`
- تحسين UI للزر (loading + disabled)

---

## 🔄 Next Steps:

### للمستقبل (اختياري):
1. **توحيد الأنظمة**: اختر نظام واحد (wishlist أو favorites)
2. **Optimistic Updates**: تحديث UI فوراً قبل انتهاء API
3. **Animation**: إضافة animation لزر القلب
4. **Sync**: مزامنة localStorage مع Appwrite للـ guests
5. **Count**: عرض عدد المفضلة في الـ Header

---

## 📊 API Documentation:

### `wishlistApi.getUserWishlist(userId: string)`
- **Returns**: `Promise<WishlistItem[]>`
- **WishlistItem**: `{ id, productId, userId, addedAt }`

### `wishlistApi.addToWishlist(userId: string, productId: string)`
- **Returns**: `Promise<WishlistItem>`
- **Error**: `"المنتج موجود بالفعل في قائمة المفضلة"`

### `wishlistApi.removeFromWishlist(id: string, userId: string)`
- **Returns**: `Promise<void>`
- **Error**: `"غير مصرح بالحذف"`

---

## 🎨 UI States:

### زر المفضلة:
```
State: Not Wishlisted
- variant: "outline"
- icon: Heart (empty)
- onClick: addToWishlist.mutate()

State: Wishlisted
- variant: "default"
- icon: Heart (filled)
- onClick: removeFromWishlist.mutate()

State: Loading
- disabled: true
- icon: Loader2 (spinning)
```

---

## 💡 Tips:

### Performance:
```typescript
// استخدم useMemo لتجنب re-calculations
const isWishlisted = useMemo(() => {
  return wishlistItems.some((item: any) => item.productId === id);
}, [wishlistItems, id]);
```

### Error Handling:
```typescript
// اعرض رسالة خطأ واضحة
onError: (error: any) => {
  toast({
    title: "خطأ",
    description: error.message || "فشل في إضافة المنتج للمفضلة",
    variant: "destructive",
  });
}
```

### User Experience:
```typescript
// تحقق من تسجيل الدخول أولاً
if (!user) {
  toast({
    title: "يجب تسجيل الدخول",
    variant: "destructive",
  });
  return;
}
```

---

**آخر تحديث**: 16/10/2025 - 9:20 PM
**الحالة**: ✅ تم الإصلاح وجاهز للاختبار
**المطور**: Cascade AI Assistant
