const Database = require('better-sqlite3');
const db = new Database('sqlite.db');

db.exec(`
-- Ecosystem: Resources
CREATE TABLE IF NOT EXISTS content_articles (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT DEFAULT '[]' NOT NULL,
  status TEXT DEFAULT 'draft' NOT NULL,
  author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  cover_image TEXT,
  read_time INTEGER DEFAULT 5 NOT NULL,
  difficulty TEXT,
  views_count INTEGER DEFAULT 0 NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  published_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS content_comments (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES content_articles(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

-- Ecosystem: Legal & Compliance
CREATE TABLE IF NOT EXISTS legal_policies (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT DEFAULT 'draft' NOT NULL,
  effective_date INTEGER NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS consent_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  consent_type TEXT NOT NULL,
  consented INTEGER NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

-- Ecosystem: Community Hub
CREATE TABLE IF NOT EXISTS community_feature_requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'under_review' NOT NULL,
  votes_count INTEGER DEFAULT 0 NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS community_votes (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES community_feature_requests(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS creator_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  twitter_url TEXT,
  github_url TEXT,
  website_url TEXT,
  reputation_score INTEGER DEFAULT 0 NOT NULL,
  is_verified INTEGER DEFAULT 0 NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS creator_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  awarded_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

-- Default legal policies
INSERT OR IGNORE INTO legal_policies (id, type, title, content, version, status, effective_date) VALUES 
('pol-1', 'privacy', 'Privacy Policy', 'We take your privacy seriously. This policy explains how we collect, use, and protect your data.', '1.0', 'published', (strftime('%s', 'now')) * 1000),
('pol-2', 'terms', 'Terms of Service', 'By using AIRank, you agree to these terms. Please read them carefully.', '1.0', 'published', (strftime('%s', 'now')) * 1000),
('pol-3', 'cookie', 'Cookie Policy', 'We use cookies to improve your experience, analytics, and personalization.', '1.0', 'published', (strftime('%s', 'now')) * 1000);
`);
console.log('Ecosystem migration completed successfully');
