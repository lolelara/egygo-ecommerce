import { Client, Databases, Storage, ID, Query } from 'node-appwrite';
import axios from 'axios';

// Appwrite Configuration
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || '';
const PRODUCTS_COLLECTION_ID = 'products';
const CATEGORIES_COLLECTION_ID = 'categories';
const STORAGE_BUCKET_ID = process.env.APPWRITE_STORAGE_BUCKET_ID || 'product-images';

interface VendoorProduct {
  id: string;
  title: string;
  supplier: string;
  price: string;
  commission: string;
  stock: string;
  image: string;
}

interface ProcessedProduct {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  vendoorPrice: number;
  vendoorCommission: number;
  stock: number;
  images: string[];
  categoryId: string;
  categoryName: string;
  supplier: string;
  vendoorId: string;
  isActive: boolean;
  source: string;
}

/**
 * معالجة السعر من نص إلى رقم
 */
export function parsePrice(priceText: string): number {
  if (!priceText) return 0;
  // إزالة كل شيء ما عدا الأرقام والنقطة العشرية
  const cleaned = priceText.replace(/[^\d.]/g, '');
  const price = parseFloat(cleaned);
  return isNaN(price) ? 0 : price;
}

/**
 * معالجة المخزون من نص إلى رقم
 */
export function parseStock(stockText: string): number {
  if (!stockText) return 0;
  // استخراج الرقم الأول من النص
  const match = stockText.match(/(\d+)/);
  if (match) {
    const stock = parseInt(match[1]);
    return isNaN(stock) ? 0 : stock;
  }
  return 0;
}

/**
 * رفع صورة إلى Appwrite Storage
 */
export async function uploadImageToAppwrite(imageUrl: string, productId: string): Promise<string> {
  try {
    // تحميل الصورة من URL
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // تحديد نوع الملف
    const contentType = response.headers['content-type'] || 'image/jpeg';
    const extension = contentType.split('/')[1] || 'jpg';
    const fileName = `vendoor-${productId}-${Date.now()}.${extension}`;

    // رفع إلى Appwrite Storage
    const buffer = Buffer.from(response.data);
    const file = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      buffer as any // Appwrite SDK accepts Buffer in Node.js
    );

    // إرجاع URL الصورة
    const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
    
    return fileUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    // في حالة الفشل، نرجع الرابط الأصلي
    return imageUrl;
  }
}

/**
 * البحث عن تصنيف أو إنشاؤه
 */
export async function findOrCreateCategory(categoryName: string): Promise<string> {
  try {
    // البحث عن التصنيف الموجود
    const existingCategories = await databases.listDocuments(
      DATABASE_ID,
      CATEGORIES_COLLECTION_ID,
      [
        Query.equal('name', categoryName),
        Query.limit(1)
      ]
    );

    if (existingCategories.documents.length > 0) {
      console.log(`✅ Found existing category: ${categoryName}`);
      return existingCategories.documents[0].$id;
    }

    // إنشاء تصنيف جديد
    console.log(`📁 Creating new category: ${categoryName}`);
    const newCategory = await databases.createDocument(
      DATABASE_ID,
      CATEGORIES_COLLECTION_ID,
      ID.unique(),
      {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
        description: `منتجات ${categoryName} من Vendoor`,
        isActive: true,
        productCount: 0,
        image: '',
        createdAt: new Date().toISOString()
      }
    );

    return newCategory.$id;
  } catch (error) {
    console.error('Error finding/creating category:', error);
    
    // في حالة الفشل، نحاول إنشاء تصنيف افتراضي
    try {
      const defaultCategory = await databases.createDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        ID.unique(),
        {
          name: 'منتجات Vendoor',
          slug: 'vendoor-products',
          description: 'منتجات مستوردة من Vendoor',
          isActive: true,
          productCount: 0,
          image: '',
          createdAt: new Date().toISOString()
        }
      );
      return defaultCategory.$id;
    } catch (err) {
      throw new Error('فشل في إنشاء التصنيف');
    }
  }
}

/**
 * معالجة منتج Vendoor وتحويله إلى صيغة قابلة للحفظ
 */
export async function processVendoorProduct(
  vendoorProduct: VendoorProduct,
  userId: string,
  userName: string,
  markupPercentage: number = 20
): Promise<ProcessedProduct> {
  // معالجة الأسعار
  const vendoorPrice = parsePrice(vendoorProduct.price);
  const vendoorCommission = parsePrice(vendoorProduct.commission);
  const stock = parseStock(vendoorProduct.stock);

  // حساب السعر النهائي (السعر الأصلي + الهامش)
  const markup = vendoorPrice * (markupPercentage / 100);
  const finalPrice = Math.round((vendoorPrice + markup) * 100) / 100;

  // رفع الصورة إلى Appwrite
  let uploadedImage = vendoorProduct.image;
  if (vendoorProduct.image && vendoorProduct.image.startsWith('http')) {
    try {
      uploadedImage = await uploadImageToAppwrite(vendoorProduct.image, vendoorProduct.id);
      console.log(`✅ Image uploaded for product ${vendoorProduct.id}`);
    } catch (error) {
      console.log(`⚠️ Failed to upload image, using original URL`);
    }
  }

  // تحديد اسم التصنيف من اسم المورد أو استخدام افتراضي
  const categoryName = vendoorProduct.supplier || 'منتجات Vendoor';
  const categoryId = await findOrCreateCategory(categoryName);

  return {
    name: vendoorProduct.title,
    description: `${vendoorProduct.title}\n\nالمورد: ${vendoorProduct.supplier}\nالمخزون: ${vendoorProduct.stock}`,
    price: finalPrice,
    originalPrice: vendoorPrice,
    vendoorPrice: vendoorPrice,
    vendoorCommission: vendoorCommission,
    stock: stock,
    images: [uploadedImage],
    categoryId: categoryId,
    categoryName: categoryName,
    supplier: vendoorProduct.supplier,
    vendoorId: vendoorProduct.id,
    isActive: stock > 0,
    source: 'vendoor'
  };
}

