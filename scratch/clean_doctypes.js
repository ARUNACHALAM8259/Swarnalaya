const fs = require('fs');
const files = fs.readdirSync('.');

files.filter(f => f.endsWith('.html')).forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Regex match for duplicate doctypes at the beginning
  const regex = /^(\s*<!doctype html>\s*){2,}/i;
  if (regex.test(content)) {
    content = content.replace(regex, '<!doctype html>\n');
    fs.writeFileSync(f, content, 'utf8');
    console.log(`Cleaned duplicate doctype in ${f}`);
  }
});
