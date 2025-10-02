import { Client, Databases, Storage, ID } from 'appwrite';

// Configuration - UPDATE WITH YOUR PROJECT ID
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('YOUR_PROJECT_ID_HERE'); // Update this with your actual project ID

const databases = new Databases(client);
const storage = new Storage(client);

const databaseId = 'ecommerce-db';

// Sample categories
const categories = [
  {
    name: 'إلكترونيات',
    description: 'أجهزة إلكترونية وهواتف ذكية وأكسسوارات',
    isActive: true
  },
  {
    name: 'أزياء',
    description: 'ملابس وأحذية وإكسسوارات للرجال والنساء',
    isActive: true
  },
  {
    name: 'منزل ومطبخ',
    description: 'أدوات منزلية ومطبخ وديكور',
    isActive: true
  },
  {
    name: 'رياضة وصحة',
    description: 'معدات رياضية ومكملات غذائية',
    isActive: true
  },
  {
    name: 'كتب ومكتبة',
    description: 'كتب وقرطاسية وأدوات مكتبية',
    isActive: true
  }
];

// Sample products
const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'هاتف ذكي متطور بكاميرا احترافية ومعالج قوي',
    price: 45000,
    comparePrice: 50000,
    stock: 25,
    images: [],
    tags: ['هاتف', 'آيفون', 'ذكي'],
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 150
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'هاتف سامسونج الرائد بشاشة AMOLED وكاميرا عالية الدقة',
    price: 35000,
    comparePrice: 40000,
    stock: 30,
    images: [],
    tags: ['هاتف', 'سامسونج', 'أندرويد'],
    isActive: true,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 89
  },
  {
    name: 'قميص قطني رجالي',
    description: 'قميص قطني عالي الجودة مناسب للمناسبات الرسمية',
    price: 250,
    comparePrice: 350,
    stock: 100,
    images: [],
    tags: ['قميص', 'قطن', 'رجالي'],
    isActive: true,
    isFeatured: false,
    rating: 4.2,
    reviewCount: 45
  },
  {
    name: 'حقيبة يد نسائية',
    description: 'حقيبة يد أنيقة من الجلد الطبيعي',
    price: 450,
    comparePrice: 600,
    stock: 20,
    images: [],
    tags: ['حقيبة', 'نسائي', 'جلد'],
    isActive: true,
    isFeatured: false,
    rating: 4.5,
    reviewCount: 32
  },
  {
    name: 'مقلاة غير لاصقة',
    description: 'مقلاة عالية الجودة بطلاء غير لاصق آمن',
    price: 180,
    comparePrice: 250,
    stock: 50,
    images: [],
    tags: ['مقلاة', 'مطبخ', 'طبخ'],
    isActive: true,
    isFeatured: false,
    rating: 4.3,
    reviewCount: 67
  },
  {
    name: 'كتاب تطوير الذات',
    description: 'كتاب شامل عن تطوير الذات وبناء الشخصية',
    price: 80,
    comparePrice: 120,
    stock: 200,
    images: [],
    tags: ['كتاب', 'تطوير', 'ذات'],
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 123
  }
];

async function createSampleData() {
  try {
    console.log('🚀 Starting to create sample data...');

    // Create categories first
    console.log('📁 Creating categories...');
    const createdCategories = [];
    
    for (const category of categories) {
      try {
        const created = await databases.createDocument(
          databaseId,
          'categories',
          ID.unique(),
          category
        );
        createdCategories.push(created);
        console.log(`✅ Created category: ${category.name}`);
      } catch (error) {
        console.error(`❌ Error creating category ${category.name}:`, error);
      }
    }

    // Create products and assign them to categories
    console.log('📦 Creating products...');
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const categoryIndex = i % createdCategories.length;
      const categoryId = createdCategories[categoryIndex]?.$id;

      if (categoryId) {
        try {
          const productData = {
            ...product,
            categoryId: categoryId
          };

          const created = await databases.createDocument(
            databaseId,
            'products',
            ID.unique(),
            productData
          );
          console.log(`✅ Created product: ${product.name}`);
        } catch (error) {
          console.error(`❌ Error creating product ${product.name}:`, error);
        }
      }
    }

    console.log('🎉 Sample data creation completed!');
    console.log(`📊 Created ${createdCategories.length} categories and ${products.length} products`);

  } catch (error) {
    console.error('💥 Error creating sample data:', error);
  }
}

// Run the script
if (typeof window === 'undefined') {
  // Running in Node.js environment
  createSampleData();
} else {
  // Running in browser environment
  console.log('🌐 Sample data script loaded. Call createSampleData() to execute.');
  (window as any).createSampleData = createSampleData;
}

export { createSampleData };