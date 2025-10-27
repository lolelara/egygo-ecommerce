/**
 * Setup Banners Collections and Buckets in Appwrite
 * سكريبت لإنشاء مجموعات البانرات في Appwrite
 * 
 * Usage: node scripts/setup-banners.js
 */

import * as sdk from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Appwrite Configuration
const client = new sdk.Client();
const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '68d8b9db00134c41e7c8')
  .setKey(process.env.APPWRITE_API_KEY || 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

async function setupBanners() {
  console.log('🚀 Starting Banners Setup...\n');

  try {
    // 1. Create Banners Collection
    console.log('📦 Creating Banners Collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'banners',
        'banners',
        [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
          sdk.Permission.delete(sdk.Role.users())
        ]
      );
      console.log('✅ Banners collection created successfully');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Banners collection already exists');
      } else {
        throw error;
      }
    }

    // 2. Create Attributes for Banners Collection
    console.log('\n📝 Creating Banners Attributes...');
    
    const bannersAttributes = [
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'imageUrl', type: 'string', size: 2000, required: true },
      { key: 'link', type: 'string', size: 2000, required: false },
      { key: 'location', type: 'enum', elements: ['offers', 'products', 'affiliate'], required: true },
      { key: 'isActive', type: 'boolean', required: false, default: true },
      { key: 'order', type: 'integer', required: false, default: 0 },
      { key: 'createdAt', type: 'datetime', required: false }
    ];

    for (const attr of bannersAttributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            'banners',
            attr.key,
            attr.size,
            attr.required,
            attr.default
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            'banners',
            attr.key,
            attr.required,
            attr.default
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            'banners',
            attr.key,
            attr.required,
            undefined,
            undefined,
            attr.default
          );
        } else if (attr.type === 'enum') {
          await databases.createEnumAttribute(
            DATABASE_ID,
            'banners',
            attr.key,
            attr.elements,
            attr.required
          );
        } else if (attr.type === 'datetime') {
          await databases.createDatetimeAttribute(
            DATABASE_ID,
            'banners',
            attr.key,
            attr.required
          );
        }
        console.log(`  ✅ Attribute '${attr.key}' created`);
        // Wait 1 second between attributes to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  Attribute '${attr.key}' already exists`);
        } else {
          console.log(`  ❌ Error creating attribute '${attr.key}':`, error.message);
        }
      }
    }

    // 3. Create Indexes for Banners Collection
    console.log('\n🔍 Creating Banners Indexes...');
    
    const indexes = [
      { key: 'location_index', type: 'key', attributes: ['location'] },
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
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  Index '${index.key}' already exists`);
        } else {
          console.log(`  ❌ Error creating index '${index.key}':`, error.message);
        }
      }
    }

    // 4. Create Banner Settings Collection
    console.log('\n📦 Creating Banner Settings Collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'bannerSettings',
        'bannerSettings',
        [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
          sdk.Permission.delete(sdk.Role.users())
        ]
      );
      console.log('✅ Banner Settings collection created successfully');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Banner Settings collection already exists');
      } else {
        throw error;
      }
    }

    // 5. Create Attributes for Banner Settings
    console.log('\n📝 Creating Banner Settings Attributes...');
    
    const settingsAttributes = [
      { key: 'location', type: 'string', size: 50, required: true },
      { key: 'autoPlayInterval', type: 'integer', required: false, default: 5 },
      { key: 'showControls', type: 'boolean', required: false, default: true },
      { key: 'height', type: 'string', size: 50, required: false, default: '300px' }
    ];

    for (const attr of settingsAttributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            'bannerSettings',
            attr.key,
            attr.size,
            attr.required,
            attr.default
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            'bannerSettings',
            attr.key,
            attr.required,
            attr.default
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            'bannerSettings',
            attr.key,
            attr.required,
            undefined,
            undefined,
            attr.default
          );
        }
        console.log(`  ✅ Attribute '${attr.key}' created`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  Attribute '${attr.key}' already exists`);
        } else {
          console.log(`  ❌ Error creating attribute '${attr.key}':`, error.message);
        }
      }
    }

    // 6. Create Storage Bucket for Banner Images
    console.log('\n🪣 Creating Banners Storage Bucket...');
    try {
      await storage.createBucket(
        'banners',
        'banners',
        [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
          sdk.Permission.delete(sdk.Role.users())
        ],
        false, // fileSecurity
        true,  // enabled
        10485760, // maxFileSize (10MB)
        ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'], // allowedFileExtensions
        undefined, // compression
        undefined, // encryption
        undefined  // antivirus
      );
      console.log('✅ Banners storage bucket created successfully');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Banners storage bucket already exists');
      } else {
        throw error;
      }
    }

    // 7. Create Default Settings for Each Location
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

    console.log('\n✨ Banners Setup Completed Successfully!\n');
    console.log('📋 Summary:');
    console.log('  ✅ Banners Collection');
    console.log('  ✅ Banner Settings Collection');
    console.log('  ✅ Banners Storage Bucket');
    console.log('  ✅ Default Settings for all locations\n');

  } catch (error) {
    console.error('\n❌ Error during setup:', error);
    process.exit(1);
  }
}

// Run the setup
setupBanners();
