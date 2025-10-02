// سكريبت إنشاء Collections في Appwrite
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const DATABASE_ID = '68de037e003bd03c4d45';
const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';

async function createCollection(id, name, documentSecurity) {
  console.log(`\n📁 إنشاء Collection: ${name}`);
  
  try {
    const response = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY
      },
      body: JSON.stringify({
        collectionId: id,
        name: name,
        documentSecurity: documentSecurity,
        permissions: []
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ تم إنشاء Collection: ${name}`);
      return true;
    } else if (response.status === 409) {
      console.log(`ℹ️  Collection ${name} موجود بالفعل`);
      return true;
    } else {
      const error = await response.json();
      console.error(`❌ خطأ: ${error.message}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ خطأ: ${error.message}`);
    return false;
  }
}

async function createStringAttribute(collectionId, key, size, required, isArray = false) {
  try {
    const response = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/attributes/string`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY
      },
      body: JSON.stringify({
        key,
        size,
        required,
        array: isArray
      })
    });
    
    if (response.ok || response.status === 409) {
      console.log(`   ✅ ${key}`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  } catch (error) {
    console.error(`   ❌ ${key}: ${error.message}`);
  }
}

async function createBooleanAttribute(collectionId, key, required, defaultValue) {
  try {
    const response = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/attributes/boolean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY
      },
      body: JSON.stringify({
        key,
        required,
        default: defaultValue
      })
    });
    
    if (response.ok || response.status === 409) {
      console.log(`   ✅ ${key}`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  } catch (error) {
    console.error(`   ❌ ${key}: ${error.message}`);
  }
}

async function createFloatAttribute(collectionId, key, required, defaultValue = null) {
  try {
    const body = { key, required };
    if (defaultValue !== null) body.default = defaultValue;
    
    const response = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/attributes/float`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY
      },
      body: JSON.stringify(body)
    });
    
    if (response.ok || response.status === 409) {
      console.log(`   ✅ ${key}`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  } catch (error) {
    console.error(`   ❌ ${key}: ${error.message}`);
  }
}

async function createIntegerAttribute(collectionId, key, required, defaultValue = null) {
  try {
    const body = { key, required };
    if (defaultValue !== null) body.default = defaultValue;
    
    const response = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/attributes/integer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY
      },
      body: JSON.stringify(body)
    });
    
    if (response.ok || response.status === 409) {
      console.log(`   ✅ ${key}`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  } catch (error) {
    console.error(`   ❌ ${key}: ${error.message}`);
  }
}

async function createIndex(collectionId, key, type, attributes) {
  try {
    const response = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/indexes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY
      },
      body: JSON.stringify({
        key,
        type,
        attributes
      })
    });
    
    if (response.ok || response.status === 409) {
      console.log(`   🔍 ${key}`);
    }
  } catch (error) {
    console.error(`   ❌ ${key}: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 بدء إنشاء Collections...\n');
  console.log(`📡 Endpoint: ${ENDPOINT}`);
  console.log(`🆔 Project ID: ${PROJECT_ID}`);
  console.log(`💾 Database ID: ${DATABASE_ID}\n`);
  
  // 1️⃣ Collection: users
  if (await createCollection('users', 'Users', true)) {
    console.log('   📝 إضافة Attributes...');
    await createStringAttribute('users', 'name', 255, true);
    await createStringAttribute('users', 'email', 255, true);
    await createStringAttribute('users', 'phone', 20, false);
    await createStringAttribute('users', 'address', 500, false);
    await createBooleanAttribute('users', 'isAffiliate', false, false);
    await createStringAttribute('users', 'affiliateCode', 10, false);
    await createFloatAttribute('users', 'commissionRate', false, 0.15);
    
    console.log('   🔍 إضافة Indexes (انتظر 2 ثانية)...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await createIndex('users', 'email_index', 'key', ['email']);
  }
  
  // 2️⃣ Collection: categories
  if (await createCollection('categories', 'Categories', false)) {
    console.log('   📝 إضافة Attributes...');
    await createStringAttribute('categories', 'name', 255, true);
    await createStringAttribute('categories', 'description', 1000, false);
    await createStringAttribute('categories', 'image', 255, false);
    await createBooleanAttribute('categories', 'isActive', false, true);
  }
  
  // 3️⃣ Collection: products
  if (await createCollection('products', 'Products', false)) {
    console.log('   📝 إضافة Attributes...');
    await createStringAttribute('products', 'name', 255, true);
    await createStringAttribute('products', 'description', 2000, true);
    await createFloatAttribute('products', 'price', true);
    await createFloatAttribute('products', 'comparePrice', false);
    await createIntegerAttribute('products', 'stock', true, 0);
    await createStringAttribute('products', 'images', 2000, false, true);
    await createStringAttribute('products', 'categoryId', 36, true);
    await createStringAttribute('products', 'tags', 50, false, true);
    await createBooleanAttribute('products', 'isActive', false, true);
    await createBooleanAttribute('products', 'isFeatured', false, false);
    await createFloatAttribute('products', 'rating', false, 0);
    await createIntegerAttribute('products', 'reviewCount', false, 0);
    
    console.log('   🔍 إضافة Indexes (انتظر 2 ثانية)...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await createIndex('products', 'category_index', 'key', ['categoryId']);
    await createIndex('products', 'price_index', 'key', ['price']);
    await createIndex('products', 'featured_index', 'key', ['isFeatured']);
  }
  
  console.log('\n\n🎉 تم إنشاء أول 3 Collections بنجاح!');
  console.log('\n📋 الخطوات المتبقية:');
  console.log('1. راجع COLLECTIONS_MANUAL_GUIDE.md لإكمال باقي Collections');
  console.log('2. أنشئ Storage Bucket اسمه "product-images"');
  console.log('3. شغّل الموقع: npm run dev\n');
}

main().catch(console.error);