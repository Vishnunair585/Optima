const Database = require('better-sqlite3');
const db = new Database('sqlite.db');

db.exec(`
CREATE TABLE IF NOT EXISTS changelog_releases (
  id TEXT PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  release_name TEXT NOT NULL,
  release_date INTEGER NOT NULL,
  type TEXT NOT NULL,
  impact TEXT NOT NULL,
  author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' NOT NULL,
  overview TEXT NOT NULL,
  new_features TEXT,
  improvements TEXT,
  bug_fixes TEXT,
  performance_optimizations TEXT,
  security_enhancements TEXT,
  breaking_changes TEXT,
  migration_notes TEXT,
  deprecated_features TEXT,
  known_issues TEXT,
  upcoming_features TEXT,
  seo_title TEXT,
  meta_description TEXT,
  cover_image_url TEXT,
  categories TEXT DEFAULT '[]' NOT NULL,
  tags TEXT DEFAULT '[]' NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS changelog_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  active INTEGER DEFAULT 1 NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);
`);
console.log('Changelog tables created successfully');
