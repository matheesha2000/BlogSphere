-- Run this in Supabase Dashboard → SQL Editor

-- 1. Add the missing 'published' column to the posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;

-- 2. Mark all existing posts as published (so nothing disappears)
UPDATE posts SET published = true WHERE published IS NULL;
