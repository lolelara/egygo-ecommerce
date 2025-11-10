import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputLogo = path.join(__dirname, '..', 'client', 'public', 'logo.jpg');
const outputDir = path.join(__dirname, '..', 'client', 'public');

// تأكد من وجود الملف
if (!fs.existsSync(inputLogo)) {
  console.error('❌ ملف الشعار غير موجود:', inputLogo);
  process.exit(1);
}

console.log('🚀 بدء توليد الأيقونات والصور...\n');

// أحجام الأيقونات المطلوبة
const iconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // Apple touch icon
  { size: 192, name: 'android-chrome-192x192.png' }, // Android Chrome
  { size: 512, name: 'android-chrome-512x512.png' }, // Android Chrome
];

// توليد الأيقونات المربعة
async function generateIcons() {
  for (const icon of iconSizes) {
    const outputPath = path.join(outputDir, icon.name);
    
    try {
      await sharp(inputLogo)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ تم توليد ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ فشل توليد ${icon.name}:`, error.message);
    }
  }
}

// توليد favicon.ico (متعدد الأحجام)
async function generateFavicon() {
  const outputPath = path.join(outputDir, 'favicon.ico');
  
  try {
    // توليد favicon 32x32 بصيغة PNG أولاً
    const faviconBuffer = await sharp(inputLogo)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toBuffer();
    
    // حفظ كـ PNG (معظم المتصفحات تدعم PNG في favicon)
    fs.writeFileSync(outputPath.replace('.ico', '-generated.png'), faviconBuffer);
    console.log('✅ تم توليد favicon-generated.png (32x32)');
  } catch (error) {
    console.error('❌ فشل توليد favicon:', error.message);
  }
}

// توليد صورة OG مخصصة (1200x630) - بتصميم محسّن
async function generateOGImage() {
  const outputPath = path.join(outputDir, 'og-image.jpg');
  const width = 1200;
  const height = 630;
  
  try {
    // قراء الشعار الأصلي للحصول على أبعاده
    const metadata = await sharp(inputLogo).metadata();
    
    // حساب حجم الشعار (40% من العرض للتصميم الأفضل)
    const logoWidth = Math.floor(width * 0.4);
    const logoHeight = Math.floor((logoWidth / metadata.width) * metadata.height);
    
    // تغيير حجم الشعار مع خلفية بيضاء
    const resizedLogo = await sharp(inputLogo)
      .resize(logoWidth, logoHeight, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toBuffer();
    
    // النص "إيجي جو - EgyGo" بجانب الشعار
    const text = `
      <svg width="${width}" height="${height}">
        <rect width="${width}" height="${height}" fill="white"/>
        <text 
          x="${Math.floor(width * 0.65)}" 
          y="${Math.floor(height * 0.4)}" 
          font-family="Arial, sans-serif" 
          font-size="80" 
          font-weight="bold" 
          fill="#dc2626"
          text-anchor="middle">إيجي جو</text>
        <text 
          x="${Math.floor(width * 0.65)}" 
          y="${Math.floor(height * 0.55)}" 
          font-family="Arial, sans-serif" 
          font-size="60" 
          fill="#000000"
          text-anchor="middle">EgyGo</text>
        <text 
          x="${Math.floor(width * 0.65)}" 
          y="${Math.floor(height * 0.7)}" 
          font-family="Arial, sans-serif" 
          font-size="32" 
          fill="#666666"
          text-anchor="middle">منصة التسوق الإلكتروني</text>
      </svg>
    `;
    
    // حساب موضع الشعار على اليسار
    const logoLeft = Math.floor(width * 0.08);
    const logoTop = Math.floor((height - logoHeight) / 2);
    
    // إنشاء صورة OG بخلفية بيضاء
    await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([
      // إضافة الشعار على اليسار
      {
        input: resizedLogo,
        top: logoTop,
        left: logoLeft
      }
    ])
    .composite([
      // إضافة النص
      {
        input: Buffer.from(text),
        top: 0,
        left: 0
      }
    ])
    .jpeg({ quality: 95 })
    .toFile(outputPath);
    
    console.log(`✅ تم توليد og-image.jpg (${width}x${height}) بتصميم محسّن`);
  } catch (error) {
    console.error('❌ فشل توليد صورة OG:', error.message);
    console.error('التفاصيل:', error);
  }
}

// تنفيذ جميع العمليات
async function main() {
  await generateIcons();
  await generateFavicon();
  await generateOGImage();
  
  console.log('\n✨ تم توليد جميع الأيقونات والصور بنجاح!');
  console.log('\n📋 الخطوات التالية:');
  console.log('1. تحديث index.html لاستخدام الأيقونات الجديدة');
  console.log('2. تحديث manifest.json');
  console.log('3. إعادة تشغيل السيرفر (Ctrl+C ثم npm run dev)');
  console.log('4. مسح كاش المتصفح (Ctrl+Shift+R)');
}

main().catch(console.error);