/**
 * حفظ منتج في Appwrite
 */
export async function saveProductToAppwrite(
  processedProduct: ProcessedProduct,
  userId: string,
  userName: string
): Promise<any> {
  try {
    // التحقق من عدم وجود المنتج مسبقاً
    const existingProducts = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal('vendoorId', processedProduct.vendoorId),
        Query.limit(1)
      ]
    );

    if (existingProducts.documents.length > 0) {
      console.log(`⚠️ Product ${processedProduct.vendoorId} already exists, updating...`);
      
      // تحديث المنتج الموجود
      const updated = await databases.updateDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        existingProducts.documents[0].$id,
        {
          name: processedProduct.name,
          price: processedProduct.price,
          stock: processedProduct.stock,
          isActive: processedProduct.isActive,
          updatedAt: new Date().toISOString()
        }
      );
      
      return { ...updated, isNew: false };
    }

    // إنشاء منتج جديد
    const newProduct = await databases.createDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      ID.unique(),
      {
        name: processedProduct.name,
        description: processedProduct.description,
        price: processedProduct.price,
        originalPrice: processedProduct.originalPrice,
        vendoorPrice: processedProduct.vendoorPrice,
        vendoorCommission: processedProduct.vendoorCommission,
        stock: processedProduct.stock,
        images: processedProduct.images,
        categoryId: processedProduct.categoryId,
        merchantId: userId,
        merchantName: userName,
        vendoorId: processedProduct.vendoorId,
        supplier: processedProduct.supplier,
        source: processedProduct.source,
        isActive: processedProduct.isActive,
        isFeatured: false,
        rating: 0,
        reviewCount: 0,
        soldCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    // تحديث عدد المنتجات في التصنيف
    try {
      const category = await databases.getDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        processedProduct.categoryId
      );
      
      await databases.updateDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        processedProduct.categoryId,
        {
          productCount: (category.productCount || 0) + 1
        }
      );
    } catch (error) {
      console.error('Error updating category count:', error);
    }

    return { ...newProduct, isNew: true };
  } catch (error) {
    console.error('Error saving product to Appwrite:', error);
    throw error;
  }
}

/**
 * معالجة وحفظ منتج Vendoor بالكامل
 */
export async function importVendoorProduct(
  vendoorProduct: VendoorProduct,
  userId: string,
  userName: string,
  markupPercentage: number = 20
): Promise<any> {
  console.log(`📦 Processing Vendoor product: ${vendoorProduct.id} - ${vendoorProduct.title}`);
  
  // معالجة المنتج
  const processedProduct = await processVendoorProduct(
    vendoorProduct,
    userId,
    userName,
    markupPercentage
  );
  
  // حفظ في Appwrite
  const savedProduct = await saveProductToAppwrite(
    processedProduct,
    userId,
    userName
  );
  
  console.log(`✅ Product ${vendoorProduct.id} ${savedProduct.isNew ? 'created' : 'updated'} successfully`);
  
  return savedProduct;
}

/**
 * تحديث منتجات Vendoor الموجودة
 */
export async function updateVendoorProducts(
  vendoorProducts: VendoorProduct[]
): Promise<{ updated: number; failed: number }> {
  let updated = 0;
  let failed = 0;

  for (const vendoorProduct of vendoorProducts) {
    try {
      // البحث عن المنتج في قاعدة البيانات
      const existingProducts = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [
          Query.equal('vendoorId', vendoorProduct.id),
          Query.limit(1)
        ]
      );

      if (existingProducts.documents.length > 0) {
        const product = existingProducts.documents[0];
        
        // تحديث السعر والمخزون
        await databases.updateDocument(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          product.$id,
          {
            vendoorPrice: parsePrice(vendoorProduct.price),
            vendoorCommission: parsePrice(vendoorProduct.commission),
            stock: parseStock(vendoorProduct.stock),
            isActive: parseStock(vendoorProduct.stock) > 0,
            updatedAt: new Date().toISOString()
          }
        );

        updated++;
        console.log(`✅ Updated product ${vendoorProduct.id}`);
      }
    } catch (error) {
      console.error(`❌ Failed to update product ${vendoorProduct.id}:`, error);
      failed++;
    }
  }

  return { updated, failed };
}
