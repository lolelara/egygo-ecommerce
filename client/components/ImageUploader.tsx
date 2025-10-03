import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { storageUtils, type UploadedFile } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export function ImageUploader({
  value = [],
  onChange,
  maxFiles = 5,
  disabled = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<{ url: string; fileId?: string }[]>(
    value.map((url) => ({
      url,
      fileId: storageUtils.extractFileId(url) || undefined,
    }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Check max files limit
    if (previews.length + files.length > maxFiles) {
      toast({
        title: "تحذير",
        description: `يمكنك رفع ${maxFiles} صور كحد أقصى`,
        variant: "destructive",
      });
      return;
    }

    // Validate files
    const validation = storageUtils.validateFiles(files);
    if (!validation.valid) {
      toast({
        title: "خطأ في الملفات",
        description: validation.errors.join("\n"),
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload files
      const uploadedFiles = await storageUtils.uploadFiles(files);

      // Add to previews
      const newPreviews = uploadedFiles.map((file) => ({
        url: file.url,
        fileId: file.fileId,
      }));

      const updatedPreviews = [...previews, ...newPreviews];
      setPreviews(updatedPreviews);

      // Call onChange with URLs
      onChange(updatedPreviews.map((p) => p.url));

      toast({
        title: "تم الرفع بنجاح",
        description: `تم رفع ${uploadedFiles.length} صورة بنجاح`,
      });
    } catch (error: any) {
      toast({
        title: "فشل الرفع",
        description: error.message || "حدث خطأ أثناء رفع الصور",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async (index: number) => {
    const preview = previews[index];

    // Try to delete from storage if fileId exists
    if (preview.fileId) {
      try {
        await storageUtils.deleteFile(preview.fileId);
      } catch (error) {
        console.error("Failed to delete file:", error);
        // Continue even if deletion fails
      }
    }

    // Remove from previews
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    onChange(updatedPreviews.map((p) => p.url));

    toast({
      title: "تم الحذف",
      description: "تم حذف الصورة بنجاح",
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          disabled={disabled || uploading || previews.length >= maxFiles}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading || previews.length >= maxFiles}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري الرفع...
            </>
          ) : (
            <>
              <Upload className="ml-2 h-4 w-4" />
              رفع صور ({previews.length}/{maxFiles})
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          الحد الأقصى: {maxFiles} صور، 5 ميجابايت لكل صورة (JPG, PNG, WEBP)
        </p>
      </div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <Card key={index} className="relative group">
              <div className="aspect-square">
                <img
                  src={preview.url}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />

                {/* Primary Badge */}
                {index === 0 && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    رئيسية
                  </Badge>
                )}

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(index)}
                  disabled={disabled || uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {previews.length === 0 && !uploading && (
        <Card className="border-dashed">
          <div className="p-8 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              لم يتم رفع صور بعد
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
