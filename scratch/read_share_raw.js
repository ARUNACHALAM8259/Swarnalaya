const https = require('https');
const fs = require('fs');

const url = "https://gemini.google.com/share/eb4fe3b09156";

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    fs.writeFileSync('C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\scratch\\raw_share.html', body);
    console.log("Finished writing raw_share.html. Length:", body.length);
    
    // Check if body contains any video, mp4, etc.
    const re = /https?:\/\/[^\s"'<>]+/g;
    const urls = body.match(re) || [];
    console.log("Found urls in raw response:", urls.filter(u => u.includes("youtube") || u.includes("drive") || u.includes("video") || u.includes("mp4")).slice(0, 10));
  });
}).on('error', (e) => {
  console.error("Error:", e);
});
