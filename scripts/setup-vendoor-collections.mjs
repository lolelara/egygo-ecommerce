import { Client, Databases, ID } from 'node-appwrite';
import 'dotenv/config';

// Appwrite Configuration
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID || '68d8b9db00134c41e7c8';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function setupCollections() {
  console.log('🚀 إعداد Vendoor Collections والـ Attributes\n');
  console.log('='.repeat(70));
  console.log('\n📋 المعلومات:');
  console.log(`   Endpoint: ${ENDPOINT}`);
  console.log(`   Project ID: ${PROJECT_ID}`);
  console.log(`   Database ID: ${DATABASE_ID}`);
  console.log(`   API Key: ${API_KEY.substring(0, 20)}...`);
  console.log('='.repeat(70));
  
  try {
    // 1. Create vendoor_settings collection
    console.log('\n📦 إنشاء vendoor_settings collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'vendoor_settings',
        'Vendoor Settings',
        []
      );
      console.log('✅ تم إنشاء collection بنجاح!');
      
      // Wait for collection to be created
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add attributes to vendoor_settings
      console.log('\n📝 إضافة attributes للـ vendoor_settings...');
      
      await databases.createStringAttribute(
        DATABASE_ID,
        'vendoor_settings',
        'profitType',
        20,
        false,
        'percentage'
      );
      console.log('  ✅ profitType');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await databases.createFloatAttribute(
        DATABASE_ID,
        'vendoor_settings',
        'profitValue',
        false,
        5.0
      );
      console.log('  ✅ profitValue');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await databases.createBooleanAttribute(
        DATABASE_ID,
        'vendoor_settings',
        'autoApply',
        false,
        false
      );
      console.log('  ✅ autoApply');
      
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  vendoor_settings collection موجودة مسبقاً');
      } else {
        throw error;
      }
    }
    
    // 2. Add new attributes to products collection
    console.log('\n📝 إضافة attributes جديدة للـ products collection...');
    
    const newAttributes = [
      {
        key: 'originalPrice',
        type: 'float',
        description: 'السعر الأصلي قبل هامش الربح'
      },
      {
        key: 'profitMargin',
        type: 'float',
        description: 'هامش الربح المطبق'
      },
      {
        key: 'profitType',
        type: 'string',
        size: 20,
        description: 'نوع هامش الربح (percentage/fixed)'
      }
    ];
    
    for (const attr of newAttributes) {
      try {
        console.log(`\n  📌 إضافة ${attr.key}...`);
        
        if (attr.type === 'float') {
          await databases.createFloatAttribute(
            DATABASE_ID,
            'products',
            attr.key,
            false
          );
        } else if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            'products',
            attr.key,
            attr.size,
            false
          );
        }
        
        console.log(`     ✅ ${attr.description}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`     ⚠️  ${attr.key} موجود مسبقاً`);
        } else {
          console.error(`     ❌ فشل: ${error.message}`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('🎉 تم الانتهاء من الإعداد!\n');
    console.log('📋 الخطوات التالية:');
    console.log('  1. تحقق من الـ collections في Appwrite Console');
    console.log('  2. شغل الموقع وادخل لـ Admin Panel');
    console.log('  3. اذهب إلى /admin/vendoor-products');
    console.log('\n✅ كل شيء جاهز! 🚀\n');
    
  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    process.exit(1);
  }
}

setupCollections();
