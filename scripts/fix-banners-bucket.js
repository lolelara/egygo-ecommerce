/**
 * Fix Banners Bucket Settings
 * إصلاح إعدادات bucket البانرات
 */

import * as sdk from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new sdk.Client();
const storage = new sdk.Storage(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '68d8b9db00134c41e7c8')
  .setKey(process.env.APPWRITE_API_KEY);

async function fixBannersBucket() {
  console.log('🔧 Fixing Banners Bucket Settings...\n');

  try {
    // Update bucket settings
    console.log('📦 Updating banners bucket...');
    
    await storage.updateBucket(
      'banners', // bucketId
      'banners', // name
      [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.users()),
        sdk.Permission.update(sdk.Role.users()),
        sdk.Permission.delete(sdk.Role.users())
      ],
      false, // fileSecurity
      true,  // enabled
      10485760, // maxFileSize (10MB)
      ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'], // allowedFileExtensions - بدون "image/"
      sdk.Compression.none, // compression
      false, // encryption
      false  // antivirus
    );
    
    console.log('✅ Banners bucket updated successfully!\n');
    console.log('📋 New Settings:');
    console.log('  ✅ Max Size: 10MB');
    console.log('  ✅ Allowed: PNG, JPG, JPEG, WebP, GIF, SVG');
    console.log('  ✅ Permissions: Read (any), Create/Update/Delete (users)\n');

  } catch (error) {
    console.error('❌ Error updating bucket:', error.message);
    console.log('\n💡 Alternative Solution:');
    console.log('Go to Appwrite Console → Storage → banners bucket → Settings');
    console.log('Update "Allowed file extensions" to: png, jpg, jpeg, webp, gif, svg');
    process.exit(1);
  }
}

fixBannersBucket();
