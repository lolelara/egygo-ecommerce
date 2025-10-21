const { Client, Databases } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('68d8b9db00134c41e7c8')
  .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';

async function addStatusField() {
  console.log('🔧 Adding status field to products collection...\n');

  try {
    // Add status attribute (optional, not required, so we can set default)
    console.log('📝 Adding status attribute...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        'products',
        'status',
        50,
        false, // optional (not required)
        'approved' // default value for existing products
      );
      console.log('✅ status attribute added (optional with default: approved)\n');
      
      // Wait for attribute to be available
      console.log('⏳ Waiting for attribute to be available (10 seconds)...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  status attribute already exists\n');
      } else {
        throw error;
      }
    }

    // Create index for status
    console.log('📊 Creating index for status...');
    try {
      await databases.createIndex(
        DATABASE_ID,
        'products',
        'idx_status',
        'key',
        ['status']
      );
      console.log('✅ Index created\n');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Index already exists\n');
      } else {
        throw error;
      }
    }

    // Add rejectionReason attribute (optional)
    console.log('📝 Adding rejectionReason attribute...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        'products',
        'rejectionReason',
        1000,
        false // optional
      );
      console.log('✅ rejectionReason attribute added\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  rejectionReason attribute already exists\n');
      } else {
        console.error('Error adding rejectionReason:', error.message);
      }
    }

    // Add approvedAt attribute (optional)
    console.log('📝 Adding approvedAt attribute...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        'products',
        'approvedAt',
        50,
        false // optional
      );
      console.log('✅ approvedAt attribute added\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  approvedAt attribute already exists\n');
      } else {
        console.error('Error adding approvedAt:', error.message);
      }
    }

    console.log('✅ Status field setup completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. All existing products now have status: "approved"');
    console.log('   2. New merchant products will have status: "pending"');
    console.log('   3. Admin can approve/reject products');
    console.log('   4. rejectionReason field available');
    console.log('   5. approvedAt field available');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addStatusField();
