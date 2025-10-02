// Script to add sample data to Appwrite Database
// Run this after setting up OAuth and admin account

import { Client, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68d8b9db00134c41e7c8')
  .setKey('YOUR_API_KEY_HERE'); // Replace with your API key

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';

const categories = [
  {
    name: 'إلكترونيات',
    description: 'أجهزة إلكترونية وتقنية حديثة',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    isActive: true
  },
  {
    name: 'ملابس',
    description: 'أزياء وملابس رجالية ونسائية',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    isActive: true
  },
  {
    name: 'منزل وديكور',
    description: 'أثاث ومستلزمات منزلية',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a',
    isActive: true
  },
  {
    name: 'رياضة',
    description: 'معدات وملابس رياضية',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    isActive: true
  },
  {
    name: 'كتب',
    description: 'كتب متنوعة بجميع المجالات',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
    isActive: true
  }
];

async function addCategories() {
  console.log('🏷️  Adding categories...');
  const categoryIds = {};

  for (const category of categories) {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        'categories',
        ID.unique(),
        category
      );
      categoryIds[category.name] = doc.$id;
      console.log(`✅ Added category: ${category.name} (${doc.$id})`);
    } catch (error) {
      console.error(`❌ Failed to add category ${category.name}:`, error);
    }
  }

  return categoryIds;
}

