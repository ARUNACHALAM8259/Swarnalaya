const fs = require('fs');

const filepath = "C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\.system_generated\\steps\\169\\content.md";
const content = fs.readFileSync(filepath, 'utf8');

const query = "TZGWNH-iaHk";
const index = content.indexOf(query);
if (index !== -1) {
  console.log("Found query. Context:");
  // Look 5000 chars around it
  const start = Math.max(0, index - 2000);
  const end = Math.min(content.length, index + 3000);
  const context = content.substring(start, end);
  
  // Replace escape sequences for readability
  console.log(context.replace(/\\u003d/g, '=').replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\n/g, '\n').replace(/\\"/g, '"'));
} else {
  console.log("Query not found.");
}
