export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string | null;
          summary: string | null;
          url: string | null;
          publishedAt: string | null;
          author: string | null;
          category: string | null;
          content: string | null;
          imageUrl: string | null;
          readTime: string | null;
          source: string | null;
        };
        Insert: {
          id?: string;
          title?: string | null;
          summary?: string | null;
          url?: string | null;
          publishedAt?: string | null;
          author?: string | null;
          category?: string | null;
          content?: string | null;
          imageUrl?: string | null;
          readTime?: string | null;
          source?: string | null;
        };
        Update: {
          id?: string;
          title?: string | null;
          summary?: string | null;
          url?: string | null;
          publishedAt?: string | null;
          author?: string | null;
          category?: string | null;
          content?: string | null;
          imageUrl?: string | null;
          readTime?: string | null;
          source?: string | null;
        };
      };
      user_bookmarks: {
        Row: {
          id: string;
          user_id: string;
          article_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          article_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          article_id?: string;
          created_at?: string;
        };
      };
    };
  };
}