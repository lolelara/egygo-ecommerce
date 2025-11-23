import { Download, ExternalLink, FolderOpen, FileText, Image as ImageIcon, Video, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface GoogleDriveViewerProps {
    links: string[];
}

export function GoogleDriveViewer({ links }: GoogleDriveViewerProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());

    if (!links || links.length === 0) return null;

    const getDriveId = (url: string) => {
        // Extract ID from various Google Drive URL formats
        const patterns = [
            /\/folders\/([a-zA-Z0-9_-]+)/,
            /\/file\/d\/([a-zA-Z0-9_-]+)/,
            /id=([a-zA-Z0-9_-]+)/,
            /[-\w]{25,}/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1] || match[0];
        }
        return null;
    };

    const isFolder = (url: string) => url.includes("folders") || url.includes("folder");

    const getEmbedUrl = (url: string, driveId: string | null) => {
        if (!driveId) return null;

        if (isFolder(url)) {
            // For folders, use the embedded folder view
            return `https://drive.google.com/embeddedfolderview?id=${driveId}#grid`;
        } else {
            // For files, use preview
            return `https://drive.google.com/file/d/${driveId}/preview`;
        }
    };

    const toggleFolder = (index: number) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <Card className="mt-6 border-blue-100 bg-blue-50/50 dark:bg-blue-950/10 dark:border-blue-900">
            <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <FolderOpen className="w-5 h-5" />
                    ملفات الميديا (Google Drive)
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                    {links.map((link, index) => {
                        const isDriveFolder = isFolder(link);
                        const driveId = getDriveId(link);
                        const embedUrl = getEmbedUrl(link, driveId);
                        const isExpanded = expandedFolders.has(index);

                        return (
                            <div key={index} className="group relative bg-white dark:bg-slate-900 p-4 rounded-lg border hover:shadow-md transition-all flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isDriveFolder ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {isDriveFolder ? <FolderOpen className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm line-clamp-1">
                                                {isDriveFolder ? `مجلد ميديا ${index + 1}` : `ملف ميديا ${index + 1}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Google Drive</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="bg-transparent">
                                        {isDriveFolder ? "مجلد" : "ملف"}
                                    </Badge>
                                </div>

                                {/* Preview Section */}
                                {embedUrl && (
                                    <div className="space-y-2">
                                        {isDriveFolder && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleFolder(index)}
                                                className="w-full justify-start gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                {isExpanded ? "إخفاء المحتويات" : "عرض المحتويات"}
                                            </Button>
                                        )}

                                        {(isExpanded || !isDriveFolder) && (
                                            <div className="aspect-video w-full bg-slate-100 rounded-md overflow-hidden border relative">
                                                <iframe
                                                    src={embedUrl}
                                                    className="w-full h-full border-0"
                                                    title={`Drive ${isDriveFolder ? 'Folder' : 'File'} ${index + 1}`}
                                                    loading="lazy"
                                                    allow="autoplay"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        className="flex-1 gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                        asChild
                                    >
                                        <a href={link} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4" />
                                            فتح في Drive
                                        </a>
                                    </Button>

                                    {embedUrl && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            asChild
                                        >
                                            <a href={embedUrl} target="_blank" rel="noopener noreferrer" title="معاينة">
                                                <Eye className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Help Text */}
                <p className="text-xs text-muted-foreground mt-4 text-center">
                    💡 تلميح: اضغط على "عرض المحتويات" لعرض الملفات داخل المجلد
                </p>
            </CardContent>
        </Card>
    );
}
