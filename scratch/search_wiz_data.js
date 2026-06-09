const fs = require('fs');

const filepath = "C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\.system_generated\\steps\\169\\content.md";
const content = fs.readFileSync(filepath, 'utf8');

// Google WIZ data is stored in window.WIZ_global_data or similar variables
// Let's extract any JSON objects or arrays inside script tags or variable declarations
const regex = /c_chat_[\w\d]+/gi;
const match = content.match(regex);
console.log("Chat IDs found:", match);

// Let's search for "http" inside JSON strings that could be video URLs
// Specifically search for Google Drive URLs, YouTube URLs, or video formats (.mp4, etc.)
// Let's extract all URLs
const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
const urls = content.match(urlRegex) || [];
const uniqueUrls = [...new Set(urls)].sort();

console.log("\nURLs related to video/drive/media:");
uniqueUrls.forEach(u => {
  if (u.includes("drive.google.com") || u.includes("youtube.com") || u.includes("video") || u.includes("mp4") || u.includes("fbcdn")) {
    console.log(u);
  }
});

// Let's dump all text around the word "prompt" or "response"
const wizRegex = /window\.WIZ_global_data\s*=\s*(\{[\s\S]*?\});/gi;
const wizMatch = wizRegex.exec(content);
if (wizMatch) {
  console.log("\nFound window.WIZ_global_data!");
  const wizDataStr = wizMatch[1];
  console.log("Length of WIZ data:", wizDataStr.length);
  // Find any text blocks
  const textBlocks = wizDataStr.match(/"[^"\\]*(?:\\.[^"\\]*)*"/g) || [];
  console.log("Number of strings in WIZ data:", textBlocks.length);
  
  // Print any string that looks like a user message or assistant response
  const interesting = textBlocks.map(s => s.replace(/\\"/g, '"').replace(/\\n/g, '\n')).filter(s => {
    return s.length > 50 && (s.includes("drive") || s.includes("video") || s.includes("youtube") || s.includes("mp4") || s.includes("Swarnalaya") || s.includes("Vruthi"));
  });
  console.log(`Interesting strings found: ${interesting.length}`);
  interesting.slice(0, 10).forEach((s, idx) => {
    console.log(`\n[${idx}]: ${s.substring(0, 500)}`);
  });
} else {
  console.log("\nwindow.WIZ_global_data not found with regex. Scanning for JSON variables...");
}
