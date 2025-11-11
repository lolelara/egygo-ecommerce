import { Client, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('68d8b9db00134c41e7c8')
  .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';

async function checkSchema() {
  try {
    console.log('🔍 Checking products collection schema...\n');
    
    // Get collection info
    const collection = await databases.getCollection(DATABASE_ID, 'products');
    
    console.log('📋 Collection: products');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('✅ Attributes found:\n');
    
    collection.attributes.forEach(attr => {
      console.log(`   ${attr.key}:`);
      console.log(`      Type: ${attr.type}`);
      console.log(`      Required: ${attr.required}`);
      if (attr.array) console.log(`      Array: true`);
      if (attr.size) console.log(`      Size: ${attr.size}`);
      if (attr.default !== undefined) console.log(`      Default: ${attr.default}`);
      console.log('');
    });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📝 Summary:');
    console.log(`   Total attributes: ${collection.attributes.length}`);
    
    // Check for specific attributes we need
    const neededAttrs = ['colors', 'sizes', 'colorSizeInventory', 'stock', 'stockQuantity'];
    console.log('\n🎯 Vendoor attributes check:');
    
    neededAttrs.forEach(attr => {
      const exists = collection.attributes.find(a => a.key === attr);
      if (exists) {
        console.log(`   ✅ ${attr}: EXISTS (${exists.type}${exists.array ? '[]' : ''})`);
      } else {
        console.log(`   ❌ ${attr}: MISSING`);
      }
    });
    
    // Create sample product data structure
    console.log('\n\n📦 Sample Product Data Structure for Vendoor:\n');
    console.log('```javascript');
    console.log('{');
    
    const sampleData = {};
    collection.attributes.forEach(attr => {
      let value;
      switch(attr.type) {
        case 'string':
          if (attr.array) {
            value = attr.key === 'colors' ? '["أحمر", "أزرق"]' : 
                    attr.key === 'sizes' ? '["S", "M", "L"]' :
                    attr.key === 'images' ? '["url1", "url2"]' : '[]';
          } else {
            value = attr.key === 'colorSizeInventory' ? 'JSON.stringify([{color: "أحمر", size: "M", quantity: 10}])' :
                    attr.key === 'name' ? '"Product Name"' :
                    attr.key === 'description' ? '"Description"' :
                    attr.key === 'sku' ? '"VD-XXX"' :
                    attr.key === 'source' ? '"vendoor"' :
                    attr.key === 'status' ? '"draft"' : '""';
          }
          break;
        case 'integer':
        case 'float':
          value = attr.key.includes('price') ? '250' :
                  attr.key === 'stock' ? '100' :
                  attr.key === 'rating' ? '4.5' : '0';
          break;
        case 'boolean':
          value = 'true';
          break;
        default:
          value = 'null';
      }
      
      console.log(`  ${attr.key}: ${value},`);
    });
    
    console.log('}');
    console.log('```');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

checkSchema();
