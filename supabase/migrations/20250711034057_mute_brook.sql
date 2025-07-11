/*
  # Add searchedAt column to articles table

  1. Schema Changes
    - Add `searchedAt` column to articles table for tracking when articles were found via search
    - Set as nullable timestamptz field
    - Add index for better query performance

  2. Purpose
    - Track when articles were discovered through search functionality
    - Enable filtering and sorting of search results by discovery time
*/

-- Add searchedAt column to articles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'searchedAt'
  ) THEN
    ALTER TABLE articles ADD COLUMN "searchedAt" timestamptz;
  END IF;
END $$;

-- Add index for better performance when querying by searchedAt
CREATE INDEX IF NOT EXISTS idx_articles_searched_at ON articles("searchedAt");