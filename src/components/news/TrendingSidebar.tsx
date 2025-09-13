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
    <div className="space-y-8">
      {/* Search */}
      <Card className="shadow-elegant hover-glow">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search breaking news..." 
              className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary transition-all"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trending Now */}
      <Card className="shadow-elegant hover-glow bg-gradient-news">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 rounded-full bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {trendingArticles.slice(0, 5).map((article, index) => (
            <div key={article.id} className="group hover:bg-accent/50 p-3 rounded-xl transition-all duration-300">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-premium text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/article/${article.slug}`}
                    className="block group-hover:text-primary transition-colors duration-300"
                  >
                    <h4 className="font-semibold line-clamp-2 text-base leading-tight">
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
                      className="w-16 h-16 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    />
                  </div>
                )}
              </div>
              
              {index < trendingArticles.slice(0, 5).length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Latest Updates */}
      <Card className="shadow-elegant hover-glow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 rounded-full bg-success/10">
              <Clock className="h-5 w-5 text-success" />
            </div>
            Latest Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {recentArticles.slice(0, 4).map((article) => (
            <div key={article.id} className="group hover:bg-accent/50 p-3 rounded-xl transition-all duration-300">
              <Link 
                to={`/article/${article.slug}`}
                className="block group-hover:text-primary transition-colors duration-300"
              >
                <h4 className="font-semibold line-clamp-2 text-base leading-tight">
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
      <Card className="bg-gradient-premium text-white shadow-glass border-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <CardHeader className="pb-4 relative">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 rounded-full bg-white/20">
              <Mail className="h-5 w-5 text-white" />
            </div>
            Stay Updated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          <p className="text-white/90 text-base">
            Get breaking news and top stories delivered to your inbox.
          </p>
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12 rounded-xl"
            />
            <Button className="w-full bg-white text-primary hover:bg-white/90 h-12 rounded-xl font-semibold">
              <Bell className="h-4 w-4 mr-2" />
              Subscribe Now
            </Button>
          </div>
          <p className="text-xs text-white/80">
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