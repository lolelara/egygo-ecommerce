const { Client, Storage } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('68d8b9db00134c41e7c8')
  .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const storage = new Storage(client);
const BUCKET_ID = 'product-images'; // Same bucket for images and videos

async function configureVideoStorage() {
  console.log('🎥 Configuring video storage for product-images bucket...\n');

  try {
    // Get current bucket configuration
    console.log('📋 Fetching current bucket configuration...');
    const bucket = await storage.getBucket(BUCKET_ID);
    
    console.log('Current configuration:');
    console.log('- Name:', bucket.name);
    console.log('- Max file size:', bucket.maximumFileSize, 'bytes');
    console.log('- Allowed extensions:', bucket.allowedFileExtensions?.join(', ') || 'All');
    console.log('- Enabled:', bucket.enabled);
    console.log('');

    // Update bucket to allow video files
    console.log('🔧 Updating bucket to allow video files...');
    
    const videoExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', // Images
      'mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'wmv', 'm4v', '3gp' // Videos
    ];

    await storage.updateBucket(
      BUCKET_ID,
      bucket.name,
      undefined, // permissions (keep current)
      undefined, // fileSecurity (keep current)
      bucket.enabled,
      100 * 1024 * 1024, // 100MB max file size
      videoExtensions, // allowed extensions
      undefined, // compression
      undefined, // encryption
      undefined  // antivirus
    );

    console.log('✅ Bucket updated successfully!\n');
    
    console.log('📊 New configuration:');
    console.log('- Max file size: 100 MB');
    console.log('- Allowed video formats: MP4, MOV, AVI, WebM, MKV, FLV, WMV, M4V, 3GP');
    console.log('- Allowed image formats: JPG, JPEG, PNG, GIF, WebP, SVG');
    console.log('');
    
    console.log('🎉 Video upload is now enabled!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Clear browser cache (Ctrl + Shift + Delete)');
    console.log('   2. Refresh the page (Ctrl + F5)');
    console.log('   3. Try uploading a video');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 404) {
      console.log('\n💡 Bucket not found. Creating new bucket...');
      
      try {
        await storage.createBucket(
          BUCKET_ID,
          'Product Images & Videos',
          undefined, // permissions
          false, // fileSecurity
          true, // enabled
          100 * 1024 * 1024, // 100MB
          ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'mov', 'avi', 'webm', 'mkv', 'flv', 'wmv', 'm4v', '3gp'],
          undefined, // compression
          undefined, // encryption
          undefined  // antivirus
        );
        
        console.log('✅ Bucket created successfully!');
      } catch (createError) {
        console.error('❌ Error creating bucket:', createError.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

configureVideoStorage();
