import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { ProductCardPremium as ProductCard } from '@/components/ProductCardPremium';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Loader2, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        if (debouncedQuery) {
            performSearch(debouncedQuery);
        } else {
            setResults([]);
            setHasSearched(false);
        }
    }, [debouncedQuery]);

    const performSearch = async (searchTerm: string) => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        setHasSearched(true);

        // Update URL
        setSearchParams({ q: searchTerm });

        try {
            // Search by name
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.collections.products,
                [
                    Query.search('name', searchTerm),
                    Query.limit(20)
                ]
            );

            setResults(response.documents);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setHasSearched(false);
        setSearchParams({});
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-[80vh]">
            <div className="max-w-2xl mx-auto mb-8">
                <h1 className="text-3xl font-bold mb-6 text-center">بحث المنتجات</h1>
                <div className="relative flex gap-2">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="ابحث عن منتج..."
                            className="pr-10 h-12 text-lg"
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={clearSearch}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    <Button
                        onClick={() => performSearch(query)}
                        disabled={loading || !query.trim()}
                        className="h-12 px-6"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'بحث'}
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    {hasSearched && results.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <SearchIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
                            <p className="text-xl">لا توجد نتائج لـ "{query}"</p>
                            <p className="mt-2">جرب كلمات مختلفة أو تأكد من الإملاء</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {results.map((product) => (
                                <ProductCard key={product.$id} product={product} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
