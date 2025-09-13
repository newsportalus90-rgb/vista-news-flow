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
    <section className="py-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div 
            className="w-1.5 h-12 rounded-full shadow-sm"
            style={{ backgroundColor: category.color }}
          />
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-muted-foreground text-base mt-2">
                {category.description}
              </p>
            )}
          </div>
          <Badge 
            style={{ backgroundColor: category.color }}
            className="text-white ml-4 px-3 py-1.5 text-sm font-semibold"
          >
            {articles.length} Articles
          </Badge>
        </div>
        
        <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white transition-all duration-300" asChild>
          <Link to={`/category/${category.slug}`}>
            View All Stories
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Articles Grid */}
      {featured ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Article - Large */}
          <div className="lg:col-span-2">
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>
          
          {/* Sidebar Articles */}
          <div className="space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Load More */}
      {articles.length > 6 && (
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3 text-base font-semibold hover:bg-primary hover:text-white transition-all duration-300"
            asChild
          >
            <Link to={`/category/${category.slug}`}>
              Load More {category.name} Articles
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
};