import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from './ArticleCard';
import { Article, Category } from '@/types';
import { ArrowRight, Globe } from 'lucide-react';

interface CategorySectionProps {
  category: Category;
  articles: Article[];
  featured?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ 
  category, 
  articles, 
  featured = false 
}) => {
  if (articles.length === 0) return null;

  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1, 4);

  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="w-1 h-8 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-muted-foreground text-sm mt-1">
                {category.description}
              </p>
            )}
          </div>
          <Badge 
            style={{ backgroundColor: category.color }}
            className="text-white ml-2"
          >
            {articles.length}
          </Badge>
        </div>
        
        <Button variant="ghost" className="text-primary hover:text-primary/80" asChild>
          <Link to={`/category/${category.slug}`}>
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      {/* Articles Grid */}
      {featured ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article - Large */}
          <div className="lg:col-span-2">
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>
          
          {/* Sidebar Articles */}
          <div className="space-y-4">
            {remainingArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                variant="compact" 
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Load More */}
      {articles.length > 6 && (
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to={`/category/${category.slug}`}>
              Load More {category.name} Articles
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
};