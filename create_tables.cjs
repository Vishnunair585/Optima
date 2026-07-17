const db = require('better-sqlite3')('optima.db');
const sql = `
CREATE TABLE IF NOT EXISTS community_feature_requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'under_review',
  votes_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS community_votes (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS creator_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  bio TEXT,
  twitter_url TEXT,
  github_url TEXT,
  website_url TEXT,
  reputation_score INTEGER NOT NULL DEFAULT 0,
  is_verified INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS creator_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  awarded_at INTEGER NOT NULL
);
`;
db.exec(sql);
console.log('Tables created');
