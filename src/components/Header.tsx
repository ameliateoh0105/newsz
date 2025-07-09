import React, { useState } from 'react';
import { Search, Bookmark, Newspaper, User, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showBookmarks: boolean;
  onToggleBookmarks: () => void;
  onFetchFromWeb?: (query: string) => void;
  isFetching?: boolean;
}

export default function Header({ 
  searchQuery, 
  onSearchChange, 
  showBookmarks, 
  onToggleBookmarks,
  onFetchFromWeb,
  isFetching = false
}: HeaderProps) {
  const { user, signOut, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      onToggleBookmarks();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleFetchFromWeb = () => {
    if (searchQuery.trim() && onFetchFromWeb) {
      console.log('Triggering web search for:', searchQuery.trim());
      onFetchFromWeb(searchQuery.trim());
    }
  };
  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NewsHub</h1>
                <p className="text-xs text-gray-500">Premium News Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={`pl-10 ${searchQuery.trim() ? 'pr-24' : 'pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 sm:w-80`}
                  />
                
                {searchQuery.trim() && onFetchFromWeb && (
                  <button
                    onClick={handleFetchFromWeb}
                    disabled={isFetching}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors ${
                      isFetching
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                    title="Trigger Pipedream webhook"
                  >
                    <Globe className="w-3 h-3" />
                    <span>
                      {isFetching ? 'Triggering...' : 'Webhook'}
                    </span>
                  </button>
                )}
              </div>
              
              <button
                onClick={handleBookmarkClick}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  showBookmarks 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">Bookmarks</span>
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700 hidden sm:inline">
                      {user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}