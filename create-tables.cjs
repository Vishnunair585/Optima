const Database = require('better-sqlite3');
const db = new Database('sqlite.db', { verbose: console.log });

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      type TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      priority TEXT NOT NULL DEFAULT 'normal',
      category TEXT NOT NULL DEFAULT 'General',
      email TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      assigned_to TEXT,
      resolved_at INTEGER,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
    
    CREATE TABLE IF NOT EXISTS bug_reports (
      ticket_id TEXT PRIMARY KEY,
      severity TEXT NOT NULL,
      browser TEXT,
      operating_system TEXT,
      current_url TEXT,
      app_version TEXT,
      FOREIGN KEY(ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS feature_requests (
      ticket_id TEXT PRIMARY KEY,
      problem TEXT,
      suggested_solution TEXT,
      expected_benefit TEXT,
      who_benefits TEXT,
      business_impact TEXT,
      frequency_of_use TEXT,
      workaround TEXT,
      votes_count INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS support_attachments (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_name TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY(ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS support_email_logs (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL,
      error_message TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY(ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS support_audit_logs (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      action TEXT NOT NULL,
      actor_id TEXT,
      details TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY(ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS ticket_replies (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      user_id TEXT,
      message TEXT NOT NULL,
      is_internal_note INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY(ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS feature_votes (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY(ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  console.log("Successfully created new tables.");
} catch (err) {
  console.error("Error creating new tables:", err.message);
}
