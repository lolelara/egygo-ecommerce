/**
 * Script to add basePrice and minCommissionPrice fields to products collection
 * Run: pnpm tsx scripts/add-commission-fields.ts
 */

import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '';
const PRODUCTS_COLLECTION = 'products';

async function addCommissionFields() {
  console.log('🔧 إضافة حقول العمولة الجديدة...\n');

  try {
    // Add basePrice attribute (السعر الأساسي قبل العمولة)
    console.log('📊 إضافة حقل basePrice...');
    try {
      await databases.createFloatAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION,
        'basePrice',
        false, // not required (will use price as fallback)
        0, // min value
        undefined, // max value
        0 // default value
      );
      console.log('✅ تم إضافة basePrice\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  basePrice موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // Add minCommissionPrice attribute (أقل سعر شامل العمولة)
    console.log('💰 إضافة حقل minCommissionPrice...');
    try {
      await databases.createFloatAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION,
        'minCommissionPrice',
        false, // not required (will use price as fallback)
        0, // min value
        undefined, // max value
        0 // default value
      );
      console.log('✅ تم إضافة minCommissionPrice\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  minCommissionPrice موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 تم إضافة حقول العمولة بنجاح!');
    console.log('\n📋 ملخص الحقول الجديدة:');
    console.log('   1. basePrice - السعر الأساسي قبل العمولة (يحدده التاجر)');
    console.log('   2. minCommissionPrice - أقل سعر شامل العمولة (الحد الأدنى للمسوق)');
    console.log('\n💡 كيف يعمل النظام:');
    console.log('   - التاجر يضع basePrice (مثلاً: $50)');
    console.log('   - التاجر يضع minCommissionPrice (مثلاً: $60)');
    console.log('   - المسوق يمكنه بيع المنتج بأي سعر >= $60');
    console.log('   - عمولة المسوق = سعر البيع - basePrice');
    console.log('   - مثال: إذا باع بـ $70، عمولته = $70 - $50 = $20');
    
  } catch (error) {
    console.error('\n❌ خطأ في إضافة الحقول:', error);
    process.exit(1);
  }
}

addCommissionFields()
  .then(() => {
    console.log('\n✅ تم الانتهاء بنجاح!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ فشل التنفيذ:', error);
    process.exit(1);
  });
