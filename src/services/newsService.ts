import { supabase } from '../lib/supabase';
import { Article, Category } from '../types/news';

export class NewsService {
  static async getArticles(category?: Category | 'all'): Promise<Article[]> {
    let query = supabase
      .from('articles')
      .select('*')
      .order('publishedAt', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch articles: ${error.message}`);
    }

    console.log('Raw database data:', data);

    if (!data || data.length === 0) {
      console.log('No articles found in database');
      return [];
    }

    return data.map(article => ({
      id: article.id,
      title: article.title || 'Untitled',
      summary: article.summary || '',
      content: article.content || '',
      author: article.author || 'Unknown Author',
      source: article.source || 'Unknown Source',
      publishedAt: article.publishedAt || new Date().toISOString(),
      imageUrl: article.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: (article.category as Category) || 'business',
      readTime: parseInt(article.readTime?.toString() || '5'),
      url: article.url || '',
      isBookmarked: false
    }));
  }

  static async searchArticles(query: string): Promise<Article[]> {
    console.log('Searching for:', query);
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,author.ilike.%${query}%`)
      .order('publishedAt', { ascending: false });

    if (error) {
      console.error('Search error:', error);
      throw new Error(`Failed to search articles: ${error.message}`);
    }

    console.log('Search results:', data);

    if (!data || data.length === 0) {
      console.log('No search results found');
      return [];
    }

    return data.map(article => ({
      id: article.id,
      title: article.title || 'Untitled',
      summary: article.summary || '',
      content: article.content || '',
      author: article.author || 'Unknown Author',
      source: article.source || 'Unknown Source',
      publishedAt: article.publishedAt || new Date().toISOString(),
      imageUrl: article.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: (article.category as Category) || 'business',
      readTime: parseInt(article.readTime?.toString() || '5'),
      url: article.url || '',
      isBookmarked: false
    }));
  }

  static async getUserBookmarks(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('article_id')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch bookmarks: ${error.message}`);
    }

    return data.map(bookmark => bookmark.article_id);
  }

  static async addBookmark(userId: string, articleId: string): Promise<void> {
    const { error } = await supabase
      .from('user_bookmarks')
      .insert({ user_id: userId, article_id: articleId });

    if (error) {
      throw new Error(`Failed to add bookmark: ${error.message}`);
    }
  }

  static async removeBookmark(userId: string, articleId: string): Promise<void> {
    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('article_id', articleId);

    if (error) {
      throw new Error(`Failed to remove bookmark: ${error.message}`);
    }
  }

  static async getBookmarkedArticles(userId: string): Promise<Article[]> {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select(`
        article_id,
        articles!inner(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch bookmarked articles: ${error.message}`);
    }

    return data
      .filter(bookmark => bookmark.articles)
      .map(bookmark => {
        const article = bookmark.articles as any;
        return {
          id: article.id,
          title: article.title || 'Untitled',
          summary: article.summary || '',
          content: article.content || '',
          author: article.author || 'Unknown Author',
          source: article.source || 'Unknown Source',
          publishedAt: article.publishedAt || new Date().toISOString(),
          imageUrl: article.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: (article.category as Category) || 'business',
          readTime: parseInt(article.readTime?.toString() || '5'),
          url: article.url || '',
          isBookmarked: true
        };
      });
  }

  // Debug method to check database contents
  static async debugDatabase(): Promise<void> {
    try {
      console.log('=== DATABASE DEBUG ===');
      
      // Check if articles table exists and get count
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('*', { count: 'exact' });
      
      if (articlesError) {
        console.error('Articles table error:', articlesError);
      } else {
        console.log(`Articles table: ${articles?.length || 0} records found`);
        if (articles && articles.length > 0) {
          console.log('Sample article:', articles[0]);
        }
      }

      // Check table structure
      const { data: tableInfo, error: tableError } = await supabase
        .rpc('exec_sql', { 
          sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'articles' ORDER BY ordinal_position;" 
        });
      
      if (tableError) {
        console.error('Table structure error:', tableError);
      } else {
        console.log('Articles table structure:', tableInfo);
      }

    } catch (error) {
      console.error('Debug error:', error);
    }
  }
}