const fs = require('fs');

const filepath = "C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\scratch\\raw_share.html";
const content = fs.readFileSync(filepath, 'utf8');

const regex = /https?:\/\/[^\s"'<>]+/gi;
const matches = content.match(regex) || [];
console.log("All URLs:");
const unique = [...new Set(matches)];
unique.forEach(u => {
  if (u.includes("youtube.com") || u.includes("youtu.be") || u.includes("drive.google.com") || u.includes("instagram.com")) {
    console.log(u);
  }
});
