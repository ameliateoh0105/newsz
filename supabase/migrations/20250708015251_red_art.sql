/*
  # Add support for external articles from News API

  1. Schema Changes
    - Add `url` field to articles table if not exists
    - Add `source` field to articles table to store source name directly
    - Add `external_id` field to track external article IDs
    - Add indexes for better performance

  2. Data Quality
    - Ensure articles can store external URLs
    - Support for external source names
    - Prevent duplicate articles from same external source
*/

-- Add new columns to articles table if they don't exist
DO $$
BEGIN
  -- Add url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'url'
  ) THEN
    ALTER TABLE articles ADD COLUMN url text;
  END IF;

  -- Add source column if it doesn't exist (for direct source name storage)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'source'
  ) THEN
    ALTER TABLE articles ADD COLUMN source text;
  END IF;

  -- Add external_id column for tracking external articles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'external_id'
  ) THEN
    ALTER TABLE articles ADD COLUMN external_id text;
  END IF;

  -- Add is_external flag to distinguish external vs internal articles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'is_external'
  ) THEN
    ALTER TABLE articles ADD COLUMN is_external boolean DEFAULT false;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_external_id ON articles(external_id);
CREATE INDEX IF NOT EXISTS idx_articles_is_external ON articles(is_external);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- Create unique constraint to prevent duplicate external articles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'unique_external_article'
  ) THEN
    ALTER TABLE articles ADD CONSTRAINT unique_external_article 
    UNIQUE(external_id, url) DEFERRABLE INITIALLY DEFERRED;
  END IF;
EXCEPTION
  WHEN duplicate_table THEN
    -- Constraint already exists, ignore
    NULL;
END $$;