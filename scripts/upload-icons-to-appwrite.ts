import { Client, Storage, ID, Permission, Role } from 'node-appwrite';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تحميل متغيرات البيئة
config();

// تكوين Appwrite - مع قيم ثابتة للتأكد من العمل
const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const storage = new Storage(client);

// معرف الـ bucket للأصول العامة
const ASSETS_BUCKET_ID = 'public-assets';

// قائمة الأيقونات المطلوب رفعها
const iconsToUpload = [
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon-48x48.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'og-image.jpg',
  'logo.png',
  'logo-dark.png',
  'manifest.json'
];

interface UploadedFile {
  filename: string;
  fileId: string;
  url: string;
}

/**
 * إنشاء bucket للأصول العامة إذا لم يكن موجوداً
 */
async function createBucketIfNotExists() {
  try {
    // محاولة الحصول على الـ bucket
    await storage.getBucket(ASSETS_BUCKET_ID);
    console.log(`✅ Bucket '${ASSETS_BUCKET_ID}' موجود بالفعل`);
  } catch (error: any) {
    if (error.code === 404) {
      // إنشاء bucket جديد
      try {
        await storage.createBucket(
          ASSETS_BUCKET_ID,
          'Public Assets',
          [Permission.read(Role.any())],
          false, // fileSecurity
          true, // enabled
          undefined, // maxFileSize (5MB default)
          undefined, // allowedFileExtensions
          undefined, // compression
          undefined, // encryption
          undefined  // antivirus
        );
        console.log(`✅ تم إنشاء bucket '${ASSETS_BUCKET_ID}' بنجاح`);
      } catch (createError: any) {
        console.error('❌ فشل إنشاء bucket:', createError.message);
        throw createError;
      }
    } else {
      console.error('❌ خطأ في الحصول على bucket:', error.message);
      throw error;
    }
  }
}

/**
 * رفع ملف واحد إلى Appwrite Storage
 */
async function uploadFile(filename: string): Promise<UploadedFile | null> {
  const filePath = path.join(__dirname, '..', 'client', 'public', filename);
  
  // التحقق من وجود الملف
  if (!fs.existsSync(filePath)) {
    console.error(`❌ الملف غير موجود: ${filename}`);
    return null;
  }

  try {
    // قراءة الملف
    const fileBuffer = fs.readFileSync(filePath);
    const file = new File([fileBuffer], filename, { 
      type: filename.endsWith('.json') ? 'application/json' : 
            filename.endsWith('.jpg') ? 'image/jpeg' : 'image/png'
    });

    // حذف الملف القديم إذا كان موجوداً (استخدم نفس الاسم كـ ID)
    try {
      await storage.deleteFile(ASSETS_BUCKET_ID, filename);
      console.log(`🗑️  تم حذف النسخة القديمة من ${filename}`);
    } catch (deleteError) {
      // الملف غير موجود، هذا طبيعي
    }

    // رفع الملف الجديد
    const uploadedFile = await storage.createFile(
      ASSETS_BUCKET_ID,
      filename, // استخدم اسم الملف كـ ID لسهولة الوصول
      file,
      [Permission.read(Role.any())]
    );

    // إنشاء URL للوصول العام
    const fileUrl = `${ENDPOINT}/storage/buckets/${ASSETS_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${PROJECT_ID}`;

    console.log(`✅ تم رفع ${filename}`);
    
    return {
      filename,
      fileId: uploadedFile.$id,
      url: fileUrl
    };
  } catch (error: any) {
    console.error(`❌ فشل رفع ${filename}:`, error.message);
    return null;
  }
}

/**
 * رفع جميع الأيقونات
 */
async function uploadAllIcons() {
  console.log('🚀 بدء رفع الأيقونات إلى Appwrite Storage...\n');

  // إنشاء bucket
  await createBucketIfNotExists();
  console.log('');

  const uploadedFiles: UploadedFile[] = [];

  // رفع كل ملف
  for (const filename of iconsToUpload) {
    const result = await uploadFile(filename);
    if (result) {
      uploadedFiles.push(result);
    }
  }

  console.log('\n✨ اكتمل رفع الأيقونات!\n');
  console.log('📋 قائمة الملفات المرفوعة:\n');
  
  uploadedFiles.forEach(file => {
    console.log(`  ${file.filename}:`);
    console.log(`    ID: ${file.fileId}`);
    console.log(`    URL: ${file.url}\n`);
  });

  // إنشاء ملف تكوين للاستخدام في الكود
  const configContent = `// Auto-generated by upload-icons-to-appwrite.ts
// تم إنشاؤه تلقائياً بواسطة سكريبت رفع الأيقونات

export const appwriteAssets = {
  endpoint: '${ENDPOINT}',
  projectId: '${PROJECT_ID}',
  bucketId: '${ASSETS_BUCKET_ID}',
  
  // روابط مباشرة للأصول
  icons: {
${uploadedFiles.map(file => `    '${file.filename}': '${file.url}'`).join(',\n')}
  },
  
  // دالة مساعدة للحصول على URL أي أصل
  getAssetUrl(filename: string): string {
    return \`\${this.endpoint}/storage/buckets/\${this.bucketId}/files/\${filename}/view?project=\${this.projectId}\`;
  }
};
`;

  const configPath = path.join(__dirname, '..', 'client', 'lib', 'appwrite-assets.ts');
  fs.writeFileSync(configPath, configContent);
  console.log(`✅ تم إنشاء ملف التكوين: client/lib/appwrite-assets.ts\n`);

  // تعليمات التحديث
  console.log('📝 الخطوات التالية:\n');
  console.log('1. قم بتحديث client/index.html لاستخدام الروابط الجديدة:');
  console.log(`   <link rel="icon" type="image/png" sizes="32x32" href="${uploadedFiles.find(f => f.filename === 'favicon-32x32.png')?.url}" />\n`);
  console.log('2. أو استخدم ملف التكوين الجديد:');
  console.log('   import { appwriteAssets } from "@/lib/appwrite-assets";\n');
  console.log('3. أعد تشغيل السيرفر: npm run dev\n');
}

// تنفيذ السكريبت
uploadAllIcons().catch(error => {
  console.error('❌ خطأ فادح:', error);
  process.exit(1);
});
