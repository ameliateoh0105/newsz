import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Clock, Check, Loader, X } from 'lucide-react';
import { SearchSource, RecentSearch } from '../types/news';
import { RecentSearchService } from '../services/recentSearchService';
import { RapidApiService } from '../services/rapidApiService';
import { SearchStorageService } from '../services/searchStorageService';
import ArticleCard from './ArticleCard';
import { Article } from '../types/news';

interface SearchPageProps {
  initialQuery?: string;
  onBack: () => void;
  onBookmarkToggle: (articleId: string) => void;
  onArticleClick: (article: Article) => void;
}

const SEARCH_SOURCES: SearchSource[] = [
  { id: 'wsj', name: 'Wall Street Journal', domain: 'wsj.com', selected: false },
  { id: 'nyt', name: 'NY Times', domain: 'nytimes.com', selected: false },
  { id: 'bloomberg', name: 'Bloomberg', domain: 'bloomberg.com', selected: false },
  { id: 'bbc', name: 'BBC', domain: 'bbc.com', selected: false },
  { id: 'cnn', name: 'CNN', domain: 'cnn.com', selected: false },
  { id: 'reuters', name: 'Reuters', domain: 'reuters.com', selected: false },
  { id: 'guardian', name: 'The Guardian', domain: 'theguardian.com', selected: false },
  { id: 'washpost', name: 'Washington Post', domain: 'washingtonpost.com', selected: false },
  { id: 'forbes', name: 'Forbes', domain: 'forbes.com', selected: false },
  { id: 'economist', name: 'The Economist', domain: 'economist.com', selected: false },
  { id: 'ft', name: 'Financial Times', domain: 'ft.com', selected: false },
  { id: 'ap', name: 'Associated Press', domain: 'apnews.com', selected: false },
  { id: 'fox', name: 'Fox News', domain: 'foxnews.com', selected: false },
];

export default function SearchPage({ initialQuery = '', onBack, onBookmarkToggle, onArticleClick }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sources, setSources] = useState<SearchSource[]>(SEARCH_SOURCES);
  const [customDomain, setCustomDomain] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [filteredSearches, setFilteredSearches] = useState<RecentSearch[]>([]);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    loadRecentSearches();
    loadRecentResults();
  }, []);

  useEffect(() => {
    const filtered = RecentSearchService.filterRecentSearches(searchQuery);
    setFilteredSearches(filtered);
  }, [searchQuery, recentSearches]);

  const loadRecentSearches = () => {
    const searches = RecentSearchService.getRecentSearches();
    setRecentSearches(searches);
    setFilteredSearches(searches);
  };

  const loadRecentResults = async () => {
    const results = await SearchStorageService.getRecentSearchResults();
    setSearchResults(results);
  };

  const handleSourceToggle = (sourceId: string) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, selected: !source.selected }
        : source
    ));
  };

  const handleSelectAll = () => {
    const allSelected = sources.every(source => source.selected);
    setSources(prev => prev.map(source => ({
      ...source,
      selected: !allSelected
    })));
  };
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const selectedSources = sources.filter(s => s.selected);
    const hasCustomDomain = customDomain.trim();
    
    if (selectedSources.length === 0 && !hasCustomDomain) {
      alert('Please select at least one news source or enter a custom domain');
      return;
    }

    setIsSearching(true);
    setShowSources(false);

    try {
      console.log('Starting search for:', searchQuery);
      
      // Prepare domains to search
      const domains = selectedSources.map(s => s.domain);
      if (hasCustomDomain) {
        domains.push(customDomain.trim());
      }
      
      // Search articles from selected domains
      const articles = await RapidApiService.searchArticles(searchQuery, domains);
      
      console.log(`RapidAPI returned ${articles.length} articles`);
      
      if (articles.length > 0) {
        // Store articles in database
        const storedArticles = await SearchStorageService.storeSearchResults(articles, searchQuery);
        
        console.log(`Successfully stored ${storedArticles.length} articles in database`);
        
        // Add to recent searches
        const sourceNames = selectedSources.map(s => s.name);
        if (hasCustomDomain) {
          sourceNames.push(customDomain.trim());
        }
        RecentSearchService.addRecentSearch(searchQuery, sourceNames);
        
        // Refresh recent searches and results
        loadRecentSearches();
        loadRecentResults();
        
        console.log(`Search completed: ${storedArticles.length} articles stored`);
      } else {
        console.log('No articles found for the search query');
        // Still add to recent searches even if no results
        RecentSearchService.addRecentSearch(searchQuery, sourceNames);
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecentSearchClick = (search: RecentSearch) => {
    setSearchQuery(search.query);
    
    // Reset all sources first
    setSources(prev => prev.map(source => ({ ...source, selected: false })));
    setCustomDomain('');
    
    // Auto-select the sources from the recent search
    setSources(prev => prev.map(source => ({
      ...source,
      selected: search.sources.includes(source.name)
    })));
    
    // Check if there's a custom domain in the recent search
    const knownSources = SEARCH_SOURCES.map(s => s.name);
    const customDomains = search.sources.filter(source => !knownSources.includes(source));
    if (customDomains.length > 0) {
      setCustomDomain(customDomains[0]); // Use the first custom domain
    }
    
    setShowSources(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectedSourcesCount = sources.filter(s => s.selected).length;
  const totalSelected = selectedSourcesCount + (customDomain.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSources(true)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Source Selection */}
        {showSources && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select News Sources</h3>
              <button
                onClick={() => setShowSources(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Predefined Sources</span>
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {sources.every(s => s.selected) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {sources.map((source) => (
                <label
                  key={source.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    source.selected
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={source.selected}
                    onChange={() => handleSourceToggle(source.id)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    source.selected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`}>
                    {source.selected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-xs font-medium">{source.name}</span>
                </label>
              ))}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Domain (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., techcrunch.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a domain name to search from a custom news source
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {totalSelected} source{totalSelected !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleSearch}
                disabled={isSearching || (selectedSourcesCount === 0 && !customDomain.trim()) || !searchQuery.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!showSources && filteredSearches.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Searches</span>
            </h3>
            
            <div className="space-y-2">
              {filteredSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{search.query}</span>
                    <span className="text-sm text-gray-500">{formatDate(search.timestamp)}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Sources: {search.sources.join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Search Results ({searchResults.length})
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onBookmarkToggle={onBookmarkToggle}
                  onClick={onArticleClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showSources && filteredSearches.length === 0 && searchResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Search</h3>
            <p className="text-gray-600">
              Click on the search bar above to begin searching for news articles from premium sources.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}