async function addProducts(categoryIds) {
  console.log('\n🛍️  Adding products...');

  const products = [
    // Electronics
    {
      name: 'لابتوب Dell XPS 13',
      description: 'لابتوب قوي للمحترفين بشاشة 13 بوصة FHD، معالج Intel Core i7 الجيل 11، ذاكرة 16GB RAM، تخزين 512GB SSD، بطاقة رسوميات Intel Iris Xe، نظام Windows 11',
      price: 25000,
      comparePrice: 30000,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45'],
      categoryId: categoryIds['إلكترونيات'],
      tags: ['لابتوب', 'dell', 'كمبيوتر', 'محمول'],
      isActive: true,
      isFeatured: true,
      rating: 4.5,
      reviewCount: 12
    },
    {
      name: 'سماعات AirPods Pro 2',
      description: 'سماعات لاسلكية مع إلغاء ضوضاء نشط وجودة صوت استثنائية، مقاومة للماء والعرق، علبة شحن لاسلكية، عمر بطارية يصل 30 ساعة',
      price: 1200,
      comparePrice: 1500,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7'],
      categoryId: categoryIds['إلكترونيات'],
      tags: ['سماعات', 'apple', 'لاسلكي', 'airpods'],
      isActive: true,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 45
    },
    {
      name: 'ساعة ذكية Samsung Galaxy Watch 6',
      description: 'ساعة ذكية بشاشة AMOLED، مراقبة صحية متقدمة، تتبع النوم والرياضة، مقاومة للماء 5ATM، عمر بطارية 40 ساعة',
      price: 1800,
      comparePrice: 2200,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a'],
      categoryId: categoryIds['إلكترونيات'],
      tags: ['ساعة', 'ذكية', 'samsung', 'رياضة'],
      isActive: true,
      isFeatured: false,
      rating: 4.6,
      reviewCount: 28
    },
    {
      name: 'كاميرا Canon EOS R6',
      description: 'كاميرا احترافية بدون مرآة، مستشعر 20 ميجابكسل، تصوير فيديو 4K، ثبات صورة 8 درجات، شاشة لمس قابلة للطي',
      price: 45000,
      comparePrice: 50000,
      stock: 8,
      images: ['https://images.unsplash.com/photo-1606941711258-91e0b7e57cc4'],
      categoryId: categoryIds['إلكترونيات'],
      tags: ['كاميرا', 'canon', 'تصوير', 'احترافي'],
      isActive: true,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 18
    },

    // Clothes
    {
      name: 'تيشيرت قطن بيور رجالي',
      description: 'تيشيرت قطن 100% بألوان متعددة، مقاسات M/L/XL/XXL، تصميم عصري مريح، مثالي للاستخدام اليومي',
      price: 150,
      comparePrice: 200,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'],
      categoryId: categoryIds['ملابس'],
      tags: ['تيشيرت', 'ملابس', 'رجالي', 'قطن'],
      isActive: true,
      isFeatured: false,
      rating: 4.2,
      reviewCount: 28
    },
    {
      name: 'فستان صيفي نسائي',
      description: 'فستان صيفي أنيق بتصميم عصري، قماش خفيف مريح، ألوان زاهية، مقاسات S/M/L/XL',
      price: 450,
      comparePrice: 600,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1'],
      categoryId: categoryIds['ملابس'],
      tags: ['فستان', 'نسائي', 'صيفي', 'موضة'],
      isActive: true,
      isFeatured: true,
      rating: 4.7,
      reviewCount: 52
    },
    {
      name: 'جاكيت جينز رجالي',
      description: 'جاكيت جينز كلاسيكي بجودة عالية، تصميم عصري، مقاسات M/L/XL/XXL، مثالي لفصل الخريف والشتاء',
      price: 650,
      comparePrice: 850,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a'],
      categoryId: categoryIds['ملابس'],
      tags: ['جاكيت', 'جينز', 'رجالي', 'شتوي'],
      isActive: true,
      isFeatured: false,
      rating: 4.4,
      reviewCount: 19
    },

    // Home & Decor
    {
      name: 'كرسي مكتب Ergonomic',
      description: 'كرسي مكتب مريح مع دعم قطني للظهر، ارتفاع قابل للتعديل، مساند ذراع قابلة للتحريك، قاعدة معدنية قوية مع عجلات',
      price: 1800,
      comparePrice: 2500,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267'],
      categoryId: categoryIds['منزل وديكور'],
      tags: ['كرسي', 'مكتب', 'أثاث', 'مريح'],
      isActive: true,
      isFeatured: true,
      rating: 4.6,
      reviewCount: 15
    },
    {
      name: 'طقم أواني طهي 12 قطعة',
      description: 'طقم أواني طهي غير لاصقة، مقاومة للحرارة العالية، سهلة التنظيف، تشمل جميع الأحجام الأساسية',
      price: 950,
      comparePrice: 1200,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1588854337236-6889d631faa8'],
      categoryId: categoryIds['منزل وديكور'],
      tags: ['أواني', 'طهي', 'مطبخ', 'طقم'],
      isActive: true,
      isFeatured: false,
      rating: 4.3,
      reviewCount: 34
    },
    {
      name: 'لوحة فنية Canvas مقاس كبير',
      description: 'لوحة فنية عصرية على قماش Canvas، طباعة عالية الجودة، ألوان ثابتة، تأتي مع إطار خشبي جاهز للتعليق',
      price: 350,
      comparePrice: 500,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38'],
      categoryId: categoryIds['منزل وديكور'],
      tags: ['لوحة', 'فنية', 'ديكور', 'canvas'],
      isActive: true,
      isFeatured: false,
      rating: 4.5,
      reviewCount: 22
    },

    // Sports
    {
      name: 'حذاء رياضي Nike Air Max',
      description: 'حذاء رياضي خفيف ومريح للجري والتدريب، وسادة هوائية في النعل، تصميم عصري، مقاسات 40-45',
      price: 800,
      comparePrice: 1000,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'],
      categoryId: categoryIds['رياضة'],
      tags: ['حذاء', 'رياضي', 'nike', 'جري'],
      isActive: true,
      isFeatured: true,
      rating: 4.7,
      reviewCount: 67
    },
    {
      name: 'دمبل قابل للتعديل 20 كجم',
      description: 'دمبل رياضي قابل للتعديل من 2 كجم حتى 20 كجم، مثالي للتمارين المنزلية، مقبض مريح مغلف بالمطاط',
      price: 550,
      comparePrice: 750,
      stock: 18,
      images: ['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c'],
      categoryId: categoryIds['رياضة'],
      tags: ['دمبل', 'أوزان', 'رياضة', 'منزلي'],
      isActive: true,
      isFeatured: false,
      rating: 4.4,
      reviewCount: 41
    },
    {
      name: 'بساط يوغا احترافي',
      description: 'بساط يوغا سميك 6 ملم، مادة صديقة للبيئة، سطح غير قابل للانزلاق، يأتي مع حقيبة حمل',
      price: 250,
      comparePrice: 350,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f'],
      categoryId: categoryIds['رياضة'],
      tags: ['يوغا', 'بساط', 'رياضة', 'لياقة'],
      isActive: true,
      isFeatured: false,
      rating: 4.6,
      reviewCount: 38
    },

    // Books
    {
      name: 'كتاب فن الحرب - صن تزو',
      description: 'كتاب استراتيجي كلاسيكي عن التكتيكات العسكرية والتخطيط، ترجمة احترافية، غلاف فاخر',
      price: 120,
      comparePrice: 150,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73'],
      categoryId: categoryIds['كتب'],
      tags: ['كتاب', 'استراتيجية', 'تنمية', 'ذاتية'],
      isActive: true,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 95
    },
    {
      name: 'العادات الذرية - جيمس كلير',
      description: 'كتاب تطوير الذات الأكثر مبيعاً عالمياً، يشرح كيفية بناء عادات إيجابية والتخلص من السلبية',
      price: 180,
      comparePrice: 220,
      stock: 65,
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f'],
      categoryId: categoryIds['كتب'],
      tags: ['كتاب', 'تطوير', 'ذات', 'عادات'],
      isActive: true,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 127
    }
  ];

  for (const product of products) {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        'products',
        ID.unique(),
        product
      );
      console.log(`✅ Added product: ${product.name}`);
    } catch (error) {
      console.error(`❌ Failed to add product ${product.name}:`, error);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting sample data import...\n');
    
    const categoryIds = await addCategories();
    await addProducts(categoryIds);
    
    console.log('\n✅ Sample data import completed!');
    console.log('\n📊 Summary:');
    console.log(`   - ${categories.length} categories added`);
    console.log(`   - 15 products added`);
    console.log('\n🌐 Visit your site: https://egygo-ecommerce.appwrite.network/');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();
