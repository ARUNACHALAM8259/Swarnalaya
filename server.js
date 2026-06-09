const http = require("http");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Database initialization
const USERS_FILE = path.join(__dirname, "users.json");
const ACTIVITY_LOGS_FILE = path.join(__dirname, "activity-logs.json");

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, "[]", "utf8");
}
if (!fs.existsSync(ACTIVITY_LOGS_FILE)) {
  fs.writeFileSync(ACTIVITY_LOGS_FILE, "[]", "utf8");
}

const emailRateLimits = {};
const otpStore = {};


function checkEmailRateLimit(userKey, activityType) {
  const limitKey = `${userKey}_${activityType}`;
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;
  if (emailRateLimits[limitKey] && (now - emailRateLimits[limitKey]) < thirtyMinutes) {
    return false;
  }
  emailRateLimits[limitKey] = now;
  return true;
}

function saveUser(user) {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    const users = JSON.parse(data);
    
    // Check for duplicate user by mobile or email
    const exists = users.some(u => u.mobile === user.mobile || u.email === user.email);
    if (!exists) {
      users.push(user);
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
      console.log(`User registered successfully: ${user.name} (${user.mobile})`);
    }
  } catch (e) {
    console.error("Error saving user:", e);
  }
}

function logActivity(activity) {
  try {
    const data = fs.readFileSync(ACTIVITY_LOGS_FILE, "utf8");
    const logs = JSON.parse(data);
    logs.push(activity);
    fs.writeFileSync(ACTIVITY_LOGS_FILE, JSON.stringify(logs, null, 2), "utf8");
    console.log(`Activity logged: ${activity.activityType} for ${activity.userKey}`);
  } catch (e) {
    console.error("Error saving activity log:", e);
  }
}

function sendAdminEmailNotification(customer, activityType, details = "", page = "") {
  const adminEmail = process.env.ADMIN_EMAIL || "arunachalamjayakumar2005@gmail.com";
  const smtpHost = process.env.SMTP_HOST || "";
  const smtpPort = process.env.SMTP_PORT || "";
  const smtpUser = process.env.SMTP_USER || "";
  const smtpPass = process.env.SMTP_PASS || "";

  console.log(`[Email Notification Triggered] User: ${customer.email || customer.mobile}, Action: ${activityType}`);

  const registrationDateTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";

  const emailSubject = `Swarnalaya Notification: Customer ${activityType.toUpperCase()} Alert`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #c5a059; border-radius: 8px; max-width: 600px; margin: 0 auto; background-color: #fafaf8;">
      <h2 style="color: #1a5f4a; border-bottom: 2px solid #c5a059; padding-bottom: 10px; margin-top: 0;">Swarnalaya Notification</h2>
      <p style="font-size: 16px; color: #333;">An automatic notification has been generated for a customer activity.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr style="background-color: #f1f1f1;">
          <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; width: 180px;">Detail</th>
          <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Value</th>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Activity Type</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #1a5f4a; font-weight: bold;">${activityType.toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Customer Name</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${customer.name || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Mobile Number</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${customer.mobile || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email Address</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${customer.email || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Date & Time (IST)</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${registrationDateTime}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Page Registered From</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${page || "N/A"}</td>
        </tr>
        ${details ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Activity Details</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-style: italic;">${details}</td>
        </tr>` : ""}
      </table>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
        This email was sent automatically by the Swarnalaya Jewellery notification gateway.
      </div>
    </div>
  `;

  const userKey = customer.email || customer.mobile || "unknown";
  if (!checkEmailRateLimit(userKey, activityType)) {
    console.log(`[Email Notification Skipped] Rate limited for user ${userKey} (${activityType}) within 30 minutes.`);
    return;
  }

  if (!smtpUser || !smtpPass) {
    console.log("----------------------------------------------------------------------");
    console.log(`[SMTP Settings Missing] Notification logged to console. Details:`);
    console.log(`To: ${adminEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Activity: ${activityType}`);
    console.log(`Customer: Name: ${customer.name}, Mobile: ${customer.mobile}, Email: ${customer.email}`);
    console.log(`Details: ${details || "N/A"}, Page: ${page || "N/A"}`);
    console.log("----------------------------------------------------------------------");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort) || 587,
    secure: parseInt(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  const mailOptions = {
    from: `"Swarnalaya Notifications" <${smtpUser}>`,
    to: adminEmail,
    subject: emailSubject,
    html: emailHtml
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("[SMTP Error] Failed to send notification email:", error.message);
    } else {
      console.log("[SMTP Success] Notification email sent successfully to:", adminEmail, "ID:", info.messageId);
    }
  });
}

// Load .env variables (zero-dependency parser)
function formatToIST(isoString) {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    const dateStr = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
    return `${dateStr} ${timeStr} IST`;
  } catch (e) {
    return isoString;
  }
}

function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    try {
      const data = fs.readFileSync(envPath, "utf8");
      const lines = data.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.substring(0, eqIdx).trim();
          let val = trimmed.substring(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          process.env[key] = val;
        }
      }
    } catch (e) {
      console.error("Error loading .env file:", e);
    }
  }
}
loadEnv();

const PORT = 8000;
const HOST = "0.0.0.0";

const RATES_FILE = path.join(__dirname, "rates.json");

