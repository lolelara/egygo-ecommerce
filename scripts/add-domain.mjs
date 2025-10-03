/**
 * إضافة دومين مخصص إلى Appwrite Platform
 * يسمح للدومين الجديد بالوصول إلى Appwrite API
 */

import 'dotenv/config';
import readline from 'readline';

const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.VITE_APPWRITE_API_KEY || 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';

// إنشاء interface للقراءة من console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function listPlatforms() {
  const url = `${APPWRITE_ENDPOINT}/projects/${PROJECT_ID}/platforms`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch platforms');
  }

  const data = await response.json();
  return data.platforms || [];
}

async function addPlatform(hostname, name) {
  const url = `${APPWRITE_ENDPOINT}/projects/${PROJECT_ID}/platforms`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY
    },
    body: JSON.stringify({
      type: 'web',
      name: name,
      hostname: hostname
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to add platform: ${error.message}`);
  }

  return response.json();
}

async function main() {
  console.log('🌐 إضافة دومين مخصص إلى Appwrite\n');

  try {
    // عرض Platforms الموجودة
    console.log('📋 Platforms الموجودة حالياً:');
    const platforms = await listPlatforms();
    
    if (platforms.length === 0) {
      console.log('  ⚠️  لا توجد platforms بعد\n');
    } else {
      platforms.forEach((platform, index) => {
        console.log(`  ${index + 1}. ${platform.name} → ${platform.hostname}`);
      });
      console.log('');
    }

    // اختيار: إضافة سريعة أو مخصصة
    console.log('اختر نوع الإضافة:');
    console.log('1. إضافة سريعة (Cloudflare Pages: egygo.pages.dev)');
    console.log('2. إضافة سريعة (Netlify: egygo.netlify.app)');
    console.log('3. إضافة سريعة (Vercel: egygo.vercel.app)');
    console.log('4. إضافة دومين مخصص');
    console.log('');

    const choice = await askQuestion('اختيارك (1-4): ');

    let hostname, name;

    switch (choice.trim()) {
      case '1':
        hostname = 'egygo.pages.dev';
        name = 'Cloudflare Pages';
        break;
      case '2':
        hostname = 'egygo.netlify.app';
        name = 'Netlify';
        break;
      case '3':
        hostname = 'egygo.vercel.app';
        name = 'Vercel';
        break;
      case '4':
        hostname = await askQuestion('أدخل الدومين (مثال: egygo.com): ');
        name = await askQuestion('أدخل اسم Platform (مثال: Production): ');
        break;
      default:
        console.log('❌ اختيار غير صحيح');
        rl.close();
        return;
    }

    // تأكيد
    console.log('\n📝 سيتم إضافة:');
    console.log(`  الاسم: ${name}`);
    console.log(`  الدومين: ${hostname}`);
    console.log('');

    const confirm = await askQuestion('هل تريد المتابعة؟ (y/n): ');

    if (confirm.toLowerCase() !== 'y') {
      console.log('❌ تم الإلغاء');
      rl.close();
      return;
    }

    // إضافة Platform
    console.log('\n⏳ جاري الإضافة...');
    const result = await addPlatform(hostname, name);

    console.log('\n✅ تم إضافة Platform بنجاح!');
    console.log(`\n📋 التفاصيل:`);
    console.log(`  ID: ${result.$id}`);
    console.log(`  الاسم: ${result.name}`);
    console.log(`  الدومين: ${result.hostname}`);
    console.log(`  النوع: ${result.type}`);

    console.log('\n🎉 الآن يمكنك استخدام الدومين للوصول إلى Appwrite API!');

    // إضافة platforms إضافية؟
    console.log('');
    const addMore = await askQuestion('هل تريد إضافة دومين آخر؟ (y/n): ');
    
    if (addMore.toLowerCase() === 'y') {
      rl.close();
      // إعادة تشغيل
      console.log('\n' + '='.repeat(50) + '\n');
      main();
    } else {
      rl.close();
    }

  } catch (error) {
    console.error('\n❌ خطأ:', error.message);
    rl.close();
    process.exit(1);
  }
}

// تشغيل السكريبت
main();
