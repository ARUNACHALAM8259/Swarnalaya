const fs = require('fs');

const filepath = "C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\scratch\\raw_share.html";
const content = fs.readFileSync(filepath, 'utf8');

// Strip HTML tags and scripts
let cleaned = content
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<[^>]+>/g, ' ');

// Look for strings between double quotes
const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
let match;
const words = [];
while ((match = regex.exec(content)) !== null) {
  const s = match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').trim();
  // Filter out variables, hashes, or programming code
  if (s.length > 25 && !s.includes('=') && !s.includes(';') && !s.includes('{') && !s.includes('}') && !s.includes('(') && !s.includes(')') && !s.includes('<') && !s.includes('>')) {
    words.push(s);
  }
}

console.log("Readable strings count:", words.length);
console.log("Readable strings sample:");
const unique = [...new Set(words)];
unique.slice(0, 100).forEach((w, i) => {
  console.log(`[${i}]: ${w.substring(0, 200)}`);
});
