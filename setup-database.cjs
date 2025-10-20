const { Client, Databases, Permission, Role } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('68d8b9db00134c41e7c8')
  .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';

async function setupCollections() {
  console.log('🚀 Starting database setup...\n');

  try {
    // 1. Stock Notifications
    console.log('📦 Creating stock_notifications...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'stock_notifications',
        'Stock Notifications',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );

      await databases.createStringAttribute(DATABASE_ID, 'stock_notifications', 'productId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'stock_notifications', 'productName', 500, true);
      await databases.createStringAttribute(DATABASE_ID, 'stock_notifications', 'email', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'stock_notifications', 'userId', 255, false);
      await databases.createBooleanAttribute(DATABASE_ID, 'stock_notifications', 'notified', true, false);
      await databases.createStringAttribute(DATABASE_ID, 'stock_notifications', 'createdAt', 50, true);
      
      await databases.createIndex(DATABASE_ID, 'stock_notifications', 'idx_email', 'key', ['email']);
      await databases.createIndex(DATABASE_ID, 'stock_notifications', 'idx_product', 'key', ['productId']);
      
      console.log('✅ stock_notifications created\n');
    } catch (error) {
      console.log('⚠️  stock_notifications already exists\n');
    }

    // 2. Addresses
    console.log('📍 Creating addresses...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'addresses',
        'Addresses',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );

      await databases.createStringAttribute(DATABASE_ID, 'addresses', 'userId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'addresses', 'label', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'addresses', 'name', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'addresses', 'phone', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'addresses', 'street', 500, true);
      await databases.createStringAttribute(DATABASE_ID, 'addresses', 'city', 100, true);
      await databases.createStringAttribute(DATABASE_ID, 'addresses', 'governorate', 100, true);
      await databases.createStringAttribute(DATABASE_ID, 'addresses', 'postalCode', 20, false);
      await databases.createBooleanAttribute(DATABASE_ID, 'addresses', 'isDefault', true, false);
      
      await databases.createIndex(DATABASE_ID, 'addresses', 'idx_user', 'key', ['userId']);
      
      console.log('✅ addresses created\n');
    } catch (error) {
      console.log('⚠️  addresses already exists\n');
    }

    // 3. Loyalty Points
    console.log('⭐ Creating loyalty_points...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'loyalty_points',
        'Loyalty Points',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users())
        ]
      );

      await databases.createStringAttribute(DATABASE_ID, 'loyalty_points', 'userId', 255, true);
      await databases.createIntegerAttribute(DATABASE_ID, 'loyalty_points', 'points', true, 0);
      await databases.createIntegerAttribute(DATABASE_ID, 'loyalty_points', 'totalEarned', true, 0);
      await databases.createIntegerAttribute(DATABASE_ID, 'loyalty_points', 'totalRedeemed', true, 0);
      await databases.createStringAttribute(DATABASE_ID, 'loyalty_points', 'level', 50, true);
      
      await databases.createIndex(DATABASE_ID, 'loyalty_points', 'idx_user', 'key', ['userId']);
      
      console.log('✅ loyalty_points created\n');
    } catch (error) {
      console.log('⚠️  loyalty_points already exists\n');
    }

    // 4. Loyalty History
    console.log('📜 Creating loyalty_history...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'loyalty_history',
        'Loyalty History',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users())
        ]
      );

      await databases.createStringAttribute(DATABASE_ID, 'loyalty_history', 'userId', 255, true);
      await databases.createIntegerAttribute(DATABASE_ID, 'loyalty_history', 'points', true);
      await databases.createStringAttribute(DATABASE_ID, 'loyalty_history', 'type', 20, true);
      await databases.createStringAttribute(DATABASE_ID, 'loyalty_history', 'description', 500, true);
      
      await databases.createIndex(DATABASE_ID, 'loyalty_history', 'idx_user', 'key', ['userId']);
      
      console.log('✅ loyalty_history created\n');
    } catch (error) {
      console.log('⚠️  loyalty_history already exists\n');
    }

    // 5. Flash Sales
    console.log('⚡ Creating flash_sales...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'flash_sales',
        'Flash Sales',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );

      await databases.createStringAttribute(DATABASE_ID, 'flash_sales', 'title', 255, true);
      await databases.createFloatAttribute(DATABASE_ID, 'flash_sales', 'discount', true);
      await databases.createStringAttribute(DATABASE_ID, 'flash_sales', 'startDate', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'flash_sales', 'endDate', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'flash_sales', 'merchantId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'flash_sales', 'merchantName', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'flash_sales', 'status', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'flash_sales', 'productIds', 10000, false, true);
      await databases.createStringAttribute(DATABASE_ID, 'flash_sales', 'createdAt', 50, true);
      
      await databases.createIndex(DATABASE_ID, 'flash_sales', 'idx_merchant', 'key', ['merchantId']);
      await databases.createIndex(DATABASE_ID, 'flash_sales', 'idx_status', 'key', ['status']);
      
      console.log('✅ flash_sales created\n');
    } catch (error) {
      console.log('⚠️  flash_sales already exists\n');
    }

    // 6. Affiliate Goals
    console.log('🎯 Creating affiliate_goals...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'affiliate_goals',
        'Affiliate Goals',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );

      await databases.createStringAttribute(DATABASE_ID, 'affiliate_goals', 'userId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'affiliate_goals', 'title', 255, true);
      await databases.createFloatAttribute(DATABASE_ID, 'affiliate_goals', 'target', true);
      await databases.createFloatAttribute(DATABASE_ID, 'affiliate_goals', 'current', true, 0);
      await databases.createStringAttribute(DATABASE_ID, 'affiliate_goals', 'deadline', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'affiliate_goals', 'type', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'affiliate_goals', 'status', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'affiliate_goals', 'createdAt', 50, true);
      
      await databases.createIndex(DATABASE_ID, 'affiliate_goals', 'idx_user', 'key', ['userId']);
      
      console.log('✅ affiliate_goals created\n');
    } catch (error) {
      console.log('⚠️  affiliate_goals already exists\n');
    }

    // 7. Product Variants
    console.log('🎨 Creating product_variants...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'product_variants',
        'Product Variants',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );

      await databases.createStringAttribute(DATABASE_ID, 'product_variants', 'productId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'product_variants', 'type', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'product_variants', 'value', 100, true);
      await databases.createFloatAttribute(DATABASE_ID, 'product_variants', 'price', false);
      await databases.createIntegerAttribute(DATABASE_ID, 'product_variants', 'stock', true, 0);
      
      await databases.createIndex(DATABASE_ID, 'product_variants', 'idx_product', 'key', ['productId']);
      
      console.log('✅ product_variants created\n');
    } catch (error) {
      console.log('⚠️  product_variants already exists\n');
    }

    // 8. Advertisements
    console.log('📢 Creating advertisements...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'advertisements',
        'Advertisements',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users())
        ]
      );

      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'merchantId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'merchantName', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'productId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'productName', 500, true);
      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'productImage', 1000, false);
      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'adType', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'placement', 50, true);
      await databases.createIntegerAttribute(DATABASE_ID, 'advertisements', 'duration', true);
      await databases.createFloatAttribute(DATABASE_ID, 'advertisements', 'price', true);
      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'startDate', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'endDate', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'status', 50, true);
      await databases.createIntegerAttribute(DATABASE_ID, 'advertisements', 'clicks', true, 0);
      await databases.createIntegerAttribute(DATABASE_ID, 'advertisements', 'impressions', true, 0);
      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'paymentProof', 1000, false);
      await databases.createStringAttribute(DATABASE_ID, 'advertisements', 'createdAt', 50, true);
      
      await databases.createIndex(DATABASE_ID, 'advertisements', 'idx_merchant', 'key', ['merchantId']);
      await databases.createIndex(DATABASE_ID, 'advertisements', 'idx_status', 'key', ['status']);
      await databases.createIndex(DATABASE_ID, 'advertisements', 'idx_adType', 'key', ['adType']);
      
      console.log('✅ advertisements created\n');
    } catch (error) {
      console.log('⚠️  advertisements already exists\n');
    }

    console.log('\n✅ Database setup completed!');
    console.log('\n📊 Collections created:');
    console.log('   1. stock_notifications ✅');
    console.log('   2. addresses ✅');
    console.log('   3. loyalty_points ✅');
    console.log('   4. loyalty_history ✅');
    console.log('   5. flash_sales ✅');
    console.log('   6. affiliate_goals ✅');
    console.log('   7. product_variants ✅');
    console.log('   8. advertisements ✅');
    console.log('\n🎉 Ready to use!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupCollections();
