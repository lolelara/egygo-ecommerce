/**
 * Advanced Search Component
 * Features: Auto-complete, Search history, Popular searches, Filters
 */

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Filter, ArrowRight } from 'lucide-react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  text: string;
  category?: string;
  image?: string;
}

interface AdvancedSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function AdvancedSearch({
  onSearch,
  placeholder = "ابحث عن منتج...",
  className,
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularSearches] = useState<string[]>([
    'أيفون 15',
    'سامسونج جالاكسي',
    'لابتوب',
    'سماعات بلوتوث',
    'ساعة ذكية',
  ]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions (mock - replace with actual API call)
  useEffect(() => {
    if (query.length > 1) {
      // Simulate API call
      const mockSuggestions: SearchSuggestion[] = [
        { id: '1', text: 'أيفون 15 برو', category: 'موبايلات' },
        { id: '2', text: 'أيفون 15 برو ماكس', category: 'موبايلات' },
        { id: '3', text: 'سامسونج جالاكسي S24', category: 'موبايلات' },
        { id: '4', text: 'لابتوب HP', category: 'أجهزة كمبيوتر' },
        { id: '5', text: 'سماعات سوني', category: 'إلكترونيات' },
      ].filter(s => s.text.toLowerCase().includes(query.toLowerCase()));

      setSuggestions(mockSuggestions);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      if (query.length === 0) {
        setIsOpen(false);
      }
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add to history
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Perform search
    onSearch(searchQuery);
    setIsOpen(false);
    setQuery(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSearch(suggestions[activeIndex].text);
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const removeFromHistory = (item: string) => {
    const newHistory = searchHistory.filter(h => h !== item);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <EnhancedInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          icon={<Search className="h-4 w-4" />}
          clearable
          onClear={() => {
            setQuery('');
            setSuggestions([]);
          }}
          className="pr-24"
        />
        <Button
          size="sm"
          className="absolute left-2 top-1/2 -translate-y-1/2"
          onClick={() => handleSearch(query)}
        >
          بحث
        </Button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-3 py-2">اقتراحات</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSearch(suggestion.text)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-right hover:bg-accent transition-colors",
                    activeIndex === index && "bg-accent"
                  )}
                >
                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm">{suggestion.text}</div>
                    {suggestion.category && (
                      <div className="text-xs text-muted-foreground">{suggestion.category}</div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
                </button>
              ))}
            </div>
          )}

          {/* Search History */}
          {query.length === 0 && searchHistory.length > 0 && (
            <div className="p-2 border-t">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  عمليات بحث سابقة
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  مسح الكل
                </button>
              </div>
              {searchHistory.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-right hover:bg-accent transition-colors group"
                >
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="flex-1 text-sm">{item}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {query.length === 0 && suggestions.length === 0 && (
            <div className="p-2 border-t">
              <div className="text-xs text-muted-foreground px-3 py-2 flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                الأكثر بحثاً
              </div>
              <div className="flex flex-wrap gap-2 px-3 py-2">
                {popularSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleSearch(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query.length > 1 && suggestions.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">لا توجد نتائج لـ "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdvancedSearch;
