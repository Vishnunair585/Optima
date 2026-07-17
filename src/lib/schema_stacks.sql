-- Public AI Stack Intelligence Engine Schema
-- Run this in your Supabase SQL Editor

-- 1. Creators Profile (Users who publish stacks)
CREATE TABLE IF NOT EXISTS stack_creators (
  id UUID PRIMARY KEY REFERENCES users(id), -- Assuming users table exists
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  website TEXT,
  github_url TEXT,
  twitter_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  creator_score NUMERIC(5, 2) DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Public Stacks Core
CREATE TABLE IF NOT EXISTS public_stacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES stack_creators(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  problem_solved TEXT,
  target_audience TEXT,
  estimated_time_saved TEXT, -- e.g., '10 hours/week'
  difficulty TEXT, -- 'Beginner', 'Intermediate', 'Advanced'
  cost_estimate TEXT, -- e.g., '$20/month', 'Free'
  automation_level TEXT, -- 'Full', 'Partial', 'Manual'
  industry TEXT,
  source_url TEXT, -- If scraped/imported
  confidence_score NUMERIC(5, 2) DEFAULT 100,
  is_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending', -- 'pending', 'published', 'rejected', 'archived'
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  community_rating NUMERIC(3, 2) DEFAULT 0.0,
  quality_score NUMERIC(5, 2) DEFAULT 0,
  overall_rank_score NUMERIC(5, 2) DEFAULT 0,
  last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Stack Steps (The actual workflow)
CREATE TABLE IF NOT EXISTS stack_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stack_id UUID REFERENCES public_stacks(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tools_used UUID[], -- Array of Tool IDs
  expected_output TEXT
);

-- 4. Stack Categories & Tags
CREATE TABLE IF NOT EXISTS stack_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS stack_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS stack_category_map (
  stack_id UUID REFERENCES public_stacks(id) ON DELETE CASCADE,
  category_id UUID REFERENCES stack_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (stack_id, category_id)
);

CREATE TABLE IF NOT EXISTS stack_tag_map (
  stack_id UUID REFERENCES public_stacks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES stack_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (stack_id, tag_id)
);

-- 5. Interactions
CREATE TABLE IF NOT EXISTS stack_saves (
  user_id UUID NOT NULL, -- References users(id)
  stack_id UUID REFERENCES public_stacks(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, stack_id)
);

CREATE TABLE IF NOT EXISTS stack_ratings (
  user_id UUID NOT NULL,
  stack_id UUID REFERENCES public_stacks(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, stack_id)
);

-- 6. Moderation & Imports
CREATE TABLE IF NOT EXISTS stack_moderation_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stack_id UUID REFERENCES public_stacks(id) ON DELETE CASCADE,
  imported_from_url TEXT,
  validation_errors JSONB,
  confidence_score NUMERIC(5, 2),
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  moderated_by UUID, -- References admin user ID
  moderated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
