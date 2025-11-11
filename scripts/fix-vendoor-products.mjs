import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('68d8b9db00134c41e7c8')
  .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';

async function fixVendoorProducts() {
  try {
    console.log('🔧 Fixing Vendoor products...\n');
    
    // Get all Vendoor products
    const products = await databases.listDocuments(
      DATABASE_ID,
      'products',
      [
        Query.equal('source', 'vendoor'),
        Query.limit(100)
      ]
    );
    
    console.log(`📦 Found ${products.total} Vendoor products to fix\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    let fixed = 0;
    
    for (const product of products.documents) {
      console.log(`\n🔧 Fixing: ${product.name}`);
      console.log(`   ID: ${product.$id}`);
      
      const updates = {};
      let needsUpdate = false;
      
      // 1. Fix status if draft
      if (product.status === 'draft') {
        updates.status = 'approved';
        console.log(`   ✅ Status: draft → approved`);
        needsUpdate = true;
      }
      
      // 2. Fix description if bad
      if (!product.description || product.description.includes('Product from Vendoor - ')) {
        let newDescription = `منتج عالي الجودة من Vendoor\n\n`;
        newDescription += `💰 السعر: ${product.price} جنيه\n\n`;
        
        if (product.colors && product.colors.length > 0) {
          newDescription += `🎨 الألوان المتاحة: ${product.colors.join(', ')}\n\n`;
        }
        
        if (product.sizes && product.sizes.length > 0) {
          const uniqueSizes = [...new Set(product.sizes.map(s => {
            // Extract size number only
            const match = s.match(/\d+/);
            return match ? match[0] : s;
          }))];
          newDescription += `📏 المقاسات المتاحة: ${uniqueSizes.join(', ')}\n\n`;
        }
        
        if (product.totalStock || product.stock) {
          newDescription += `📦 المخزون: ${product.totalStock || product.stock} قطعة متاحة\n\n`;
        }
        
        if (product.colorSizeInventory) {
          try {
            const inventory = JSON.parse(product.colorSizeInventory);
            if (inventory.length > 0) {
              newDescription += `📊 التفاصيل:\n`;
              // Show first 5 items as example
              const samplesToShow = inventory.slice(0, 5);
              samplesToShow.forEach(item => {
                if (item.quantity > 0) {
                  newDescription += `   • ${item.color} - مقاس ${item.size}: ${item.quantity} قطعة\n`;
                }
              });
              if (inventory.length > 5) {
                newDescription += `   ... و ${inventory.length - 5} variant أخرى\n`;
              }
            }
          } catch (e) {
            // Ignore JSON parse errors
          }
        }
        
        updates.description = newDescription.substring(0, 1500);
        console.log(`   ✅ Description updated`);
        needsUpdate = true;
      }
      
      // 3. Make sure isActive is true
      if (!product.isActive) {
        updates.isActive = true;
        console.log(`   ✅ isActive: false → true`);
        needsUpdate = true;
      }
      
      // 4. Update the product
      if (needsUpdate) {
        try {
          await databases.updateDocument(
            DATABASE_ID,
            'products',
            product.$id,
            updates
          );
          console.log(`   ✅ Updated successfully`);
          fixed++;
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
        }
      } else {
        console.log(`   ℹ️  No changes needed`);
      }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 Summary:');
    console.log(`   Total products: ${products.total}`);
    console.log(`   Fixed: ${fixed}`);
    console.log('');
    console.log('✅ Done! All Vendoor products should now be:');
    console.log('   - Status: approved (visible to customers)');
    console.log('   - Description: improved with details');
    console.log('   - Active: true');
    console.log('   - Stock: preserved');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixVendoorProducts();
