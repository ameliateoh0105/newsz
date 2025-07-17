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


  static async searchArticles(query: string, domains: string[]): Promise<RapidApiArticle[]> {
    console.log('Searching RapidAPI with query:', query, 'domains:', domains);
    
    const allArticles: RapidApiArticle[] = [];

    for (const domain of domains) {
      try {
        console.log(`Fetching from ${domain}`);

        const params = new URLSearchParams({
          query: query,
          language: 'en',
          publisher: domain,
          from: '1d'
        });

        const response = await fetch(`${this.BASE_URL}?${params}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'news-api14.p.rapidapi.com',
            'x-rapidapi-key': this.API_KEY
          }
        });

        if (!response.ok) {
          console.error(`Failed to fetch from ${domain}: ${response.status}`);
          continue;
        }

        const data: RapidApiResponse = await response.json();
        
        if (data.success && data.data) {
          console.log(`Found ${data.data.length} articles from ${domain}`);
          allArticles.push(...data.data);
        } else {
          console.warn(`No articles found from ${domain}:`, data.message);
        }

        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error fetching from ${domain}:`, error);
      }
    }

    console.log(`Total articles found: ${allArticles.length}`);
    return allArticles;
  }
}