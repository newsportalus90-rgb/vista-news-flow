import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArticleCard } from './ArticleCard';
import { Article } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage from '@/assets/news-hero.jpg';

export const HeroSection: React.FC = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const { data } = await supabase
          .from('articles')
          .select(`
            *,
            category:categories(*),
            author:profiles(*)
          `)
          .eq('status', 'published')
          .eq('is_featured', true)
          .order('published_at', { ascending: false })
          .limit(5);

        if (data) {
          setFeaturedArticles(data);
        }
      } catch (error) {
        console.error('Error fetching featured articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  useEffect(() => {
    if (featuredArticles.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [featuredArticles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  if (loading) {
    return (
      <section className="relative h-[600px] bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredArticles.length === 0) {
    return (
      <section className="relative h-[600px] bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage}
            alt="Vista News"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to NewsStream
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Professional journalism, breaking news, and real-time global updates
            </p>
            <Button size="lg" variant="secondary">
              Explore Latest News
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const currentArticle = featuredArticles[currentSlide];

  return (
    <section className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        {currentArticle?.featured_image ? (
          <img 
            src={currentArticle.featured_image}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={heroImage}
            alt="NewsStream"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* Main featured article */}
          <div className="text-white">
            <div className="mb-4 flex gap-2">
              <Badge className="bg-featured-news text-white">
                Featured
              </Badge>
              {currentArticle?.category && (
                <Badge variant="secondary">
                  {currentArticle.category.name}
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {currentArticle?.title}
            </h1>
            
            {currentArticle?.excerpt && (
              <p className="text-lg md:text-xl text-white/90 mb-6 line-clamp-3">
                {currentArticle.excerpt}
              </p>
            )}
            
            <div className="flex items-center gap-4 mb-6 text-white/80">
              <span>{currentArticle?.author?.full_name}</span>
              <span>•</span>
              <span>{new Date(currentArticle?.published_at || '').toLocaleDateString()}</span>
            </div>
            
            <Button size="lg" asChild>
              <a href={`/article/${currentArticle?.slug}`}>
                Read Full Story
              </a>
            </Button>
          </div>

          {/* Side featured articles */}
          <div className="hidden lg:block">
            <div className="space-y-4">
              {featuredArticles.slice(1, 4).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="compact"
                  className="bg-white/95 backdrop-blur"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {featuredArticles.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex gap-2">
              {featuredArticles.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white' : 'bg-white/40'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};