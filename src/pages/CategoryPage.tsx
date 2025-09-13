import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArticleCard } from '@/components/news/ArticleCard';
import { Article, Category } from '@/types';
import { ArrowLeft, Filter, Grid, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ITEMS_PER_PAGE = 12;

// Category mapping for direct routes
const CATEGORY_MAPPING: Record<string, string> = {
  '/world': 'world',
  '/business': 'business', 
  '/technology': 'technology',
  '/sports': 'sports',
  '/entertainment': 'entertainment',
  '/opinion': 'opinion'
};

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  
  // Determine the actual category slug
  const categorySlug = slug || CATEGORY_MAPPING[location.pathname];
  
  // Fallback category data for when database category doesn't exist
  const getFallbackCategory = (slug: string): Category => {
    const categoryNames: Record<string, { name: string; description: string; color: string }> = {
      'world': { 
        name: 'World', 
        description: 'Global news and international affairs',
        color: '#3B82F6'
      },
      'business': { 
        name: 'Business', 
        description: 'Financial markets, economy, and corporate news',
        color: '#10B981'
      },
      'technology': { 
        name: 'Technology', 
        description: 'Latest tech innovations, gadgets, and digital trends',
        color: '#8B5CF6'
      },
      'sports': { 
        name: 'Sports', 
        description: 'Sports news, scores, and athletic achievements',
        color: '#F59E0B'
      },
      'entertainment': { 
        name: 'Entertainment', 
        description: 'Movies, music, celebrities, and pop culture',
        color: '#EF4444'
      },
      'opinion': { 
        name: 'Opinion', 
        description: 'Editorial pieces, analysis, and expert commentary',
        color: '#6366F1'
      }
    };
    
    const categoryInfo = categoryNames[slug] || { 
      name: slug.charAt(0).toUpperCase() + slug.slice(1), 
      description: `Latest ${slug} news and updates`,
      color: '#3B82F6'
    };
    
    return {
      id: slug,
      name: categoryInfo.name,
      slug: slug,
      description: categoryInfo.description,
      color: categoryInfo.color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch category data with fallback
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categorySlug],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', categorySlug)
          .single();
        
        if (error || !data) {
          // Return fallback category if not found in database
          return getFallbackCategory(categorySlug);
        }
        return data as Category;
      } catch (error) {
        // Return fallback category on any error
        return getFallbackCategory(categorySlug);
      }
    },
    enabled: !!categorySlug,
  });

  // Fetch articles for this category
  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['category-articles', categorySlug, currentPage, searchTerm, sortBy],
    queryFn: async () => {
      try {
        let query = supabase
          .from('articles')
          .select(`
            *,
            categories(name, slug, color),
            profiles(full_name, avatar_url)
          `)
          .eq('status', 'published');

        // Filter by category if it exists in database
        const { data: categoryExists } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();

        if (categoryExists) {
          query = query.eq('categories.slug', categorySlug);
        } else {
          // For fallback categories, return empty array for now
          return { articles: [], totalCount: 0 };
        }

        // Add search filter
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
        }

        // Add sorting
        query = query.order(sortBy, { ascending: false });

        // Add pagination
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;
        
        if (error) throw error;
        
        return {
          articles: data as Article[],
          totalCount: count || 0,
        };
      } catch (error) {
        // Return empty array on error
        return { articles: [], totalCount: 0 };
      }
    },
    enabled: !!categorySlug,
  });

  const articles = articlesData?.articles || [];
  const totalCount = articlesData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  if (categoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-2 h-16 rounded-full shadow-sm"
              style={{ backgroundColor: category.color }}
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-muted-foreground text-lg mt-2">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge 
              style={{ backgroundColor: category.color }}
              className="text-white px-4 py-2 text-base font-semibold"
            >
              {totalCount} Articles
            </Badge>
          </div>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Latest</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles */}
        {articlesLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <Skeleton key={i} className={viewMode === 'grid' ? 'h-64' : 'h-32'} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? `No articles found matching "${searchTerm}" in ${category.name}.`
                  : `No articles available in ${category.name} category yet.`
                }
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {articles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  variant={viewMode === 'list' ? 'horizontal' : 'default'}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
