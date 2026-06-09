const fs = require('fs');
const path = require('path');

const files = ["swarna-vruthi.html", "thanaa-vruthi.html"];

const target = `            <button class="mic-icon">
              <i class="fas fa-microphone"></i>
            </button>
          </div>
        </div>`;

const replacement = `            <button class="mic-icon">
              <i class="fas fa-microphone"></i>
            </button>
          </div>
          <div class="live-rates-ticker" id="liveRatesTicker">
            <div class="ticker-pulse-dot"></div>
            <div class="ticker-text-wrapper">
              <div class="ticker-text" id="tickerText">Loading rates...</div>
            </div>
          </div>
        </div>`;

files.forEach(f => {
  const filePath = path.resolve(f);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const normalizedContent = content.replace(/\r\n/g, '\n');
    if (normalizedContent.includes(target)) {
      const updatedNormalized = normalizedContent.replace(target, replacement);
      const finalContent = content.includes('\r\n') ? updatedNormalized.replace(/\n/g, '\r\n') : updatedNormalized;
      fs.writeFileSync(filePath, finalContent, 'utf8');
      console.log(`Updated ${f}`);
    } else {
      console.log(`Target not found in ${f}`);
    }
  } else {
    console.log(`File not found: ${f}`);
  }
});
