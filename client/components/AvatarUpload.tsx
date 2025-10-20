import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/appwrite-client';
import { ID } from 'appwrite';

interface AvatarUploadProps {
  currentAvatar?: string;
  onUploadComplete: (fileId: string, url: string) => void;
  userName: string;
}

export default function AvatarUpload({
  currentAvatar,
  onUploadComplete,
  userName
}: AvatarUploadProps) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'خطأ',
        description: 'الرجاء اختيار صورة',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'خطأ',
        description: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت',
        variant: 'destructive'
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    setUploading(true);
    try {
      const file = fileInputRef.current.files[0];
      
      // Upload to Appwrite Storage
      const response = await storage.createFile(
        'avatars', // bucket ID
        ID.unique(),
        file
      );

      const fileUrl = storage.getFileView('avatars', response.$id);
      
      onUploadComplete(response.$id, fileUrl.toString());
      
      toast({
        title: 'نجح',
        description: 'تم رفع الصورة بنجاح'
      });
      
      setOpen(false);
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل رفع الصورة',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div className="relative inline-block">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentAvatar} alt={userName} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-lg"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفع صورة شخصية</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {preview && (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 ml-2" />
                    رفع الصورة
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setPreview(null);
                }}
              >
                <X className="h-4 w-4 ml-2" />
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
