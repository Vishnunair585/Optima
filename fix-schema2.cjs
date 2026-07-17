const Database = require('better-sqlite3');

const db = new Database('sqlite.db', { verbose: console.log });

try {
  db.exec(`
    ALTER TABLE community_feature_requests ADD COLUMN category TEXT NOT NULL DEFAULT 'Other';
    ALTER TABLE community_feature_requests ADD COLUMN priority TEXT NOT NULL DEFAULT 'normal';
  `);
  console.log("Successfully added category and priority columns to community_feature_requests");
} catch (err) {
  console.error("Error altering table:", err.message);
}
