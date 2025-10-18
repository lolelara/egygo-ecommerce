/**
 * Seed Affiliate Activities
 * إضافة بيانات تجريبية للنشاطات
 */

import { Client, Databases, ID } from 'node-appwrite';
import { config } from 'dotenv';

config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

// Sample activities
const sampleActivities = [
  {
    type: 'sale',
    title: 'مبيعة جديدة',
    description: 'تم شراء ساعة ذكية عبر رابطك',
    amount: 45.50,
    productName: 'ساعة ذكية متطورة',
    minutesAgo: 30
  },
  {
    type: 'earning',
    title: 'عمولة مضافة',
    description: 'تم إضافة عمولة إلى رصيدك',
    amount: 45.50,
    minutesAgo: 45
  },
  {
    type: 'click',
    title: 'نقرات جديدة',
    description: '15 نقرة على رابط سماعات لاسلكية',
    productName: 'سماعات لاسلكية Pro',
    minutesAgo: 120
  },
  {
    type: 'link_created',
    title: 'رابط جديد',
    description: 'تم إنشاء رابط لمنتج كاميرا احترافية',
    productName: 'كاميرا احترافية 4K',
    minutesAgo: 300
  },
  {
    type: 'sale',
    title: 'مبيعة جديدة',
    description: 'تم شراء لابتوب ألعاب عبر رابطك',
    amount: 120.00,
    productName: 'لابتوب ألعاب متطور',
    minutesAgo: 1440 // 1 day
  },
  {
    type: 'click',
    title: 'نقرات جديدة',
    description: '8 نقرات على رابط تابلت رسم',
    productName: 'تابلت رسم رقمي',
    minutesAgo: 2880 // 2 days
  },
  {
    type: 'earning',
    title: 'عمولة مضافة',
    description: 'عمولة من طلب سماعات',
    amount: 32.00,
    productName: 'سماعات بلوتوث',
    minutesAgo: 180
  },
  {
    type: 'sale',
    title: 'مبيعة جديدة',
    description: 'تم شراء هاتف ذكي عبر رابطك',
    amount: 85.00,
    productName: 'هاتف ذكي متطور',
    minutesAgo: 360
  },
  {
    type: 'click',
    title: 'نقرات جديدة',
    description: '25 نقرة على رابط شاشة ألعاب',
    productName: 'شاشة ألعاب 144Hz',
    minutesAgo: 480
  },
  {
    type: 'link_created',
    title: 'رابط جديد',
    description: 'تم إنشاء رابط لمنتج ماوس ألعاب',
    productName: 'ماوس ألعاب RGB',
    minutesAgo: 600
  }
];

async function seedActivities() {
  console.log('\n🌱 بدء إضافة النشاطات التجريبية...\n');

  try {
    // Get all affiliates from users collection
    const usersResponse = await databases.listDocuments(
      DATABASE_ID,
      'users',
      []
    );

    const affiliates = usersResponse.documents.filter((user: any) => 
      user.isAffiliate === true || user.role === 'affiliate'
    );

    if (affiliates.length === 0) {
      console.log('⚠️  لا يوجد مسوقين في النظام');
      return;
    }

    console.log(`✅ تم العثور على ${affiliates.length} مسوق\n`);

    // Add activities for each affiliate
    for (const affiliate of affiliates) {
      console.log(`📝 إضافة نشاطات لـ: ${affiliate.name || affiliate.email}`);

      for (const activity of sampleActivities) {
        const createdAt = new Date(Date.now() - activity.minutesAgo * 60 * 1000).toISOString();

        try {
          await databases.createDocument(
            DATABASE_ID,
            'affiliate_activities',
            ID.unique(),
            {
              affiliateId: affiliate.$id,
              type: activity.type,
              title: activity.title,
              description: activity.description,
              amount: activity.amount || 0,
              productName: activity.productName || '',
              productId: '',
              orderId: '',
              link: '',
              metadata: '{}',
              createdAt,
            }
          );

          console.log(`   ✅ ${activity.title}`);
        } catch (error: any) {
          console.log(`   ❌ خطأ: ${error.message}`);
        }
      }

      console.log('');
    }

    console.log('\n✅ تم إضافة جميع النشاطات بنجاح!\n');

  } catch (error: any) {
    console.error('❌ خطأ:', error.message);
  }
}

seedActivities();
