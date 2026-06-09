const fs = require('fs');

const filepath = "C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\.system_generated\\steps\\169\\content.md";
const content = fs.readFileSync(filepath, 'utf8');

// Find all script tags content
const matches = [];
let idx = 0;
while ((idx = content.indexOf('<script', idx)) !== -1) {
  const end = content.indexOf('</script>', idx);
  if (end !== -1) {
    const text = content.substring(idx, end + 9);
    matches.push(text);
    idx = end + 9;
  } else {
    break;
  }
}

console.log(`Found ${matches.length} script tags.`);

// Let's search inside the script tags for text strings in double quotes that could be the chat content
const allStrings = [];
matches.forEach(script => {
  const strRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
  let m;
  while ((m = strRegex.exec(script)) !== null) {
    const str = m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
    if (str.length > 40 && !str.includes('var ') && !str.includes('function(') && !str.includes('css') && !str.includes('{') && !str.includes('}')) {
      allStrings.push(str);
    }
  }
});

const uniqueStrings = [...new Set(allStrings)].sort();
console.log(`Found ${uniqueStrings.length} unique readable strings inside script tags:`);
uniqueStrings.forEach((s, i) => {
  console.log(`\n[${i}]: ${s.substring(0, 300)}`);
});
