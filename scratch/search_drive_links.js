const fs = require('fs');

const filepath = "C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\scratch\\raw_share.html";
const content = fs.readFileSync(filepath, 'utf8');

// Search for any Google Drive file paths
const regex = /drive\.google\.com[^\s"']*/gi;
const matches = content.match(regex) || [];
console.log("Drive links found:", [...new Set(matches)]);

// Search for any YouTube links
const ytRegex = /youtube\.com[^\s"']*/gi;
const ytMatches = content.match(ytRegex) || [];
console.log("YouTube links found:", [...new Set(ytMatches)]);

// Search for other video extension formats
const videoRegex = /[\w\d-_\.\/]+\.(mp4|webm|ogg|mov|avi)/gi;
const videoMatches = content.match(videoRegex) || [];
console.log("Direct video files found:", [...new Set(videoMatches)]);
