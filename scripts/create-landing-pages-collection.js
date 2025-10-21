/**
 * Script to create Landing Pages Collection in Appwrite
 * يقوم بإنشاء collection الـ landing_pages مع جميع الحقول المطلوبة
 */

import * as sdk from 'node-appwrite';

// Configuration from .env
const config = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: '68d8b9db00134c41e7c8',
  databaseId: '68de037e003bd03c4d45',
  apiKey: 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5',
};

const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const COLLECTION_ID = 'landing_pages';

async function createCollection() {
  try {
    console.log('🚀 Starting Landing Pages Collection creation...\n');

    // Step 1: Create Collection
    console.log('📦 Creating collection...');
    try {
      const collection = await databases.createCollection(
        config.databaseId,
        COLLECTION_ID,
        'Landing Pages',
        [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
          sdk.Permission.delete(sdk.Role.users()),
        ],
        true, // documentSecurity
        true  // enabled
      );
      console.log('✅ Collection created:', collection.$id);
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Collection already exists, continuing...');
      } else {
        throw error;
      }
    }

    // Step 2: Create Attributes
    console.log('\n📝 Creating attributes...');

    const attributes = [
      // 1. affiliateId
      {
        name: 'affiliateId',
        type: 'string',
        size: 100,
        required: true,
        xdefault: null,
        array: false,
      },
      // 2. title
      {
        name: 'title',
        type: 'string',
        size: 200,
        required: true,
        xdefault: null,
        array: false,
      },
      // 3. subtitle
      {
        name: 'subtitle',
        type: 'string',
        size: 300,
        required: false,
        xdefault: null,
        array: false,
      },
      // 4. description
      {
        name: 'description',
        type: 'string',
        size: 2000,
        required: false,
        xdefault: null,
        array: false,
      },
      // 5. ctaText
      {
        name: 'ctaText',
        type: 'string',
        size: 100,
        required: false,
        xdefault: 'اشترِ الآن',
        array: false,
      },
      // 6. productUrl
      {
        name: 'productUrl',
        type: 'string',
        size: 500,
        required: true,
        xdefault: null,
        array: false,
      },
      // 7. affiliateLink
      {
        name: 'affiliateLink',
        type: 'string',
        size: 500,
        required: true,
        xdefault: null,
        array: false,
      },
      // 8. template
      {
        name: 'template',
        type: 'string',
        size: 50,
        required: false,
        xdefault: 'modern',
        array: false,
      },
      // 9. colorScheme
      {
        name: 'colorScheme',
        type: 'string',
        size: 50,
        required: false,
        xdefault: 'blue',
        array: false,
      },
      // 10. features (array)
      {
        name: 'features',
        type: 'string',
        size: 200,
        required: false,
        xdefault: null,
        array: true,
      },
      // 11. testimonials
      {
        name: 'testimonials',
        type: 'boolean',
        required: false,
        xdefault: true,
      },
      // 12. countdown
      {
        name: 'countdown',
        type: 'boolean',
        required: false,
        xdefault: false,
      },
      // 13. slug
      {
        name: 'slug',
        type: 'string',
        size: 200,
        required: true,
        xdefault: null,
        array: false,
      },
      // 14. views
      {
        name: 'views',
        type: 'integer',
        required: false,
        min: 0,
        max: 999999999,
        xdefault: 0,
      },
      // 15. clicks
      {
        name: 'clicks',
        type: 'integer',
        required: false,
        min: 0,
        max: 999999999,
        xdefault: 0,
      },
      // 16. conversions
      {
        name: 'conversions',
        type: 'integer',
        required: false,
        min: 0,
        max: 999999999,
        xdefault: 0,
      },
      // 17. isActive
      {
        name: 'isActive',
        type: 'boolean',
        required: false,
        xdefault: true,
      },
    ];

    for (const attr of attributes) {
      try {
        let result;
        
        if (attr.type === 'string') {
          result = await databases.createStringAttribute(
            config.databaseId,
            COLLECTION_ID,
            attr.name,
            attr.size,
            attr.required,
            attr.xdefault,
            attr.array || false
          );
        } else if (attr.type === 'boolean') {
          result = await databases.createBooleanAttribute(
            config.databaseId,
            COLLECTION_ID,
            attr.name,
            attr.required,
            attr.xdefault
          );
        } else if (attr.type === 'integer') {
          result = await databases.createIntegerAttribute(
            config.databaseId,
            COLLECTION_ID,
            attr.name,
            attr.required,
            attr.min,
            attr.max,
            attr.xdefault
          );
        }
        
        console.log(`  ✅ ${attr.name} (${attr.type})`);
        
        // Wait a bit between attributes to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  ${attr.name} already exists`);
        } else {
          console.error(`  ❌ Error creating ${attr.name}:`, error.message);
        }
      }
    }

    // Step 3: Create Indexes
    console.log('\n🔍 Creating indexes...');
    
    const indexes = [
      {
        key: 'idx_affiliate',
        type: 'key',
        attributes: ['affiliateId'],
        orders: ['ASC'],
      },
      {
        key: 'idx_slug',
        type: 'unique',
        attributes: ['slug'],
        orders: ['ASC'],
      },
      {
        key: 'idx_active',
        type: 'key',
        attributes: ['isActive'],
        orders: ['ASC'],
      },
    ];

    // Wait for attributes to be ready
    console.log('⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    for (const index of indexes) {
      try {
        const result = await databases.createIndex(
          config.databaseId,
          COLLECTION_ID,
          index.key,
          index.type,
          index.attributes,
          index.orders
        );
        console.log(`  ✅ ${index.key} (${index.type})`);
        
        // Wait between indexes
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  ${index.key} already exists`);
        } else {
          console.error(`  ❌ Error creating ${index.key}:`, error.message);
        }
      }
    }

    console.log('\n✅ Landing Pages Collection setup complete!');
    console.log('\n📊 Summary:');
    console.log('  - Collection ID: landing_pages');
    console.log('  - Attributes: 17');
    console.log('  - Indexes: 3');
    console.log('  - Permissions: Configured');
    console.log('\n🎉 You can now use the Landing Pages feature!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the script
createCollection();
