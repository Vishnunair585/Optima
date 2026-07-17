-- AI Market Intelligence & Dynamic Ranking Schema
-- Run this in your Supabase SQL Editor

-- 1. Tools Table (Core Product Directory)
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  vendor TEXT NOT NULL,
  category TEXT NOT NULL,
  website TEXT,
  pricing_model TEXT,
  has_free_tier BOOLEAN DEFAULT false,
  has_api BOOLEAN DEFAULT false,
  platforms TEXT[],
  release_date DATE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  latest_version TEXT,
  supported_models TEXT[],
  popularity_score NUMERIC(5, 2) DEFAULT 0,
  growth_score NUMERIC(5, 2) DEFAULT 0,
  community_score NUMERIC(5, 2) DEFAULT 0,
  review_score NUMERIC(5, 2) DEFAULT 0,
  reliability_score NUMERIC(5, 2) DEFAULT 0,
  overall_score NUMERIC(5, 2) DEFAULT 0,
  trend_indicator TEXT, -- 'rising', 'declining', 'new', 'hot'
  last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. News Table (Aggregated verified intelligence)
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headline TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  related_tool_ids UUID[] DEFAULT '{}',
  confidence_score NUMERIC(5, 2) DEFAULT 100,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Market Updates (Staging for automated detection pending Admin review)
CREATE TABLE IF NOT EXISTS market_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id), -- Nullable if it's a new tool discovery
  update_type TEXT NOT NULL, -- 'pricing_change', 'new_feature', 'new_tool', etc.
  raw_data JSONB NOT NULL,
  source_urls TEXT[] NOT NULL,
  confidence_score NUMERIC(5, 2),
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'merged'
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID -- References admin user ID
);

-- 4. Ranking History (To track volatility and trends over time)
CREATE TABLE IF NOT EXISTS ranking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) NOT NULL,
  score_snapshot NUMERIC(5, 2) NOT NULL,
  rank_position INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Add necessary RLS policies after creating tables to restrict admin routes and allow public read access.
