import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.VITE_APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function fixCommissionsCollection() {
  console.log('🔧 Fixing Commissions Collection attributes...\n');
  
  try {
    // Check if status attribute exists
    console.log('  Checking status attribute...');
    
    try {
      await databases.createEnumAttribute(
        databaseId,
        'commissions',
        'status',
        ['pending', 'approved', 'paid', 'cancelled'],
        false,
        'pending'
      );
      console.log('  ✓ status attribute created');
    } catch (error) {
      if (error.code === 409) {
        console.log('  ℹ️  status attribute already exists');
      } else {
        throw error;
      }
    }
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check other missing attributes
    try {
      await databases.createDatetimeAttribute(
        databaseId,
        'commissions',
        'createdAt',
        false
      );
      console.log('  ✓ createdAt attribute created');
    } catch (error) {
      if (error.code === 409) {
        console.log('  ℹ️  createdAt attribute already exists');
      } else {
        throw error;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await databases.createDatetimeAttribute(
        databaseId,
        'commissions',
        'paidAt',
        false
      );
      console.log('  ✓ paidAt attribute created');
    } catch (error) {
      if (error.code === 409) {
        console.log('  ℹ️  paidAt attribute already exists');
      } else {
        throw error;
      }
    }
    
    console.log('\n  ⏳ Waiting 5 seconds for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Create missing indexes
    console.log('\n  Creating indexes...');
    
    try {
      await databases.createIndex(
        databaseId,
        'commissions',
        'status_index',
        'key',
        ['status'],
        ['asc']
      );
      console.log('  ✓ status index created');
    } catch (error) {
      if (error.code === 409) {
        console.log('  ℹ️  status index already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await databases.createIndex(
        databaseId,
        'commissions',
        'createdAt_index',
        'key',
        ['createdAt'],
        ['desc']
      );
      console.log('  ✓ createdAt index created');
    } catch (error) {
      if (error.code === 409) {
        console.log('  ℹ️  createdAt index already exists');
      } else {
        throw error;
      }
    }
    
    console.log('\n✅ Commissions Collection is now complete!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  }
}

fixCommissionsCollection().catch(console.error);
