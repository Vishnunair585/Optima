const Database = require('better-sqlite3');
const db = new Database('sqlite.db', { verbose: console.log });

try {
  db.exec(`DROP INDEX IF EXISTS status_services_name_unique;`);
  console.log("Successfully dropped index.");
} catch (err) {
  console.error("Error dropping index:", err.message);
}
