import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Link2, 
  Upload, 
  Code, 
  FileSpreadsheet, 
  Rss,
  Search,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { ID } from "appwrite";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { importProductFromUrl, bulkImportProducts } from "@/lib/intermediary-api";

export default function ProductImportTools() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // URL Import
  const [productUrl, setProductUrl] = useState("");
  const [markup, setMarkup] = useState("20");
  
  // API Import
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  
  // CSV Import
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  // Bulk URLs
  const [bulkUrls, setBulkUrls] = useState("");

  /**
   * Import from URL
   */
  const handleUrlImport = async () => {
    if (!productUrl) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال رابط المنتج",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // استخدام intermediary-api مباشرة
      const result = await importProductFromUrl(
        productUrl,
        parseFloat(markup)
      );

      if (!result.success) {
        throw new Error(result.error || 'فشل في استخراج بيانات المنتج');
      }

      // Product already saved by importProductFromUrl
      const productData = result.scrapedData;

      toast({
        title: "✅ تم الاستيراد",
        description: "تم إضافة المنتج بنجاح"
      });

      setProductUrl("");
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في استيراد المنتج",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Import from API
   */
  const handleApiImport = async () => {
    if (!apiEndpoint) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال رابط API",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(apiEndpoint, { headers });
      if (!response.ok) {
        throw new Error('فشل في الاتصال بـ API');
      }

      const products = await response.json();
      
      // Import products
      let imported = 0;
      for (const product of products) {
        try {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.products,
            ID.unique(),
            {
              name: product.name || product.title,
              description: product.description,
              price: product.price * (1 + parseFloat(markup) / 100),
              originalPrice: product.price,
              images: product.images || [product.image],
              category: product.category,
              intermediaryId: user?.$id,
              sourceApi: apiEndpoint,
              markup: parseFloat(markup),
              isActive: true,
              createdAt: new Date().toISOString()
            }
          );
          imported++;
        } catch (err) {
          console.error('Error importing product:', err);
        }
      }

      toast({
        title: "✅ تم الاستيراد",
        description: `تم استيراد ${imported} منتج بنجاح`
      });

      setApiEndpoint("");
      setApiKey("");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في الاستيراد من API",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Import from CSV
   */
  const handleCsvImport = async () => {
    if (!csvFile) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار ملف CSV",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const text = await csvFile.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      let imported = 0;
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const product: any = {};
        
        headers.forEach((header, index) => {
          product[header.trim()] = values[index]?.trim();
        });

        try {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.products,
            ID.unique(),
            {
              name: product.name,
              description: product.description || '',
              price: parseFloat(product.price) * (1 + parseFloat(markup) / 100),
              originalPrice: parseFloat(product.price),
              images: product.images ? product.images.split('|') : [],
              category: product.category || 'general',
              intermediaryId: user?.$id,
              markup: parseFloat(markup),
              isActive: true,
              createdAt: new Date().toISOString()
            }
          );
          imported++;
        } catch (err) {
          console.error('Error importing product:', err);
        }
      }

      toast({
        title: "✅ تم الاستيراد",
        description: `تم استيراد ${imported} منتج من CSV`
      });

      setCsvFile(null);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "فشل في قراءة ملف CSV",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Bulk URL Import
   */
  const handleBulkImport = async () => {
    if (!bulkUrls.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال روابط المنتجات",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const urls = bulkUrls.split('\n').filter(url => url.trim());
    let imported = 0;

    try {
      for (const url of urls) {
        try {
          const response = await fetch('/api/scrape-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              url: url.trim(),
              markup: parseFloat(markup)
            })
          });

          if (response.ok) {
            const productData = await response.json();
            
            await databases.createDocument(
              appwriteConfig.databaseId,
              appwriteConfig.collections.products,
              ID.unique(),
              {
                ...productData,
                intermediaryId: user?.$id,
                sourceUrl: url.trim(),
                markup: parseFloat(markup),
                isActive: true,
                createdAt: new Date().toISOString()
              }
            );
            imported++;
          }
        } catch (err) {
          console.error('Error importing URL:', url, err);
        }
      }

      toast({
        title: "✅ تم الاستيراد",
        description: `تم استيراد ${imported} من ${urls.length} منتج`
      });

      setBulkUrls("");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "فشل في الاستيراد الجماعي",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          استيراد المنتجات
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          اختر طريقة لاستيراد المنتجات من مصادر خارجية
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="url">
              <Link2 className="h-4 w-4 mr-1" />
              رابط
            </TabsTrigger>
            <TabsTrigger value="api">
              <Code className="h-4 w-4 mr-1" />
              API
            </TabsTrigger>
            <TabsTrigger value="csv">
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              CSV
            </TabsTrigger>
            <TabsTrigger value="bulk">
              <Upload className="h-4 w-4 mr-1" />
              جماعي
            </TabsTrigger>
            <TabsTrigger value="rss">
              <Rss className="h-4 w-4 mr-1" />
              RSS
            </TabsTrigger>
          </TabsList>

          {/* URL Import */}
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>رابط المنتج</Label>
                <Input
                  placeholder="https://example.com/product/123"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  الصق رابط المنتج من أي متجر إلكتروني
                </p>
              </div>

              <div>
                <Label>نسبة الترميز (%)</Label>
                <Input
                  type="number"
                  placeholder="20"
                  value={markup}
                  onChange={(e) => setMarkup(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  النسبة التي ستضاف على السعر الأصلي
                </p>
              </div>

              <Button 
                onClick={handleUrlImport} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    جاري الاستيراد...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    استخراج وإضافة المنتج
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* API Import */}
          <TabsContent value="api" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>رابط API</Label>
                <Input
                  placeholder="https://api.example.com/products"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                />
              </div>

              <div>
                <Label>API Key (اختياري)</Label>
                <Input
                  type="password"
                  placeholder="your-api-key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div>
                <Label>نسبة الترميز (%)</Label>
                <Input
                  type="number"
                  placeholder="20"
                  value={markup}
                  onChange={(e) => setMarkup(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleApiImport} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    جاري الاستيراد...
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    استيراد من API
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* CSV Import */}
          <TabsContent value="csv" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>ملف CSV</Label>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  يجب أن يحتوي الملف على: name, description, price, images, category
                </p>
              </div>

              <div>
                <Label>نسبة الترميز (%)</Label>
                <Input
                  type="number"
                  placeholder="20"
                  value={markup}
                  onChange={(e) => setMarkup(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleCsvImport} 
                disabled={loading || !csvFile}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    جاري الاستيراد...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    استيراد من CSV
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Bulk Import */}
          <TabsContent value="bulk" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>روابط المنتجات (كل رابط في سطر)</Label>
                <Textarea
                  placeholder="https://example.com/product/1&#10;https://example.com/product/2&#10;https://example.com/product/3"
                  rows={8}
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                />
              </div>

              <div>
                <Label>نسبة الترميز (%)</Label>
                <Input
                  type="number"
                  placeholder="20"
                  value={markup}
                  onChange={(e) => setMarkup(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleBulkImport} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    جاري الاستيراد...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    استيراد جماعي
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* RSS Feed */}
          <TabsContent value="rss" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <Rss className="h-4 w-4 inline mr-1" />
                  قريباً: الاشتراك في RSS Feeds للتحديث التلقائي
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