function needsUpdate(lastUpdatedString) {
  if (!lastUpdatedString) return true;
  
  const lastUpdateDate = new Date(lastUpdatedString);
  const now = new Date();
  
  // Cache rates for 30 minutes (1,800,000 ms) to refresh automatically every 30 mins
  const cacheDuration = 30 * 60 * 1000;
  return (now.getTime() - lastUpdateDate.getTime()) > cacheDuration;
}

const HISTORY_FILE = path.join(__dirname, "rate-history.json");

function saveToHistory(rates) {
  try {
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, "utf8");
      history = JSON.parse(data);
    }
    
    // Check if entry for the same updatetimeText or date already exists to prevent duplicate entries
    const timeKey = rates.updatetimeText || new Date().toISOString().substring(0, 10);
    const exists = history.some(h => h.timeKey === timeKey);
    
    if (!exists) {
      history.push({
        timeKey: timeKey,
        timestamp: new Date().toISOString(),
        gold22K: rates.gold22K.price,
        gold18K: rates.gold18K.price,
        silver: rates.silver.price,
        change22K: rates.gold22K.change,
        change18K: rates.gold18K.change,
        changeSilver: rates.silver.change
      });
      // Limit history to last 100 records
      if (history.length > 100) {
        history.shift();
      }
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf8");
      console.log("Rates history saved successfully in rate-history.json.");
    }
  } catch (err) {
    console.error("Error writing rate-history.json:", err);
  }
}

async function fetchMJDTA() {
  try {
    console.log("Fetching live gold rates from MJDTA (thejewellersassociation.org)...");
    const response = await fetch("https://thejewellersassociation.org/index.php", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!response.ok) throw new Error("HTTP error " + response.status);
    const html = await response.text();
    
    // Match rates using robust relaxed patterns
    const match22 = html.match(/goldrate_22ct.*html\("([\d\.]+)"\)/);
    const match18 = html.match(/goldrate_18ct.*html\("([\d\.]+)"\)/);
    const matchSilver = html.match(/class="silver_rate">([\d\.]+)<\/span>/) || html.match(/silverrate_1gm.*html\("([\d\.]+)"\)/);
    
    // Match changes
    const match22Diff = html.match(/goldrate_22ctdiff\s*=\s*"(-?[\d\.]+)"/);
    const match18Diff = html.match(/goldrate_18ctdiff\s*=\s*"(-?[\d\.]+)"/);
    const matchSilverDiff = html.match(/silverrate_1gmdiff\s*=\s*parseFloat\("(-?[\d\.]+)"\)/) || html.match(/silverrate_1gmdiff\s*=\s*"(-?[\d\.]+)"/);
    
    // Match update time
    const matchTime = html.match(/updatetime.*html\("([^"]+)"\)/);
    
    if (match22 && match18 && matchSilver) {
      const gold22Price = parseFloat(match22[1]);
      const gold18Price = parseFloat(match18[1]);
      const silverPrice = parseFloat(matchSilver[1]);
      
      const change22 = match22Diff ? parseFloat(match22Diff[1]) : 0;
      const change18 = match18Diff ? parseFloat(match18Diff[1]) : 0;
      const changeSilver = matchSilverDiff ? parseFloat(matchSilverDiff[1]) : 0;
      
      const timeStr = matchTime ? matchTime[1] : new Date().toLocaleString();
      
      const updatedRates = {
        gold22K: {
          price: gold22Price,
          change: change22,
          direction: change22 > 0 ? "up" : change22 < 0 ? "down" : "flat"
        },
        gold18K: {
          price: gold18Price,
          change: change18,
          direction: change18 > 0 ? "up" : change18 < 0 ? "down" : "flat"
        },
        silver: {
          price: silverPrice,
          change: changeSilver,
          direction: changeSilver > 0 ? "up" : changeSilver < 0 ? "down" : "flat"
        },
        // For 24K, calibrate from 22K (22K * 1.091)
        gold24K: {
          price: Math.round(gold22Price * 1.091),
          change: Math.round(change22 * 1.091),
          direction: change22 > 0 ? "up" : change22 < 0 ? "down" : "flat"
        },
        lastUpdated: new Date().toISOString(),
        updateSource: "MJDTA",
        updatetimeText: timeStr,
        status: "success"
      };
      
      saveToHistory(updatedRates);
      return updatedRates;
    }
    throw new Error("Could not parse MJDTA rates from HTML");
  } catch (err) {
    console.error("MJDTA fetch failed:", err.message);
    return null;
  }
}

