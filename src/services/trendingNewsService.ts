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

interface TrendingNewsResponse {
  success: boolean;
  data: TrendingNewsArticle[];
  message?: string;
}

export class TrendingNewsService {
  private static readonly API_KEY = '6582fb3a6emshb967ad3b5c73525p132333jsn5b5ade348156';
  private static readonly BASE_URL = 'https://news-api14.p.rapidapi.com/v2/trendings';

  private static readonly TOPIC_MAPPING = {
    'business': 'Business',
    'technology': 'Technology',
    'politics': 'Politics',
    'sports': 'Sports',
    'health': 'Health',
    'entertainment': 'Entertainment'
  };

  private static getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }

  static async fetchTrendingNews(topics: string[]): Promise<TrendingNewsArticle[]> {
    console.log('Fetching trending news for topics:', topics);
    
    const allArticles: TrendingNewsArticle[] = [];
    const currentDate = this.getCurrentDate();

    for (const topic of topics) {
      try {
        const mappedTopic = this.TOPIC_MAPPING[topic as keyof typeof this.TOPIC_MAPPING];
        if (!mappedTopic) {
          console.warn(`Unknown topic: ${topic}`);
          continue;
        }

        console.log(`Fetching trending news for ${mappedTopic} on ${currentDate}`);

        const params = new URLSearchParams({
          date: currentDate,
          topic: mappedTopic,
          language: 'en'
        });

        const response = await fetch(`${this.BASE_URL}?${params}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'news-api14.p.rapidapi.com',
            'x-rapidapi-key': this.API_KEY
          }
        });

        if (!response.ok) {
          console.error(`Failed to fetch trending news for ${mappedTopic}: ${response.status}`);
          continue;
        }

        const data: TrendingNewsResponse = await response.json();
        
        if (data.success && data.data) {
          console.log(`Found ${data.data.length} trending articles for ${mappedTopic}`);
          allArticles.push(...data.data);
        } else {
          console.warn(`No trending articles found for ${mappedTopic}:`, data.message);
        }

        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error fetching trending news for ${topic}:`, error);
      }
    }

    console.log(`Total trending articles found: ${allArticles.length}`);
    return allArticles;
  }
}