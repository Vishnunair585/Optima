const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('sqlite.db', { verbose: console.log });

try {
  const sqlFilePath = path.join(__dirname, 'drizzle', '0005_absent_random.sql');
  const sql = fs.readFileSync(sqlFilePath, 'utf8');
  
  db.exec(sql);
  console.log("Successfully executed migration SQL.");
} catch (err) {
  console.error("Error executing migration SQL:", err.message);
}
