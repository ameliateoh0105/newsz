import { useState, useEffect } from 'react';
import { TopHeadlinesService, ProcessedHeadline, Country } from '../services/topHeadlinesService';

export function useTopHeadlines() {
  const [headlines, setHeadlines] = useState<{
    US: ProcessedHeadline[];
    HK: ProcessedHeadline[];
    CN: ProcessedHeadline[];
  }>({
    US: [],
    HK: [],
    CN: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Starting to fetch top headlines...');
        const allHeadlines = await TopHeadlinesService.fetchAllTopHeadlines();
        
        console.log('Headlines fetched:', {
          US: allHeadlines.US.length,
          HK: allHeadlines.HK.length,
          CN: allHeadlines.CN.length
        });
        
        setHeadlines(allHeadlines);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch top headlines';
        console.error('Error in useTopHeadlines:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Fetch headlines when component mounts (app opens)
    fetchHeadlines();
  }, []);

  const getHeadlinesByCountry = (country: Country): ProcessedHeadline[] => {
    return headlines[country] || [];
  };

  const getTotalHeadlinesCount = (): number => {
    return headlines.US.length + headlines.HK.length + headlines.CN.length;
  };

  return {
    headlines,
    loading,
    error,
    getHeadlinesByCountry,
    getTotalHeadlinesCount
  };
}