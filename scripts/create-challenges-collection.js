/**
 * Script to create Affiliate Challenges Collection in Appwrite
 * يقوم بإنشاء collection للتحديات والمكافآت
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

async function createChallengesCollection() {
  try {
    console.log('🚀 Starting Affiliate Challenges setup...\n');

    // Create affiliate_challenges collection
    console.log('📦 Creating affiliate_challenges collection...');
    try {
      await databases.createCollection(
        config.databaseId,
        'affiliate_challenges',
        'Affiliate Challenges',
        [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
          sdk.Permission.delete(sdk.Role.users()),
        ],
        true,
        true
      );
      console.log('✅ affiliate_challenges collection created');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  affiliate_challenges collection already exists');
      } else {
        throw error;
      }
    }

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create attributes for affiliate_challenges
    console.log('\n📝 Creating attributes for affiliate_challenges...');
    
    const challengeAttributes = [
      { name: 'affiliateId', type: 'string', size: 100, required: true },
      { name: 'challengeId', type: 'string', size: 100, required: true },
      { name: 'title', type: 'string', size: 200, required: true },
      { name: 'description', type: 'string', size: 500, required: false },
      { name: 'type', type: 'string', size: 50, required: true }, // daily, weekly, monthly, special
      { name: 'target', type: 'integer', required: true, min: 1, max: 10000 },
      { name: 'current', type: 'integer', required: false, min: 0, max: 10000, xdefault: 0 },
      { name: 'reward', type: 'integer', required: true, min: 0, max: 100000 },
      { name: 'rewardType', type: 'string', size: 50, required: true }, // cash, points, badge
      { name: 'completed', type: 'boolean', required: false, xdefault: false },
      { name: 'claimed', type: 'boolean', required: false, xdefault: false },
      { name: 'expiresAt', type: 'string', size: 100, required: false },
      { name: 'completedAt', type: 'string', size: 100, required: false },
      { name: 'claimedAt', type: 'string', size: 100, required: false },
    ];

    for (const attr of challengeAttributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            config.databaseId,
            'affiliate_challenges',
            attr.name,
            attr.size,
            attr.required,
            attr.xdefault || null,
            false
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            config.databaseId,
            'affiliate_challenges',
            attr.name,
            attr.required,
            attr.min,
            attr.max,
            attr.xdefault || null
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            config.databaseId,
            'affiliate_challenges',
            attr.name,
            attr.required,
            attr.xdefault
          );
        }
        console.log(`  ✅ ${attr.name} (${attr.type})`);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  ${attr.name} already exists`);
        } else {
          console.error(`  ❌ Error creating ${attr.name}:`, error.message);
        }
      }
    }

    // Create affiliate_stats collection (if not exists)
    console.log('\n📦 Creating affiliate_stats collection...');
    try {
      await databases.createCollection(
        config.databaseId,
        'affiliate_stats',
        'Affiliate Stats',
        [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
        ],
        true,
        true
      );
      console.log('✅ affiliate_stats collection created');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  affiliate_stats collection already exists');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create attributes for affiliate_stats
    console.log('\n📝 Creating attributes for affiliate_stats...');
    
    const statsAttributes = [
      { name: 'affiliateId', type: 'string', size: 100, required: true },
      { name: 'totalSales', type: 'integer', required: false, min: 0, max: 999999, xdefault: 0 },
      { name: 'todaySales', type: 'integer', required: false, min: 0, max: 10000, xdefault: 0 },
      { name: 'weekSales', type: 'integer', required: false, min: 0, max: 100000, xdefault: 0 },
      { name: 'monthSales', type: 'integer', required: false, min: 0, max: 100000, xdefault: 0 },
      { name: 'currentStreak', type: 'integer', required: false, min: 0, max: 1000, xdefault: 0 },
      { name: 'level', type: 'integer', required: false, min: 1, max: 100, xdefault: 1 },
      { name: 'points', type: 'integer', required: false, min: 0, max: 9999999, xdefault: 0 },
      { name: 'totalEarnings', type: 'integer', required: false, min: 0, max: 99999999, xdefault: 0 },
      { name: 'lastSaleDate', type: 'string', size: 100, required: false },
    ];

    for (const attr of statsAttributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            config.databaseId,
            'affiliate_stats',
            attr.name,
            attr.size,
            attr.required,
            attr.xdefault || null,
            false
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            config.databaseId,
            'affiliate_stats',
            attr.name,
            attr.required,
            attr.min,
            attr.max,
            attr.xdefault || null
          );
        }
        console.log(`  ✅ ${attr.name} (${attr.type})`);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  ${attr.name} already exists`);
        } else {
          console.error(`  ❌ Error creating ${attr.name}:`, error.message);
        }
      }
    }

    // Create indexes
    console.log('\n🔍 Creating indexes...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const indexes = [
      {
        collection: 'affiliate_challenges',
        key: 'idx_affiliate_id',
        type: 'key',
        attributes: ['affiliateId'],
      },
      {
        collection: 'affiliate_challenges',
        key: 'idx_challenge_id',
        type: 'key',
        attributes: ['challengeId'],
      },
      {
        collection: 'affiliate_stats',
        key: 'idx_affiliate_id_stats',
        type: 'unique',
        attributes: ['affiliateId'],
      },
    ];

    for (const index of indexes) {
      try {
        await databases.createIndex(
          config.databaseId,
          index.collection,
          index.key,
          index.type,
          index.attributes,
          ['ASC']
        );
        console.log(`  ✅ ${index.key} on ${index.collection}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  ${index.key} already exists`);
        } else {
          console.error(`  ❌ Error creating ${index.key}:`, error.message);
        }
      }
    }

    console.log('\n✅ Affiliate Challenges setup complete!');
    console.log('\n📊 Summary:');
    console.log('  - Collections: affiliate_challenges, affiliate_stats');
    console.log('  - Attributes: 14 (challenges) + 10 (stats)');
    console.log('  - Indexes: 3');
    console.log('\n🎉 You can now use the Challenges feature!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the script
createChallengesCollection();
