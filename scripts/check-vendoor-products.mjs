import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('68d8b9db00134c41e7c8')
  .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';

async function checkVendoorProducts() {
  try {
    console.log('🔍 Checking Vendoor products...\n');
    
    // Get all products from Vendoor source
    const products = await databases.listDocuments(
      DATABASE_ID,
      'products',
      [
        Query.equal('source', 'vendoor'),
        Query.limit(100)
      ]
    );
    
    console.log(`📦 Found ${products.total} Vendoor products\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    products.documents.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name || 'No Name'}`);
      console.log(`   ID: ${product.$id}`);
      console.log(`   Price: ${product.price} EGP`);
      console.log(`   Description: ${product.description?.substring(0, 100)}...`);
      console.log(`   Stock: ${product.stock || 0}`);
      console.log(`   Total Stock: ${product.totalStock || 0}`);
      console.log(`   Colors: ${product.colors ? JSON.stringify(product.colors) : 'None'}`);
      console.log(`   Sizes: ${product.sizes ? JSON.stringify(product.sizes).substring(0, 100) : 'None'}...`);
      
      if (product.colorSizeInventory) {
        try {
          const inventory = JSON.parse(product.colorSizeInventory);
          console.log(`   Inventory Items: ${inventory.length}`);
          if (inventory.length > 0) {
            console.log(`   Sample: ${JSON.stringify(inventory[0])}`);
          }
        } catch (e) {
          console.log(`   Inventory: ERROR parsing JSON`);
        }
      } else {
        console.log(`   Inventory: NULL or empty`);
      }
      
      console.log(`   Status: ${product.status || 'unknown'}`);
      console.log(`   Active: ${product.isActive}`);
      console.log('');
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Summary
    const withStock = products.documents.filter(p => (p.stock || 0) > 0 || (p.totalStock || 0) > 0);
    const withColors = products.documents.filter(p => p.colors && p.colors.length > 0);
    const withSizes = products.documents.filter(p => p.sizes && p.sizes.length > 0);
    const withInventory = products.documents.filter(p => p.colorSizeInventory);
    const active = products.documents.filter(p => p.isActive);
    const published = products.documents.filter(p => p.status === 'approved' || p.status === 'published');
    
    console.log('📊 Summary:');
    console.log(`   Total: ${products.total}`);
    console.log(`   With Stock: ${withStock.length}`);
    console.log(`   With Colors: ${withColors.length}`);
    console.log(`   With Sizes: ${withSizes.length}`);
    console.log(`   With Inventory: ${withInventory.length}`);
    console.log(`   Active: ${active.length}`);
    console.log(`   Published: ${published.length}`);
    console.log('');
    
    // Find problems
    console.log('⚠️  Potential Issues:');
    
    const noStock = products.documents.filter(p => !p.stock && !p.totalStock);
    if (noStock.length > 0) {
      console.log(`   ${noStock.length} products with NO stock (will show as unavailable)`);
    }
    
    const noInventory = products.documents.filter(p => !p.colorSizeInventory);
    if (noInventory.length > 0) {
      console.log(`   ${noInventory.length} products with NO inventory data`);
    }
    
    const badDescription = products.documents.filter(p => p.description?.includes('(مخزن'));
    if (badDescription.length > 0) {
      console.log(`   ${badDescription.length} products with OLD description format (needs cleanup)`);
    }
    
    const draft = products.documents.filter(p => p.status === 'draft');
    if (draft.length > 0) {
      console.log(`   ${draft.length} products in DRAFT status (not visible to customers)`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkVendoorProducts();
