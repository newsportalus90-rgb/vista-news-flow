import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, Calendar, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  className?: string;
}

interface SearchFilters {
  category?: string;
  dateRange?: string;
  author?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const categories = [
    'World', 'Business', 'Technology', 'Sports', 
    'Entertainment', 'Health', 'Politics', 'Science'
  ];

  const dateRanges = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'This Year', value: 'year' }
  ];

  const handleSearch = () => {
    onSearch?.(query, filters);
  };

  const clearFilters = () => {
    setFilters({});
    setQuery('');
  };

  const removeFilter = (filterType: keyof SearchFilters) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: undefined
    }));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search breaking news, articles, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 h-12"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={handleSearch}
          className="h-12 px-6"
        >
          Search
        </Button>
      </div>

      {/* Active Filters */}
      {(filters.category || filters.dateRange || filters.author) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('category')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.dateRange && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              {dateRanges.find(d => d.value === filters.dateRange)?.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('dateRange')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.author && (
            <Badge variant="secondary" className="gap-1">
              Author: {filters.author}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('author')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Categories */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={filters.category === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        category: prev.category === category ? undefined : category
                      }))}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </label>
                <div className="space-y-1">
                  {dateRanges.map((range) => (
                    <Button
                      key={range.value}
                      variant={filters.dateRange === range.value ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        dateRange: prev.dateRange === range.value ? undefined : range.value
                      }))}
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input
                  placeholder="Search by author name..."
                  value={filters.author || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    author: e.target.value || undefined
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};