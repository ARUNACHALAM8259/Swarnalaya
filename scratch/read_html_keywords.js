const fs = require('fs');

const filepath = "C:\\Users\\Arunachalam.J\\.gemini\\antigravity\\brain\\ef0a74fe-79ea-4e9c-890a-2f9440ec607e\\.system_generated\\steps\\169\\content.md";
const content = fs.readFileSync(filepath, 'utf8');

const keywords = ["swarnalaya", "vruthi", "idols", "youtube", "vhbk", "lYah"];

keywords.forEach(kw => {
  let index = 0;
  console.log(`\n=== Matches for "${kw}":`);
  let count = 0;
  while ((index = content.toLowerCase().indexOf(kw.toLowerCase(), index)) !== -1) {
    count++;
    console.log(`Match ${count} at index ${index}:`);
    console.log(content.substring(Math.max(0, index - 100), Math.min(content.length, index + 300)).replace(/\\n/g, '\n').replace(/\\"/g, '"'));
    index += kw.length;
    if (count >= 5) {
      console.log("... truncated further matches");
      break;
    }
  }
  if (count === 0) {
    console.log("No matches found.");
  }
});
