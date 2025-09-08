import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Article } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Zap } from 'lucide-react';

export const BreakingNewsTicker: React.FC = () => {
  const [breakingNews, setBreakingNews] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      const { data } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(*),
          author:profiles(*)
        `)
        .eq('status', 'published')
        .eq('is_breaking', true)
        .order('published_at', { ascending: false })
        .limit(5);

      if (data) {
        setBreakingNews(data);
      }
    };

    fetchBreakingNews();
  }, []);

  useEffect(() => {
    if (breakingNews.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [breakingNews.length]);

  if (breakingNews.length === 0) return null;

  const currentNews = breakingNews[currentIndex];

  return (
    <div className="bg-breaking-news text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-2">
          <div className="flex items-center gap-2 mr-4 flex-shrink-0">
            <Zap className="h-4 w-4 text-white animate-pulse" />
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              BREAKING
            </Badge>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {currentNews && (
              <div className="animate-fade-in">
                <Link 
                  to={`/article/${currentNews.slug}`}
                  className="hover:underline block truncate"
                >
                  <span className="text-sm font-medium">
                    {currentNews.title}
                  </span>
                </Link>
              </div>
            )}
          </div>

          {breakingNews.length > 1 && (
            <div className="flex items-center gap-2 ml-4">
              {breakingNews.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};