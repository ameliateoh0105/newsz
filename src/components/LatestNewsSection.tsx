import React, { useState } from 'react';
import { TrendingUp, Check, Search, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { TrendingNewsService } from '../services/trendingNewsService';
import { TrendingStorageService } from '../services/trendingStorageService';

interface LatestNewsSectionProps {
  onNewsUpdate?: () => void;
}

const CATEGORIES = [
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'politics', label: 'Politics', emoji: '🏛️' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'health', label: 'Health', emoji: '🏥' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
];

export default function LatestNewsSection({ onNewsUpdate }: LatestNewsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === CATEGORIES.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(CATEGORIES.map(cat => cat.id));
    }
  };

  const handleSearch = async () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }

    setIsSearching(true);

    try {
      console.log('Starting trending news search for categories:', selectedCategories);
      
      // Fetch trending articles from API
      const articles = await TrendingNewsService.fetchTrendingNews(selectedCategories);
      
      console.log(`Trending API returned ${articles.length} articles`);
      
      if (articles.length > 0) {
        // Store articles in database
        const storedArticles = await TrendingStorageService.storeTrendingArticles(articles);
        
        console.log(`Successfully stored ${storedArticles.length} trending articles in database`);
        
        // Notify parent component to refresh articles
        if (onNewsUpdate) {
          onNewsUpdate();
        }
        
        // Collapse the section after successful search
        setIsExpanded(false);
        
        console.log(`Trending news search completed: ${storedArticles.length} articles stored`);
      } else {
        console.log('No trending articles found for the selected categories');
        alert('No trending articles found for the selected categories. Please try different categories.');
      }
    } catch (error) {
      console.error('Trending news search failed:', error);
      alert('Failed to fetch trending news. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectedCount = selectedCategories.length;
  const allSelected = selectedCount === CATEGORIES.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
              Get Latest News
            </h2>
            <p className="text-sm text-gray-500">
              {isExpanded ? 'Select categories to fetch trending news' : 'Click to fetch trending news by category'}
            </p>
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Select Categories</h3>
              <button
                onClick={handleSelectAll}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((category) => (
                <label
                  key={category.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedCategories.includes(category.id)
                      ? 'bg-green-50 border-green-200 text-green-900'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedCategories.includes(category.id) 
                      ? 'bg-green-600 border-green-600' 
                      : 'border-gray-300'
                  }`}>
                    {selectedCategories.includes(category.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-lg">{category.emoji}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedCount} categor{selectedCount !== 1 ? 'ies' : 'y'} selected
            </span>
            <button
              onClick={handleSearch}
              disabled={isSearching || selectedCount === 0}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}