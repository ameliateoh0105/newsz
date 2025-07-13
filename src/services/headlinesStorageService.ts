import { supabase } from '../lib/supabase';
import { ProcessedHeadline } from './topHeadlinesService';

export class HeadlinesStorageService {
  static async storeHeadlines(headlines: ProcessedHeadline[]): Promise<void> {
    console.log(`Storing ${headlines.length} headlines in Supabase...`);
    let storedCount = 0;

    for (const headline of headlines) {
      try {
        // Check if headline already exists by URL to avoid duplicates
        const { data: existingHeadline, error: checkError } = await supabase
          .from('articles')
          .select('id')
          .eq('url', headline.url)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking for existing headline:', checkError);
          continue;
        }

        if (existingHeadline) {
          console.log(`Headline already exists: ${headline.title}`);
          continue;
        }

        // Prepare headline data with exact column names
        const headlineData = {
          id: headline.id,
          title: headline.title,
          excerpt: headline.excerpt,
          url: headline.url,
          publishedAt: headline.publishedAt,
          author: headline.author,
          category: headline.category,
          content: headline.content,
          imageUrl: headline.imageUrl,
          readTime: headline.readTime,
          source: headline.source
        };

        console.log('Storing headline:', {
          id: headlineData.id,
          title: headlineData.title,
          url: headlineData.url
        });

        // Insert headline into database
        const { error } = await supabase
          .from('articles')
          .insert(headlineData);

        if (error) {
          console.error('Failed to store headline:', error.message);
          console.error('Headline data:', headlineData);
          continue;
        }

        console.log(`Successfully stored: ${headline.title}`);
        storedCount++;
      } catch (error) {
        console.error('Error processing headline:', error);
      }
    }

    console.log(`Successfully stored ${storedCount} out of ${headlines.length} headlines`);
  }

  static async getRecentHeadlines(limit: number = 20): Promise<ProcessedHeadline[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('publishedAt', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch recent headlines:', error);
      return [];
    }

    return data.map(article => ({
      id: article.id,
      title: article.title || 'Untitled',
      excerpt: article.excerpt || article.summary || '',
      content: article.content || '',
      author: article.author || 'Unknown Author',
      source: article.source || 'Unknown Source',
      publishedAt: article.publishedAt || new Date().toISOString(),
      imageUrl: article.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: article.category || 'business',
      readTime: parseInt(article.readTime?.toString() || '5'),
      url: article.url || '',
      fetchedAt: article.fetchedAt || new Date().toISOString()
    }));
  }
}