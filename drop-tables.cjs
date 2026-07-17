const Database = require('better-sqlite3');
const db = new Database('sqlite.db', { verbose: console.log });

try {
  db.exec(`
    DROP TABLE IF EXISTS community_feature_requests;
    DROP TABLE IF EXISTS community_votes;
    DROP TABLE IF EXISTS community_feature_follows;
    DROP TABLE IF EXISTS community_feature_bookmarks;
    DROP TABLE IF EXISTS creator_profiles;
    DROP TABLE IF EXISTS creator_badges;
    DROP TABLE IF EXISTS bug_reports;
    DROP TABLE IF EXISTS feature_requests;
    DROP TABLE IF EXISTS issue_comments;
    DROP TABLE IF EXISTS issue_attachments;
    DROP TABLE IF EXISTS support_votes;
    DROP TABLE IF EXISTS ticket_history;
  `);
  console.log("Successfully dropped old tables.");
} catch (err) {
  console.error("Error dropping tables:", err.message);
}
