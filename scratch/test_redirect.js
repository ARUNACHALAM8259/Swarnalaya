const https = require('https');

const url = "https://g.co/gemini/share/eb4fe3b09156";

https.get(url, (res) => {
  console.log("Status code:", res.statusCode);
  console.log("Headers location:", res.headers.location);
  
  if (res.headers.location) {
    https.get(res.headers.location, (res2) => {
      console.log("Second redirect status:", res2.statusCode);
      console.log("Second redirect location:", res2.headers.location);
      if (res2.headers.location) {
        https.get(res2.headers.location, (res3) => {
          console.log("Third redirect status:", res3.statusCode);
          console.log("Third redirect location:", res3.headers.location);
        });
      }
    });
  }
}).on('error', (e) => {
  console.error("Error:", e);
});
