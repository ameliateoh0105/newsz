import { supabase } from '../lib/supabase';
import { Article, Category } from '../types/news';
import { TextSummarizer } from '../utils/textSummarizer';

interface NewsApiArticle {
  title: string;
  description: string;
  content: string;
  author: string;
  source: {
    name: string;
  };
  publishedAt: string;
  urlToImage: string;
  url: string;
}

export class ArticleStorageService {
  private static categorizeArticle(title: string, description: string): Category {
    const text = `${title} ${description}`.toLowerCase();
    
    // Business keywords
    if (text.match(/\b(business|finance|economy|market|stock|investment|bank|corporate|revenue|profit|trade|commerce)\b/)) {
      return 'business';
    }
    
    // Technology keywords
    if (text.match(/\b(technology|tech|software|ai|artificial intelligence|computer|digital|internet|app|startup|innovation)\b/)) {
      return 'technology';
    }
    
    // Politics keywords
    if (text.match(/\b(politics|government|election|congress|senate|president|policy|law|legislation|vote|campaign)\b/)) {
      return 'politics';
    }
    
    // Sports keywords
    if (text.match(/\b(sports|football|basketball|baseball|soccer|tennis|golf|olympics|athlete|team|game|match)\b/)) {
      return 'sports';
    }
    
    // Health keywords
    if (text.match(/\b(health|medical|medicine|doctor|hospital|disease|treatment|vaccine|wellness|fitness)\b/)) {
      return 'health';
    }
    
    // Entertainment keywords
    if (text.match(/\b(entertainment|movie|film|music|celebrity|actor|actress|show|television|tv|hollywood)\b/)) {
      return 'entertainment';
    }
    
    // Default to business if no clear category
    return 'business';
  }

  private static estimateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  private static generateExternalId(article: NewsApiArticle): string {
    // Create a unique ID based on URL and published date
    const urlHash = btoa(article.url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    const dateHash = new Date(article.publishedAt).getTime().toString(36);
    return `newsapi_${urlHash}_${dateHash}`;
  }

  static async storeNewsApiArticles(articles: NewsApiArticle[]): Promise<Article[]> {
    console.log(`Attempting to store ${articles.length} articles`);
    const storedArticles: Article[] = [];

    for (const apiArticle of articles) {
      try {
        // Generate external ID
        const externalId = this.generateExternalId(apiArticle);
        
        // Check if article already exists
        const { data: existingArticle } = await supabase
          .from('articles')
          .select('id')
          .eq('external_id', externalId)
          .single();

        if (existingArticle) {
          console.log(`Article already exists: ${apiArticle.title}`);
          continue; // Skip if already exists
        }

        // Prepare article data
        const category = this.categorizeArticle(apiArticle.title, apiArticle.description);
        const content = apiArticle.content || apiArticle.description || '';
        const readTime = this.estimateReadTime(content);
        
        // Use a default image if none provided
        const imageUrl = apiArticle.urlToImage || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800';

        const articleData = {
          title: apiArticle.title,
          summary: apiArticle.description || TextSummarizer.summarize(content, 2),
          content: content,
          author: apiArticle.author || 'Unknown Author',
          source: apiArticle.source.name,
          publishedAt: apiArticle.publishedAt,
          imageUrl: imageUrl,
          category: category,
          readTime: readTime,
          url: apiArticle.url,
          id: externalId
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
          readTime: parseInt(insertedArticle.readTime || '5'),
          url: insertedArticle.url || '',
          isBookmarked: false
        };

        storedArticles.push(article);
      } catch (error) {
        console.error('Error processing article:', error);
      }
    }

    return storedArticles;
  }

  static async cleanupOldExternalArticles(daysOld: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('is_external', true)
        .lt('published_at', cutoffDate.toISOString());

      if (error) {
        console.error('Failed to cleanup old articles:', error);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}