interface TopHeadlineArticle {
  title: string;
  snippet: string;
  publisher: string;
  timestamp: string;
  newsUrl: string;
  images?: {
    thumbnail?: string;
    thumbnailProxied?: string;
  };
  hasSubnews?: boolean;
  subnews?: TopHeadlineArticle[];
}

interface TopHeadlinesResponse {
  status: string;
  request_id: string;
  data: TopHeadlineArticle[];
}

export type Country = 'US' | 'HK' | 'CN';

export interface ProcessedHeadline {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
  readTime: number;
  url: string;
  country: Country;
  fetchedAt: string;
}

export class TopHeadlinesService {
  private static readonly API_KEY = '6582fb3a6emshb967ad3b5c73525p132333jsn5b5ade348156';
  private static readonly BASE_URL = 'https://real-time-news-data.p.rapidapi.com/top-headlines';

  private static categorizeHeadline(title: string, snippet: string): string {
    const text = `${title} ${snippet}`.toLowerCase();
    
    // Business keywords
    if (text.match(/\b(business|finance|economy|market|stock|investment|bank|corporate|revenue|profit|trade|commerce|economic|financial|money|dollar|currency)\b/)) {
      return 'business';
    }
    
    // Technology keywords
    if (text.match(/\b(technology|tech|software|ai|artificial intelligence|computer|digital|internet|app|startup|innovation|cyber|data|cloud|mobile)\b/)) {
      return 'technology';
    }
    
    // Politics keywords
    if (text.match(/\b(politics|government|election|congress|senate|president|policy|law|legislation|vote|campaign|political|minister|parliament|diplomatic)\b/)) {
      return 'politics';
    }
    
    // Sports keywords
    if (text.match(/\b(sports|football|basketball|baseball|soccer|tennis|golf|olympics|athlete|team|game|match|championship|tournament|league)\b/)) {
      return 'sports';
    }
    
    // Health keywords
    if (text.match(/\b(health|medical|medicine|doctor|hospital|disease|treatment|vaccine|wellness|fitness|healthcare|virus|pandemic|drug)\b/)) {
      return 'health';
    }
    
    // Entertainment keywords
    if (text.match(/\b(entertainment|movie|film|music|celebrity|actor|actress|show|television|tv|hollywood|concert|album|award|festival)\b/)) {
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

  private static generateHeadlineId(article: TopHeadlineArticle, country: Country): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    const countryCode = country.toLowerCase();
    return `headline_${countryCode}_${timestamp}_${random}`;
  }

  static async fetchTopHeadlines(country: Country): Promise<ProcessedHeadline[]> {
    console.log(`Fetching top headlines for ${country}`);
    
    try {
      const params = new URLSearchParams({
        limit: '500',
        country: country,
        lang: 'en'
      });

      const response = await fetch(`${this.BASE_URL}?${params}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com',
          'x-rapidapi-key': this.API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch headlines for ${country}: ${response.status}`);
      }

      const data: TopHeadlinesResponse = await response.json();
      
      if (data.status !== 'OK' || !data.data) {
        throw new Error(`Invalid response for ${country}: ${data.status}`);
      }

      console.log(`Found ${data.data.length} headlines for ${country}`);

      const processedHeadlines: ProcessedHeadline[] = [];
      const fetchedAt = new Date().toISOString();

      for (const article of data.data) {
        try {
          if (!article.title || !article.newsUrl) {
            continue; // Skip articles without essential data
          }

          const category = this.categorizeHeadline(article.title, article.snippet || '');
          const content = article.snippet || article.title;
          const readTime = this.estimateReadTime(content);
          
          // Use thumbnail or default image
          const imageUrl = article.images?.thumbnail || 
                          article.images?.thumbnailProxied || 
                          'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800';

          const processedHeadline: ProcessedHeadline = {
            id: this.generateHeadlineId(article, country),
            title: article.title,
            summary: article.snippet || content.substring(0, 200) + '...',
            content: content,
            author: 'News Reporter',
            source: article.publisher || 'Unknown Source',
            publishedAt: article.timestamp || new Date().toISOString(),
            imageUrl: imageUrl,
            category: category,
            readTime: readTime,
            url: article.newsUrl,
            country: country,
            fetchedAt: fetchedAt
          };

          processedHeadlines.push(processedHeadline);
        } catch (error) {
          console.error('Error processing headline:', error);
        }
      }

      console.log(`Successfully processed ${processedHeadlines.length} headlines for ${country}`);
      return processedHeadlines;
    } catch (error) {
      console.error(`Error fetching headlines for ${country}:`, error);
      return [];
    }
  }

  static async fetchAllTopHeadlines(): Promise<{
    US: ProcessedHeadline[];
    HK: ProcessedHeadline[];
    CN: ProcessedHeadline[];
  }> {
    console.log('Fetching top headlines for all countries...');
    
    try {
      // Fetch headlines for all countries in parallel
      const [usHeadlines, hkHeadlines, cnHeadlines] = await Promise.all([
        this.fetchTopHeadlines('US'),
        this.fetchTopHeadlines('HK'),
        this.fetchTopHeadlines('CN')
      ]);

      return {
        US: usHeadlines,
        HK: hkHeadlines,
        CN: cnHeadlines
      };
    } catch (error) {
      console.error('Error fetching all top headlines:', error);
      return {
        US: [],
        HK: [],
        CN: []
      };
    }
  }
}