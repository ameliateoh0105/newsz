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

interface RapidApiResponse {
  success: boolean;
  data: RapidApiArticle[];
  message?: string;
}

export class RapidApiService {
  private static readonly API_KEY = '6582fb3a6emshb967ad3b5c73525p132333jsn5b5ade348156';
  private static readonly BASE_URL = 'https://news-api14.p.rapidapi.com/v2/search/articles';

  private static readonly SOURCE_DOMAINS = {
    'bloomberg': 'bloomberg.com',
    'wall street journal': 'wsj.com',
    'bbc': 'bbc.com',
    'new york times': 'nytimes.com',
    'south china morning post': 'scmp.com',
    'the guardian': 'theguardian.com',
    'fox news': 'foxnews.com',
    'reuters': 'reuters.com'
  };

  static async searchArticles(query: string, sources: string[]): Promise<RapidApiArticle[]> {
    console.log('Searching RapidAPI with query:', query, 'sources:', sources);
    
    const allArticles: RapidApiArticle[] = [];

    for (const source of sources) {
      try {
        const domain = this.SOURCE_DOMAINS[source.toLowerCase() as keyof typeof this.SOURCE_DOMAINS];
        if (!domain) {
          console.warn(`Unknown source: ${source}`);
          continue;
        }

        console.log(`Fetching from ${source} (${domain})`);

        const params = new URLSearchParams({
          query: query,
          language: 'en',
          publisher: domain,
          from: '5d'
        });

        const response = await fetch(`${this.BASE_URL}?${params}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'news-api14.p.rapidapi.com',
            'x-rapidapi-key': this.API_KEY
          }
        });

        if (!response.ok) {
          console.error(`Failed to fetch from ${source}: ${response.status}`);
          continue;
        }

        const data: RapidApiResponse = await response.json();
        
        if (data.success && data.data) {
          console.log(`Found ${data.data.length} articles from ${source}`);
          allArticles.push(...data.data);
        } else {
          console.warn(`No articles found from ${source}:`, data.message);
        }

        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error fetching from ${source}:`, error);
      }
    }

    console.log(`Total articles found: ${allArticles.length}`);
    return allArticles;
  }
}