import sharp from 'sharp';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { loggers } from './logger';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
const processedDir = path.join(uploadsDir, 'processed');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Image processing options
interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

// Default processing options
const defaultOptions: ImageProcessingOptions = {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp',
  fit: 'cover'
};

// Process and compress image
export async function processImage(
  inputPath: string,
  outputPath: string,
  options: ImageProcessingOptions = {}
): Promise<{ success: boolean; outputPath?: string; error?: string; size?: { original: number; compressed: number } }> {
  try {
    const opts = { ...defaultOptions, ...options };
    
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;

    // Process image with Sharp
    let sharpInstance = sharp(inputPath);

    // Resize if dimensions are provided
    if (opts.width || opts.height) {
      sharpInstance = sharpInstance.resize(opts.width, opts.height, {
        fit: opts.fit,
        withoutEnlargement: true
      });
    }

    // Apply format-specific options
    switch (opts.format) {
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: opts.quality, progressive: true });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality: opts.quality, progressive: true });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: opts.quality });
        break;
      case 'avif':
        sharpInstance = sharpInstance.avif({ quality: opts.quality });
        break;
    }

    // Write processed image
    await sharpInstance.toFile(outputPath);

    // Get compressed file size
    const compressedStats = fs.statSync(outputPath);
    const compressedSize = compressedStats.size;

    // Log processing success
    loggers.info('Image processed successfully', {
      inputPath,
      outputPath,
      originalSize,
      compressedSize,
      compressionRatio: ((originalSize - compressedSize) / originalSize * 100).toFixed(2) + '%'
    });

    return {
      success: true,
      outputPath,
      size: {
        original: originalSize,
        compressed: compressedSize
      }
    };

  } catch (error) {
    loggers.error('Image processing failed', error, { inputPath, outputPath, options });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Generate multiple sizes for responsive images
export async function generateResponsiveImages(
  inputPath: string,
  baseName: string
): Promise<{ success: boolean; images?: Array<{ size: string; path: string; width: number; height: number }>; error?: string }> {
  try {
    const sizes = [
      { name: 'thumbnail', width: 150, height: 150 },
      { name: 'small', width: 400, height: 300 },
      { name: 'medium', width: 800, height: 600 },
      { name: 'large', width: 1200, height: 900 },
      { name: 'xlarge', width: 1920, height: 1080 }
    ];

    const processedImages = [];

    for (const size of sizes) {
      const outputPath = path.join(processedDir, `${baseName}-${size.name}.webp`);
      
      const result = await processImage(inputPath, outputPath, {
        width: size.width,
        height: size.height,
        format: 'webp',
        quality: 85,
        fit: 'cover'
      });

      if (result.success) {
        processedImages.push({
          size: size.name,
          path: outputPath,
          width: size.width,
          height: size.height
        });
      }
    }

    loggers.info('Responsive images generated', {
      inputPath,
      baseName,
      generatedCount: processedImages.length
    });

    return {
      success: true,
      images: processedImages
    };

  } catch (error) {
    loggers.error('Responsive image generation failed', error, { inputPath, baseName });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Clean up temporary files
export function cleanupTempFiles(filePaths: string[]): void {
  filePaths.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        loggers.debug('Temporary file cleaned up', { filePath });
      }
    } catch (error) {
      loggers.error('Failed to cleanup temporary file', error, { filePath });
    }
  });
}

// Get image metadata
export async function getImageMetadata(imagePath: string): Promise<{
  width: number;
  height: number;
  format: string;
  size: number;
  hasAlpha: boolean;
} | null> {
  try {
    const metadata = await sharp(imagePath).metadata();
    const stats = fs.statSync(imagePath);

    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: stats.size,
      hasAlpha: metadata.hasAlpha || false
    };
  } catch (error) {
    loggers.error('Failed to get image metadata', error, { imagePath });
    return null;
  }
}
