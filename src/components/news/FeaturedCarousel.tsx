import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Article } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FeaturedCarouselProps {
  articles: Article[];
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (articles.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [articles.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  if (articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-xl bg-card">
      {/* Background Image */}
      <div className="absolute inset-0">
        {currentArticle.featured_image && (
          <img
            src={currentArticle.featured_image}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-3xl">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4">
              {currentArticle.is_featured && (
                <Badge className="bg-featured-news text-white">
                  FEATURED
                </Badge>
              )}
              {currentArticle.is_breaking && (
                <Badge className="breaking-banner breaking-pulse">
                  BREAKING
                </Badge>
              )}
              {currentArticle.category && (
                <Badge 
                  variant="secondary"
                  className="bg-white/20 text-white backdrop-blur-sm"
                >
                  {currentArticle.category.name}
                </Badge>
              )}
              {currentArticle.featured_video && (
                <Badge className="bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  VIDEO
                </Badge>
              )}
            </div>

            {/* Title and Excerpt */}
            <Link 
              to={`/article/${currentArticle.slug}`}
              className="block group"
            >
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight group-hover:text-gray-200 transition-colors">
                {currentArticle.title}
              </h1>
              {currentArticle.excerpt && (
                <p className="text-lg text-gray-200 mb-6 line-clamp-3">
                  {currentArticle.excerpt}
                </p>
              )}
            </Link>

            {/* Meta Information */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-gray-200">
                <span className="font-medium">
                  {currentArticle.author?.full_name}
                </span>
                <span>•</span>
                <span>
                  {format(new Date(currentArticle.published_at || currentArticle.created_at), 'MMM dd, yyyy')}
                </span>
                <span>•</span>
                <span>{currentArticle.views_count} views</span>
              </div>

              <Button 
                asChild
                className="bg-white text-foreground hover:bg-white/90"
              >
                <Link to={`/article/${currentArticle.slug}`}>
                  Read Full Story
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {articles.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Slide Indicators */}
      {articles.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {articles.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentIndex 
                  ? "bg-white" 
                  : "bg-white/40 hover:bg-white/60"
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};