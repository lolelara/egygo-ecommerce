import { useState, useRef } from "react";
import { Upload, X, PlayCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { storage, appwriteConfig } from "@/lib/appwrite";
import { ID } from "appwrite";
import { Progress } from "./ui/progress";

interface VideoUploaderProps {
  value?: string;
  onChange: (videoUrl: string) => void;
  label?: string;
  required?: boolean;
}

export default function VideoUploader({
  value,
  onChange,
  label = "فيديو التحقق من المنتج",
  required = false,
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("يرجى اختيار ملف فيديو صحيح");
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError("حجم الفيديو يجب أن يكون أقل من 50 ميجابايت");
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload to Appwrite Storage
      const response = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );

      // Get file URL
      const fileUrl = `${response.$id}`;
      
      onChange(fileUrl);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 500);
    } catch (err) {
      console.error("Error uploading video:", err);
      setError("فشل رفع الفيديو. حاول مرة أخرى");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getVideoUrl = (fileId: string) => {
    if (!fileId) return "";
    if (fileId.startsWith("http")) return fileId;
    return `https://cloud.appwrite.io/v1/storage/buckets/${appwriteConfig.storageId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        <span className="text-xs text-muted-foreground">
          حد أقصى: 50 ميجابايت
        </span>
      </div>

      {!value ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            uploading
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary"
          }`}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <div className="space-y-2">
                <p className="text-sm font-medium">جاري رفع الفيديو...</p>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {uploadProgress}%
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">اضغط لرفع فيديو التحقق</p>
                <p className="text-xs text-muted-foreground mt-1">
                  MP4, MOV, AVI, WebM (حد أقصى 50MB)
                </p>
              </div>
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                ℹ️ يجب أن يُظهر الفيديو المنتج بوضوح مع جميع التفاصيل المذكورة في
                الوصف
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">تم رفع الفيديو</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <video
            src={getVideoUrl(value)}
            controls
            className="w-full rounded-lg max-h-64"
          >
            المتصفح لا يدعم عرض الفيديو
          </video>

          <p className="text-xs text-muted-foreground">
            ✅ تم رفع الفيديو بنجاح. المنتج سيكون قيد المراجعة حتى تتم الموافقة
            عليه من قبل الإدارة.
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
        <p className="font-semibold mb-1">📹 متطلبات الفيديو:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>تصوير واضح للمنتج من جميع الزوايا</li>
          <li>إظهار جميع التفاصيل والمواصفات المذكورة في الوصف</li>
          <li>إظهار العلامة التجارية والباركود (إن وُجد)</li>
          <li>التأكد من جودة الصوت والصورة</li>
          <li>مدة الفيديو: 30 ثانية إلى 3 دقائق</li>
        </ul>
      </div>
    </div>
  );
}
