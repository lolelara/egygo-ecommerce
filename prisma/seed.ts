import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء إضافة البيانات التجريبية...");

  // إنشاء الفئات
  console.log("📂 إضافة الفئات...");
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "الإلكترونيات",
        slug: "electronics",
        description: "أحدث الأجهزة الإلكترونية والتكنولوجيا",
        image:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop",
        productCount: 0,
      },
    }),
    prisma.category.upsert({
      where: { slug: "fashion" },
      update: {},
      create: {
        name: "الأزياء",
        slug: "fashion",
        description: "أزياء عصرية وأناقة متميزة",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
        productCount: 0,
      },
    }),
    prisma.category.upsert({
      where: { slug: "home-garden" },
      update: {},
      create: {
        name: "المنزل والحديقة",
        slug: "home-garden",
        description: "كل ما تحتاجه للمنزل والحديقة",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop",
        productCount: 0,
      },
    }),
    prisma.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: {
        name: "الرياضة واللياقة",
        slug: "sports",
        description: "معدات رياضية ولياقة بدنية",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
        productCount: 0,
      },
    }),
    prisma.category.upsert({
      where: { slug: "beauty" },
      update: {},
      create: {
        name: "الجمال والصحة",
        slug: "beauty",
        description: "منتجات ��لعناية والجمال",
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=300&fit=crop",
        productCount: 0,
      },
    }),
    prisma.category.upsert({
      where: { slug: "books" },
      update: {},
      create: {
        name: "الكتب والوسائط",
        slug: "books",
        description: "كتب ووسائط تعليمية وترفيهية",
        image:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop",
        productCount: 0,
      },
    }),
  ]);

  // إنشاء العلامات
  console.log("🏷️ إضافة العلامات...");
  const tags = await Promise.all([
    prisma.productTag.upsert({
      where: { name: "لاسلكي" },
      update: {},
      create: { name: "لاسلكي" },
    }),
    prisma.productTag.upsert({
      where: { name: "إلغاء الضوضاء" },
      update: {},
      create: { name: "إلغاء الضوضاء" },
    }),
    prisma.productTag.upsert({
      where: { name: "متميز" },
      update: {},
      create: { name: "متميز" },
    }),
    prisma.productTag.upsert({
      where: { name: "صوت" },
      update: {},
      create: { name: "صوت" },
    }),
    prisma.productTag.upsert({
      where: { name: "لياقة" },
      update: {},
      create: { name: "لياقة" },
    }),
    prisma.productTag.upsert({
      where: { name: "ساعة ذكي��" },
      update: {},
      create: { name: "ساعة ذكية" },
    }),
    prisma.productTag.upsert({
      where: { name: "صحة" },
      update: {},
      create: { name: "صحة" },
    }),
    prisma.productTag.upsert({
      where: { name: "جي بي اس" },
      update: {},
      create: { name: "جي بي اس" },
    }),
    prisma.productTag.upsert({
      where: { name: "طبيعي" },
      update: {},
      create: { name: "طبيعي" },
    }),
    prisma.productTag.upsert({
      where: { name: "عناية بالبشرة" },
      update: {},
      create: { name: "عناية بالبشرة" },
    }),
    prisma.productTag.upsert({
      where: { name: "أعشاب" },
      update: {},
      create: { name: "أعشاب" },
    }),
    prisma.productTag.upsert({
      where: { name: "روتين" },
      update: {},
      create: { name: "روتين" },
    }),
  ]);

  // إضافة المنتجات
  console.log("📦 إضافة المنتجات...");

  const electronicsCategory = categories.find((c) => c.slug === "electronics");
  const sportsCategory = categories.find((c) => c.slug === "sports");
  const beautyCategory = categories.find((c) => c.slug === "beauty");
  const homeCategory = categories.find((c) => c.slug === "home-garden");
  const fashionCategory = categories.find((c) => c.slug === "fashion");
  const booksCategory = categories.find((c) => c.slug === "books");

  const products = await Promise.all([
    // سماعات لاسلكية احترافية
    prisma.product.create({
      data: {
        name: "سماعات لاسلكية احترافية",
        description:
          "سماعات لاسلكية متميزة بتقنية إلغاء الضوضاء مع بطارية تدوم 30 ساعة وجودة صوت عالية الوضوح.",
        price: 299.99,
        originalPrice: 399.99,
        sku: "WH-PRO-001",
        inStock: true,
        stockQuantity: 50,
        rating: 4.8,
        reviewCount: 127,
        affiliateCommission: 8,
        categoryId: electronicsCategory!.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
              alt: "سماعات لاسلكية احترافية",
              order: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
              alt: "سماعات لاسلكية احترافية - منظر جانبي",
              order: 1,
            },
          ],
        },
        tags: {
          connect: [
            { name: "لاسلكي" },
            { name: "إلغاء الضوضاء" },
            { name: "متميز" },
            { name: "صوت" },
          ],
        },
      },
    }),

    // ساعة ذكية للياقة البدنية
    prisma.product.create({
      data: {
        name: "ساعة ذكية للياقة البدنية",
        description:
          "ساعة لياقة بدنية متطورة مع مراقبة معدل ضربات القلب ونظام تحديد المواقع وبطارية تدوم 7 أيام.",
        price: 249.99,
        originalPrice: 299.99,
        sku: "SW-FIT-001",
        inStock: true,
        stockQuantity: 30,
        rating: 4.6,
        reviewCount: 89,
        affiliateCommission: 12,
        categoryId: sportsCategory!.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
              alt: "ساعة ذكية للياقة البدنية",
              order: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
              alt: "ساعة ذكية للياقة البدنية - منظر مختلف",
              order: 1,
            },
          ],
        },
        tags: {
          connect: [
            { name: "لياقة" },
            { name: "ساعة ذكية" },
            { name: "صحة" },
            { name: "جي بي اس" },
          ],
        },
      },
    }),

    // مجموعة العناية الطبيعية بالبشرة
    prisma.product.create({
      data: {
        name: "مجموعة العناية الطبيعية بالبشرة",
        description:
          "مجموعة كاملة من 5 قطع للعناية الطبيعية بالبشرة مع مكونات طبيعية لجميع أنواع البشرة.",
        price: 89.99,
        originalPrice: 129.99,
        sku: "SK-NAT-001",
        inStock: true,
        stockQuantity: 75,
        rating: 4.9,
        reviewCount: 203,
        affiliateCommission: 15,
        categoryId: beautyCategory!.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=600&fit=crop",
              alt: "مجموعة العناية الطبيعية بالبشرة",
              order: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop",
              alt: "مجموعة العناية الطبيعية بالبشرة - تفاصيل",
              order: 1,
            },
          ],
        },
        tags: {
          connect: [
            { name: "طبيعي" },
            { name: "عناية بالبشرة" },
            { name: "أعشاب" },
            { name: "روتين" },
          ],
        },
      },
    }),

    // كرسي مكتب مريح
    prisma.product.create({
      data: {
        name: "كرسي مكتب مريح",
        description:
          "كرسي مكتب متميز بتصميم مريح مع دعم أسفل الظهر وارتفاع قابل للتعديل وتصميم شبكي للتهوية.",
        price: 399.99,
        originalPrice: 549.99,
        sku: "CH-ERG-001",
        inStock: true,
        stockQuantity: 20,
        rating: 4.7,
        reviewCount: 156,
        affiliateCommission: 10,
        categoryId: homeCategory!.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
              alt: "كرسي مكتب مريح",
              order: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
              alt: "كرسي مكتب مريح - منظر جانبي",
              order: 1,
            },
          ],
        },
      },
    }),
  ]);

  // إنشاء مستخدم تجريبي
  console.log("👤 إضافة مستخدم تجريبي...");
  const user = await prisma.user.create({
    data: {
      email: "test@shopco.com",
      name: "مستخدم تجريبي",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  });

  // إنشاء شريك تجريبي
  console.log("🤝 إضافة شريك تجريبي...");
  const affiliate = await prisma.affiliateUser.create({
    data: {
      userId: user.id,
      affiliateCode: "TESTPARTNER001",
      commissionRate: 15,
      totalEarnings: 1250.75,
      pendingEarnings: 340.25,
      referralCount: 45,
      status: "ACTIVE",
    },
  });

  // إضافة بعض المراجعات
  console.log("⭐ إضافة المراجعات...");
  await Promise.all([
    prisma.review.create({
      data: {
        userId: user.id,
        productId: products[0].id,
        rating: 5,
        comment:
          "سماعات رائعة! جودة الصوت ممتازة وإلغاء الضوضاء يعمل بشكل مثالي.",
      },
    }),
    prisma.review.create({
      data: {
        userId: user.id,
        productId: products[1].id,
        rating: 4,
        comment: "ساعة ذكية جيدة جداً، مراقبة اللياقة دقيقة والتصميم أنيق.",
      },
    }),
  ]);

  // تحديث عدد المنتجات في الفئات
  console.log("📊 تحديث إحصائيات الفئات...");
  await Promise.all([
    prisma.category.update({
      where: { id: electronicsCategory!.id },
      data: { productCount: 1 },
    }),
    prisma.category.update({
      where: { id: sportsCategory!.id },
      data: { productCount: 1 },
    }),
    prisma.category.update({
      where: { id: beautyCategory!.id },
      data: { productCount: 1 },
    }),
    prisma.category.update({
      where: { id: homeCategory!.id },
      data: { productCount: 1 },
    }),
  ]);

  console.log("✅ تم إضافة البيانات التجريبية بنجاح!");
  console.log(`📦 تم إنشاء ${products.length} منتجات`);
  console.log(`📂 تم إنشاء ${categories.length} فئات`);
  console.log(`👤 تم إنشاء 1 مستخدم`);
  console.log(`🤝 تم إنشاء 1 شريك`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ خطأ في إضافة البيانات:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