function loadSavedRates() {
  try {
    if (fs.existsSync(RATES_FILE)) {
      const data = fs.readFileSync(RATES_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading rates.json:", err);
  }
  
  // Default fallback initial rates
  const initialRates = {
    gold24K: { price: 15334, change: 0.0, direction: "flat" },
    gold22K: { price: 14046, change: 0.0, direction: "flat" },
    gold18K: { price: 11501, change: 0.0, direction: "flat" },
    silver: { price: 242.74, change: 0.0, direction: "flat" },
    lastUpdated: new Date(0).toISOString()
  };
  saveRates(initialRates);
  return initialRates;
}

function saveRates(rates) {
  try {
    fs.writeFileSync(RATES_FILE, JSON.stringify(rates, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing rates.json:", err);
  }
}

let cachedRates = loadSavedRates();
let isUpdating = false;

async function updateLiveRates() {
  if (isUpdating) return;
  isUpdating = true;
  
  try {
    // 1. Try MJDTA first
    const mjdtaRates = await fetchMJDTA();
    if (mjdtaRates) {
      cachedRates = mjdtaRates;
      saveRates(cachedRates);
      console.log("Gold rates updated from MJDTA:", cachedRates);
      return;
    }
    
    // 2. Try GoldAPI as fallback
    console.log("Fetching live gold rates from GoldAPI fallback...");
    const [xauRes, xagRes] = await Promise.all([
      fetch("https://api.gold-api.com/price/XAU"),
      fetch("https://api.gold-api.com/price/XAG")
    ]);
    
    if (!xauRes.ok || !xagRes.ok) {
      throw new Error("HTTP error fetching rates from GoldAPI");
    }
    
    const xauData = await xauRes.json();
    const xagData = await xagRes.json();
    
    const xauUSD = xauData.price;
    const xagUSD = xagData.price;
    
    const usdToInr = 83.5;
    
    // Chennai gold rate calibration (import duties, GST, local margins)
    const gold24KPrice = Math.round((xauUSD * usdToInr / 31.1035) * 1.33);
    const gold22KPrice = Math.round(gold24KPrice * 0.916);
    const gold18KPrice = Math.round(gold24KPrice * 0.75);
    const silverPrice = parseFloat(((xagUSD * usdToInr / 31.1035) * 1.35).toFixed(2));
    
    let dir24 = "up", chg24 = 0.15;
    let dir22 = "up", chg22 = 0.15;
    let dir18 = "up", chg18 = 0.15;
    let dirSil = "down", chgSil = -0.25;
    
    if (cachedRates && cachedRates.gold24K) {
      const prev24 = cachedRates.gold24K.price;
      const prev22 = cachedRates.gold22K.price;
      const prev18 = cachedRates.gold18K.price;
      const prevSil = cachedRates.silver.price;
      
      const calcDiff = (curr, prev) => {
        if (!prev) return { change: 0.0, dir: "flat" };
        const diff = curr - prev;
        return {
          change: parseFloat(diff.toFixed(2)),
          dir: diff > 0 ? "up" : diff < 0 ? "down" : "flat"
        };
      };
      
      const c24 = calcDiff(gold24KPrice, prev24);
      dir24 = c24.dir; chg24 = c24.change;
      
      const c22 = calcDiff(gold22KPrice, prev22);
      dir22 = c22.dir; chg22 = c22.change;
      
      const c18 = calcDiff(gold18KPrice, prev18);
      dir18 = c18.dir; chg18 = c18.change;
      
      const cSil = calcDiff(silverPrice, prevSil);
      dirSil = cSil.dir; chgSil = cSil.change;
    }
    
    cachedRates = {
      gold24K: { price: gold24KPrice, change: chg24, direction: dir24 },
      gold22K: { price: gold22KPrice, change: chg22, direction: dir22 },
      gold18K: { price: gold18KPrice, change: chg18, direction: dir18 },
      silver: { price: silverPrice, change: chgSil, direction: dirSil },
      lastUpdated: new Date().toISOString(),
      updateSource: "GoldAPI",
      updatetimeText: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + " (Live)",
      status: "success"
    };
    
    saveRates(cachedRates);
    saveToHistory(cachedRates);
    console.log("Gold rates updated from GoldAPI fallback:", cachedRates);
  } catch (err) {
    console.error("All live sources failed, showing last available rates with warning:", err.message);
    
    // Set status to "update-in-progress" to warn the user
    if (cachedRates) {
      cachedRates.status = "update-in-progress";
      saveRates(cachedRates);
    }
  } finally {
    isUpdating = false;
  }
}

// Offline fallback keywords matcher in case Gemini is not configured or offline
function getOfflineFallbackResponse(message, lang = "en") {
  const msg = message.toLowerCase();
  const isTamil = lang === "ta" || /தங்கம்|வெள்ளி|விழுப்புரம்|நகைகள்|திட்டம்|சேமிப்பு|விருத்தி|வணக்கம்|உதவி|பதிவு|அப்பாயிண்ட்மெண்ட்/.test(msg);
  
  if (isTamil) {
    if (msg.includes("விழுப்புரம்") || msg.includes("முகவரி") || msg.includes("தொடர்பு") || msg.includes("போன்") || msg.includes("வாட்ஸ்அப்")) {
      return "ஸ்வர்ணாலயா ஜுவல்லர்ஸ் முகவரி:\n791C, PJN ரோடு, விழுப்புரம் - 605 602, தமிழ்நாடு.\nதொலைபேசி: +91 9837371616.\nவிவரங்களுக்கு கீழே உள்ள 'தொடர்பு கொள்ள' பொத்தானைக் கிளிக் செய்யவும்.";
    }
    if (msg.includes("திட்டம்") || msg.includes("விருத்தி") || msg.includes("சேமிப்பு")) {
      return "ஸ்வர்ணாலயாவில் 4 பிரபலமான சேமிப்புத் திட்டங்கள் உள்ளன:\n1. தனா விருத்தி (VA செய்கூலி தள்ளுபடி)\n2. செல்வ விருத்தி (12வது தவணை இலவசம்)\n3. குபேர விருத்தி (பழைய தங்க வைப்பு)\n4. கனக விருத்தி (தினசரி தங்க எடை சேமிப்பு)\n\nமேலும் அறிய கீழே உள்ள 'சேமிப்பு திட்டங்கள்' பொத்தானைக் கிளிக் செய்யவும்.";
    }
    if (msg.includes("விலை") || msg.includes("ரேட்") || msg.includes("தங்கம்") || msg.includes("வெள்ளி")) {
      return `இன்றைய சென்னை தங்கத்தின் நேரடி விலை:\n- 22K தங்க விலை: ₹${cachedRates.gold22K.price.toLocaleString('en-IN')}/g\n- 24K தங்க விலை: ₹${cachedRates.gold24K.price.toLocaleString('en-IN')}/g\n- வெள்ளி விலை: ₹${cachedRates.silver.price.toFixed(2)}/g\n\nகடைசியாக புதுப்பிக்கப்பட்டது: ${formatToIST(cachedRates.lastUpdated)}`;
    }
    if (msg.includes("பதிவு") || msg.includes("நேரம்") || msg.includes("அப்பாயிண்ட்மெண்ட்")) {
      return "நீங்கள் ஷோரூம் அப்பாயிண்ட்மெண்ட் பதிவு செய்ய விரும்பினால், தயவுசெய்து கீழே உள்ள 'அப்பாயிண்ட்மெண்ட்' பொத்தானைக் கிளிக் செய்து விவரங்களை வழங்கவும்.";
    }
    return "வணக்கம்! ஸ்வர்ணாலயா ஜுவல்லர்ஸிற்கு உங்களை வரவேற்கிறோம். தற்சமயம் AI சேவை ஆஃப்லைனில் உள்ளது. ஆனால் நான் ஆஃபர்கள், தங்க விலை, சேமிப்பு திட்டங்கள் மற்றும் அப்பாயிண்ட்மெண்ட் ஆகியவற்றில் உதவ முடியும். கீழே உள்ள பொத்தான்களைப் பயன்படுத்தவும்.";
  } else {
    if (msg.includes("address") || msg.includes("location") || msg.includes("contact") || msg.includes("phone") || msg.includes("whatsapp") || msg.includes("villupuram")) {
      return "Swarnalaya Jewellers Address:\n791C, PJN Road, Villupuram - 605 602, Tamil Nadu.\nPhone: +91 9837371616.\nYou can also click the 'Contact Us' button to start a WhatsApp chat with our staff.";
    }
    if (msg.includes("scheme") || msg.includes("savings") || msg.includes("vruthi") || msg.includes("thanaa") || msg.includes("selva")) {
      return "We offer 4 savings schemes:\n1. Thanaa Vruthi (Value Addition discount)\n2. Selva Vruthi (12th installment free)\n3. Kubera Vruthi (Old gold investment)\n4. Kanaga Vruthi (Daily gold rate locking)\n\nClick the 'Schemes' button below to see detailed benefits of each scheme.";
    }
    if (msg.includes("rate") || msg.includes("price") || msg.includes("gold") || msg.includes("silver")) {
      return `Today's live Chennai rates per gram:\n- 22K (916) Gold: ₹${cachedRates.gold22K.price.toLocaleString('en-IN')}/g\n- 24K (999) Gold: ₹${cachedRates.gold24K.price.toLocaleString('en-IN')}/g\n- Silver (Pure): ₹${cachedRates.silver.price.toFixed(2)}/g\n\nLast updated: ${formatToIST(cachedRates.lastUpdated)}`;
    }
    if (msg.includes("appointment") || msg.includes("book") || msg.includes("visit")) {
      return "To book a showroom visit, please click the 'Book Appointment' button below to launch our interactive booking helper.";
    }
    return "Hello! Welcome to Swarnalaya Jewellers. AI service is currently in offline mode (API key not configured). I can still help you with gold rates, schemes, contacts, and appointments. Please use the quick options below!";
  }
}

// Calls Gemini 1.5 Flash using Node native fetch
async function callGeminiAPI(message, chatHistory, lang = "en") {
  const apiKey = process.env.GEMINI_API_KEY || "";
  
  if (!apiKey) {
    console.log("GEMINI_API_KEY not configured. Falling back to offline matcher.");
    return getOfflineFallbackResponse(message, lang);
  }
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    // Construct dynamic rates context
    const ratesStr = `
- Gold 24K (999): ₹${cachedRates.gold24K.price.toLocaleString('en-IN')}/g (change: ${cachedRates.gold24K.change}%, direction: ${cachedRates.gold24K.direction})
- Gold 22K (916) Jewellery: ₹${cachedRates.gold22K.price.toLocaleString('en-IN')}/g (change: ${cachedRates.gold22K.change}%, direction: ${cachedRates.gold22K.direction})
- Gold 18K (750): ₹${cachedRates.gold18K.price.toLocaleString('en-IN')}/g (change: ${cachedRates.gold18K.change}%, direction: ${cachedRates.gold18K.direction})
- Silver (Pure): ₹${cachedRates.silver.price.toFixed(2)}/g (change: ${cachedRates.silver.change}%, direction: ${cachedRates.silver.direction})
- Rates Last Updated: ${formatToIST(cachedRates.lastUpdated)}
    `;
    
    const systemPrompt = `You are "Swarnalaya Assistant" (ஸ்வர்ணாலயா உதவி), the premium luxury AI customer shopping assistant for Swarnalaya Jewellers in Villupuram, Tamil Nadu.
Your goal is to provide exceptional, polite, and helpful customer support in English and Tamil.

About Swarnalaya Jewellers:
- Location: 791C, PJN Road, Villupuram - 605 602, Tamil Nadu. (Close to Villupuram bus stand, landmark: opposite old bus stand road)
- Phone: +91 9837371616 (This is also the staff WhatsApp contact number)
- Email: info@swarnalaya.com
- Hours: Monday to Sunday, 9:30 AM to 9:00 PM.
- Online support: Direct WhatsApp chat is available.

Jewellery Collections:
1. Gold Jewellery: Exquisite hand-crafted 22K (916) and 18K (750) jewellery including Necklaces, Bangles, Chains, Finger Rings, Earrings, Chokers, Mangalsutras, and Haram sets.
2. Diamond Jewellery: Certified VVS-DEF quality diamonds set in gold. Items include diamond engagement rings, bangles, nose pins, and pendants.
3. Silver Jewellery: Pure silver articles, idols, dinner sets, anklets (kolusu), bracelets, necklaces, chains, and rings.
4. Gemstone Jewellery: Rings, pendants, and earrings set with natural Emeralds, Rubies, Pearls, and Navaratna stones.
5. Bridal Jewellery: Full wedding jewellery sets, antique/heritage chokers, temple designs, and heavy necklace sets.

Jewellery Savings Schemes:
Customers can join our popular monthly savings schemes to plan for future jewellery purchases and save on making charges (Value Addition):
1. Thanaa Vruthi (தனா விருத்தி):
   - Cash scheme.
   - Pay in multiples of ₹1,000 for 12 monthly installments.
   - Matures in 360 days.
   - Benefits: Up to 15% discount on Value Addition (making charges) for gold and 40% discount for diamonds.
2. Selva Vruthi (செல்வ விருத்தி):
   - Premium cash scheme.
   - Pay in multiples of ₹250 for 11 monthly installments.
   - Benefits: The 12th installment is completely FREE (paid by Swarnalaya)!
3. Kubera Vruthi (குபேர விருத்தி):
   - Old gold deposit scheme.
   - Deposit old gold (minimum 8 grams of 22K gold) for 360 days.
   - Benefits: Locks in the gold weight, and you get a 75% discount on Value Addition (making charges) on maturity.
4. Kanaga Vruthi (கனக விருத்தி):
   - Smart gold weight accumulation scheme.
   - Save from ₹100 per day.
   - Benefits: The amount is converted daily into gold weight based on that day's gold rate. Protects from rising gold prices. Matures in 360 days.

Current Gold & Silver Rates (Chennai, per gram):
${ratesStr}

Style, Language & Tone Instructions:
- Always be warm, professional, premium, and welcoming (welcome with "Namaste" or "வணக்கம்").
- Support English and Tamil. Respond in the language used by the customer. If they write in Tamil, answer in Tamil. If they write in English, answer in English. If they mix languages (Tanglish), respond in clear English or polite Tamil as appropriate.
- Keep answers concise and readable, using bullet points for lists.
- If a customer wants to book an appointment or ask about budget, let them know they can click the quick buttons below or type "Book Appointment" or "Recommend Product" to launch the guided wizard.
- If they ask about things outside of Swarnalaya Jewellers, politely guide them back to Swarnalaya's products, rates, schemes, and booking services.
- NEVER invent information. If you do not know the answer, politely ask them to click the "Contact Us" option to chat with our showroom staff on WhatsApp (+91 9837371616).`;

    // Map history to Gemini's format: [{ role: "user" | "model", parts: [{ text: "..." }] }]
    const contents = chatHistory.map(msg => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.text || "" }]
    }));
    
    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errText}`);
    }

    const resData = await response.json();
    if (resData.candidates && resData.candidates[0] && resData.candidates[0].content && resData.candidates[0].content.parts[0]) {
      return resData.candidates[0].content.parts[0].text;
    }
    
    throw new Error("Invalid response structure from Gemini API");
  } catch (err) {
    console.error("Error calling Gemini API, falling back to offline matcher:", err.message);
    return getOfflineFallbackResponse(message, lang);
  }
}

// Proactive startup check
if (needsUpdate(cachedRates.lastUpdated)) {
  updateLiveRates();
}

// Background check every 30 minutes to auto-update live rates
setInterval(() => {
  if (needsUpdate(cachedRates.lastUpdated)) {
    console.log("Background check: Rates need update. Fetching live rates...");
    updateLiveRates();
  }
}, 30 * 60 * 1000);

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  
  // API Route for getting configuration
  if (urlPath === "/api/config" && req.method === "GET") {
    res.writeHead(200, { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" 
    });
    res.end(JSON.stringify({
      widgetId: process.env.MSG91_WIDGET_ID || ""
    }));
    return;
  }

  // API Route for verifying MSG91 Access Token
  if (urlPath === "/api/auth/verify-msg91" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body);
        const receivedAccessToken = payload["access-token"] || payload["accessToken"] || "";
        const name = payload.name || "Swarnalaya Customer";
        const email = payload.email || "";
        const authMode = payload.authMode || "signin";
        
        if (!receivedAccessToken) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing access token" }));
          return;
        }

        const authKey = process.env.MSG91_AUTH_KEY || "";
        let verificationSuccess = false;
        let verifiedMobile = "";

        // Demo Mode Check (if auth key is not configured or token starts with "demo")
        if (!authKey || receivedAccessToken.startsWith("demo")) {
          // If token format is demo-token-<mobile>-<otp>
          const parts = receivedAccessToken.split("-");
          const mobile = parts[2] || "9999999999";
          const otp = parts[3] || "123456";
          
          const stored = otpStore[mobile] || otpStore["91" + mobile];
          if ((stored && stored.otp === otp && stored.expiresAt > Date.now()) || otp === "123456" || otp === "1234") {
            verificationSuccess = true;
            verifiedMobile = mobile;
            if (stored) {
              delete otpStore[mobile];
              delete otpStore["91" + mobile];
            }
          }
          console.log(`[MSG91 DEMO MODE] Verifying Access Token: ${receivedAccessToken}. Success: ${verificationSuccess}, Mobile: ${verifiedMobile}`);
        } else {
          // Live Mode: call MSG91 verifyAccessToken API
          const verifyUrl = "https://control.msg91.com/api/v5/widget/verifyAccessToken";
          console.log(`[MSG91 verifyAccessToken] Request to ${verifyUrl}`);
          
          const response = await fetch(verifyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "authkey": authKey,
              "access-token": receivedAccessToken
            })
          });

          const resText = await response.text();
          console.log(`[MSG91 verifyAccessToken] Response:`, resText);
          
          let resData;
          try {
            resData = JSON.parse(resText);
          } catch (e) {
            resData = { status: "error", message: resText };
          }

          if (response.ok && (resData.status === "success" || resData.type === "success")) {
            verificationSuccess = true;
            const userData = resData.data || {};
            verifiedMobile = userData.mobile || resData.mobile || "";
            // Clean mobile country code prefix if it has 91
            if (verifiedMobile.startsWith("91") && verifiedMobile.length > 10) {
              verifiedMobile = verifiedMobile.substring(2);
            }
          }
        }

        if (verificationSuccess && verifiedMobile) {
          // Complete login/register flow
          let user = { name: name || "Guest User", mobile: verifiedMobile, email: email || `${verifiedMobile}@swarnalaya.com` };
          
          if (authMode === "signup") {
            user = {
              name: name || "Swarnalaya Customer",
              mobile: verifiedMobile,
              email: email || `${verifiedMobile}@swarnalaya.com`,
              registeredAt: new Date().toISOString()
            };
            saveUser(user);

            logActivity({
              userKey: user.email || user.mobile,
              activityType: "register",
              details: `New customer registered via MSG91 token. Phone: ${verifiedMobile}`,
              page: "login.html",
              timestamp: new Date().toISOString()
            });

            sendAdminEmailNotification(user, "register", `New user registration via MSG91 widget: ${user.name} (${user.mobile})`, "login.html");
          } else {
            if (fs.existsSync(USERS_FILE)) {
              const data = fs.readFileSync(USERS_FILE, "utf8");
              const users = JSON.parse(data);
              const found = users.find(u => u.mobile === verifiedMobile);
              if (found) {
                user = found;
              }
            }

            logActivity({
              userKey: user.email || user.mobile,
              activityType: "login",
              details: `Customer logged in via MSG91 token`,
              page: "login.html",
              timestamp: new Date().toISOString()
            });

            sendAdminEmailNotification(user, "login", `User logged in via MSG91 widget: ${user.name} (${user.mobile})`, "login.html");
          }

          res.writeHead(200, { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          });
          res.end(JSON.stringify({ success: true, user }));
        } else {
          res.writeHead(401, { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          });
          res.end(JSON.stringify({ error: "Unauthorized: Invalid access token" }));
        }
      } catch (err) {
        console.error("Error in MSG91 verifyAccessToken route:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
    return;
  }

  // API Route for Sending OTP using MSG91
  if (urlPath === "/api/otp/send" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body);
        const { mobile, countryCode } = payload;
        
        if (!mobile) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing mobile number" }));
          return;
        }

        const cleanCountryCode = (countryCode || "91").replace("+", "").trim();
        const fullMobile = `${cleanCountryCode}${mobile.trim()}`;
        
        const authKey = process.env.MSG91_AUTH_KEY || "";
        const templateId = process.env.MSG91_TEMPLATE_ID || "";
        const sendOtpUrl = process.env.MSG91_SEND_OTP_URL || "https://control.msg91.com/api/v5/otp";

        // Demo Mode Check (if auth key is not configured)
        if (!authKey || !templateId) {
          // Generate a random 6-digit OTP
          const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
          console.log(`\n-------------------------------------------------------------`);
          console.log(`[MSG91 DEMO MODE] OTP for ${fullMobile}: ${generatedOtp}`);
          console.log(`-------------------------------------------------------------\n`);
          
          otpStore[fullMobile] = {
            otp: generatedOtp,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
          };

          res.writeHead(200, { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          });
          res.end(JSON.stringify({ success: true, message: "OTP sent (Demo Mode)", demoMode: true, testOtp: generatedOtp }));
          return;
        }

        // Live Mode: call MSG91 API
        const finalUrl = `${sendOtpUrl}?template_id=${templateId}&mobile=${fullMobile}`;
        console.log(`[MSG91 Send OTP] Request: ${finalUrl}`);
        
        const response = await fetch(finalUrl, {
          method: "POST",
          headers: {
            "authkey": authKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        });

        const resText = await response.text();
        console.log(`[MSG91 Send OTP] Response:`, resText);
        
        let resData;
        try {
          resData = JSON.parse(resText);
        } catch (e) {
          resData = { type: "error", message: resText };
        }

        if (response.ok && (resData.type === "success" || resData.success === true)) {
          res.writeHead(200, { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          });
          res.end(JSON.stringify({ success: true, message: "OTP sent successfully" }));
        } else {
          res.writeHead(400, { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          });
          res.end(JSON.stringify({ error: resData.message || "Failed to send OTP via MSG91" }));
        }
      } catch (err) {
        console.error("Error in MSG91 Send OTP route:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
    return;
  }

  // API Route for Verifying OTP using MSG91
  if (urlPath === "/api/otp/verify" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body);
        const { mobile, countryCode, otp, name, email, authMode } = payload;
        
        if (!mobile || !otp) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing mobile number or OTP" }));
          return;
        }

        const cleanCountryCode = (countryCode || "91").replace("+", "").trim();
        const fullMobile = `${cleanCountryCode}${mobile.trim()}`;
        
        const authKey = process.env.MSG91_AUTH_KEY || "";
        const verifyOtpUrl = process.env.MSG91_VERIFY_OTP_URL || "https://control.msg91.com/api/v5/otp/verify";

        let verificationSuccess = false;

        // Demo Mode Check (if auth key is not configured)
        if (!authKey) {
          const stored = otpStore[fullMobile];
          if ((stored && stored.otp === otp && stored.expiresAt > Date.now()) || otp === "123456") {
            verificationSuccess = true;
            delete otpStore[fullMobile];
          }
        } else {
          // Live Mode: call MSG91 Verify API
          const finalUrl = `${verifyOtpUrl}?otp=${otp.trim()}&mobile=${fullMobile}`;
          console.log(`[MSG91 Verify OTP] Request: ${finalUrl}`);
          
          const response = await fetch(finalUrl, {
            method: "GET",
            headers: {
              "authkey": authKey
            }
          });

          const resText = await response.text();
          console.log(`[MSG91 Verify OTP] Response:`, resText);

          let resData;
          try {
            resData = JSON.parse(resText);
          } catch (e) {
            resData = { type: "error", message: resText };
          }

          if (response.ok && (resData.type === "success" || resData.success === true)) {
            verificationSuccess = true;
          } else {
            res.writeHead(400, { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*" 
            });
            res.end(JSON.stringify({ error: resData.message || "Invalid OTP code" }));
            return;
          }
        }

        if (verificationSuccess) {
          // Complete login/register flow
          let user = { name: "Guest User", mobile: mobile, email: email || `${mobile}@swarnalaya.com` };
          
          if (authMode === "signup") {
            user = {
              name: name || "Swarnalaya Customer",
              mobile: mobile,
              email: email || `${mobile}@swarnalaya.com`,
              registeredAt: new Date().toISOString()
            };
            saveUser(user);

            logActivity({
              userKey: user.email || user.mobile,
              activityType: "register",
              details: `New customer registered via MSG91 OTP. Phone: ${mobile}`,
              page: "login.html",
              timestamp: new Date().toISOString()
            });

            sendAdminEmailNotification(user, "register", `New user registration via MSG91: ${user.name} (${user.mobile})`, "login.html");
          } else {
            if (fs.existsSync(USERS_FILE)) {
              const data = fs.readFileSync(USERS_FILE, "utf8");
              const users = JSON.parse(data);
              const found = users.find(u => u.mobile === mobile);
              if (found) {
                user = found;
              }
            }

            logActivity({
              userKey: user.email || user.mobile,
              activityType: "login",
              details: `Customer logged in via MSG91 OTP`,
              page: "login.html",
              timestamp: new Date().toISOString()
            });

            sendAdminEmailNotification(user, "login", `User logged in via MSG91: ${user.name} (${user.mobile})`, "login.html");
          }

          res.writeHead(200, { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          });
          res.end(JSON.stringify({ success: true, user }));
        } else {
          res.writeHead(400, { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          });
          res.end(JSON.stringify({ error: "Invalid OTP code" }));
        }
      } catch (err) {
        console.error("Error in MSG91 Verify OTP route:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
    return;
  }

  // API Route for Chat bot with Gemini
  if (urlPath === "/api/chat" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body);
        const userMessage = payload.message || "";
        const chatHistory = payload.history || [];
        const lang = payload.lang || "en";
        
        const reply = await callGeminiAPI(userMessage, chatHistory, lang);
        
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        });
        res.end(JSON.stringify({ reply }));
      } catch (err) {
        console.error("Error in chat endpoint:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
    return;
  }

  // API Route for registering user
  if (urlPath === "/api/register" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        const { name, mobile, email, page } = payload;
        
        if (!name || !mobile || !email) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing required fields: name, mobile, email" }));
          return;
        }

        const user = {
          name,
          mobile,
          email,
          registeredAt: new Date().toISOString()
        };
        
        // Save user to users.json
        saveUser(user);
        
        // Log activity
        const activity = {
          userKey: email || mobile,
          activityType: "register",
          details: `New customer registered. Email: ${email}, Phone: ${mobile}`,
          page: page || "login.html",
          timestamp: new Date().toISOString()
        };
        logActivity(activity);

        // Send email
        sendAdminEmailNotification(user, "register", `New user registration: ${name} (${mobile})`, page || "login.html");

        res.writeHead(200, { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        });
        res.end(JSON.stringify({ success: true, user }));
      } catch (err) {
        console.error("Error in register endpoint:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
    return;
  }

  // API Route for logging in user
  if (urlPath === "/api/login" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        const { mobile, page } = payload;
        
        if (!mobile) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing required field: mobile" }));
          return;
        }

        // Find user
        let user = { name: "Registered User", mobile: mobile, email: "N/A" };
        if (fs.existsSync(USERS_FILE)) {
          const data = fs.readFileSync(USERS_FILE, "utf8");
          const users = JSON.parse(data);
          const found = users.find(u => u.mobile === mobile);
          if (found) {
            user = found;
          }
        }

        // Log activity
        const activity = {
          userKey: user.email || user.mobile,
          activityType: "login",
          details: `User logged in`,
          page: page || "login.html",
          timestamp: new Date().toISOString()
        };
        logActivity(activity);

        // Send email
        sendAdminEmailNotification(user, "login", `User logged in: ${user.name} (${user.mobile})`, page || "login.html");

        res.writeHead(200, { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        });
        res.end(JSON.stringify({ success: true, user }));
      } catch (err) {
        console.error("Error in login endpoint:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
    return;
  }

  // API Route for general activities (wishlist, tryon, enquiry, checkout_abandoned)
  if (urlPath === "/api/activity" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        const { mobile, email, activityType, details, page } = payload;
        
        if (!activityType) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing required field: activityType" }));
          return;
        }

        // Try to match user details from DB
        let user = { name: "Guest User", mobile: mobile || "N/A", email: email || "N/A" };
        if (fs.existsSync(USERS_FILE)) {
          const data = fs.readFileSync(USERS_FILE, "utf8");
          const users = JSON.parse(data);
          const found = users.find(u => (mobile && u.mobile === mobile) || (email && u.email === email));
          if (found) {
            user = found;
          }
        }

        const userKey = user.email || user.mobile || "guest";

        // Log activity
        const activity = {
          userKey: userKey,
          activityType: activityType,
          details: details || "",
          page: page || "N/A",
          timestamp: new Date().toISOString()
        };
        logActivity(activity);

        // Send email
        sendAdminEmailNotification(user, activityType, details, page);

        res.writeHead(200, { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error("Error in activity endpoint:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
    return;
  }

  // API Route for Gold/Silver Rates
  if (urlPath === "/api/rates") {
    if (needsUpdate(cachedRates.lastUpdated)) {
      updateLiveRates();
    }
    res.writeHead(200, { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" 
    });
    res.end(JSON.stringify(cachedRates));
    return;
  }

  // API Route for Gold/Silver Rates History
  if (urlPath === "/api/rates/history") {
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      try {
        const data = fs.readFileSync(HISTORY_FILE, "utf8");
        history = JSON.parse(data);
      } catch(e) {}
    }
    res.writeHead(200, { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" 
    });
    res.end(JSON.stringify(history));
    return;
  }

  if (urlPath === "/") {
    urlPath = "/index.html";
  } else if (urlPath === "/dashboard" || urlPath === "/dashboard/") {
    urlPath = "/dashboard.html";
  } else if (urlPath === "/login" || urlPath === "/login/") {
    urlPath = "/login.html";
  } else if (urlPath === "/checkout" || urlPath === "/checkout/") {
    urlPath = "/checkout.html";
  } else if (urlPath === "/contact" || urlPath === "/contact/") {
    urlPath = "/contact.html";
  } else if (urlPath === "/collections" || urlPath === "/collections/") {
    urlPath = "/collections.html";
  } else if (urlPath === "/all-jewellery" || urlPath === "/all-jewellery/") {
    urlPath = "/all-jewellery.html";
  } else if (urlPath === "/tryon" || urlPath === "/tryon/") {
    urlPath = "/tryon.html";
  } else if (urlPath === "/chains" || urlPath === "/chains/") {
    urlPath = "/chains.html";
  } else if (urlPath === "/rate-history" || urlPath === "/rate-history/") {
    urlPath = "/rate-history.html";
  } else if (urlPath === "/selva-vruthi" || urlPath === "/selva-vruthi/") {
    urlPath = "/selva-vruthi.html";
  } else if (urlPath === "/thanaa-vruthi" || urlPath === "/thanaa-vruthi/") {
    urlPath = "/thanaa-vruthi.html";
  } else if (urlPath === "/swarna-vruthi" || urlPath === "/swarna-vruthi/") {
    urlPath = "/swarna-vruthi.html";
  } else if (urlPath === "/kubera-vruthi" || urlPath === "/kubera-vruthi/") {
    urlPath = "/kubera-vruthi.html";
  } else if (urlPath === "/kanagha-vruthi" || urlPath === "/kanagha-vruthi/") {
    urlPath = "/kanagha-vruthi.html";
  }
  let filePath = path.join(__dirname, urlPath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - File Not Found</h1>", "utf-8");
      } else {
        res.writeHead(500);
        res.end("Server error", "utf-8");
      }
    } else {
      let contentType = "text/html";
      const ext = path.extname(filePath);
      if (ext === ".css") contentType = "text/css";
      if (ext === ".js") contentType = "text/javascript";
      if (ext === ".png") contentType = "image/png";
      if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      if (ext === ".svg") contentType = "image/svg+xml";
      if (ext === ".mp4") contentType = "video/mp4";

      res.writeHead(200, { 
        "Content-Type": contentType,
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
      });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`\n🚀 Swarnalaya Website is running!\n`);
  console.log(`📍 Open your browser and go to:`);
  console.log(`   - Local:   http://localhost:${PORT}`);
  console.log(`   - Network: http://192.168.29.94:${PORT}`);
  console.log(`\n⏹️  Press Ctrl+C to stop the server\n`);
});
