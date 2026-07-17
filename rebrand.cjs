const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function rebrandFile(filePath) {
  if (filePath.includes('node_modules') || filePath.includes('.git')) return;
  // only replace in ts, tsx, js, jsx, html, md, json
  if (!filePath.match(/\.(tsx?|jsx?|md|json|css|html)$/)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content
    .replace(/AIRank/g, 'Optima')
    .replace(/airank/g, 'optima');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated: ${filePath}`);
  }
}

walkDir('./src', rebrandFile);
rebrandFile('./README.md');
rebrandFile('./package.json');
rebrandFile('./DISASTER_RECOVERY.md');

console.log('Rebranding complete.');
