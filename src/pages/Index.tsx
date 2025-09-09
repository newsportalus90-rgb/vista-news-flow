import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NewsletterPopup } from '@/components/ui/newsletter-popup';
import { BreakingNewsTicker } from '@/components/news/BreakingNewsTicker';
import { HeroSection } from '@/components/news/HeroSection';
import { ArticleCard } from '@/components/news/ArticleCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Article, Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Clock, Globe } from 'lucide-react';

const Index = () => {
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
          .limit(6);

        if (categoriesData) setCategories(categoriesData);
        if (latestData) setLatestNews(latestData);
        if (trendingData) setTrendingNews(trendingData);

        // Fetch news by category
        if (categoriesData) {
          const categoryNews: Record<string, Article[]> = {};
          
          for (const category of categoriesData.slice(0, 6)) {
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
              .limit(4);
            
            if (data) {
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
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-4 bg-muted rounded w-96"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <BreakingNewsTicker />
      <HeroSection />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Latest News */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Latest News</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestNews.slice(0, 6).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </section>

            {/* Category Sections */}
            {categories.slice(0, 4).map((category) => {
              const categoryArticles = newsByCategory[category.slug] || [];
              if (categoryArticles.length === 0) return null;

              return (
                <section key={category.id}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl font-bold">{category.name}</h2>
                      <Badge 
                        style={{ backgroundColor: category.color }}
                        className="text-white"
                      >
                        {categoryArticles.length}
                      </Badge>
                    </div>
                    <Button variant="ghost">
                      View All {category.name}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoryArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending News */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingNews.map((article, index) => (
                  <div key={article.id}>
                    <ArticleCard article={article} variant="compact" />
                    {index < trendingNews.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href={`/${category.slug}`}>
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-news">
              <CardHeader>
                <CardTitle>Stay Informed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest news delivered directly to your inbox.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <Button className="w-full">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
      <NewsletterPopup />
    </div>
  );
};

export default Index;
