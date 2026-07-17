const Database = require('better-sqlite3');
const db = new Database('sqlite.db');

db.exec(`
CREATE TABLE IF NOT EXISTS bug_reports (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  steps_to_reproduce TEXT NOT NULL,
  expected_behaviour TEXT NOT NULL,
  actual_behaviour TEXT NOT NULL,
  severity TEXT NOT NULL,
  os TEXT,
  browser TEXT,
  device_type TEXT,
  app_version TEXT,
  url TEXT,
  status TEXT DEFAULT 'new' NOT NULL,
  priority TEXT DEFAULT 'normal' NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  email TEXT,
  assigned_team TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS feature_requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  problem TEXT,
  solution TEXT,
  expected_benefit TEXT,
  use_case TEXT,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' NOT NULL,
  status TEXT DEFAULT 'new' NOT NULL,
  votes_count INTEGER DEFAULT 0 NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  assigned_team TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updated_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS issue_comments (
  id TEXT PRIMARY KEY,
  issue_id TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS issue_attachments (
  id TEXT PRIMARY KEY,
  issue_id TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS support_votes (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_history (
  id TEXT PRIMARY KEY,
  issue_id TEXT NOT NULL,
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  details TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);
`);
console.log('Support tables created.');
