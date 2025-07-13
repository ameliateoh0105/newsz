import { useState, useEffect } from 'react';
import { TopHeadlinesService, ProcessedHeadline } from '../services/topHeadlinesService';
import { HeadlinesStorageService } from '../services/headlinesStorageService';

export function useTopHeadlines() {
  const [headlines, setHeadlines] = useState<ProcessedHeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndStoreHeadlines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Starting to fetch global top headlines...');
        
        // Fetch headlines from API
        const fetchedHeadlines = await TopHeadlinesService.fetchTopHeadlines();
        
        console.log(`Fetched ${fetchedHeadlines.length} headlines from API`);
        
        if (fetchedHeadlines.length > 0) {
          // Store headlines in Supabase
          await HeadlinesStorageService.storeHeadlines(fetchedHeadlines);
          
          // Get recent headlines from database to display
          const recentHeadlines = await HeadlinesStorageService.getRecentHeadlines(50);
          setHeadlines(recentHeadlines);
          
          console.log(`Displaying ${recentHeadlines.length} recent headlines`);
        } else {
          console.log('No headlines fetched from API');
          // Still try to get existing headlines from database
          const existingHeadlines = await HeadlinesStorageService.getRecentHeadlines(50);
          setHeadlines(existingHeadlines);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch top headlines';
        console.error('Error in useTopHeadlines:', errorMessage);
        setError(errorMessage);
        
        // Try to get existing headlines from database as fallback
        try {
          const existingHeadlines = await HeadlinesStorageService.getRecentHeadlines(50);
          setHeadlines(existingHeadlines);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch headlines when component mounts (app opens)
    fetchAndStoreHeadlines();
  }, []);

  const getTotalHeadlinesCount = (): number => {
    return headlines.length;
  };

  return {
    headlines,
    loading,
    error,
    getTotalHeadlinesCount
  };
}