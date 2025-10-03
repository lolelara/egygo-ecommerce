# إصلاح روابط المنتجات في صفحة Index

## المشكلة
بطاقات المنتجات في الصفحة الرئيسية لا تحتوي على روابط لصفحات تفاصيل المنتجات.

## الحل
إضافة مكون `Link` حول بطاقات المنتجات للتنقل إلى صفحة `/product/{id}`

## الأماكن التي تحتاج تعديل في `client/pages/Index.tsx`:

### 1. Hero Section - أول مجموعة منتجات (سطر ~115):
```tsx
// قبل
{featuredProducts.slice(0, 2).map((product, index) => (
  <Card key={product.id} className="...">
    ...
  </Card>
))}

// بعد
{featuredProducts.slice(0, 2).map((product, index) => (
  <Link key={product.id} to={`/product/${product.id}`}>
    <Card className="... hover:bg-white/20 transition-colors cursor-pointer">
      ...
    </Card>
  </Link>
))}
```

### 2. Hero Section - ثاني مجموعة منتجات (سطر ~138):
نفس التعديل أعلاه

### 3. Featured Products Section (سطر ~220):
```tsx
// قبل
{featuredProducts.map((product) => (
  <Card key={product.id} className="...">
    ...
  </Card>
))}

// بعد
{featuredProducts.map((product) => (
  <Link key={product.id} to={`/product/${product.id}`} className="block">
    <Card className="... cursor-pointer">
      ...
    </Card>
  </Link>
))}
```

### 4. Best Sellers Section (سطر ~415):
نفس التعديل كـ Featured Products

## ملاحظة
`Link` component مستورد بالفعل من `react-router-dom` في بداية الملف.
