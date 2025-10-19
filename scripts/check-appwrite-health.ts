/**
 * Check Appwrite Health
 * التحقق من حالة خوادم Appwrite
 */

import { config } from 'dotenv';

config();

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID || '';
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '';

console.log('\n🏥 Checking Appwrite Connection...\n');
console.log(`📍 Endpoint: ${ENDPOINT}`);
console.log(`🎯 Project ID: ${PROJECT_ID}`);
console.log(`💾 Database ID: ${DATABASE_ID}\n`);

async function checkHealth() {
  const checks = [
    { 
      name: 'Appwrite Server', 
      url: `${ENDPOINT}`,
      headers: {}
    },
    { 
      name: 'Database Connection', 
      url: `${ENDPOINT}/databases/${DATABASE_ID}`,
      headers: {
        'X-Appwrite-Project': PROJECT_ID
      }
    },
  ];

  let allHealthy = true;

  for (const check of checks) {
    try {
      const startTime = Date.now();
      const response = await fetch(check.url, {
        method: 'GET',
        headers: check.headers
      });
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (response.ok) {
        console.log(`✅ ${check.name}: OK (${duration}ms)`);
        try {
          const data = await response.json();
          if (data.name) console.log(`   Name: ${data.name}`);
          if (data.$id) console.log(`   ID: ${data.$id}`);
        } catch (e) {
          // Response might not be JSON
        }
      } else if (response.status === 503) {
        console.log(`⚠️ ${check.name}: 503 Service Unavailable`);
        console.log(`   🔴 Appwrite Cloud is experiencing issues`);
        allHealthy = false;
      } else {
        console.log(`❌ ${check.name}: ${response.status} ${response.statusText}`);
        allHealthy = false;
      }
    } catch (error: any) {
      if (error.message.includes('fetch')) {
        console.log(`⚠️ ${check.name}: Network Error`);
        console.log(`   Cannot reach Appwrite server`);
      } else {
        console.log(`❌ ${check.name}: ${error.message}`);
      }
      allHealthy = false;
    }
    console.log('');
  }

  console.log('═══════════════════════════════════════════════');
  if (allHealthy) {
    console.log('✅ All Appwrite services are healthy!');
    console.log('═══════════════════════════════════════════════\n');
    return true;
  } else {
    console.log('❌ Some Appwrite services are down!');
    console.log('═══════════════════════════════════════════════');
    console.log('\n📝 Recommendations:');
    console.log('   1. Check https://status.appwrite.io/');
    console.log('   2. Wait 5-10 minutes and try again');
    console.log('   3. Check Appwrite Discord/Twitter for updates');
    console.log('   4. Contact Appwrite Support if issue persists\n');
    return false;
  }
}

checkHealth()
  .then((healthy) => {
    process.exit(healthy ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
