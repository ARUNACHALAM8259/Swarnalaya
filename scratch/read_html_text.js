const fs = require('fs');

const filepath = "C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\.system_generated\\steps\\169\\content.md";
const content = fs.readFileSync(filepath, 'utf8');

// Strip styles and scripts
let textOnly = content
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '');

// Extract strings from JSON array
const strings = [];
const strRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
let m;
while ((m = strRegex.exec(textOnly)) !== null) {
  const str = m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
  if (str.length > 20 && !str.includes('{') && !str.includes('}') && !str.includes('[') && !str.includes(']')) {
    strings.push(str);
  }
}

console.log("Extracted readable text strings:");
const uniqueStrings = [...new Set(strings)];
uniqueStrings.forEach((s, i) => {
  if (s.includes("youtube") || s.includes("video") || s.includes("watch") || s.includes("vruthi") || s.includes("swarnalaya") || s.includes("idols") || s.includes("about")) {
    console.log(`\n[${i}]: ${s}`);
  }
});
