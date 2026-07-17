const Database = require('better-sqlite3');
const db = new Database('sqlite.db');

db.exec(`
-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  verified INTEGER DEFAULT 0 NOT NULL,
  active INTEGER DEFAULT 1 NOT NULL,
  preferences TEXT DEFAULT '{}' NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

-- Newsletter Campaigns
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT DEFAULT '[]' NOT NULL,
  status TEXT DEFAULT 'draft' NOT NULL,
  scheduled_at INTEGER,
  sent_at INTEGER,
  sent_count INTEGER DEFAULT 0 NOT NULL,
  open_count INTEGER DEFAULT 0 NOT NULL,
  click_count INTEGER DEFAULT 0 NOT NULL,
  author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  cover_image TEXT,
  read_time INTEGER DEFAULT 3 NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

-- Help Center Articles
CREATE TABLE IF NOT EXISTS help_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT DEFAULT '[]' NOT NULL,
  status TEXT DEFAULT 'draft' NOT NULL,
  author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  read_time INTEGER DEFAULT 5 NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,
  helpful_count INTEGER DEFAULT 0 NOT NULL,
  not_helpful_count INTEGER DEFAULT 0 NOT NULL,
  related_articles TEXT DEFAULT '[]' NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

-- System Status Services
CREATE TABLE IF NOT EXISTS status_services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'operational' NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  uptime_24h REAL DEFAULT 100.0 NOT NULL,
  uptime_7d REAL DEFAULT 100.0 NOT NULL,
  uptime_30d REAL DEFAULT 100.0 NOT NULL,
  uptime_90d REAL DEFAULT 100.0 NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

-- System Status Incidents
CREATE TABLE IF NOT EXISTS status_incidents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT DEFAULT 'investigating' NOT NULL,
  affected_services TEXT DEFAULT '[]' NOT NULL,
  timeline TEXT DEFAULT '[]' NOT NULL,
  root_cause TEXT,
  started_at INTEGER NOT NULL,
  resolved_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

-- Status Subscribers
CREATE TABLE IF NOT EXISTS status_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  active INTEGER DEFAULT 1 NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

-- Seed default services
INSERT OR IGNORE INTO status_services (id, name, description, status, sort_order, uptime_24h, uptime_7d, uptime_30d, uptime_90d) VALUES
  ('svc-web', 'Website', 'Main website and user interface', 'operational', 1, 100.0, 99.99, 99.98, 99.97),
  ('svc-auth', 'Authentication', 'Login, signup, and session management', 'operational', 2, 100.0, 100.0, 99.99, 99.99),
  ('svc-api', 'API', 'Public and internal API endpoints', 'operational', 3, 100.0, 99.98, 99.97, 99.96),
  ('svc-db', 'Database', 'Primary data storage and queries', 'operational', 4, 100.0, 100.0, 99.99, 99.99),
  ('svc-search', 'Search', 'Full-text search and AI finder', 'operational', 5, 100.0, 99.99, 99.98, 99.97),
  ('svc-analytics', 'Analytics', 'Usage tracking and dashboards', 'operational', 6, 100.0, 99.97, 99.95, 99.93),
  ('svc-rankings', 'Ranking Engine', 'AI tool rankings and scoring', 'operational', 7, 100.0, 100.0, 99.99, 99.99),
  ('svc-stacks', 'Public Stacks', 'Stack creation and sharing', 'operational', 8, 100.0, 99.99, 99.98, 99.97),
  ('svc-notify', 'Notifications', 'Email and in-app notifications', 'operational', 9, 100.0, 99.98, 99.96, 99.95),
  ('svc-payments', 'Payments', 'Billing and subscription management', 'operational', 10, 100.0, 100.0, 99.99, 99.99),
  ('svc-email', 'Email Delivery', 'Transactional email sending', 'operational', 11, 100.0, 99.95, 99.90, 99.88),
  ('svc-storage', 'Storage', 'File and media storage', 'operational', 12, 100.0, 100.0, 99.99, 99.99);
`);
console.log('All module tables created and seeded successfully');
