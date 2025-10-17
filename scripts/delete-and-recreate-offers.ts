/**
 * Delete and Recreate Offers Collection
 * 
 * يحذف offers collection القديم ويعيد إنشاؤه من جديد
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || '')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function deleteAndRecreateOffers() {
  console.log('🗑️  Deleting old offers collection...\n');
  
  try {
    await databases.deleteCollection(databaseId, 'offers');
    console.log('✅ Old collection deleted\n');
  } catch (error: any) {
    if (error.code === 404) {
      console.log('⚠️  Collection does not exist (OK)\n');
    } else {
      console.log('⚠️  Could not delete:', error.message, '\n');
    }
  }

  console.log('📦 Creating new offers collection...\n');
  
  try {
    // Create collection
    const collection = await databases.createCollection(
      databaseId,
      'offers',
      'offers',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    
    console.log('✅ Collection created:', collection.$id, '\n');
    
    // Add attributes
    console.log('📝 Adding attributes...\n');
    
    await databases.createStringAttribute(databaseId, 'offers', 'title', 255, true);
    console.log('  ✓ title');
    
    await databases.createStringAttribute(databaseId, 'offers', 'description', 1000, true);
    console.log('  ✓ description');
    
    await databases.createStringAttribute(databaseId, 'offers', 'backgroundColor', 100, false, 'from-brand-purple via-brand-orange to-brand-purple');
    console.log('  ✓ backgroundColor');
    
    await databases.createStringAttribute(databaseId, 'offers', 'textColor', 50, false, 'text-white');
    console.log('  ✓ textColor');
    
    await databases.createStringAttribute(databaseId, 'offers', 'icon', 255, false);
    console.log('  ✓ icon');
    
    // Required fields WITHOUT default values
    await databases.createBooleanAttribute(databaseId, 'offers', 'isActive', true);
    console.log('  ✓ isActive');
    
    await databases.createEnumAttribute(
      databaseId,
      'offers',
      'targetAudience',
      ['all', 'customer', 'affiliate', 'merchant'],
      true
    );
    console.log('  ✓ targetAudience');
    
    await databases.createIntegerAttribute(databaseId, 'offers', 'priority', true);
    console.log('  ✓ priority');
    
    console.log('\n⏳ Waiting for attributes...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Create indexes
    console.log('\n📊 Creating indexes...\n');
    
    await databases.createIndex(databaseId, 'offers', 'isActive_idx', 'key' as any, ['isActive'], ['asc']);
    console.log('  ✓ isActive_idx');
    
    await databases.createIndex(databaseId, 'offers', 'priority_idx', 'key' as any, ['priority'], ['desc']);
    console.log('  ✓ priority_idx');
    
    console.log('\n✅ Collection setup complete!\n');
    
    // Create sample offer
    console.log('📝 Creating sample offer...\n');
    
    await databases.createDocument(
      databaseId,
      'offers',
      'default_offer',
      {
        title: '💼 انضم لفريق الشركاء!',
        description: 'سجّل الآن كتاجر أو مسوق واحصل على عمولات مميزة وأرباح مستمرة',
        backgroundColor: 'from-brand-purple via-brand-orange to-brand-purple',
        textColor: 'text-white',
        isActive: true,
        targetAudience: 'all',
        priority: 1
      }
    );
    
    console.log('✅ Sample offer created!\n');
    console.log('🎉 All done!\n');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Run
console.log('\n🚀 Delete and Recreate Offers Collection\n');
deleteAndRecreateOffers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Failed:', error);
    process.exit(1);
  });
