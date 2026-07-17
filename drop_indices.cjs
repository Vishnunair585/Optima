const db = require('better-sqlite3')('optima.db');
const indices = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_autoindex_%'").all();
for (const idx of indices) {
  try {
    db.exec(`DROP INDEX IF EXISTS ${idx.name}`);
    console.log(`Dropped ${idx.name}`);
  } catch (e) {
    console.log(`Failed to drop ${idx.name}: ${e.message}`);
  }
}
