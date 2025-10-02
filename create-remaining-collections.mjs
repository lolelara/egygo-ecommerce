// سكريبت إنشاء باقي Collections في Appwrite
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

async function createStringAttribute(collectionId, key, size, required, defaultValue = null, isArray = false) {
  try {
    const body = { key, size, required, array: isArray };
    if (defaultValue !== null) body.default = defaultValue;
    
    const response = await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/attributes/string`, {
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
  console.log('🚀 بدء إنشاء باقي Collections...\n');
  
  // 4️⃣ Collection: orders
  if (await createCollection('orders', 'Orders', true)) {
    console.log('   📝 إضافة Attributes...');
    await createStringAttribute('orders', 'userId', 36, true);
    await createFloatAttribute('orders', 'total', true);
    await createStringAttribute('orders', 'status', 20, true, 'pending');
    await createStringAttribute('orders', 'customerName', 255, true);
    await createStringAttribute('orders', 'customerEmail', 255, true);
    await createStringAttribute('orders', 'customerPhone', 20, true);
    await createStringAttribute('orders', 'shippingAddress', 1000, true);
    await createStringAttribute('orders', 'paymentMethod', 50, true);
    await createStringAttribute('orders', 'affiliateCode', 10, false);
    await createFloatAttribute('orders', 'affiliateCommission', false, 0);
    
    console.log('   🔍 إضافة Indexes (انتظر 2 ثانية)...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await createIndex('orders', 'user_orders_index', 'key', ['userId']);
    await createIndex('orders', 'status_index', 'key', ['status']);
  }
  
  // 5️⃣ Collection: order_items
  if (await createCollection('order_items', 'Order Items', true)) {
    console.log('   📝 إضافة Attributes...');
    await createStringAttribute('order_items', 'orderId', 36, true);
    await createStringAttribute('order_items', 'productId', 36, true);
    await createStringAttribute('order_items', 'productName', 255, true);
    await createStringAttribute('order_items', 'productImage', 255, false);
    await createFloatAttribute('order_items', 'price', true);
    await createIntegerAttribute('order_items', 'quantity', true);
    await createFloatAttribute('order_items', 'total', true);
    
    console.log('   🔍 إضافة Indexes (انتظر 2 ثانية)...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await createIndex('order_items', 'order_items_index', 'key', ['orderId']);
    await createIndex('order_items', 'product_sales_index', 'key', ['productId']);
  }
  
  // 6️⃣ Collection: reviews
  if (await createCollection('reviews', 'Reviews', true)) {
    console.log('   📝 إضافة Attributes...');
    await createStringAttribute('reviews', 'productId', 36, true);
    await createStringAttribute('reviews', 'userId', 36, true);
    await createStringAttribute('reviews', 'userName', 255, true);
    await createIntegerAttribute('reviews', 'rating', true);
    await createStringAttribute('reviews', 'comment', 1000, false);
    await createBooleanAttribute('reviews', 'isApproved', false, false);
    
    console.log('   🔍 إضافة Indexes (انتظر 2 ثانية)...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await createIndex('reviews', 'product_reviews_index', 'key', ['productId']);
    await createIndex('reviews', 'user_reviews_index', 'key', ['userId']);
  }
  
  // 7️⃣ Collection: affiliates
  if (await createCollection('affiliates', 'Affiliates', true)) {
    console.log('   📝 إضافة Attributes...');
    await createStringAttribute('affiliates', 'userId', 36, true);
    await createStringAttribute('affiliates', 'code', 10, true);
    await createFloatAttribute('affiliates', 'commissionRate', false, 0.15);
    await createFloatAttribute('affiliates', 'totalEarnings', false, 0);
    await createIntegerAttribute('affiliates', 'totalSales', false, 0);
    await createBooleanAttribute('affiliates', 'isActive', false, true);
    
    console.log('   🔍 إضافة Indexes (انتظر 2 ثانية)...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await createIndex('affiliates', 'affiliate_code_index', 'unique', ['code']);
    await createIndex('affiliates', 'user_affiliate_index', 'unique', ['userId']);
  }
  
  console.log('\n\n🎉 تم إنشاء جميع Collections بنجاح!');
  console.log('\n📋 الخطوات المتبقية:');
  console.log('1. أنشئ Storage Bucket اسمه "product-images"');
  console.log('2. شغّل الموقع: npm run dev');
  console.log('3. اختبر التسجيل وتسجيل الدخول\n');
}

main().catch(console.error);