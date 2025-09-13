import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NewsletterPopup } from '@/components/ui/newsletter-popup';
import { BreakingNewsTicker } from '@/components/news/BreakingNewsTicker';
import { FeaturedCarousel } from '@/components/news/FeaturedCarousel';
import { CategorySection } from '@/components/news/CategorySection';
import { TrendingSidebar } from '@/components/news/TrendingSidebar';
import { Article, Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [featuredNews, setFeaturedNews] = useState<Article[]>([]);
  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [trendingNews, setTrendingNews] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newsByCategory, setNewsByCategory] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        // Fetch featured news
        const { data: featuredData } = await supabase
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

        // Fetch latest news
        const { data: latestData } = await supabase
          .from('articles')
          .select(`
            *,
            category:categories(*),
            author:profiles(*)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(12);

        // Fetch trending news (most viewed)
        const { data: trendingData } = await supabase
          .from('articles')
          .select(`
            *,
            category:categories(*),
            author:profiles(*)
          `)
          .eq('status', 'published')
          .order('views_count', { ascending: false })
          .limit(10);

        if (categoriesData) setCategories(categoriesData);
        if (featuredData) setFeaturedNews(featuredData);
        if (latestData) setLatestNews(latestData);
        if (trendingData) setTrendingNews(trendingData);

        // Fetch news by category
        if (categoriesData) {
          const categoryNews: Record<string, Article[]> = {};
          
          for (const category of categoriesData.slice(0, 8)) {
            const { data } = await supabase
              .from('articles')
              .select(`
                *,
                category:categories(*),
                author:profiles(*)
              `)
              .eq('status', 'published')
              .eq('category_id', category.id)
              .order('published_at', { ascending: false })
              .limit(6);
            
            if (data && data.length > 0) {
              categoryNews[category.slug] = data;
            }
          }
          
          setNewsByCategory(categoryNews);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <BreakingNewsTicker />
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
            <div className="h-12 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 bg-muted rounded-lg"></div>
              <div className="h-32 bg-muted rounded-lg"></div>
              <div className="h-32 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BreakingNewsTicker />
      
      {/* Featured Carousel */}
      {featuredNews.length > 0 && (
        <section className="container mx-auto px-6 py-12">
          <FeaturedCarousel articles={featuredNews} />
        </section>
      )}
      
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Category Sections */}
            {Object.entries(newsByCategory).map(([categorySlug, articles], index) => {
              const category = categories.find(cat => cat.slug === categorySlug);
              if (!category || articles.length === 0) return null;

              return (
                <div key={category.id} className="scroll-mt-24">
                  <CategorySection 
                    category={category} 
                    articles={articles}
                    featured={index === 0} // First category gets featured treatment
                  />
                  {index < Object.keys(newsByCategory).length - 1 && (
                    <Separator className="mt-16 bg-gradient-to-r from-transparent via-border to-transparent" />
                  )}
                </div>
              );
            })}

            {/* Latest News Section */}
            {latestNews.length > 0 && (
              <>
                <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="scroll-mt-24">
                  <CategorySection 
                    category={{
                      id: 'latest',
                      name: 'Latest News',
                      slug: 'latest',
                      description: 'Stay updated with the most recent developments around the world',
                      color: '#3B82F6',
                      created_at: '',
                      updated_at: ''
                    }}
                    articles={latestNews}
                  />
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <TrendingSidebar 
              trendingArticles={trendingNews}
              recentArticles={latestNews.slice(0, 8)}
              categories={categories}
            />
          </div>
        </div>
      </main>
      
      <Footer />
      <NewsletterPopup />
    </div>
  );
};

export default Index;
