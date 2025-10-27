/**
 * Fix Missing Banners Attributes
 * إصلاح الـ attributes الناقصة للبانرات
 */

import * as sdk from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '68d8b9db00134c41e7c8')
  .setKey(process.env.APPWRITE_API_KEY);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

async function fixBannersAttributes() {
  console.log('🔧 Fixing Banners Attributes...\n');

  try {
    // Fix banners collection
    console.log('📦 Fixing Banners Collection Attributes...');
    
    const bannersFixAttributes = [
      { key: 'isActive', type: 'boolean', default: true },
      { key: 'order', type: 'integer', default: 0 }
    ];

    for (const attr of bannersFixAttributes) {
      try {
        if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            'banners',
            attr.key,
            false, // required = false
            attr.default
          );
          console.log(`  ✅ Attribute '${attr.key}' created`);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            'banners',
            attr.key,
            false, // required = false
            undefined,
            undefined,
            attr.default
          );
          console.log(`  ✅ Attribute '${attr.key}' created`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  Attribute '${attr.key}' already exists`);
        } else {
          console.log(`  ❌ Error creating attribute '${attr.key}':`, error.message);
        }
      }
    }

    // Create indexes
    console.log('\n🔍 Creating Missing Indexes...');
    
    const indexes = [
      { key: 'active_index', type: 'key', attributes: ['isActive'] },
      { key: 'order_index', type: 'key', attributes: ['order'] },
      { key: 'location_active_order', type: 'key', attributes: ['location', 'isActive', 'order'] }
    ];

    for (const index of indexes) {
      try {
        await databases.createIndex(
          DATABASE_ID,
          'banners',
          index.key,
          index.type,
          index.attributes
        );
        console.log(`  ✅ Index '${index.key}' created`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  Index '${index.key}' already exists`);
        } else {
          console.log(`  ❌ Error creating index '${index.key}':`, error.message);
        }
      }
    }

    // Fix banner settings collection
    console.log('\n📦 Fixing Banner Settings Collection Attributes...');
    
    const settingsFixAttributes = [
      { key: 'autoPlayInterval', type: 'integer', default: 5 },
      { key: 'showControls', type: 'boolean', default: true },
      { key: 'height', type: 'string', size: 50, default: '300px' }
    ];

    for (const attr of settingsFixAttributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            'bannerSettings',
            attr.key,
            attr.size,
            false, // required = false
            attr.default
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            'bannerSettings',
            attr.key,
            false, // required = false
            attr.default
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            'bannerSettings',
            attr.key,
            false, // required = false
            undefined,
            undefined,
            attr.default
          );
        }
        console.log(`  ✅ Attribute '${attr.key}' created`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  Attribute '${attr.key}' already exists`);
        } else {
          console.log(`  ❌ Error creating attribute '${attr.key}':`, error.message);
        }
      }
    }

    // Create default settings
    console.log('\n⚙️  Creating Default Settings...');
    
    const defaultSettings = [
      { location: 'offers', autoPlayInterval: 5, showControls: true, height: '300px' },
      { location: 'products', autoPlayInterval: 5, showControls: true, height: '300px' },
      { location: 'affiliate', autoPlayInterval: 5, showControls: true, height: '300px' }
    ];

    for (const setting of defaultSettings) {
      try {
        await databases.createDocument(
          DATABASE_ID,
          'bannerSettings',
          sdk.ID.unique(),
          setting
        );
        console.log(`  ✅ Default settings created for '${setting.location}'`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  Default settings for '${setting.location}' already exist`);
        } else {
          console.log(`  ❌ Error creating settings for '${setting.location}':`, error.message);
        }
      }
    }

    console.log('\n✨ Fix Completed!\n');

  } catch (error) {
    console.error('\n❌ Error during fix:', error);
    process.exit(1);
  }
}

fixBannersAttributes();
