const fs = require('fs');
const path = require('path');

const filesToDelete = [
  "src/routes/faq.tsx",
  "src/routes/changelog.tsx",
  "src/routes/release-notes.tsx",
  "src/routes/status.tsx",
  "src/routes/legal.refund.tsx",
  "src/routes/docs.tsx",
  "src/routes/api-docs.tsx",
  "src/routes/newsletter.tsx",
  "src/routes/admin/newsletter.tsx",
  "src/routes/admin/status.tsx",
  "src/routes/admin/content.tsx"
];

const dirsToDelete = [
  "src/routes/blog"
];

filesToDelete.forEach(f => {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log('Deleted file:', f);
  }
});

dirsToDelete.forEach(d => {
  if (fs.existsSync(d)) {
    fs.rmSync(d, { recursive: true, force: true });
    console.log('Deleted dir:', d);
  }
});
