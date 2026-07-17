const Database = require('better-sqlite3');

const db = new Database('sqlite.db', { verbose: console.log });

try {
  db.exec(`
    ALTER TABLE community_feature_requests ADD COLUMN problem TEXT;
    ALTER TABLE community_feature_requests ADD COLUMN solution TEXT;
    ALTER TABLE community_feature_requests ADD COLUMN expected_benefit TEXT;
    ALTER TABLE community_feature_requests ADD COLUMN who_benefits TEXT;
    ALTER TABLE community_feature_requests ADD COLUMN business_impact TEXT;
    ALTER TABLE community_feature_requests ADD COLUMN frequency_of_use TEXT;
    ALTER TABLE community_feature_requests ADD COLUMN workaround TEXT;
    ALTER TABLE community_feature_requests ADD COLUMN attachments TEXT;
    ALTER TABLE community_feature_requests ADD COLUMN mockups TEXT;
    ALTER TABLE community_feature_requests ADD COLUMN reference_links TEXT;
    ALTER TABLE community_feature_requests ADD COLUMN duplicate_of TEXT;
  `);
  console.log("Successfully added columns to community_feature_requests");
} catch (err) {
  console.error("Error altering table:", err.message);
}
