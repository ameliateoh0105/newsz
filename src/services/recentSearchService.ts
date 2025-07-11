import { RecentSearch } from '../types/news';

export class RecentSearchService {
  private static readonly STORAGE_KEY = 'newsHub_recentSearches';
  private static readonly MAX_SEARCHES = 10;

  static getRecentSearches(): RecentSearch[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load recent searches:', error);
      return [];
    }
  }

  static addRecentSearch(query: string, sources: string[]): void {
    try {
      const searches = this.getRecentSearches();
      
      // Remove existing search with same query
      const filtered = searches.filter(search => search.query.toLowerCase() !== query.toLowerCase());
      
      // Add new search at the beginning
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        query,
        timestamp: new Date().toISOString(),
        sources
      };
      
      filtered.unshift(newSearch);
      
      // Keep only the most recent searches
      const trimmed = filtered.slice(0, this.MAX_SEARCHES);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  }

  static filterRecentSearches(query: string): RecentSearch[] {
    const searches = this.getRecentSearches();
    if (!query.trim()) return searches;
    
    return searches.filter(search => 
      search.query.toLowerCase().includes(query.toLowerCase())
    );
  }

  static clearRecentSearches(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  }
}