const fs = require('fs');

const filepath = "C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\scratch\\raw_share.html";
const content = fs.readFileSync(filepath, 'utf8');

// Find WIZ global data or script contents
const regex = /AF_initDataCallback\s*\(\s*\{[\s\S]*?\}\s*\)\s*;/gi;
const matches = content.match(regex) || [];
console.log(`Found ${matches.length} AF_initDataCallback matches.`);

matches.forEach((m, idx) => {
  // Extract the JSON data
  try {
    const dataStr = m.substring(m.indexOf('{'), m.lastIndexOf('}') + 1);
    // Find all strings in the data
    const strings = dataStr.match(/"([^"\\]*(?:\\.[^"\\]*)*)"/g) || [];
    const longStrings = strings
      .map(s => s.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\u003d/g, '=').replace(/\\u003c/g, '<').replace(/\\u003e/g, '>'))
      .filter(s => s.length > 80 && !s.includes('{') && !s.includes('}'));
    
    if (longStrings.length > 0) {
      console.log(`\nCallback ${idx} has ${longStrings.length} long strings:`);
      longStrings.slice(0, 10).forEach((s, sIdx) => {
        console.log(`  [${sIdx}]: ${s.substring(0, 500)}`);
      });
    }
  } catch (e) {
    console.error(`Error parsing callback ${idx}:`, e.message);
  }
});

// Let's also look for script tags that contain large arrays
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let sCount = 0;
while ((m = scriptRegex.exec(content)) !== null) {
  const scriptText = m[1];
  if (scriptText.includes("eb4fe3b09156") || scriptText.includes("TZGWNH") || scriptText.includes("lYah5")) {
    sCount++;
    console.log(`\nScript ${sCount} contains references! Length: ${scriptText.length}`);
    const matches2 = scriptText.match(/"([^"\\]*(?:\\.[^"\\]*)*)"/g) || [];
    const interesting = matches2
      .map(s => s.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\u003d/g, '=').replace(/\\u003c/g, '<').replace(/\\u003e/g, '>'))
      .filter(s => s.length > 60 && !s.includes('{') && !s.includes('}'));
    console.log(`  Interesting strings count: ${interesting.length}`);
    interesting.slice(0, 15).forEach((s, sIdx) => {
      console.log(`    [${sIdx}]: ${s.substring(0, 300)}`);
    });
  }
}
