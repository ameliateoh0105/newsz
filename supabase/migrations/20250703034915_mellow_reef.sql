/*
  # NewsHub Database Schema

  1. New Tables
    - `news_sources`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `url` (text)
      - `category` (text)
      - `created_at` (timestamp)
    
    - `articles`
      - `id` (uuid, primary key)
      - `title` (text)
      - `summary` (text)
      - `content` (text)
      - `author` (text)
      - `source_id` (uuid, foreign key)
      - `published_at` (timestamp)
      - `image_url` (text)
      - `category` (text)
      - `read_time` (integer)
      - `created_at` (timestamp)
    
    - `user_bookmarks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `article_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their bookmarks
    - Public read access for articles and news sources
*/

-- Create news_sources table
CREATE TABLE IF NOT EXISTS news_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  url text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  content text NOT NULL,
  author text NOT NULL,
  source_id uuid REFERENCES news_sources(id),
  published_at timestamptz NOT NULL,
  image_url text,
  category text NOT NULL,
  read_time integer DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

-- Create user_bookmarks table
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable Row Level Security
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for news_sources (public read)
CREATE POLICY "Anyone can read news sources"
  ON news_sources
  FOR SELECT
  TO public
  USING (true);

-- Create policies for articles (public read)
CREATE POLICY "Anyone can read articles"
  ON articles
  FOR SELECT
  TO public
  USING (true);

-- Create policies for user_bookmarks
CREATE POLICY "Users can read own bookmarks"
  ON user_bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON user_bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON user_bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample news sources
INSERT INTO news_sources (name, description, url, category) VALUES
  ('Wall Street Journal', 'Business and financial news', 'https://wsj.com', 'business'),
  ('Bloomberg', 'Financial and business news', 'https://bloomberg.com', 'business'),
  ('TechCrunch', 'Technology startup news', 'https://techcrunch.com', 'technology'),
  ('Reuters', 'Global news and business', 'https://reuters.com', 'politics')
ON CONFLICT DO NOTHING;