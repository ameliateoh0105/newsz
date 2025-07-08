import React from 'react';
import { Clock, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Article } from '../types/news';

interface ArticleCardProps {
  article: Article;
  onBookmarkToggle: (articleId: string) => void;
  onClick: (article: Article) => void;
}

export default function ArticleCard({ article, onBookmarkToggle, onClick }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      business: 'bg-blue-100 text-blue-800',
      technology: 'bg-green-100 text-green-800',
      politics: 'bg-red-100 text-red-800',
      sports: 'bg-yellow-100 text-yellow-800',
      health: 'bg-purple-100 text-purple-800',
      entertainment: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleArticleClick = () => {
    if (article.url) {
      // Open the article URL in a new tab
      window.open(article.url, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to modal if no URL is available
      onClick(article);
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <div onClick={handleArticleClick}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </span>
            <div className="flex items-center space-x-2">
              {article.url && (
                <ExternalLink className="w-4 h-4 text-gray-400" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmarkToggle(article.id);
                }}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                {article.isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-blue-600" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h2>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.summary}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="font-medium">{article.source}</span>
              <span>by {article.author}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} min</span>
              </div>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}