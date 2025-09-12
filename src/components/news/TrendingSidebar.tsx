import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Article, Category } from '@/types';
import { 
  TrendingUp, 
  Clock, 
  Eye, 
  MessageSquare, 
  Heart,
  Search,
  Tag,
  Mail,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';

interface TrendingSidebarProps {
  trendingArticles: Article[];
  recentArticles: Article[];
  categories: Category[];
}

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({
  trendingArticles,
  recentArticles,
  categories
}) => {
  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search news..." 
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trending Now */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingArticles.slice(0, 5).map((article, index) => (
            <div key={article.id} className="group">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/article/${article.slug}`}
                    className="block group-hover:text-primary transition-colors"
                  >
                    <h4 className="font-medium line-clamp-2 text-sm leading-tight">
                      {article.title}
                    </h4>
                  </Link>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{article.views_count}</span>
                    <Heart className="h-3 w-3" />
                    <span>{article.likes_count}</span>
                  </div>
                </div>

                {article.featured_image && (
                  <div className="flex-shrink-0">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              
              {index < trendingArticles.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Latest Updates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Latest Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentArticles.slice(0, 4).map((article) => (
            <div key={article.id} className="group">
              <Link 
                to={`/article/${article.slug}`}
                className="block group-hover:text-primary transition-colors"
              >
                <h4 className="font-medium line-clamp-2 text-sm leading-tight">
                  {article.title}
                </h4>
              </Link>
              
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{format(new Date(article.published_at || article.created_at), 'HH:mm')}</span>
                <span>•</span>
                <span>{article.category?.name}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{article.comments_count}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5 text-primary" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className="w-full justify-start h-auto p-2"
                asChild
              >
                <Link to={`/category/${category.slug}`}>
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1 text-left">{category.name}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {/* This would need article counts from props */}
                    12
                  </Badge>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Subscription */}
      <Card className="bg-gradient-news border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-primary" />
            Stay Updated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Get breaking news and top stories delivered to your inbox.
          </p>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-background"
            />
            <Button className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Subscribe Now
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Join 50,000+ readers. Unsubscribe anytime.
          </p>
        </CardContent>
      </Card>

      {/* Advertisement Space */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <div className="h-32 bg-muted rounded flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Advertisement</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Sponsored Content
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};