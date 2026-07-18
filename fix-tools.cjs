const fs = require('fs');
const path = './src/lib/data/public_stacks.json';
let data = fs.readFileSync(path, 'utf8');

// Replace tool names in strings
data = data.replace(/"Tool 1"/g, '"ChatGPT"');
data = data.replace(/"Tool 2"/g, '"Midjourney"');
data = data.replace(/"Tool 3"/g, '"Zapier"');
data = data.replace(/"Tool 4"/g, '"Notion AI"');
data = data.replace(/"Tool 5"/g, '"GitHub Copilot"');

// Replace Tool # in descriptions/strings
data = data.replace(/Tool 1/g, 'ChatGPT');
data = data.replace(/Tool 2/g, 'Midjourney');
data = data.replace(/Tool 3/g, 'Zapier');
data = data.replace(/Tool 4/g, 'Notion AI');
data = data.replace(/Tool 5/g, 'GitHub Copilot');

fs.writeFileSync(path, data);
console.log('Done mapping tool names!');
