export type UserRole = 'admin' | 'editor' | 'author' | 'user';
export type ArticleStatus = 'draft' | 'published' | 'archived' | 'scheduled';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  featured_video?: string;
  category_id: string;
  author_id: string;
  status: ArticleStatus;
  is_featured: boolean;
  is_breaking: boolean;
  published_at?: string;
  scheduled_at?: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  category?: Category;
  author?: Profile;
  tags?: Tag[];
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  user?: Profile;
}

export interface Like {
  id: string;
  article_id: string;
  user_id: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  article_id: string;
  user_id: string;
  created_at: string;
  
  // Relations
  article?: Article;
}