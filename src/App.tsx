import React, { useState } from 'react';
import Header from './components/Header';
import SearchPage from './components/SearchPage';
import CategoryTabs from './components/CategoryTabs';
import ArticleCard from './components/ArticleCard';
import ArticleModal from './components/ArticleModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';
import LatestNewsSection from './components/LatestNewsSection';
import { useNews } from './hooks/useNews';
import { Article } from './types/news';

function App() {
  const {
    articles,
    bookmarkedArticles,
    loading,
    fetchingFromWeb,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    toggleBookmark,
    fetchFromWeb
  } = useNews();

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [searchPageQuery, setSearchPageQuery] = useState('');

  const displayArticles = showBookmarks ? bookmarkedArticles : articles;

  const handleArticleClick = (article: Article) => {
    // Only show modal if article doesn't have a URL (fallback behavior)
    if (!article.url) {
      setSelectedArticle(article);
    }
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  const handleBookmarkToggle = (articleId: string) => {
    toggleBookmark(articleId);
    // Update the selected article if it's currently open
    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle({
        ...selectedArticle,
        isBookmarked: !selectedArticle.isBookmarked
      });
    }
  };

  const handleSearchPageOpen = (query: string = '') => {
    setSearchPageQuery(query);
    setShowSearchPage(true);
  };

  const handleSearchPageClose = () => {
    setShowSearchPage(false);
    setSearchPageQuery('');
  };

  // Show search page if requested
  if (showSearchPage) {
    return (
      <SearchPage
        initialQuery={searchPageQuery}
        onBack={handleSearchPageClose}
        onBookmarkToggle={handleBookmarkToggle}
        onArticleClick={handleArticleClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchFocus={handleSearchPageOpen}
        showBookmarks={showBookmarks}
        onToggleBookmarks={() => setShowBookmarks(!showBookmarks)}
        onFetchFromWeb={fetchFromWeb}
        isFetching={fetchingFromWeb}
      />
      
      {!showBookmarks && (
        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <LatestNewsSection onNewsUpdate={() => window.location.reload()} />
        </div>

        {showBookmarks && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Bookmarks</h2>
            <p className="text-gray-600">Articles you've saved for later reading</p>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : displayArticles.length === 0 ? (
          <EmptyState 
            type={showBookmarks ? 'bookmarks' : 'search'} 
            searchQuery={searchQuery}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onBookmarkToggle={handleBookmarkToggle}
                onClick={handleArticleClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Only show modal for articles without URLs */}
      <ArticleModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={handleCloseModal}
        onBookmarkToggle={handleBookmarkToggle}
      />
    </div>
  );
}

export default App;