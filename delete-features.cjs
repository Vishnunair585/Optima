const fs = require('fs');
const files = [
  "src/routes/blog/index.tsx",
  "src/routes/blog/$slug.tsx",
  "src/routes/blog.tsx",
  "src/routes/admin/content.tsx",
  "src/routes/docs.tsx",
  "src/routes/api-docs.tsx",
  "src/routes/tutorials.tsx",
  "src/routes/newsletter.tsx",
  "src/routes/admin/newsletter.tsx",
  "src/routes/status.tsx",
  "src/routes/admin/status.tsx",
  "src/routes/changelog.tsx",
  "src/routes/release-notes.tsx",
  "src/routes/faq.tsx",
  "src/routes/legal.refund.tsx",
  "src/routes/resources.tsx"
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log('Deleted:', f);
  }
});
