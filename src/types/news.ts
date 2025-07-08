export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  category: Category;
  readTime: number;
  url?: string;
  isBookmarked?: boolean;
  isExternal?: boolean; // Add flag to distinguish external articles
}

export type Category = 'business' | 'technology' | 'politics' | 'sports' | 'health' | 'entertainment';

export interface NewsSource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: Category;
}