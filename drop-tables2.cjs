const Database = require('better-sqlite3');
const db = new Database('sqlite.db', { verbose: console.log });

try {
  db.exec(`
    DROP TABLE IF EXISTS support_tickets;
    DROP TABLE IF EXISTS ticket_replies;
    DROP TABLE IF EXISTS feature_votes;
  `);
  console.log("Successfully dropped remaining old tables.");
} catch (err) {
  console.error("Error dropping tables:", err.message);
}
