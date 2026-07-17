const db = require('better-sqlite3')('optima.db');

const addColumn = (table, col, def) => {
  try {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`);
    console.log(`Added ${col} to ${table}`);
  } catch (e) {
    if (!e.message.includes('duplicate column name')) {
      console.log(`Failed to add ${col} to ${table}: ${e.message}`);
    }
  }
};

addColumn('community_feature_requests', 'problem', 'TEXT');
addColumn('community_feature_requests', 'solution', 'TEXT');
addColumn('community_feature_requests', 'expected_benefit', 'TEXT');
addColumn('community_feature_requests', 'who_benefits', 'TEXT');
addColumn('community_feature_requests', 'category', 'TEXT NOT NULL DEFAULT "Other"');
addColumn('community_feature_requests', 'priority', 'TEXT NOT NULL DEFAULT "normal"');
addColumn('community_feature_requests', 'business_impact', 'TEXT');
addColumn('community_feature_requests', 'frequency_of_use', 'TEXT');
addColumn('community_feature_requests', 'workaround', 'TEXT');
addColumn('community_feature_requests', 'attachments', 'TEXT');
addColumn('community_feature_requests', 'mockups', 'TEXT');
addColumn('community_feature_requests', 'reference_links', 'TEXT');
addColumn('community_feature_requests', 'duplicate_of', 'TEXT');

const sql = `
CREATE TABLE IF NOT EXISTS community_feature_follows (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS community_feature_bookmarks (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
`;
db.exec(sql);
console.log('Finished updating schema.');
