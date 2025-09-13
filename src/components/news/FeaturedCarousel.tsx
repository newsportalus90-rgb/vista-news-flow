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
    <div className="relative h-[500px] md:h-[650px] overflow-hidden rounded-2xl bg-card shadow-elegant hover-glow">
      {/* Background Image */}
      <div className="absolute inset-0">
        {currentArticle.featured_image && (
          <img
            src={currentArticle.featured_image}
            alt={currentArticle.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        )}
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-3xl">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4">
              {currentArticle.is_featured && (
                <Badge className="bg-featured-news text-white px-4 py-1.5 text-xs font-bold tracking-wider">
                  ⭐ FEATURED
                </Badge>
              )}
              {currentArticle.is_breaking && (
                <Badge className="breaking-banner breaking-pulse px-4 py-1.5 text-xs font-bold tracking-wider">
                  🔥 BREAKING
                </Badge>
              )}
              {currentArticle.category && (
                <Badge 
                  variant="secondary"
                  className="glass-effect text-white px-3 py-1.5 text-xs font-semibold"
                >
                  {currentArticle.category.name.toUpperCase()}
                </Badge>
              )}
              {currentArticle.featured_video && (
                <Badge className="glass-effect text-white flex items-center gap-2 px-3 py-1.5 text-xs font-semibold">
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
              <h1 className="text-3xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight group-hover:text-gray-200 transition-all duration-300">
                {currentArticle.title}
              </h1>
              {currentArticle.excerpt && (
                <p className="text-xl text-gray-200 mb-8 line-clamp-3 leading-relaxed">
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
                size="lg"
                className="bg-white text-foreground hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-base font-semibold"
              >
                <Link to={`/article/${currentArticle.slug}`}>
                  Read Full Story →
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
            className="absolute left-6 top-1/2 -translate-y-1/2 glass-effect text-white hover:bg-white/20 transition-all duration-300 h-12 w-12 rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-6 top-1/2 -translate-y-1/2 glass-effect text-white hover:bg-white/20 transition-all duration-300 h-12 w-12 rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
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