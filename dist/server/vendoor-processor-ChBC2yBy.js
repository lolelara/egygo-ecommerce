import { Databases, Query, ID, Client, Storage } from "node-appwrite";
import axios from "axios";
const client = new Client().setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1").setProject(process.env.APPWRITE_PROJECT_ID || "").setKey(process.env.APPWRITE_API_KEY || "");
const databases = new Databases(client);
const storage = new Storage(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "";
const PRODUCTS_COLLECTION_ID = "products";
const CATEGORIES_COLLECTION_ID = "categories";
const STORAGE_BUCKET_ID = process.env.APPWRITE_STORAGE_BUCKET_ID || "product-images";
function parsePrice(priceText) {
  if (!priceText) return 0;
  const cleaned = priceText.replace(/[^\d.]/g, "");
  const price = parseFloat(cleaned);
  return isNaN(price) ? 0 : price;
}
function parseStock(stockText) {
  if (!stockText) return 0;
  const match = stockText.match(/(\d+)/);
  if (match) {
    const stock = parseInt(match[1]);
    return isNaN(stock) ? 0 : stock;
  }
  return 0;
}
async function uploadImageToAppwrite(imageUrl, productId) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 3e4,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    const contentType = response.headers["content-type"] || "image/jpeg";
    const extension = contentType.split("/")[1] || "jpg";
    const fileName = `vendoor-${productId}-${Date.now()}.${extension}`;
    const buffer = Buffer.from(response.data);
    const file = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      buffer
      // Appwrite SDK accepts Buffer in Node.js
    );
    const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return imageUrl;
  }
}
async function findOrCreateCategory(categoryName) {
  try {
    const existingCategories = await databases.listDocuments(
      DATABASE_ID,
      CATEGORIES_COLLECTION_ID,
      [
        Query.equal("name", categoryName),
        Query.limit(1)
      ]
    );
    if (existingCategories.documents.length > 0) {
      console.log(`✅ Found existing category: ${categoryName}`);
      return existingCategories.documents[0].$id;
    }
    console.log(`📁 Creating new category: ${categoryName}`);
    const newCategory = await databases.createDocument(
      DATABASE_ID,
      CATEGORIES_COLLECTION_ID,
      ID.unique(),
      {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, ""),
        description: `منتجات ${categoryName} من Vendoor`,
        isActive: true,
        productCount: 0,
        image: "",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
    return newCategory.$id;
  } catch (error) {
    console.error("Error finding/creating category:", error);
    try {
      const defaultCategory = await databases.createDocument(
        DATABASE_ID,
        CATEGORIES_COLLECTION_ID,
        ID.unique(),
        {
          name: "منتجات Vendoor",
          slug: "vendoor-products",
          description: "منتجات مستوردة من Vendoor",
          isActive: true,
          productCount: 0,
          image: "",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      );
      return defaultCategory.$id;
    } catch (err) {
      throw new Error("فشل في إنشاء التصنيف");
    }
  }
}
async function processVendoorProduct(vendoorProduct, userId, userName, markupPercentage = 20) {
  const vendoorPrice = parsePrice(vendoorProduct.price);
  const vendoorCommission = parsePrice(vendoorProduct.commission);
  const stock = parseStock(vendoorProduct.stock);
  const markup = vendoorPrice * (markupPercentage / 100);
  const finalPrice = Math.round((vendoorPrice + markup) * 100) / 100;
  let uploadedImage = vendoorProduct.image;
  if (vendoorProduct.image && vendoorProduct.image.startsWith("http")) {
    try {
      uploadedImage = await uploadImageToAppwrite(vendoorProduct.image, vendoorProduct.id);
      console.log(`✅ Image uploaded for product ${vendoorProduct.id}`);
    } catch (error) {
      console.log(`⚠️ Failed to upload image, using original URL`);
    }
  }
  const categoryName = vendoorProduct.supplier || "منتجات Vendoor";
  const categoryId = await findOrCreateCategory(categoryName);
  return {
    name: vendoorProduct.title,
    description: `${vendoorProduct.title}

المورد: ${vendoorProduct.supplier}
المخزون: ${vendoorProduct.stock}`,
    price: finalPrice,
    originalPrice: vendoorPrice,
    vendoorPrice,
    vendoorCommission,
    stock,
    images: [uploadedImage],
    categoryId,
    categoryName,
    supplier: vendoorProduct.supplier,
    vendoorId: vendoorProduct.id,
    isActive: stock > 0,
    source: "vendoor"
  };
}
async function saveProductToAppwrite(processedProduct, userId, userName) {
  try {
    const existingProducts = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal("vendoorId", processedProduct.vendoorId),
        Query.limit(1)
      ]
    );
    if (existingProducts.documents.length > 0) {
      console.log(`⚠️ Product ${processedProduct.vendoorId} already exists, updating...`);
      const updated = await databases.updateDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        existingProducts.documents[0].$id,
        {
          name: processedProduct.name,
          price: processedProduct.price,
          stock: processedProduct.stock,
          isActive: processedProduct.isActive,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      );
      return { ...updated, isNew: false };
    }
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
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    );
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
      console.error("Error updating category count:", error);
    }
    return { ...newProduct, isNew: true };
  } catch (error) {
    console.error("Error saving product to Appwrite:", error);
    throw error;
  }
}
async function importVendoorProduct(vendoorProduct, userId, userName, markupPercentage = 20) {
  console.log(`📦 Processing Vendoor product: ${vendoorProduct.id} - ${vendoorProduct.title}`);
  const processedProduct = await processVendoorProduct(
    vendoorProduct,
    userId,
    userName,
    markupPercentage
  );
  const savedProduct = await saveProductToAppwrite(
    processedProduct,
    userId,
    userName
  );
  console.log(`✅ Product ${vendoorProduct.id} ${savedProduct.isNew ? "created" : "updated"} successfully`);
  return savedProduct;
}
async function updateVendoorProducts(vendoorProducts) {
  let updated = 0;
  let failed = 0;
  for (const vendoorProduct of vendoorProducts) {
    try {
      const existingProducts = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [
          Query.equal("vendoorId", vendoorProduct.id),
          Query.limit(1)
        ]
      );
      if (existingProducts.documents.length > 0) {
        const product = existingProducts.documents[0];
        await databases.updateDocument(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          product.$id,
          {
            vendoorPrice: parsePrice(vendoorProduct.price),
            vendoorCommission: parsePrice(vendoorProduct.commission),
            stock: parseStock(vendoorProduct.stock),
            isActive: parseStock(vendoorProduct.stock) > 0,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
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
export {
  findOrCreateCategory,
  importVendoorProduct,
  parsePrice,
  parseStock,
  processVendoorProduct,
  saveProductToAppwrite,
  updateVendoorProducts,
  uploadImageToAppwrite
};
//# sourceMappingURL=vendoor-processor-ChBC2yBy.js.map
