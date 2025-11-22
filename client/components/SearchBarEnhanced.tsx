import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '@/lib/api';

interface SearchSuggestion {
    id: string;
    text: string;
    type: 'product' | 'category' | 'brand';
    image?: string;
    price?: number;
}

interface SearchBarEnhancedProps {
    onSearch?: (query: string) => void;
    suggestions?: SearchSuggestion[];
    recentSearches?: string[];
    popularSearches?: string[];
    isLoading?: boolean;
}



export function SearchBarEnhanced({
    onSearch,
    suggestions = [],
    recentSearches = [],
    popularSearches = ['iPhone 15', 'سماعات بلوتوث', 'لابتوب ديل', 'ساعة ذكية'],
    isLoading = false,
}: SearchBarEnhancedProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [trendingSearches, setTrendingSearches] = useState<string[]>(popularSearches);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch trending searches
        const fetchTrending = async () => {
            try {
                const terms = await productsApi.getTrendingSearchTerms();
                if (terms && terms.length > 0) {
                    setTrendingSearches(terms);
                }
            } catch (error) {
                console.error('Failed to fetch trending searches:', error);
            }
        };

        fetchTrending();

        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            onSearch?.(searchQuery);
            setShowSuggestions(false);
            setIsFocused(false);

            // Save to recent searches (localStorage)
            const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
            const updated = [searchQuery, ...recent.filter((s: string) => s !== searchQuery)].slice(0, 5);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(query);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    const clearSearch = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    const displaySuggestions = query.length > 0 ? suggestions : [];
    const showRecent = query.length === 0 && recentSearches.length > 0;
    const showPopular = query.length === 0 && !showRecent && popularSearches.length > 0;

    return (
        <div ref={searchRef} className="relative w-full max-w-2xl">
            {/* Search Input */}
            <motion.div
                animate={{
                    scale: isFocused ? 1.02 : 1,
                    boxShadow: isFocused
                        ? '0 10px 40px -10px rgba(147, 51, 234, 0.3)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                transition={{ duration: 0.2 }}
                className="relative"
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                        setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="ابحث عن منتجات، فئات، أو علامات تجارية..."
                    className="w-full pr-12 pl-12 py-4 rounded-2xl border-2 border-gray-200
                     focus:border-purple-500 focus:outline-none transition-all duration-200
                     text-lg bg-white placeholder:text-gray-400"
                />

                {/* Search Icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Search className={`w-6 h-6 transition-colors ${isFocused ? 'text-purple-600' : 'text-gray-400'
                        }`} />
                </div>

                {/* Clear Button / Loading */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    {isLoading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full"
                        />
                    ) : query.length > 0 ? (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={clearSearch}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300
                         flex items-center justify-center transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </motion.button>
                    ) : null}
                </div>
            </motion.div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
                {showSuggestions && (isFocused || query.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl
                       shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto"
                    >
                        {/* Product Suggestions */}
                        {displaySuggestions.length > 0 && (
                            <div className="p-4">
                                <h4 className="text-sm font-semibold text-gray-500 mb-3 px-2">
                                    نتائج البحث
                                </h4>
                                <div className="space-y-1">
                                    {displaySuggestions.map((suggestion, index) => (
                                        <motion.button
                                            key={suggestion.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            onClick={() => {
                                                setQuery(suggestion.text);
                                                handleSearch(suggestion.text);
                                            }}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl
                                 hover:bg-gradient-to-r hover:from-purple-50 hover:to-orange-50
                                 transition-all duration-200 text-right group"
                                        >
                                            {suggestion.image && (
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={suggestion.image}
                                                        alt={suggestion.text}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 truncate">
                                                    {suggestion.text}
                                                </p>
                                                {suggestion.price && (
                                                    <p className="text-sm text-purple-600 font-semibold">
                                                        {suggestion.price.toLocaleString('ar-EG')} جنيه
                                                    </p>
                                                )}
                                            </div>

                                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-purple-600 
                                          group-hover:-translate-x-1 transition-all flex-shrink-0" />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Searches */}
                        {showRecent && (
                            <div className="p-4 border-t border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-500 mb-3 px-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    عمليات بحث سابقة
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((search, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => {
                                                setQuery(search);
                                                handleSearch(search);
                                            }}
                                            className="px-4 py-2 bg-gray-100 hover:bg-purple-100 rounded-full
                                 text-sm font-medium text-gray-700 hover:text-purple-600
                                 transition-colors"
                                        >
                                            {search}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Popular Searches */}
                        {showPopular && (
                            <div className="p-4 border-t border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-500 mb-3 px-2 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    عمليات بحث شائعة
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((search, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => {
                                                setQuery(search);
                                                handleSearch(search);
                                            }}
                                            className="px-4 py-2 bg-gradient-to-r from-purple-50 to-orange-50
                                 hover:from-purple-100 hover:to-orange-100 rounded-full
                                 text-sm font-medium text-purple-600
                                 transition-all border border-purple-200"
                                        >
                                            {search}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {query.length > 0 && displaySuggestions.length === 0 && !isLoading && (
                            <div className="p-8 text-center">
                                <p className="text-gray-500 mb-2">لا توجد نتائج لـ "{query}"</p>
                                <p className="text-sm text-gray-400">جرب كلمات بحث مختلفة</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
