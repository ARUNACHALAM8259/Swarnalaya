const fs = require('fs');

const filepath = "C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\.system_generated\\steps\\169\\content.md";
const content = fs.readFileSync(filepath, 'utf8');

// Strip HTML tags and print first 2000 chars of readable text
let text = content
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

console.log("TEXT PREVIEW:");
console.log(text.substring(0, 3000));
