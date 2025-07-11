import { supabase } from '../lib/supabase';
import { Article, Category } from '../types/news';

interface RapidApiArticle {
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

export class SearchStorageService {
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

  private static generateSearchId(article: RapidApiArticle): string {
    // Create a unique ID based on URL and title
    const urlHash = encodeURIComponent(article.url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    const titleHash = encodeURIComponent(article.title).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
    return `search_${urlHash}_${titleHash}`;
  }

  static async storeSearchResults(articles: RapidApiArticle[], searchQuery: string): Promise<Article[]> {
    console.log(`Storing ${articles.length} search results for query: ${searchQuery}`);
    const storedArticles: Article[] = [];
    const searchedAt = new Date().toISOString();

    for (const apiArticle of articles) {
      try {
        // Generate unique ID
        const articleId = this.generateSearchId(apiArticle);
        
        // Check if article already exists
        const { data: existingArticle } = await supabase
          .from('articles')
          .select('id')
          .eq('id', articleId)
          .maybeSingle();

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
          "searchedAt": searchedAt
        };

        // Insert article into database
        const { data: insertedArticle, error } = await supabase
          .from('articles')
          .insert(articleData)
          .select()
          .single();

        if (error) {
          console.error('Failed to store article:', error);
          console.error('Article data:', articleData);
          continue;
        }

        console.log(`Successfully stored: ${insertedArticle.title}`);

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
        console.error('Error processing article:', error);
      }
    }

    console.log(`Successfully stored ${storedArticles.length} articles`);
    return storedArticles;
  }

  static async getRecentSearchResults(limit: number = 20): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .not('"searchedAt"', 'is', null)
      .order('"searchedAt"', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch recent search results:', error);
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
      searchedAt: article.searchedAt,
      isBookmarked: false
    }));
  }
}