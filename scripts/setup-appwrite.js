/**
 * Appwrite Database Setup Script
 * 
 * Automatically creates all required collections and attributes
 */

const sdk = require('node-appwrite');
require('dotenv').config();

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'egygo-database';

// Helper to wait for attribute creation
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createDatabase() {
  try {
    console.log('🗄️  Creating database...');
    const database = await databases.create(
      DATABASE_ID,
      'EgyGo E-commerce Database'
    );
    console.log('✅ Database created:', database.$id);
    return database;
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Database already exists');
      return { $id: DATABASE_ID };
    }
    throw error;
  }
}

async function createAddressesCollection() {
  console.log('\n📍 Creating addresses collection...');
  
  try {
    const collection = await databases.createCollection(
      DATABASE_ID,
      'addresses',
      'User Addresses',
      ['read("user")'],
      true // Document security
    );
    
    console.log('✅ Collection created:', collection.$id);
    
    // Create attributes
    await databases.createStringAttribute(DATABASE_ID, 'addresses', 'userId', 255, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'addresses', 'name', 255, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'addresses', 'phone', 50, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'addresses', 'street', 500, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'addresses', 'city', 100, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'addresses', 'state', 100, false);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'addresses', 'postalCode', 20, false);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'addresses', 'country', 100, true, 'Egypt');
    await wait(1000);
    
    await databases.createBooleanAttribute(DATABASE_ID, 'addresses', 'isDefault', true, false);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'addresses', 'type', 50, false, 'home');
    await wait(1000);
    
    // Create indexes
    await databases.createIndex(DATABASE_ID, 'addresses', 'userId_index', 'key', ['userId']);
    await wait(1000);
    
    await databases.createIndex(DATABASE_ID, 'addresses', 'isDefault_index', 'key', ['isDefault']);
    
    console.log('✅ Addresses collection setup complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function createProductsCollection() {
  console.log('\n📦 Creating products collection...');
  
  try {
    const collection = await databases.createCollection(
      DATABASE_ID,
      'products',
      'Products Catalog',
      ['read("any")'],
      false
    );
    
    console.log('✅ Collection created:', collection.$id);
    
    // Create attributes
    await databases.createStringAttribute(DATABASE_ID, 'products', 'name', 255, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'products', 'nameEn', 255, false);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'products', 'description', 10000, true);
    await wait(1000);
    
    await databases.createFloatAttribute(DATABASE_ID, 'products', 'price', true);
    await wait(1000);
    
    await databases.createFloatAttribute(DATABASE_ID, 'products', 'originalPrice', false);
    await wait(1000);
    
    await databases.createIntegerAttribute(DATABASE_ID, 'products', 'discount', false, 0);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'products', 'image', 500, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'products', 'images', 500, false, undefined, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'products', 'category', 255, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'products', 'brand', 255, false);
    await wait(1000);
    
    await databases.createIntegerAttribute(DATABASE_ID, 'products', 'stock', true, 0);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'products', 'sku', 100, false);
    await wait(1000);
    
    await databases.createFloatAttribute(DATABASE_ID, 'products', 'rating', false, 0);
    await wait(1000);
    
    await databases.createIntegerAttribute(DATABASE_ID, 'products', 'reviewCount', false, 0);
    await wait(1000);
    
    await databases.createBooleanAttribute(DATABASE_ID, 'products', 'featured', false, false);
    await wait(1000);
    
    await databases.createBooleanAttribute(DATABASE_ID, 'products', 'active', true, true);
    await wait(1000);
    
    // Create indexes
    await databases.createIndex(DATABASE_ID, 'products', 'category_index', 'key', ['category']);
    await wait(1000);
    
    await databases.createIndex(DATABASE_ID, 'products', 'price_index', 'key', ['price']);
    await wait(1000);
    
    await databases.createIndex(DATABASE_ID, 'products', 'featured_index', 'key', ['featured']);
    
    console.log('✅ Products collection setup complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function createOrdersCollection() {
  console.log('\n📝 Creating orders collection...');
  
  try {
    const collection = await databases.createCollection(
      DATABASE_ID,
      'orders',
      'Customer Orders',
      ['read("user")'],
      true
    );
    
    console.log('✅ Collection created:', collection.$id);
    
    // Create attributes
    await databases.createStringAttribute(DATABASE_ID, 'orders', 'userId', 255, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'orders', 'orderNumber', 50, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'orders', 'items', 50000, true);
    await wait(1000);
    
    await databases.createFloatAttribute(DATABASE_ID, 'orders', 'subtotal', true);
    await wait(1000);
    
    await databases.createFloatAttribute(DATABASE_ID, 'orders', 'shipping', true);
    await wait(1000);
    
    await databases.createFloatAttribute(DATABASE_ID, 'orders', 'tax', false, 0);
    await wait(1000);
    
    await databases.createFloatAttribute(DATABASE_ID, 'orders', 'discount', false, 0);
    await wait(1000);
    
    await databases.createFloatAttribute(DATABASE_ID, 'orders', 'total', true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'orders', 'status', 50, true, 'pending');
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'orders', 'paymentMethod', 50, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'orders', 'paymentStatus', 50, true, 'pending');
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'orders', 'shippingAddress', 5000, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'orders', 'trackingNumber', 100, false);
    await wait(1000);
    
    // Create indexes
    await databases.createIndex(DATABASE_ID, 'orders', 'userId_index', 'key', ['userId']);
    await wait(1000);
    
    await databases.createIndex(DATABASE_ID, 'orders', 'orderNumber_index', 'unique', ['orderNumber']);
    await wait(1000);
    
    await databases.createIndex(DATABASE_ID, 'orders', 'status_index', 'key', ['status']);
    
    console.log('✅ Orders collection setup complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function createCartCollection() {
  console.log('\n🛒 Creating cart collection...');
  
  try {
    const collection = await databases.createCollection(
      DATABASE_ID,
      'cart',
      'Shopping Cart',
      ['read("user")'],
      true
    );
    
    console.log('✅ Collection created:', collection.$id);
    
    // Create attributes
    await databases.createStringAttribute(DATABASE_ID, 'cart', 'userId', 255, true);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'cart', 'productId', 255, true);
    await wait(1000);
    
    await databases.createIntegerAttribute(DATABASE_ID, 'cart', 'quantity', true, 1);
    await wait(1000);
    
    await databases.createFloatAttribute(DATABASE_ID, 'cart', 'price', true);
    await wait(1000);
    
    // Create indexes
    await databases.createIndex(DATABASE_ID, 'cart', 'userId_index', 'key', ['userId']);
    await wait(1000);
    
    await databases.createIndex(DATABASE_ID, 'cart', 'productId_index', 'key', ['productId']);
    
    console.log('✅ Cart collection setup complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function createPointsCollection() {
  console.log('\n🎮 Creating points collection...');
  
  try {
    const collection = await databases.createCollection(
      DATABASE_ID,
      'points',
      'User Points',
      ['read("user")'],
      true
    );
    
    console.log('✅ Collection created:', collection.$id);
    
    // Create attributes
    await databases.createStringAttribute(DATABASE_ID, 'points', 'userId', 255, true);
    await wait(1000);
    
    await databases.createIntegerAttribute(DATABASE_ID, 'points', 'total', true, 0);
    await wait(1000);
    
    await databases.createIntegerAttribute(DATABASE_ID, 'points', 'level', true, 1);
    await wait(1000);
    
    await databases.createIntegerAttribute(DATABASE_ID, 'points', 'streak', false, 0);
    await wait(1000);
    
    await databases.createDatetimeAttribute(DATABASE_ID, 'points', 'lastLogin', false);
    await wait(1000);
    
    // Create indexes
    await databases.createIndex(DATABASE_ID, 'points', 'userId_index', 'unique', ['userId']);
    await wait(1000);
    
    await databases.createIndex(DATABASE_ID, 'points', 'total_index', 'key', ['total']);
    
    console.log('✅ Points collection setup complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function createSpinsCollection() {
  console.log('\n🎰 Creating spins collection...');
  
  try {
    const collection = await databases.createCollection(
      DATABASE_ID,
      'spins',
      'Spin Wheel Data',
      ['read("user")'],
      true
    );
    
    console.log('✅ Collection created:', collection.$id);
    
    // Create attributes
    await databases.createStringAttribute(DATABASE_ID, 'spins', 'userId', 255, true);
    await wait(1000);
    
    await databases.createIntegerAttribute(DATABASE_ID, 'spins', 'spinsLeft', true, 1);
    await wait(1000);
    
    await databases.createDatetimeAttribute(DATABASE_ID, 'spins', 'lastSpin', false);
    await wait(1000);
    
    await databases.createStringAttribute(DATABASE_ID, 'spins', 'history', 10000, false);
    await wait(1000);
    
    // Create indexes
    await databases.createIndex(DATABASE_ID, 'spins', 'userId_index', 'unique', ['userId']);
    
    console.log('✅ Spins collection setup complete');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Appwrite setup...\n');
  
  try {
    // Create database
    await createDatabase();
    await wait(2000);
    
    // Create collections
    await createAddressesCollection();
    await wait(2000);
    
    await createProductsCollection();
    await wait(2000);
    
    await createOrdersCollection();
    await wait(2000);
    
    await createCartCollection();
    await wait(2000);
    
    await createPointsCollection();
    await wait(2000);
    
    await createSpinsCollection();
    await wait(2000);
    
    console.log('\n✅ Setup complete! All collections created successfully.');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with the DATABASE_ID');
    console.log('2. Set collection permissions in Appwrite Console');
    console.log('3. Test your API calls');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  main();
}

module.exports = { main };
