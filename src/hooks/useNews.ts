import { useState, useEffect, useMemo } from 'react';
import { Article, Category } from '../types/news';
import { NewsService } from '../services/newsService';
import { PipedreamService } from '../services/pipedreamService';
import { ArticleStorageService } from '../services/articleStorageService';
import { useAuth } from './useAuth';
import { AuthService } from '../services/authService';
import { supabase } from '../lib/supabase';

export function useNews() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingFromWeb, setFetchingFromWeb] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Fetch user bookmarks when user changes
  useEffect(() => {
    if (user) {
      NewsService.getUserBookmarks(user.id)
        .then(bookmarks => setBookmarkedIds(new Set(bookmarks)))
        .catch(console.error);
    } else {
      setBookmarkedIds(new Set());
    }
  }, [user]);

  // Fetch articles
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching news with category:', selectedCategory, 'search:', searchQuery);
        
        let fetchedArticles: Article[];
        
        if (searchQuery.trim()) {
          // For regular search, only search database
          const { data, error } = await supabase
            .from('articles')
            .select('*')
            .or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`)
            .order('publishedAt', { ascending: false });

          if (error) {
            throw new Error(`Failed to search articles: ${error.message}`);
          }

          fetchedArticles = data.map(article => ({
            id: article.id,
            title: article.title || 'Untitled',
            summary: article.summary || '',
            content: article.content || '',
            author: article.author || 'Unknown Author',
            source: article.source || 'Unknown Source',
            publishedAt: article.publishedAt || new Date().toISOString(),
            imageUrl: article.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
            category: (article.category as Category) || 'business',
            readTime: parseInt(article.readTime || '5'),
            url: article.url || '',
            isBookmarked: false
          }));
        } else {
          fetchedArticles = await NewsService.getArticles(selectedCategory);
        }
        
        console.log('Fetched articles count:', fetchedArticles.length);
        
        // Update bookmark status
        const articlesWithBookmarks = fetchedArticles.map(article => ({
          ...article,
          isBookmarked: bookmarkedIds.has(article.id)
        }));
        
        setArticles(articlesWithBookmarks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news articles');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory, searchQuery, bookmarkedIds]);

  const fetchFromWeb = async (query: string) => {
    try {
      setFetchingFromWeb(true);
      setError(null);
      
      console.log('Triggering Pipedream webhook for query:', query);
      
      // Trigger Pipedream webhook
      const result = await PipedreamService.triggerWebSearch(query);
      
      if (!result.success) {
        setError(`Webhook failed: ${result.message}`);
        return;
      }
      
      // Show success message
      setError(null);
      console.log('Webhook triggered successfully:', result.data);
      
      // You can add logic here to handle the webhook response
      // For example, refresh articles or show a success message
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to trigger webhook';
      console.error('Webhook error:', errorMessage);
      setError(errorMessage);
    } finally {
      setFetchingFromWeb(false);
    }
  };

  const toggleBookmark = async (articleId: string) => {
    try {
      // Get the current authenticated user to ensure we have a valid session
      const currentUser = await AuthService.getCurrentUser();
      
      if (!currentUser) {
        console.error('No authenticated user found');
        return;
      }

      const isCurrentlyBookmarked = bookmarkedIds.has(articleId);
      
      if (isCurrentlyBookmarked) {
        await NewsService.removeBookmark(currentUser.id, articleId);
        setBookmarkedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(articleId);
          return newSet;
        });
      } else {
        await NewsService.addBookmark(currentUser.id, articleId);
        setBookmarkedIds(prev => new Set(prev).add(articleId));
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const bookmarkedArticles = useMemo(() => {
    return articles.filter(article => bookmarkedIds.has(article.id));
  }, [articles, bookmarkedIds]);

  return {
    articles,
    bookmarkedArticles,
    loading,
    fetchingFromWeb,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    toggleBookmark,
    fetchFromWeb
  };
}