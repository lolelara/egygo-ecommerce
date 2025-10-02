import React, { useState, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import AppwriteService from '@/lib/appwrite';

interface ImageUploadProps {
  onUpload: (fileId: string, url: string) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
  className?: string;
}

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  fileId?: string;
  url?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  maxFiles = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  disabled = false,
  className = ''
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `نوع الملف غير مدعوم. الأنواع المدعومة: ${acceptedTypes.join(', ')}`;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      return 'حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت';
    }
    return null;
  };

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadFile[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const validation = validateFile(file);
      
      if (validation) {
        toast.error(validation);
        continue;
      }

      if (files.length + newFiles.length >= maxFiles) {
        toast.error(`لا يمكن رفع أكثر من ${maxFiles} صور`);
        break;
      }

      const uploadFile: UploadFile = {
        id: `${Date.now()}-${i}`,
        file,
        preview: URL.createObjectURL(file),
        uploading: false,
        uploaded: false
      };

      newFiles.push(uploadFile);
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      // Start uploading automatically
      newFiles.forEach(uploadFile);
    }
  }, [files.length, maxFiles]);

  const uploadFile = async (uploadFile: UploadFile) => {
    setFiles(prev => prev.map(f => 
      f.id === uploadFile.id ? { ...f, uploading: true } : f
    ));

    try {
      const result = await AppwriteService.uploadFile(uploadFile.file);
      const fileUrl = AppwriteService.getFilePreview(result.$id);

      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { 
              ...f, 
              uploading: false, 
              uploaded: true, 
              fileId: result.$id,
              url: fileUrl.toString()
            } 
          : f
      ));

      onUpload(result.$id, fileUrl.toString());
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { 
              ...f, 
              uploading: false, 
              error: 'فشل في رفع الصورة'
            } 
          : f
      ));
      toast.error('فشل في رفع الصورة');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }, [processFiles, disabled]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  }, [processFiles, disabled]);

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const retryUpload = (file: UploadFile) => {
    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, error: undefined } : f
    ));
    uploadFile(file);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary hover:bg-primary/5'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          اضغط لرفع الصور أو اسحبها هنا
        </p>
        <p className="text-sm text-gray-500">
          PNG, JPG, WEBP حتى {maxFiles} صور، حد أقصى 10 ميجابايت لكل صورة
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.id} className="relative group">
              <div className="aspect-square rounded-lg border overflow-hidden bg-gray-50">
                <img
                  src={file.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Remove button */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-3 w-3" />
                </Button>

                {/* Status overlay */}
                {file.uploading && (
                  <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-xs">جاري الرفع...</p>
                    </div>
                  </div>
                )}

                {file.error && (
                  <div className="absolute inset-0 bg-red-50/90 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-red-600 mb-2">{file.error}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryUpload(file)}
                        className="h-6 text-xs"
                      >
                        إعادة المحاولة
                      </Button>
                    </div>
                  </div>
                )}

                {file.uploaded && (
                  <div className="absolute top-2 left-2">
                    <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};