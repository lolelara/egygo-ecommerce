import { Client, Account, ID } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '');

const account = new Account(client);

async function createAffiliateAccount() {
  const email = 'almlmibrahym574@gmail.com';
  // Generate random password
  const password = 'Affiliate' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const name = 'إبراهيم المسوق';
  
  console.log('👤 Creating Affiliate Test Account...\n');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`👤 Name: ${name}\n`);
  
  try {
    // Create account
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );
    
    console.log('✅ Account created successfully!');
    console.log(`   User ID: ${user.$id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}\n`);
    
    // Now login to set preferences
    const session = await account.createEmailPasswordSession(email, password);
    console.log('✅ Logged in successfully');
    console.log(`   Session ID: ${session.$id}\n`);
    
    // Set user preferences for affiliate
    const affiliateCode = 'AFF' + Date.now().toString(36).toUpperCase();
    await account.updatePrefs({
      role: 'affiliate',
      isAffiliate: true,
      affiliateCode: affiliateCode,
      commissionRate: 0.15, // 15% commission
    });
    
    console.log('✅ Affiliate preferences set');
    console.log(`   Affiliate Code: ${affiliateCode}`);
    console.log(`   Commission Rate: 15%\n`);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Affiliate account ready!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`\n⚠️  IMPORTANT: Save this password! It won't be shown again.\n`);
    
    // Delete session
    await account.deleteSession('current');
    console.log('✅ Logged out');
    
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  Account already exists!');
      console.log('   Email: ' + email);
      console.log('\nℹ️  You can login with the existing account.');
      console.log('   If you forgot the password, use "Forgot Password" feature.\n');
    } else {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }
}

createAffiliateAccount();
