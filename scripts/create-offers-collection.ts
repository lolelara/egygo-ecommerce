/**
 * Create Offers Collection in Appwrite
 * 
 * يقوم بإنشاء collection للعروض والإشعارات
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

/**
 * Create Offers Collection
 */
async function createOffersCollection() {
  console.log('📦 Creating offers collection...');
  
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
    
    console.log('✅ Offers collection created:', collection.$id);
    
    // Add attributes
    console.log('📝 Adding attributes to offers collection...');
    
    // title - العنوان
    await databases.createStringAttribute(
      databaseId,
      'offers',
      'title',
      255,
      true
    );
    console.log('  ✓ title');
    
    // description - الوصف
    await databases.createStringAttribute(
      databaseId,
      'offers',
      'description',
      1000,
      true
    );
    console.log('  ✓ description');
    
    // backgroundColor - لون الخلفية
    await databases.createStringAttribute(
      databaseId,
      'offers',
      'backgroundColor',
      100,
      false,
      'from-brand-purple via-brand-orange to-brand-purple'
    );
    console.log('  ✓ backgroundColor');
    
    // textColor - لون النص
    await databases.createStringAttribute(
      databaseId,
      'offers',
      'textColor',
      50,
      false,
      'text-white'
    );
    console.log('  ✓ textColor');
    
    // icon - أيقونة (optional)
    await databases.createStringAttribute(
      databaseId,
      'offers',
      'icon',
      255,
      false
    );
    console.log('  ✓ icon');
    
    // isActive - نشط/غير نشط
    await databases.createBooleanAttribute(
      databaseId,
      'offers',
      'isActive',
      true // required, no default value
    );
    console.log('  ✓ isActive');
    
    // targetAudience - الجمهور المستهدف
    await databases.createEnumAttribute(
      databaseId,
      'offers',
      'targetAudience',
      ['all', 'customer', 'affiliate', 'merchant'],
      true // required, no default value
    );
    console.log('  ✓ targetAudience');
    
    // priority - الأولوية (أعلى رقم = أعلى أولوية)
    await databases.createIntegerAttribute(
      databaseId,
      'offers',
      'priority',
      true // required, no default value
    );
    console.log('  ✓ priority');
    
    // Wait for attributes to be available
    console.log('⏳ Waiting for attributes to be available...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Create indexes
    console.log('📊 Creating indexes...');
    
    await databases.createIndex(
      databaseId,
      'offers',
      'isActive_idx',
      'key' as any,
      ['isActive'],
      ['asc']
    );
    console.log('  ✓ isActive_idx');
    
    await databases.createIndex(
      databaseId,
      'offers',
      'priority_idx',
      'key' as any,
      ['priority'],
      ['desc']
    );
    console.log('  ✓ priority_idx');
    
    console.log('✅ Offers collection setup complete!\n');
    
    // Create sample offer
    console.log('📝 Creating sample offer...');
    
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
    
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Offers collection already exists\n');
    } else {
      console.error('❌ Error creating offers collection:', error.message);
      throw error;
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Offers Collection Setup\n');
  console.log('📍 Database:', databaseId);
  console.log('\n');
  
  try {
    await createOffersCollection();
    
    console.log('🎉 Offers collection created successfully!');
    console.log('\n✅ Next steps:');
    console.log('1. Check Appwrite Console to verify collection');
    console.log('2. Add more offers in the admin panel');
    console.log('3. AnnouncementBar will now show your offers\n');
    
  } catch (error) {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
main();
