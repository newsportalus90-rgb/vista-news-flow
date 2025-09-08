import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Article } from '@/types';
import { format } from 'date-fns';
import { Eye, Heart, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  variant = 'default',
  className 
}) => {
  const getCategoryColor = (categorySlug: string) => {
    const colorMap: Record<string, string> = {
      world: 'bg-category-world',
      business: 'bg-category-business',
      technology: 'bg-category-tech',
      sports: 'bg-category-sports',
      entertainment: 'bg-category-entertainment',
      health: 'bg-category-health',
      politics: 'bg-category-politics',
      science: 'bg-category-science',
    };
    return colorMap[categorySlug] || 'bg-primary';
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (variant === 'featured') {
    return (
      <Card className={cn(
        "group overflow-hidden hover:shadow-lg transition-all duration-normal",
        className
      )}>
        <div className="relative">
          {article.featured_image && (
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
              />
            </div>
          )}
          
          {article.is_breaking && (
            <Badge className="absolute top-4 left-4 bg-breaking-news text-white">
              BREAKING
            </Badge>
          )}
          
          <Badge 
            className={cn(
              "absolute top-4 right-4 text-white",
              getCategoryColor(article.category?.slug || '')
            )}
          >
            {article.category?.name}
          </Badge>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Link 
                to={`/article/${article.slug}`}
                className="group-hover:text-primary transition-colors"
              >
                <h2 className="text-2xl font-bold leading-tight line-clamp-3">
                  {article.title}
                </h2>
              </Link>
              
              {article.excerpt && (
                <p className="text-muted-foreground mt-3 line-clamp-3">
                  {article.excerpt}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>{article.author?.full_name}</span>
                <span>•</span>
                <span>{formatDate(article.published_at || article.created_at)}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{article.views_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{article.likes_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{article.comments_count}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="default" asChild>
                <Link to={`/article/${article.slug}`}>
                  Read More
                </Link>
              </Button>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={cn(
        "group hover:shadow-md transition-all duration-normal",
        className
      )}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            {article.featured_image && (
              <div className="flex-shrink-0">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="secondary"
                  className={cn(
                    "text-xs",
                    getCategoryColor(article.category?.slug || '')
                  )}
                >
                  {article.category?.name}
                </Badge>
                {article.is_breaking && (
                  <Badge className="text-xs bg-breaking-news text-white">
                    BREAKING
                  </Badge>
                )}
              </div>
              
              <Link 
                to={`/article/${article.slug}`}
                className="group-hover:text-primary transition-colors"
              >
                <h3 className="font-semibold line-clamp-2 text-sm">
                  {article.title}
                </h3>
              </Link>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{formatDate(article.published_at || article.created_at)}</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{article.views_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{article.likes_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn(
      "group overflow-hidden hover:shadow-lg transition-all duration-normal",
      className
    )}>
      {article.featured_image && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
          />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge 
              className={cn(
                "text-white text-xs",
                getCategoryColor(article.category?.slug || '')
              )}
            >
              {article.category?.name}
            </Badge>
            {article.is_breaking && (
              <Badge className="bg-breaking-news text-white text-xs">
                BREAKING
              </Badge>
            )}
          </div>
        </div>
      )}

      <CardContent className="p-4">
        <div className="space-y-3">
          <Link 
            to={`/article/${article.slug}`}
            className="group-hover:text-primary transition-colors"
          >
            <h3 className="font-semibold leading-tight line-clamp-3">
              {article.title}
            </h3>
          </Link>
          
          {article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>{article.author?.full_name}</span>
              <span>•</span>
              <span>{formatDate(article.published_at || article.created_at)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{article.views_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{article.likes_count}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};