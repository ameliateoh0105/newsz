import React from 'react';
import { Search, FileText } from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'bookmarks';
  searchQuery?: string;
}

export default function EmptyState({ type, searchQuery }: EmptyStateProps) {
  if (type === 'search') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
        <p className="text-gray-600 max-w-md">
          {searchQuery 
            ? `We couldn't find any articles matching "${searchQuery}". Try adjusting your search terms or browse different categories.`
            : "No articles match your current filters. Try selecting a different category or clearing your search."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileText className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
      <p className="text-gray-600 max-w-md">
        Start bookmarking articles you want to read later. Click the bookmark icon on any article to save it here.
      </p>
    </div>
  );
}