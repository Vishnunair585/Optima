const Database = require('better-sqlite3');
const db = new Database('sqlite.db', { verbose: console.log });
const columns = db.prepare("PRAGMA table_info(community_feature_requests)").all();
console.log(columns.map(c => c.name));
