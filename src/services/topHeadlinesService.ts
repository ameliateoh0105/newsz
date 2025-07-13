interface TopHeadlineArticle {
  title: string;
  excerpt: string;
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

export interface ProcessedHeadline {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
  readTime: number;
  url: string;
  fetchedAt: string;
}

export class TopHeadlinesService {
  private static readonly API_KEY = '6582fb3a6emshb967ad3b5c73525p132333jsn5b5ade348156';
  private static readonly BASE_URL = 'https://real-time-news-data.p.rapidapi.com/top-headlines';

  private static categorizeHeadline(title: string, excerpt: string): string {
    const text = `${title} ${excerpt}`.toLowerCase();
    
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

  private static generateHeadlineId(article: TopHeadlineArticle): string {
    // Create a unique ID based on URL and title to avoid duplicates
    const urlPart = encodeURIComponent(article.newsUrl).substring(0, 20);
    const titlePart = encodeURIComponent(article.title).substring(0, 20);
    const timestamp = Date.now().toString(36);
    return `headline_${urlPart}_${titlePart}_${timestamp}`;
  }

  static async fetchTopHeadlines(): Promise<ProcessedHeadline[]> {
    console.log('Fetching global top headlines...');
    
    try {
      const params = new URLSearchParams({
        limit: '500',
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
        throw new Error(`Failed to fetch headlines: ${response.status}`);
      }

      const data: TopHeadlinesResponse = await response.json();
      
      if (data.status !== 'OK' || !data.data) {
        throw new Error(`Invalid response: ${data.status}`);
      }

      console.log(`Found ${data.data.length} global headlines`);

      const processedHeadlines: ProcessedHeadline[] = [];
      const fetchedAt = new Date().toISOString();

      for (const article of data.data) {
        try {
          if (!article.title || !article.newsUrl) {
            continue; // Skip articles without essential data
          }

          const category = this.categorizeHeadline(article.title, article.excerpt || '');
          const content = article.excerpt || article.title;
          const readTime = this.estimateReadTime(content);
          
          // Use thumbnail or default image
          const imageUrl = article.images?.thumbnail || 
                          article.images?.thumbnailProxied || 
                          'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800';

          const processedHeadline: ProcessedHeadline = {
            id: this.generateHeadlineId(article),
            title: article.title,
            excerpt: article.excerpt || content.substring(0, 200) + '...',
            content: content,
            author: 'News Reporter',
            source: article.publisher || 'Unknown Source',
            publishedAt: article.timestamp || new Date().toISOString(),
            imageUrl: imageUrl,
            category: category,
            readTime: readTime,
            url: article.newsUrl,
            fetchedAt: fetchedAt
          };

          processedHeadlines.push(processedHeadline);
        } catch (error) {
          console.error('Error processing headline:', error);
        }
      }

      console.log(`Successfully processed ${processedHeadlines.length} headlines`);
      return processedHeadlines;
    } catch (error) {
      console.error('Error fetching headlines:', error);
      return [];
    }
  }
}