import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function setupCollections() {
  console.log('🚀 Starting collections setup...\n');

  try {
    // 1. Stock Notifications Collection
    console.log('📦 Creating stock_notifications collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'stock_notifications',
        'stock_notifications',
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

      console.log('✅ stock_notifications created\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  stock_notifications already exists\n');
      } else {
        throw error;
      }
    }

    // 2. Addresses Collection
    console.log('📍 Creating addresses collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'addresses',
        'addresses',
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

      console.log('✅ addresses created\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  addresses already exists\n');
      } else {
        throw error;
      }
    }

    // 3. Loyalty Points Collection
    console.log('⭐ Creating loyalty_points collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'loyalty_points',
        'loyalty_points',
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

      console.log('✅ loyalty_points created\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  loyalty_points already exists\n');
      } else {
        throw error;
      }
    }

    // 4. Loyalty History Collection
    console.log('📜 Creating loyalty_history collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'loyalty_history',
        'loyalty_history',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users())
        ]
      );

      await databases.createStringAttribute(DATABASE_ID, 'loyalty_history', 'userId', 255, true);
      await databases.createIntegerAttribute(DATABASE_ID, 'loyalty_history', 'points', true);
      await databases.createStringAttribute(DATABASE_ID, 'loyalty_history', 'type', 20, true);
      await databases.createStringAttribute(DATABASE_ID, 'loyalty_history', 'description', 500, true);

      console.log('✅ loyalty_history created\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  loyalty_history already exists\n');
      } else {
        throw error;
      }
    }

    // 5. Flash Sales Collection
    console.log('⚡ Creating flash_sales collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'flash_sales',
        'flash_sales',
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

      console.log('✅ flash_sales created\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  flash_sales already exists\n');
      } else {
        throw error;
      }
    }

    // 6. Affiliate Goals Collection
    console.log('🎯 Creating affiliate_goals collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'affiliate_goals',
        'affiliate_goals',
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

      console.log('✅ affiliate_goals created\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  affiliate_goals already exists\n');
      } else {
        throw error;
      }
    }

    // 7. Product Variants Collection
    console.log('🎨 Creating product_variants collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'product_variants',
        'product_variants',
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

      console.log('✅ product_variants created\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  product_variants already exists\n');
      } else {
        throw error;
      }
    }

    // 8. Update Products Collection with new attributes
    console.log('📦 Updating products collection...');
    try {
      await databases.createStringAttribute(DATABASE_ID, 'products', 'colors', 1000, false, true);
      await databases.createStringAttribute(DATABASE_ID, 'products', 'sizes', 1000, false, true);
      await databases.createStringAttribute(DATABASE_ID, 'products', 'dimensions', 100, false);
      await databases.createFloatAttribute(DATABASE_ID, 'products', 'weight', false);
      console.log('✅ products updated\n');
    } catch (error: any) {
      console.log('⚠️  products attributes might already exist\n');
    }

    // 9. Create Indexes
    console.log('🔍 Creating indexes...');
    
    try {
      await databases.createIndex(DATABASE_ID, 'stock_notifications', 'idx_email', 'key', ['email']);
      await databases.createIndex(DATABASE_ID, 'stock_notifications', 'idx_product', 'key', ['productId']);
      await databases.createIndex(DATABASE_ID, 'addresses', 'idx_user', 'key', ['userId']);
      await databases.createIndex(DATABASE_ID, 'loyalty_points', 'idx_user', 'key', ['userId']);
      await databases.createIndex(DATABASE_ID, 'loyalty_history', 'idx_user', 'key', ['userId']);
      await databases.createIndex(DATABASE_ID, 'flash_sales', 'idx_merchant', 'key', ['merchantId']);
      await databases.createIndex(DATABASE_ID, 'flash_sales', 'idx_status', 'key', ['status']);
      await databases.createIndex(DATABASE_ID, 'affiliate_goals', 'idx_user', 'key', ['userId']);
      await databases.createIndex(DATABASE_ID, 'product_variants', 'idx_product', 'key', ['productId']);
      console.log('✅ Indexes created\n');
    } catch (error: any) {
      console.log('⚠️  Some indexes might already exist\n');
    }

    console.log('\n✅ All collections setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - stock_notifications ✅');
    console.log('   - addresses ✅');
    console.log('   - loyalty_points ✅');
    console.log('   - loyalty_history ✅');
    console.log('   - flash_sales ✅');
    console.log('   - affiliate_goals ✅');
    console.log('   - product_variants ✅');
    console.log('   - products (updated) ✅');
    console.log('\n🎉 Database is ready!');

  } catch (error) {
    console.error('❌ Error setting up collections:', error);
    process.exit(1);
  }
}

setupCollections();
