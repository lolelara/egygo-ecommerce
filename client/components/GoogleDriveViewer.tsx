import { Download, ExternalLink, FolderOpen, FileText, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GoogleDriveViewerProps {
    links: string[];
}

export function GoogleDriveViewer({ links }: GoogleDriveViewerProps) {
    if (!links || links.length === 0) return null;

    const getDriveId = (url: string) => {
        const match = url.match(/[-\w]{25,}/);
        return match ? match[0] : null;
    };

    const isFolder = (url: string) => url.includes("folders");

    return (
        <Card className="mt-6 border-blue-100 bg-blue-50/50 dark:bg-blue-950/10 dark:border-blue-900">
            <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <FolderOpen className="w-5 h-5" />
                    ملفات الميديا (Google Drive)
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                    {links.map((link, index) => {
                        const isDriveFolder = isFolder(link);
                        const driveId = getDriveId(link);

                        return (
                            <div key={index} className="group relative bg-white dark:bg-slate-900 p-4 rounded-lg border hover:shadow-md transition-all flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isDriveFolder ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {isDriveFolder ? <FolderOpen className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
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

                                {/* Preview for Folders (Embedded View) */}
                                {isDriveFolder && driveId && (
                                    <div className="aspect-video w-full bg-slate-100 rounded-md overflow-hidden border relative">
                                        <iframe
                                            src={`https://drive.google.com/embeddedfolderview?id=${driveId}#list`}
                                            className="w-full h-full border-0"
                                            title={`Drive Folder ${index + 1}`}
                                            loading="lazy"
                                        />
                                        {/* Overlay to prevent interaction issues if needed, or just let it be interactive */}
                                    </div>
                                )}

                                <Button variant="secondary" className="w-full mt-auto gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                                    <a href={link} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4" />
                                        فتح في Google Drive
                                    </a>
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
