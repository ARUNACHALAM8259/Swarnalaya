const fs = require('fs');

const filepath = "C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\scratch\\raw_share.html";
const content = fs.readFileSync(filepath, 'utf8');

// Find all JSON arrays or blocks containing the youtube URLs
const ytEmbed = "TZGWNH-iaHk";
const ytWatch1 = "vhbkCEnNXcY";
const ytWatch2 = "lYah5-xEeck";

const targets = [ytEmbed, ytWatch1, ytWatch2];

targets.forEach(t => {
  let index = 0;
  console.log(`\n=== Matches for ${t}:`);
  while ((index = content.indexOf(t, index)) !== -1) {
    // Find the enclosing JSON array or object
    // Scan backwards for the start of the string or array
    let start = Math.max(0, index - 1000);
    let end = Math.min(content.length, index + 2000);
    
    // Find nearest [ or { before index
    console.log(`Context around index ${index}:`);
    const slice = content.substring(index - 500, index + 1500)
      .replace(/\\u003d/g, '=')
      .replace(/\\u003c/g, '<')
      .replace(/\\u003e/g, '>')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n');
    console.log(slice);
    
    index += t.length;
    break; // just show the first match
  }
});
