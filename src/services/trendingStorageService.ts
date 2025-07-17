import { supabase } from '../lib/supabase';
import { Article, Category } from '../types/news';

interface TrendingNewsArticle {
  title: string;
  summary: string;
  url: string;
  published_date: string;
  authors: string[];
  category: string[];
  content: string;
  thumbnail: string;
  publisher: {
    name: string;
    url: string;
  };
}

export class TrendingStorageService {
  private static categorizeArticle(title: string, summary: string, categories: string[]): Category {
    const text = `${title} ${summary} ${categories.join(' ')}`.toLowerCase();
    
    // Check API categories first
    for (const cat of categories) {
      const category = cat.toLowerCase();
      if (category.includes('business') || category.includes('finance') || category.includes('economy')) {
        return 'business';
      }
      if (category.includes('technology') || category.includes('tech')) {
        return 'technology';
      }
      if (category.includes('politics') || category.includes('government')) {
        return 'politics';
      }
      if (category.includes('sports')) {
        return 'sports';
      }
      if (category.includes('health') || category.includes('medical')) {
        return 'health';
      }
      if (category.includes('entertainment') || category.includes('celebrity')) {
        return 'entertainment';
      }
    }
    
    // Fallback to keyword matching
    if (text.match(/\b(business|finance|economy|market|stock|investment|bank|corporate|revenue|profit|trade|commerce)\b/)) {
      return 'business';
    }
    if (text.match(/\b(technology|tech|software|ai|artificial intelligence|computer|digital|internet|app|startup|innovation)\b/)) {
      return 'technology';
    }
    if (text.match(/\b(politics|government|election|congress|senate|president|policy|law|legislation|vote|campaign)\b/)) {
      return 'politics';
    }
    if (text.match(/\b(sports|football|basketball|baseball|soccer|tennis|golf|olympics|athlete|team|game|match)\b/)) {
      return 'sports';
    }
    if (text.match(/\b(health|medical|medicine|doctor|hospital|disease|treatment|vaccine|wellness|fitness)\b/)) {
      return 'health';
    }
    if (text.match(/\b(entertainment|movie|film|music|celebrity|actor|actress|show|television|tv|hollywood)\b/)) {
      return 'entertainment';
    }
    
    return 'business'; // Default fallback
  }

  private static estimateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  private static generateTrendingId(article: TrendingNewsArticle): string {
    // Create a unique ID based on URL and title
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `trending_${timestamp}_${random}`;
  }

  static async storeTrendingArticles(articles: TrendingNewsArticle[]): Promise<Article[]> {
    console.log(`Storing ${articles.length} trending articles`);
    const storedArticles: Article[] = [];
    const fetchedAt = new Date().toISOString();

    for (const apiArticle of articles) {
      try {
        // Generate unique ID
        const articleId = this.generateTrendingId(apiArticle);
        
        // Check if article already exists
        const { data: existingArticle, error: checkError } = await supabase
          .from('articles')
          .select('id')
          .eq('url', apiArticle.url)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking for existing article:', checkError);
        }

        if (existingArticle) {
          console.log(`Article already exists: ${apiArticle.title}`);
          continue;
        }

        // Prepare article data
        const category = this.categorizeArticle(
          apiArticle.title, 
          apiArticle.summary, 
          apiArticle.category || []
        );
        
        const content = apiArticle.content || apiArticle.summary || '';
        const readTime = this.estimateReadTime(content);
        const author = apiArticle.authors?.join(', ') || 'Unknown Author';
        
        // Use thumbnail or default image
        const imageUrl = apiArticle.thumbnail || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800';

        const articleData = {
          id: articleId,
          title: apiArticle.title,
          summary: apiArticle.summary || content.substring(0, 200) + '...',
          content: content,
          author: author,
          source: apiArticle.publisher?.name || 'Unknown Source',
          publishedAt: apiArticle.published_date,
          imageUrl: imageUrl,
          category: category,
          readTime: readTime,
          url: apiArticle.url,
          "searchedAt": fetchedAt
        };

        console.log('Attempting to insert trending article:', {
          id: articleData.id,
          title: articleData.title,
          url: articleData.url
        });

        // Insert article into database
        const { data: insertedArticle, error } = await supabase
          .from('articles')
          .insert(articleData)
          .select()
          .single();

        if (error) {
          console.error('Failed to store trending article:', error.message);
          console.error('Error details:', error);
          continue;
        }

        console.log(`Successfully stored trending article: ${insertedArticle.title}`);

        // Convert to Article type
        const article: Article = {
          id: insertedArticle.id,
          title: insertedArticle.title,
          summary: insertedArticle.summary || '',
          content: insertedArticle.content || '',
          author: insertedArticle.author || 'Unknown Author',
          source: insertedArticle.source || 'Unknown Source',
          publishedAt: insertedArticle.publishedAt || new Date().toISOString(),
          imageUrl: insertedArticle.imageUrl || imageUrl,
          category: insertedArticle.category as Category,
          readTime: parseInt(insertedArticle.readTime?.toString() || '5'),
          url: insertedArticle.url || '',
          searchedAt: insertedArticle.searchedAt,
          isBookmarked: false
        };

        storedArticles.push(article);
      } catch (error) {
        console.error('Error processing trending article:', error);
      }
    }

    console.log(`Successfully stored ${storedArticles.length} trending articles`);
    return storedArticles;
  }
}