import React, { useState } from 'react';
import { Globe, ArrowLeft } from 'lucide-react';
import { useTopHeadlines } from '../hooks/useTopHeadlines';
import ArticleCard from './ArticleCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { Article } from '../types/news';

interface TopHeadlinesSectionProps {
  onBookmarkToggle: (articleId: string) => void;
  onArticleClick: (article: Article) => void;
}

export default function TopHeadlinesSection({ onBookmarkToggle, onArticleClick }: TopHeadlinesSectionProps) {
  const { headlines, loading, error, getTotalHeadlinesCount } = useTopHeadlines();
  const [showAllHeadlines, setShowAllHeadlines] = useState(false);

  // Convert ProcessedHeadline to Article for compatibility
  const convertToArticle = (headline: any): Article => ({
    id: headline.id,
    title: headline.title,
    summary: headline.excerpt,
    content: headline.content,
    author: headline.author,
    source: headline.source,
    publishedAt: headline.publishedAt,
    imageUrl: headline.imageUrl,
    category: headline.category as any,
    readTime: headline.readTime,
    url: headline.url,
    isBookmarked: false
  });

  if (showAllHeadlines) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAllHeadlines(false)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Globe className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Top Headlines
              </h3>
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {headlines.length} articles
          </span>
        </div>

        {headlines.length === 0 ? (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No headlines available</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {headlines.map((headline) => (
              <ArticleCard
                key={headline.id}
                article={convertToArticle(headline)}
                onBookmarkToggle={onBookmarkToggle}
                onClick={onArticleClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Top Headlines</h2>
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${getTotalHeadlinesCount()} global headlines`}
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : getTotalHeadlinesCount() === 0 ? (
        <div className="text-center py-8">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Top Headlines Available</h3>
          <p className="text-gray-600">
            Unable to fetch headlines at the moment. Please try again later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setShowAllHeadlines(true)}
            className="w-full p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Globe className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    Global Top Headlines
                  </h3>
                  <p className="text-sm text-gray-500">
                    {headlines.length} latest headlines
                  </p>
                </div>
              </div>
            </div>
            
            {headlines.length > 0 && (
              <div className="space-y-2">
                {headlines.slice(0, 3).map((headline) => (
                  <div key={headline.id} className="text-sm text-gray-600 line-clamp-1">
                    • {headline.title}
                  </div>
                ))}
                {headlines.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{headlines.length - 3} more articles
                  </div>
                )}
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
}