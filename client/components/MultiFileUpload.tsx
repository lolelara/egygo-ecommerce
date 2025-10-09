import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  File, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Music,
  Archive,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  uploadedUrl?: string;
}

interface MultiFileUploadProps {
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  onUpload?: (files: UploadFile[]) => Promise<void>;
  onRemove?: (fileId: string) => void;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  uploadEndpoint?: string;
}

export function MultiFileUpload({
  accept = '*/*',
  maxFiles = 10,
  maxSize = 10,
  onUpload,
  onRemove,
  className,
  disabled = false,
  showPreview = true,
  uploadEndpoint = '/api/upload'
}: MultiFileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Generate file preview
  const generatePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve('');
      }
    });
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `حجم الملف يجب أن يكون أقل من ${maxSize}MB`;
    }
    
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;
      
      const isAccepted = acceptedTypes.some(type => 
        type === mimeType || 
        type === fileExtension ||
        (type.endsWith('/*') && mimeType.startsWith(type.slice(0, -1)))
      );
      
      if (!isAccepted) {
        return `نوع الملف غير مدعوم. الأنواع المقبولة: ${accept}`;
      }
    }
    
    return null;
  };

  // Add files
  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: UploadFile[] = [];
    
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "خطأ في الملف",
          description: `${file.name}: ${error}`,
          variant: "destructive"
        });
        continue;
      }
      
      const preview = await generatePreview(file);
      const uploadFile: UploadFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        preview,
        progress: 0,
        status: 'pending'
      };
      
      validFiles.push(uploadFile);
    }
    
    setFiles(prev => {
      const updated = [...prev, ...validFiles];
      if (updated.length > maxFiles) {
        toast({
          title: "تحذير",
          description: `يمكن رفع ${maxFiles} ملفات كحد أقصى`,
          variant: "destructive"
        });
        return updated.slice(0, maxFiles);
      }
      return updated;
    });
  }, [maxFiles, maxSize, accept, toast]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [disabled, addFiles]);

  // Remove file
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    onRemove?.(fileId);
  };

  // Upload files
  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const uploadPromises = files.map(async (uploadFile) => {
        if (uploadFile.status === 'completed') return uploadFile;
        
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'uploading' as const }
            : f
        ));
        
        try {
          const formData = new FormData();
          formData.append('file', uploadFile.file);
          
          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setFiles(prev => prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, progress: Math.min(f.progress + 10, 90) }
                : f
            ));
          }, 200);
          
          // Mock upload - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          clearInterval(progressInterval);
          
          const uploadedUrl = URL.createObjectURL(uploadFile.file);
          
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { 
                  ...f, 
                  status: 'completed' as const, 
                  progress: 100,
                  uploadedUrl
                }
              : f
          ));
          
          return { ...uploadFile, status: 'completed' as const, uploadedUrl };
        } catch (error) {
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { 
                  ...f, 
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'فشل في الرفع'
                }
              : f
          ));
          throw error;
        }
      });
      
      await Promise.allSettled(uploadPromises);
      await onUpload?.(files);
      
      toast({
        title: "نجح",
        description: "تم رفع الملفات بنجاح"
      });
      
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في رفع بعض الملفات",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Get file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (file.type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (file.type.includes('zip') || file.type.includes('rar')) return <Archive className="w-5 h-5" />;
    if (file.type.includes('pdf') || file.type.includes('document')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Upload className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isDragOver ? 'أفلت الملفات هنا' : 'اسحب الملفات أو انقر للرفع'}
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            يمكنك رفع حتى {maxFiles} ملفات بحجم {maxSize}MB لكل ملف
          </p>
          <Button variant="outline" disabled={disabled}>
            <Upload className="w-4 h-4 mr-2" />
            اختيار الملفات
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">الملفات المحددة ({files.length})</h4>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiles([])}
                disabled={isUploading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                مسح الكل
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={isUploading || files.every(f => f.status === 'completed')}
              >
                {isUploading ? 'جاري الرفع...' : 'رفع الملفات'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {files.map((uploadFile) => (
              <Card key={uploadFile.id} className="p-4">
                <div className="flex items-start space-x-3">
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {uploadFile.preview ? (
                      <img
                        src={uploadFile.preview}
                        alt={uploadFile.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        {getFileIcon(uploadFile.file)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">
                        {uploadFile.file.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        disabled={isUploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge
                        variant={
                          uploadFile.status === 'completed' ? 'default' :
                          uploadFile.status === 'error' ? 'destructive' :
                          uploadFile.status === 'uploading' ? 'secondary' :
                          'outline'
                        }
                      >
                        {uploadFile.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {uploadFile.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {uploadFile.status === 'uploading' && 'جاري الرفع...'}
                        {uploadFile.status === 'pending' && 'في الانتظار'}
                        {uploadFile.status === 'completed' && 'مكتمل'}
                        {uploadFile.status === 'error' && 'خطأ'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(uploadFile.file.size)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="h-2" />
                    )}

                    {/* Error Message */}
                    {uploadFile.status === 'error' && uploadFile.error && (
                      <p className="text-xs text-destructive">{uploadFile.error}</p>
                    )}

                    {/* Actions */}
                    {uploadFile.status === 'completed' && uploadFile.uploadedUrl && (
                      <div className="flex space-x-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(uploadFile.uploadedUrl, '_blank')}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          معاينة
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = uploadFile.uploadedUrl!;
                            a.download = uploadFile.file.name;
                            a.click();
                          }}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          تحميل
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized image upload component
export function ImageUpload({
  maxFiles = 5,
  maxSize = 5,
  ...props
}: Omit<MultiFileUploadProps, 'accept'>) {
  return (
    <MultiFileUpload
      accept="image/*"
      maxFiles={maxFiles}
      maxSize={maxSize}
      showPreview={true}
      {...props}
    />
  );
}

// Specialized document upload component
export function DocumentUpload({
  maxFiles = 10,
  maxSize = 10,
  ...props
}: Omit<MultiFileUploadProps, 'accept'>) {
  return (
    <MultiFileUpload
      accept=".pdf,.doc,.docx,.txt,.rtf"
      maxFiles={maxFiles}
      maxSize={maxSize}
      showPreview={false}
      {...props}
    />
  );
}

