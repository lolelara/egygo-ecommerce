
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cmsApi, type Page } from "@/lib/cms-api";
import { PageLoader } from "@/components/ui/loading-screen";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PageViewer() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [page, setPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            loadPage(slug);
        }
    }, [slug]);

    const loadPage = async (pageSlug: string) => {
        setLoading(true);
        try {
            const data = await cmsApi.getPageBySlug(pageSlug);
            if (data && data.isPublished) {
                setPage(data);
                // Update document title
                document.title = `${data.title} | EgyGo`;
            } else {
                setPage(null);
            }
        } catch (error) {
            console.error("Error loading page:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <PageLoader />;
    }

    if (!page) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        الصفحة التي تبحث عنها غير موجودة
                    </p>
                    <Button onClick={() => navigate("/")}>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        العودة للرئيسية
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container py-12 max-w-4xl mx-auto">
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold tracking-tight mb-8">{page.title}</h1>

                    <div
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </article>
            </main>

            <Footer />
        </div>
    );
}
