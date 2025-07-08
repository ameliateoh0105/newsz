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

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

export class NewsApiService {
  private static readonly API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  private static readonly BASE_URL = 'https://newsapi.org/v2';
  
  // Add CORS proxy for development
  private static readonly CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  static async searchArticles(query: string): Promise<NewsApiArticle[]> {
    if (!this.API_KEY) {
      const error = 'News API key not configured. Please add VITE_NEWS_API_KEY to your .env file';
      console.error(error);
      throw new Error(error);
    }

    console.log('Searching News API with query:', query);
    console.log('API Key present:', !!this.API_KEY);
    console.log('API Key (first 10 chars):', this.API_KEY?.substring(0, 10) + '...');

    try {
      // Calculate date 5 days ago
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      const fromDate = fiveDaysAgo.toISOString().split('T')[0];

      const params = new URLSearchParams({
        q: query,
        domains: 'bbc.com',
        from: fromDate,
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: '20',
        apiKey: this.API_KEY
      });

      const apiUrl = `${this.BASE_URL}/everything?${params}`;
      console.log('Making request to:', apiUrl.replace(this.API_KEY, 'API_KEY_HIDDEN'));
      
      // Try direct request first, then with CORS proxy if needed
      let response;
      try {
        response = await fetch(apiUrl);
      } catch (corsError) {
        console.log('Direct request failed, trying with CORS proxy...');
        response = await fetch(`${this.CORS_PROXY}${apiUrl}`);
      }
      
      console.log('News API response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('News API error response:', errorText);
        
        // Parse error response if it's JSON
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(`News API error: ${errorData.message || errorData.code || 'Unknown error'}`);
        } catch {
          throw new Error(`News API request failed: ${response.status} - ${errorText}`);
        }
      }

      const data: NewsApiResponse = await response.json();
      
      console.log('Full API response:', data);
      
      if (data.status !== 'ok') {
        console.error('News API error response:', data);
        throw new Error(`News API error: ${(data as any).message || 'Unknown error'}`);
      }

      console.log(`Found ${data.articles.length} articles from News API`);
      if (data.articles.length > 0) {
        console.log('Sample article:', data.articles[0]);
      }

      return data.articles.filter(article => 
        article.title && 
        article.description && 
        article.url &&
        article.title !== '[Removed]' &&
        article.description !== '[Removed]'
      );
    } catch (error) {
      console.error('Failed to fetch from News API:', error);
      
      // Provide more helpful error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to News API. Check your internet connection.');
      }
      
      throw error;
    }
  }

  static async getTopHeadlines(category?: string): Promise<NewsApiArticle[]> {
    if (!this.API_KEY) {
      console.warn('News API key not configured');
      return [];
    }

    try {
      const params = new URLSearchParams({
        country: 'us',
        pageSize: '20',
        apiKey: this.API_KEY
      });

      if (category && category !== 'all') {
        params.append('category', category);
      }

      const response = await fetch(`${this.BASE_URL}/top-headlines?${params}`);
      
      if (!response.ok) {
        throw new Error(`News API request failed: ${response.status}`);
      }

      const data: NewsApiResponse = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error('News API returned error status');
      }

      return data.articles.filter(article => 
        article.title && 
        article.description && 
        article.url &&
        article.title !== '[Removed]' &&
        article.description !== '[Removed]'
      );
    } catch (error) {
      console.error('Failed to fetch top headlines:', error);
      return [];
    }
  }
}