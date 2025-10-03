import { storage } from "./appwrite";
import { ID } from "appwrite";

const BUCKET_ID = "product-images";

export interface UploadedFile {
  fileId: string;
  url: string;
  name: string;
  size: number;
}

export const storageUtils = {
  /**
   * Upload a single file to Appwrite Storage
   */
  uploadFile: async (file: File): Promise<UploadedFile> => {
    try {
      const fileId = ID.unique();
      const uploadedFile = await storage.createFile(
        BUCKET_ID,
        fileId,
        file
      );

      // Get the file URL
      const fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id);

      return {
        fileId: uploadedFile.$id,
        url: fileUrl.toString(),
        name: uploadedFile.name,
        size: uploadedFile.sizeOriginal,
      };
    } catch (error: any) {
      console.error("Error uploading file:", error);
      throw new Error(error.message || "فشل رفع الملف");
    }
  },

  /**
   * Upload multiple files
   */
  uploadFiles: async (files: File[]): Promise<UploadedFile[]> => {
    try {
      const uploadPromises = files.map((file) => storageUtils.uploadFile(file));
      return await Promise.all(uploadPromises);
    } catch (error: any) {
      console.error("Error uploading files:", error);
      throw new Error(error.message || "فشل رفع الملفات");
    }
  },

  /**
   * Delete a file from storage
   */
  deleteFile: async (fileId: string): Promise<void> => {
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
    } catch (error: any) {
      console.error("Error deleting file:", error);
      throw new Error(error.message || "فشل حذف الملف");
    }
  },

  /**
   * Delete multiple files
   */
  deleteFiles: async (fileIds: string[]): Promise<void> => {
    try {
      const deletePromises = fileIds.map((fileId) => 
        storageUtils.deleteFile(fileId)
      );
      await Promise.all(deletePromises);
    } catch (error: any) {
      console.error("Error deleting files:", error);
      throw new Error(error.message || "فشل حذف الملفات");
    }
  },

  /**
   * Get file URL from fileId
   */
  getFileUrl: (fileId: string): string => {
    return storage.getFileView(BUCKET_ID, fileId).toString();
  },

  /**
   * Extract fileId from URL
   * URL format: https://fra.cloud.appwrite.io/v1/storage/buckets/product-images/files/{fileId}/view
   */
  extractFileId: (url: string): string | null => {
    try {
      const match = url.match(/files\/([^\/]+)\/view/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  },

  /**
   * Validate file before upload
   */
  validateFile: (file: File): { valid: boolean; error?: string } => {
    // Max 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "حجم الملف يجب أن يكون أقل من 5 ميجابايت",
      };
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "نوع الملف غير مدعوم. يرجى رفع صورة (JPG, PNG, WEBP)",
      };
    }

    return { valid: true };
  },

  /**
   * Validate multiple files
   */
  validateFiles: (files: File[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    files.forEach((file, index) => {
      const result = storageUtils.validateFile(file);
      if (!result.valid && result.error) {
        errors.push(`ملف ${index + 1}: ${result.error}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};
