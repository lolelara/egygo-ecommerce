import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputLogo = path.join(__dirname, '..', 'client', 'public', 'logo.jpg');
const outputLogo = path.join(__dirname, '..', 'client', 'public', 'logo.png');

async function createTransparentLogo() {
  try {
    console.log('🎨 بدء إنشاء شعار بخلفية شفافة...');
    
    // قراءة الشعار الأصلي
    const image = sharp(inputLogo);
    const metadata = await image.metadata();
    
    console.log(`📐 أبعاد الشعار: ${metadata.width}x${metadata.height}`);
    
    // تحويل الخلفية البيضاء إلى شفافة
    await image
      .removeAlpha() // إزالة أي alpha موجود
      .toColorspace('srgb')
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        // تحويل الخلفية البيضاء إلى شفافة
        const pixels = new Uint8ClampedArray(info.width * info.height * 4);
        
        for (let i = 0; i < data.length; i += info.channels) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // إذا كان البيكسل أبيض أو قريب جداً من الأبيض، اجعله شفاف
          const isWhite = r > 240 && g > 240 && b > 240;
          
          const idx = (i / info.channels) * 4;
          pixels[idx] = r;
          pixels[idx + 1] = g;
          pixels[idx + 2] = b;
          pixels[idx + 3] = isWhite ? 0 : 255; // شفاف إذا أبيض، غير شفاف إذا ملون
        }
        
        return sharp(pixels, {
          raw: {
            width: info.width,
            height: info.height,
            channels: 4
          }
        })
        .png()
        .toFile(outputLogo);
      });
    
    console.log('✅ تم إنشاء logo.png بخلفية شفافة');
    console.log(`📁 الملف: ${outputLogo}`);
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    console.log('\n💡 حل بديل: استخدم برنامج تحرير صور لإزالة الخلفية يدوياً');
    console.log('   مثل: https://www.remove.bg/');
  }
}

createTransparentLogo();
