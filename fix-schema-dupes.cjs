const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'src', 'lib', 'db', 'schema.ts');
let content = fs.readFileSync(schemaPath, 'utf8');

// 1. We already added the new tables at the top around line 388.
// We will just remove the old ecosystem community hub and support tracking at the bottom.
// Let's find "// ─── Ecosystem: Community Hub ──────────────────────────────────" and remove everything after it up to the end (or before anything else if there is something else).

const marker = "// ─── Ecosystem: Community Hub ──────────────────────────────────";
const index = content.indexOf(marker);

if (index !== -1) {
    // Keep everything before the marker
    content = content.substring(0, index);
    
    // Add a comment that the schema is now unified at the top
    content += "\n// NOTE: Community Hub and Support Bug/Feature tracking have been unified into the Helpdesk & Ticketing System above.\n";
    
    fs.writeFileSync(schemaPath, content, 'utf8');
    console.log("Successfully removed old duplicate schemas.");
} else {
    console.log("Marker not found, maybe already removed?");
}
