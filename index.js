const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Increased limit to 15MB so users can easily upload payment screenshots
app.use(express.json({ limit: '15mb' }));

// Permanent Storage Setup (Automatically uses Railway Volume /app/data)
const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}
const DB_FILE = path.join(DATA_DIR, 'database.json');

const PLANS = [
  { id: 1, name: 'VIP 1 - Starter Elite', price: 500, daily: 50, days: 30, reqInvites: 0 },
  { id: 2, name: 'VIP 2 - Bronze Venture', price: 1500, daily: 150, days: 30, reqInvites: 0 },
  { id: 3, name: 'VIP 3 - Silver Capital', price: 3000, daily: 300, days: 20, reqInvites: 0 },
  { id: 4, name: 'VIP 4 - Gold Tycoon', price: 6000, daily: 600, days: 20, reqInvites: 0 },
  { id: 5, name: 'VIP 5 - Platinum Empire', price: 15000, daily: 1500, days: 20, reqInvites: 3 }, // Requires 3 Invites
  { id: 6, name: 'VIP 6 - Diamond Syndicate', price: 50000, daily: 5000, days: 20, reqInvites: 5 } // Requires 5 Invites
];

const nowTime = Date.now();

// Pre-loaded 33 Active Users (Updated Backup)
const INITIAL_USERS = [
  { id: 370019, name: 'Malik', phone: '03074532161', pass: null, balance: 5513, activePlan: PLANS[4], lastClaimTime: nowTime, referredBy: null, refEarnings: 0, customTeamCount: 24, isAdmin: false },
  { id: 752498, name: 'Hamza', phone: '03146317272', pass: null, balance: 25640, activePlan: PLANS[3], lastClaimTime: nowTime, referredBy: null, refEarnings: 0, customTeamCount: 16, isAdmin: false },
  { id: 470999, name: 'Haneef', phone: '03105426316', pass: null, balance: 13480, activePlan: PLANS[2], lastClaimTime: nowTime, referredBy: null, refEarnings: 0, customTeamCount: 9, isAdmin: false },
  { id: 138967, name: 'Arham', phone: '03466400034', pass: null, balance: 13800, activePlan: PLANS[3], lastClaimTime: nowTime, referredBy: 3, refEarnings: 0, customTeamCount: 9, isAdmin: false },
  { id: 594811, name: 'Muhammad Shahwaiz Shaheer', phone: '03355333310', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 370019, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 461445, name: 'Muhammad Ali', phone: '0318 0816215', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 370019, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 785971, name: 'Abdulhadi', phone: '+923135861028', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 370019, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 292161, name: 'Muzamil Khan', phone: '03126112337', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 370019, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 221169, name: 'Zainab umer', phone: '0327 9189534', pass: null, balance: 600, activePlan: PLANS[3], lastClaimTime: nowTime, referredBy: 370019, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 260690, name: 'Jani gujjar', phone: '03204049533', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 752498, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 190187, name: 'shahzaib niazi', phone: '03188117086', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 752498, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 946320, name: 'Muhammad Arslan', phone: '03215706658', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 292161, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 362105, name: 'Hashir amin', phone: '03402828581', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 370019, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 982227, name: 'Moiz Ul Eman', phone: '03708058726', pass: null, balance: 0, activePlan: PLANS[1], lastClaimTime: nowTime, referredBy: 752498, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 399878, name: 'Luqman', phone: '03295825871', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: null, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 993595, name: 'Shahid zaman', phone: '03005498117', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 399878, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 949009, name: 'Daniyal', phone: '0318 5223061', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: null, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 982852, name: 'Kamran Maqsood', phone: '03484097886', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 982227, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 377280, name: 'Shehzan', phone: '03182628010', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 982227, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 203973, name: 'Haseeb Ahmed', phone: '03105941294', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 370019, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 930607, name: 'Muhammad Abdullah', phone: '03104166661', pass: null, balance: 250, activePlan: PLANS[0], lastClaimTime: nowTime, referredBy: 370019, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 479946, name: 'Muhammed Zafir khan', phone: '03001555644', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 930607, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 808836, name: 'Muhammad Fahad ameer', phone: '03355328153', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 190187, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 787130, name: 'Malik adnan', phone: '03183615420', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 370019, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 391226, name: 'Palwasha', phone: '03135309990', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 370019, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 983196, name: 'Mehran Mehfooz', phone: '03447969768', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 982227, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 535236, name: 'Yasir Awan', phone: '03704791734', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 370019, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 693023, name: 'Hasnain Aqdas', phone: '03305349779', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 982227, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 211015, name: 'Abdul Samad', phone: '03715291288', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 190187, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 297188, name: 'HK123', phone: '03165348096', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: null, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 927719, name: 'Muzzamil jutt', phone: '03199710144', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 693023, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 153071, name: 'Hassaan', phone: '03105212438', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: 693023, refEarnings: 0, customTeamCount: null, isAdmin: false },
  { id: 555641, name: 'Khizar Khattak', phone: '+923368664218', pass: null, balance: 0, activePlan: null, lastClaimTime: null, referredBy: null, refEarnings: 0, customTeamCount: null, isAdmin: false }
];

let db = {
  users: INITIAL_USERS,
  plans: PLANS,
  deposits: [],
  withdrawals: []
};

// Load saved database from Railway Volume so NO users or transaction history are ever lost
if (fs.existsSync(DB_FILE)) {
  try {
    const saved = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (saved && Array.isArray(saved.users) && saved.users.length > 0) {
      db.users = saved.users;
      db.deposits = saved.deposits || [];
      db.withdrawals = saved.withdrawals || [];
      INITIAL_USERS.forEach(initUser => {
        if (!db.users.find(u => u.id === initUser.id)) {
          db.users.push(initUser);
        }
      });
    }
  } catch (e) {
    console.error('Error loading DB file:', e);
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      users: db.users,
      deposits: db.deposits,
      withdrawals: db.withdrawals
    }, null, 2));
  } catch (e) {
    console.error('Error saving DB file:', e);
  }
}

db.users.forEach(u => {
  if (u.activePlan && !u.lastClaimTime) {
    u.lastClaimTime = Date.now();
  }
});
saveDB();

const ADMIN_PHONE = '03256098796';
const ADMIN_PASS = 'admin123';

function normalizePhone(p) {
  return String(p || '').replace(/\s+/g, '').trim();
}

function getUserTeamCount(user) {
  if (!user) return 0;
  const depositedRefs = db.users.filter(u => u.referredBy === user.id && u.activePlan !== null).length;
  if (typeof user.customTeamCount === 'number') {
    return user.customTeamCount;
  }
  return depositedRefs;
}

// Credit 10% Daily ROI + 1% of Friend's TOTAL DEPOSIT as Daily Referral Bonus
function creditUserROI(user) {
  if (!user || !user.activePlan) return false;
  const planObj = db.plans.find(p => p.id === Number(user.activePlan.id)) || user.activePlan;
  const dailyProfit = Number(planObj.daily || (planObj.price * 0.10));
  user.balance = Number((Number(user.balance || 0) + dailyProfit).toFixed(2));
  user.lastClaimTime = Date.now();

  if (user.referredBy) {
    const referrer = db.users.find(u => u.id === Number(user.referredBy));
    if (referrer) {
      // 1% of the friend's TOTAL DEPOSIT (price) every 24 hours!
      const refBonus = Number((Number(planObj.price) * 0.01).toFixed(2));
      referrer.balance = Number((Number(referrer.balance || 0) + refBonus).toFixed(2));
      referrer.refEarnings = Number(((Number(referrer.refEarnings) || 0) + refBonus).toFixed(2));
    }
  }
  saveDB();
  return true;
}

// Automatic 24-Hour ROI Credit Timer for ALL Plans
setInterval(() => {
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  let updated = false;

  db.users.forEach(user => {
    if (user.activePlan) {
      if (!user.lastClaimTime) {
        user.lastClaimTime = now;
        updated = true;
      } else if (now - user.lastClaimTime >= TWENTY_FOUR_HOURS) {
        creditUserROI(user);
        updated = true;
      }
    }
  });

  if (updated) saveDB();
}, 60 * 1000);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VIP Earn PK - Futuristic Crypto & Wealth Hub</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        body {
          background-color: #030712;
          overflow-x: hidden;
        }
        /* Moving Futuristic Cyber Grid */
        .cyber-grid {
          position: fixed;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(234, 179, 8, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(236, 72, 153, 0.05) 1px, transparent 1px);
          background-size: 38px 38px;
          transform: perspective(600px) rotateX(45deg) scale(1.8);
          transform-origin: center top;
          animation: gridMove 15s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 380px; }
        }
        /* Neon Glassmorphism Card */
        .glass-card {
          background: rgba(10, 15, 30, 0.82);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(250, 204, 21, 0.32);
          box-shadow: 0 0 25px rgba(234, 179, 8, 0.08), inset 0 0 15px rgba(250, 204, 21, 0.04);
        }
        /* Live Ticker Animation */
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-ticker {
          display: inline-block;
          white-space: nowrap;
          animation: ticker 22s linear infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.12); }
        }
        .animate-glow { animation: pulseGlow 6s ease-in-out infinite; }
      </style>
    </head>
    <body class="text-slate-100 font-sans min-h-screen flex flex-col justify-between relative">
      
      <!-- Live 3D Crypto & Bitcoin Floating Canvas -->
      <canvas id="cryptoCanvas" class="fixed inset-0 pointer-events-none z-0"></canvas>
      <div class="cyber-grid"></div>

      <!-- Ambient Futuristic Neon Orbs -->
      <div class="fixed top-10 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-glow z-0"></div>
      <div class="fixed bottom-10 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none animate-glow z-0"></div>

      <!-- Top Live Crypto & Payout Ticker -->
      <div class="w-full bg-slate-950/90 border-b border-amber-500/30 py-1.5 overflow-hidden z-20 sticky top-0 backdrop-blur-md">
        <div class="animate-ticker text-[11px] font-bold tracking-wider text-amber-300">
          <span class="mx-4"><i class="fab fa-bitcoin text-amber-400 mr-1"></i> BTC/USDT AI-Node: <span class="text-emerald-400">+10.0% Daily Yield Active</span></span>
          <span class="mx-4">⚡ VIP #370019 received <span class="text-emerald-400">Rs. 1,500</span> Auto-ROI</span>
          <span class="mx-4">💸 VIP #752498 withdrew <span class="text-emerald-400">Rs. 4,500</span> via EasyPaisa</span>
          <span class="mx-4">🔥 VIP #982227 earned <span class="text-amber-400">1% Team Royalty Bonus</span></span>
          <span class="mx-4">💎 Instant NayaPay & EasyPaisa Automated Payouts Live 24/7</span>
        </div>
      </div>

      <div id="app" class="max-w-md mx-auto w-full p-4 flex-grow z-10 pb-24"></div>
      
      <!-- Fullscreen Screenshot Viewer Modal -->
      <div id="imgModal" onclick="this.classList.add('hidden')" class="hidden fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 cursor-pointer">
        <p class="text-xs text-amber-400 font-bold mb-2 uppercase tracking-wider">Tap anywhere to close</p>
        <img id="imgModalSrc" src="" class="max-h-[85vh] max-w-full rounded-2xl border-2 border-amber-400 shadow-2xl object-contain" />
      </div>

      <!-- Telegram Official Support Floating Button -->
      <a href="https://t.me/VIPEARNPK_SUPPORT" target="_blank" class="fixed bottom-5 right-5 bg-gradient-to-r from-amber-500 via-yellow-500 to-pink-600 hover:brightness-110 text-slate-950 px-5 py-3.5 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center gap-2.5 text-xs font-black uppercase tracking-wider z-40 transition transform hover:scale-105 border border-amber-200/60">
        <i class="fab fa-telegram-plane text-xl"></i> VIP Telegram Care
      </a>

      <script>
        // --- LIVE FUTURISTIC BITCOIN & CRYPTO PARTICLE ANIMATION ---
        const canvas = document.getElementById('cryptoCanvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        const symbols = ['₿', '₮', 'Ξ', '◈', '₨', '★'];
        const colors = ['#facc15', '#f59e0b', '#10b981', '#ec4899', '#38bdf8'];

        function resizeCanvas() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        for (let i = 0; i < 28; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.65,
            vy: -Math.random() * 0.85 - 0.25,
            size: Math.floor(Math.random() * 14) + 12,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.55 + 0.2,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.02
          });
        }

        function animateCryptoBg() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 135) {
                ctx.beginPath();
                ctx.strokeStyle = \`rgba(250, 204, 21, \${(1 - dist / 135) * 0.16})\`;
                ctx.lineWidth = 0.8;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
              }
            }
          }

          particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.angle += p.spin;

            if (p.y < -30) p.y = canvas.height + 30;
            if (p.x < -30) p.x = canvas.width + 30;
            if (p.x > canvas.width + 30) p.x = -30;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.font = \`bold \${p.size}px monospace\`;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;
            ctx.fillText(p.symbol, -p.size / 2, p.size / 2);
            ctx.restore();
          });

          requestAnimationFrame(animateCryptoBg);
        }
        animateCryptoBg();

        // --- MAIN APP LOGIC ---
        let currentUser = null;
        let selectedScreenshotData = null;
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('ref') || '';

        async function api(url, data) {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          return res.json();
        }

        function copyText(text, label) {
          navigator.clipboard.writeText(text);
          alert(label + ' copied to clipboard: ' + text);
        }

        function viewFullImage(src) {
          if (!src) return;
          document.getElementById('imgModalSrc').src = src;
          document.getElementById('imgModal').classList.remove('hidden');
        }

        function handleScreenshotSelect(event) {
          const file = event.target.files[0];
          if (!file) {
            selectedScreenshotData = null;
            return;
          }
          const reader = new FileReader();
          reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 750;
              let width = img.width;
              let height = img.height;
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              selectedScreenshotData = canvas.toDataURL('image/jpeg', 0.7);
              const previewImg = document.getElementById('ssPreview');
              const previewBox = document.getElementById('ssPreviewContainer');
              if (previewImg && previewBox) {
                previewImg.src = selectedScreenshotData;
                previewBox.classList.remove('hidden');
              }
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }

        function renderLogin() {
          document.getElementById('app').innerHTML = \`
            <div class="flex items-center justify-center min-h-[82vh]">
              <div class="glass-card p-8 rounded-3xl shadow-2xl w-full relative overflow-hidden">
                <div class="text-center mb-8">
                  <div class="inline-flex p-4 bg-gradient-to-tr from-amber-500/25 via-yellow-400/20 to-pink-500/25 text-amber-400 rounded-2xl text-4xl mb-4 border border-amber-400/40 shadow-[0_0_25px_rgba(250,204,21,0.3)]">
                    <i class="fab fa-bitcoin animate-pulse"></i>
                  </div>
                  <h1 class="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-pink-400">VIP EARN PK</h1>
                  <p class="text-[11px] text-amber-400/90 mt-1 uppercase tracking-widest font-bold">AI-Crypto & Millionaire Wealth Hub</p>
                </div>
                
                <form onsubmit="handleLogin(event)" class="space-y-5">
                  <div>
                    <label class="block text-xs uppercase text-slate-300 font-bold mb-1.5">Mobile Number</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-amber-400"><i class="fas fa-mobile-alt"></i></span>
                      <input type="text" id="phone" required placeholder="03001234567" class="w-full bg-slate-950/90 border border-amber-500/30 rounded-xl px-4 py-3.5 pl-11 text-white focus:outline-none focus:border-amber-400">
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-300 font-bold mb-1.5">Security Password</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-amber-400"><i class="fas fa-lock"></i></span>
                      <input type="password" id="pass" required placeholder="••••••••" class="w-full bg-slate-950/90 border border-amber-500/30 rounded-xl px-4 py-3.5 pl-11 text-white focus:outline-none focus:border-amber-400">
                    </div>
                  </div>
                  <button type="submit" class="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:brightness-110 transition uppercase text-sm">
                    Access VIP Vault <i class="fas fa-bolt ml-1"></i>
                  </button>
                </form>
                
                <div class="text-center mt-6">
                  <button onclick="renderRegister()" class="text-amber-400 text-sm hover:text-amber-300 font-semibold">New Elite Member? <span class="underline">Create VIP Account</span></button>
                </div>
              </div>
            </div>
          \`;
        }

        function renderRegister() {
          document.getElementById('app').innerHTML = \`
            <div class="flex items-center justify-center min-h-[82vh]">
              <div class="glass-card p-8 rounded-3xl shadow-2xl w-full">
                <div class="text-center mb-6">
                  <div class="inline-flex p-3 bg-amber-500/20 text-amber-400 rounded-2xl text-3xl mb-2 border border-amber-500/40 shadow-[0_0_20px_rgba(250,204,21,0.25)]">
                    <i class="fas fa-user-astronaut"></i>
                  </div>
                  <h1 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">Join Elite Crypto Syndicate</h1>
                  <p class="text-xs text-slate-300 mt-1 uppercase tracking-widest">10% Daily ROI & 1% Daily Deposit Bonus</p>
                </div>
                <form onsubmit="handleRegister(event)" class="space-y-4">
                  <div>
                    <label class="block text-xs uppercase text-slate-300 font-bold mb-1">Full Name</label>
                    <input type="text" id="name" required placeholder="Muhammad Ali" class="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-300 font-bold mb-1">Mobile Number</label>
                    <input type="text" id="phone" required placeholder="03001234567" class="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-300 font-bold mb-1">Password</label>
                    <input type="password" id="pass" required placeholder="••••••••" class="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-amber-400 font-bold mb-1">Invite Code (Optional)</label>
                    <input type="text" id="refCode" value="\${refFromUrl}" placeholder="Referral ID" class="w-full bg-slate-950/90 border border-amber-500/40 rounded-xl px-4 py-3 text-amber-300 focus:outline-none focus:border-amber-400">
                  </div>
                  <button type="submit" class="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black py-3.5 rounded-xl hover:brightness-110 transition uppercase shadow-[0_0_20px_rgba(250,204,21,0.4)]">Register VIP Account</button>
                </form>
                <div class="text-center mt-5">
                  <button onclick="renderLogin()" class="text-slate-300 text-sm hover:text-amber-400">Already a member? <span class="text-amber-400 underline font-semibold">Login</span></button>
                </div>
              </div>
            </div>
          \`;
        }

        async function handleLogin(e) {
          e.preventDefault();
          const res = await api('/api/login', { phone: document.getElementById('phone').value, pass: document.getElementById('pass').value });
          if(res.ok) {
            currentUser = res.user;
            if(currentUser.isAdmin) renderAdmin();
            else renderDashboard();
          } else {
            alert(res.msg);
          }
        }

        async function handleRegister(e) {
          e.preventDefault();
          const res = await api('/api/register', {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            pass: document.getElementById('pass').value,
            referredBy: document.getElementById('refCode').value
          });
          if(res.ok) {
            alert('Elite account created successfully! Please login.');
            renderLogin();
          } else {
            alert(res.msg);
          }
        }

        async function renderDashboard() {
          const res = await api('/api/user', { id: currentUser.id });
          currentUser = res.user;
          const plans = res.plans;
          const userTeamCount = res.teamCount || 0;
          const userDeposits = res.deposits || [];
          const userWithdrawals = res.withdrawals || [];
          const inviteLink = window.location.origin + '/?ref=' + currentUser.id;

          document.getElementById('app').innerHTML = \`
            <div class="py-2 space-y-4">
              <!-- Top Profile Bar -->
              <div class="flex justify-between items-center glass-card p-3.5 rounded-2xl">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
                    <i class="fab fa-bitcoin"></i>
                  </div>
                  <div>
                    <span class="text-[10px] uppercase tracking-widest bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-black border border-amber-500/30">VIP NODE #\${currentUser.id}</span>
                    <h2 class="text-sm font-black text-white mt-0.5">\${currentUser.name}</h2>
                  </div>
                </div>
                <button onclick="logout()" class="bg-rose-500/15 text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition">Logout</button>
              </div>

              <!-- Futuristic Main Portfolio Card -->
              <div class="bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 p-5 rounded-3xl shadow-[0_0_35px_rgba(245,158,11,0.35)] text-slate-950 relative overflow-hidden border border-yellow-200/50">
                <div class="absolute -right-6 -bottom-6 text-slate-950/15 text-8xl font-black pointer-events-none"><i class="fab fa-bitcoin fa-spin" style="animation-duration: 25s;"></i></div>
                <div class="flex justify-between items-start relative z-10">
                  <div>
                    <p class="text-[11px] uppercase font-black tracking-widest opacity-80 flex items-center gap-1"><i class="fas fa-shield-alt"></i> Total Vault Balance</p>
                    <h1 class="text-3xl font-black mt-0.5">Rs. \${Number(currentUser.balance).toLocaleString()}</h1>
                  </div>
                  <span class="bg-slate-950 text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-md border border-amber-400/40">⚡ 10% Daily ROI</span>
                </div>
                <div class="mt-4 grid grid-cols-3 gap-2 relative z-10">
                  <button onclick="claimDaily()" class="bg-slate-950 text-amber-400 font-extrabold py-2.5 px-2 rounded-xl text-xs shadow-xl hover:bg-slate-900 transition flex items-center justify-center gap-1 border border-amber-400/40">
                    <i class="fas fa-bolt text-yellow-400"></i> Collect ROI
                  </button>
                  <button onclick="renderDepositModal(2)" class="bg-emerald-600 text-white font-extrabold py-2.5 px-2 rounded-xl text-xs shadow-xl hover:bg-emerald-500 transition flex items-center justify-center gap-1 border border-emerald-300/40">
                    <i class="fas fa-plus-circle"></i> Deposit
                  </button>
                  <button onclick="renderWithdrawModal()" class="bg-slate-950 text-rose-400 font-extrabold py-2.5 px-2 rounded-xl text-xs shadow-xl hover:bg-slate-900 transition flex items-center justify-center gap-1 border border-rose-500/40">
                    <i class="fas fa-money-bill-wave"></i> Withdraw
                  </button>
                </div>
              </div>

              <!-- Active Membership Banner -->
              \${currentUser.activePlan ? \`
                <div class="glass-card p-4 rounded-2xl border-2 border-emerald-400/70 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <div class="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-3 py-0.5 rounded-bl-xl">⚡ ACTIVE PLAN</div>
                  <h3 class="font-black text-base text-amber-300 flex items-center gap-1.5"><i class="fas fa-crown text-emerald-400"></i> \${currentUser.activePlan.name}</h3>
                  <p class="text-xs text-emerald-400 mt-1 font-bold"><i class="fas fa-sync-alt fa-spin mr-1"></i> Auto-Crediting 10% ROI: Rs. \${currentUser.activePlan.daily} Every 24 Hours (\${currentUser.activePlan.days} Days Validity)</p>
                </div>
              \` : \`
                <div class="glass-card p-3 rounded-2xl border border-amber-400/50 text-center bg-amber-500/10">
                  <p class="text-xs text-amber-300 font-bold"><i class="fas fa-rocket mr-1"></i> Select & Activate a VIP Tier below to start earning 10% daily profit!</p>
                </div>
              \`}

              <!-- FRONT & CENTER: VIP Investment Tiers (With Automatic Invite Unlock System) -->
              <div>
                <div class="flex justify-between items-center mb-2.5">
                  <h3 class="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <i class="fab fa-bitcoin text-base"></i> VIP Mining Tiers (Auto-Unlock via Invites)
                  </h3>
                  <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">Your Invites: \${userTeamCount}</span>
                </div>
                <div class="grid grid-cols-2 gap-2.5">
                  \${plans.map(p => {
                    const isCurrent = currentUser.activePlan && Number(currentUser.activePlan.id) === Number(p.id);
                    const reqInv = p.reqInvites || 0;
                    const isLocked = userTeamCount < reqInv;

                    return \`
                      <div class="glass-card p-3.5 rounded-2xl flex flex-col justify-between relative overflow-hidden transition \${isCurrent ? 'border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]' : isLocked ? 'opacity-70 border-rose-500/30' : 'hover:border-amber-400'}">
                        \${isCurrent ? '<div class="bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg absolute top-0 right-0">⚡ ACTIVE</div>' : ''}
                        \${isLocked ? '<div class="bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg absolute top-0 right-0">🔒 LOCKED</div>' : ''}
                        
                        <div>
                          <div class="flex justify-between items-center">
                            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">VIP \${p.id}</span>
                            <span class="text-[10px] font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-500/30">\${p.days} Days</span>
                          </div>
                          <h4 class="font-black text-white text-xs mt-1.5 truncate">\${p.name.replace('VIP ' + p.id + ' - ', '')}</h4>
                          <p class="text-base font-black text-amber-400 mt-1">Rs. \${p.price.toLocaleString()}</p>
                          <p class="text-[11px] text-emerald-400 font-bold mt-0.5"><i class="fas fa-arrow-trend-up mr-1"></i>Daily: Rs. \${p.daily.toLocaleString()}</p>
                          
                          \${reqInv > 0 ? \`
                            <div class="mt-2 pt-2 border-t border-slate-800 text-[10px] font-bold \${userTeamCount >= reqInv ? 'text-emerald-400' : 'text-rose-400'}">
                              <i class="fas \${userTeamCount >= reqInv ? 'fa-check-circle' : 'fa-lock'} mr-1"></i> \${userTeamCount >= reqInv ? 'Unlocked (Req: ' + reqInv + ')' : 'Need ' + (reqInv - userTeamCount) + ' more active invites (Req: ' + reqInv + ')'}
                            </div>
                          \` : \`
                            <div class="mt-2 pt-2 border-t border-slate-800 text-[10px] font-bold text-slate-400">
                              <i class="fas fa-unlock mr-1"></i> Open to All Members
                            </div>
                          \`}
                        </div>

                        <button onclick="\${isLocked ? 'alert(\\'🔒 This tier is locked! You need at ' + reqInv + ' active team invites with a deposit to unlock VIP ' + p.id + '. Your current active invites: ' + userTeamCount + '\\')' : 'renderDepositModal(' + p.id + ')'}" class="mt-3 w-full \${isCurrent ? 'bg-emerald-500 text-slate-950' : isLocked ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-rose-500/40' : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950'} font-black py-2 rounded-xl text-[11px] uppercase tracking-wider shadow-md transition">
                          \${isCurrent ? 'Upgrade / Renew' : isLocked ? '🔒 Locked (' + userTeamCount + '/' + reqInv + ')' : 'Activate Now'}
                        </button>
                      </div>
                    \`;
                  }).join('')}
                </div>
              </div>

              <!-- Invite & Earn 1% Daily Banner -->
              <div class="glass-card p-5 rounded-3xl border border-amber-400/40 relative overflow-hidden">
                <div class="flex items-center justify-between mb-2">
                  <span class="bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">🔥 Viral Team Syndicate</span>
                  <span class="text-xs font-black text-emerald-400">Daily 1% Deposit Bonus</span>
                </div>
                <h3 class="text-base font-black text-white mt-1">Invite Friends & Unlock VIP 5 & VIP 6!</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  Share your unique referral link below! Get <span class="text-amber-400 font-bold">1% of your friend's total deposit</span> every day! Plus, bringing <span class="text-emerald-400 font-bold">3 active invites</span> unlocks VIP 5 (Rs. 15,000), and <span class="text-emerald-400 font-bold">5 active invites</span> unlocks VIP 6 (Rs. 50,000)!
                </p>

                <div class="grid grid-cols-2 gap-2.5 my-3">
                  <div class="bg-slate-950/90 p-3 rounded-xl border border-amber-500/20 text-center">
                    <p class="text-[10px] uppercase text-slate-400 font-bold">Active Team Invites</p>
                    <p class="text-lg font-black text-amber-400 mt-0.5">\${userTeamCount} Invites</p>
                  </div>
                  <div class="bg-slate-950/90 p-3 rounded-xl border border-emerald-500/20 text-center">
                    <p class="text-[10px] uppercase text-slate-400 font-bold">1% Referral Bonus</p>
                    <p class="text-lg font-black text-emerald-400 mt-0.5">Rs. \${Number(currentUser.refEarnings || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-amber-500/40">
                  <input type="text" readonly value="\${inviteLink}" class="bg-transparent text-[11px] text-amber-200 w-full px-2 focus:outline-none font-mono">
                  <button onclick="copyText('\${inviteLink}', 'Referral Link')" class="bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black px-3.5 py-2 rounded-lg text-xs uppercase shrink-0 transition">
                    <i class="fas fa-copy mr-1"></i> Copy Link
                  </button>
                </div>
              </div>

              <!-- Deposit & Withdrawal History Sections -->
              <div class="space-y-4">
                <div class="glass-card p-4 rounded-2xl">
                  <h3 class="text-xs font-black text-amber-400 uppercase tracking-wider mb-3"><i class="fas fa-history mr-1"></i> Deposit History</h3>
                  <div class="space-y-2 max-h-40 overflow-y-auto">
                    \${userDeposits.length === 0 ? '<p class="text-[11px] text-slate-500 italic">No deposit records found.</p>' : ''}
                    \${userDeposits.map(d => \`
                      <div class="bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-[11px]">
                        <div>
                          <p class="font-bold text-white">\${d.planName} (Rs. \${d.amount})</p>
                          <p class="text-emerald-400 text-[10px]"><i class="fas fa-image mr-1"></i>Payment Screenshot Uploaded</p>
                        </div>
                        <span class="px-2 py-0.5 rounded font-bold uppercase text-[10px] \${d.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : d.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">\${d.status}</span>
                      </div>
                    \`).join('')}
                  </div>
                </div>

                <div class="glass-card p-4 rounded-2xl">
                  <h3 class="text-xs font-black text-rose-400 uppercase tracking-wider mb-3"><i class="fas fa-wallet mr-1"></i> Withdrawal History</h3>
                  <div class="space-y-2 max-h-40 overflow-y-auto">
                    \${userWithdrawals.length === 0 ? '<p class="text-[11px] text-slate-500 italic">No withdrawal records found.</p>' : ''}
                    \${userWithdrawals.map(w => \`
                      <div class="bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-[11px]">
                        <div>
                          <p class="font-bold text-white">Rs. \${w.amount} (\${w.method})</p>
                          <p class="text-slate-400 font-mono">\${w.account}</p>
                        </div>
                        <span class="px-2 py-0.5 rounded font-bold uppercase text-[10px] \${w.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : w.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">\${w.status}</span>
                      </div>
                    \`).join('')}
                  </div>
                </div>
              </div>
            </div>
          \`;
        }

        function renderDepositModal(selectedPlanId = 2) {
          selectedScreenshotData = null;
          document.getElementById('app').innerHTML = \`
            <div class="py-6">
              <div class="glass-card p-6 rounded-3xl shadow-2xl relative">
                <div class="flex justify-between items-center mb-5">
                  <h2 class="text-lg font-black text-amber-400"><i class="fas fa-university mr-1"></i> Official NayaPay Deposit</h2>
                  <button onclick="renderDashboard()" class="text-slate-400 hover:text-white font-bold text-sm"><i class="fas fa-times text-lg"></i></button>
                </div>

                <div class="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 mb-5 space-y-3">
                  <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span class="text-[11px] uppercase font-bold text-amber-400">Official Payment Gateway</span>
                    <span class="text-xs font-black text-emerald-400">NayaPay Only</span>
                  </div>

                  <div>
                    <p class="text-[11px] text-slate-400 uppercase">NayaPay Account Title:</p>
                    <p class="text-base font-black text-white">Sooba Khan</p>
                  </div>

                  <div class="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <p class="text-[10px] text-slate-400 uppercase font-bold">NayaPay Account Number</p>
                      <p class="text-sm font-black text-amber-300 font-mono">03256098796</p>
                    </div>
                    <button type="button" onclick="copyText('03256098796', 'NayaPay Account Number')" class="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-bold">Copy</button>
                  </div>

                  <div class="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                    <div class="overflow-hidden pr-2">
                      <p class="text-[10px] text-slate-400 uppercase font-bold">NayaPay IBAN Number</p>
                      <p class="text-xs font-black text-emerald-300 font-mono truncate">PK49NAYA1234503256098796</p>
                    </div>
                    <button type="button" onclick="copyText('PK49NAYA1234503256098796', 'NayaPay IBAN')" class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0">Copy</button>
                  </div>
                </div>

                <form onsubmit="submitDeposit(event)" class="space-y-4">
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Payment Method</label>
                    <input type="text" id="depMethod" value="NayaPay" readonly class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-emerald-400 font-bold text-xs focus:outline-none">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Select VIP Membership Tier</label>
                    <select id="depPlan" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400">
                      <option value="1" \${selectedPlanId == 1 ? 'selected' : ''}>VIP 1 - Rs. 500 (30 Days)</option>
                      <option value="2" \${selectedPlanId == 2 ? 'selected' : ''}>VIP 2 - Rs. 1,500 (30 Days)</option>
                      <option value="3" \${selectedPlanId == 3 ? 'selected' : ''}>VIP 3 - Rs. 3,000 (20 Days)</option>
                      <option value="4" \${selectedPlanId == 4 ? 'selected' : ''}>VIP 4 - Rs. 6,000 (20 Days)</option>
                      <option value="5" \${selectedPlanId == 5 ? 'selected' : ''}>VIP 5 - Rs. 15,000 (20 Days - Req 3 Invites)</option>
                      <option value="6" \${selectedPlanId == 6 ? 'selected' : ''}>VIP 6 - Rs. 50,000 (20 Days - Req 5 Invites)</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-amber-400 font-bold mb-1.5"><i class="fas fa-camera mr-1"></i> Upload Payment Screenshot</label>
                    <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amber-500/50 rounded-2xl cursor-pointer bg-slate-950 hover:bg-slate-900/90 transition">
                      <div class="flex flex-col items-center justify-center pt-5 pb-6 text-center px-3">
                        <i class="fas fa-cloud-upload-alt text-3xl text-amber-400 mb-2"></i>
                        <p class="text-xs text-slate-200 font-bold">Tap here to select NayaPay Screenshot</p>
                        <p class="text-[10px] text-slate-500 mt-1">Supports JPG, PNG, JPEG</p>
                      </div>
                      <input type="file" id="depScreenshot" accept="image/*" required onchange="handleScreenshotSelect(event)" class="hidden" />
                    </label>
                    <div id="ssPreviewContainer" class="hidden mt-3 text-center bg-slate-950 p-2.5 rounded-xl border border-emerald-500/40">
                      <p class="text-[10px] text-emerald-400 font-bold uppercase mb-1.5"><i class="fas fa-check-circle mr-1"></i> Screenshot Attached Successfully</p>
                      <img id="ssPreview" src="" class="max-h-44 mx-auto rounded-lg border border-slate-800 object-contain" />
                    </div>
                  </div>
                  <button type="submit" id="depSubmitBtn" class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg transition">Submit Screenshot for Activation</button>
                </form>
              </div>
            </div>
          \`;
        }

        function renderWithdrawModal() {
          document.getElementById('app').innerHTML = \`
            <div class="py-6">
              <div class="glass-card p-6 rounded-3xl shadow-2xl relative">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-lg font-black text-rose-400"><i class="fas fa-wallet mr-1"></i> Instant Withdrawal</h2>
                  <button onclick="renderDashboard()" class="text-slate-400 hover:text-white font-bold text-sm"><i class="fas fa-times text-lg"></i></button>
                </div>

                <div class="bg-slate-950 p-3.5 rounded-2xl border border-rose-500/30 mb-4 flex justify-between items-center">
                  <span class="text-xs text-slate-400">Available Balance:</span>
                  <span class="text-base font-black text-amber-400">Rs. \${Number(currentUser.balance).toLocaleString()}</span>
                </div>

                <form onsubmit="submitWithdraw(event)" class="space-y-4">
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Receive Method</label>
                    <select id="wMethod" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-rose-400">
                      <option value="NayaPay">NayaPay</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                      <option value="JazzCash">JazzCash</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Account Holder Name & Number</label>
                    <input type="text" id="wAcc" required placeholder="e.g. Ali Khan - 03001234567" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-rose-400">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Withdrawal Amount (Minimum Rs. 300)</label>
                    <input type="number" id="wAmount" min="300" step="any" required placeholder="Min Rs. 300" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-rose-400">
                  </div>
                  <button type="submit" class="w-full bg-rose-500 hover:bg-rose-400 text-white font-black py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg transition">Request Payout</button>
                </form>
              </div>
            </div>
          \`;
        }

        async function submitDeposit(e) {
          e.preventDefault();
          if (!selectedScreenshotData) {
            alert('Please select your payment screenshot first!');
            return;
          }
          const btn = document.getElementById('depSubmitBtn');
          if (btn) {
            btn.disabled = true;
            btn.innerText = 'Uploading Screenshot...';
          }
          const planId = Number(document.getElementById('depPlan').value);
          const method = 'NayaPay';
          const res = await api('/api/deposit', { userId: currentUser.id, planId, screenshot: selectedScreenshotData, method });
          alert(res.msg);
          renderDashboard();
        }

        async function submitWithdraw(e) {
          e.preventDefault();
          const method = document.getElementById('wMethod').value;
          const account = document.getElementById('wAcc').value;
          const amount = Number(document.getElementById('wAmount').value);
          if(amount < 300) {
            alert('Minimum withdrawal limit is Rs. 300!');
            return;
          }
          const res = await api('/api/withdraw', { userId: currentUser.id, method, account, amount });
          alert(res.msg);
          renderDashboard();
        }

        async function claimDaily() {
          const res = await api('/api/claim', { userId: currentUser.id });
          alert(res.msg);
          renderDashboard();
        }

        async function renderAdmin() {
          const res = await api('/api/admin/data', {});
          document.getElementById('app').innerHTML = \`
            <div class="py-6 space-y-6">
              <div class="flex justify-between items-center glass-card border-amber-500/40 p-5 rounded-2xl">
                <div>
                  <span class="text-[10px] uppercase font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded">Master Admin</span>
                  <h2 class="text-lg font-black text-amber-400 mt-1">Syndicate Control Panel</h2>
                  <p class="text-xs text-slate-400">\${currentUser.phone}</p>
                </div>
                <button onclick="logout()" class="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold">Logout</button>
              </div>

              <!-- Pending Deposits (With Screenshot View & Plan Override Dropdown) -->
              <div class="glass-card p-5 rounded-2xl">
                <h3 class="text-sm font-black text-amber-400 mb-3 uppercase tracking-wider"><i class="fas fa-clock mr-1"></i> Pending Deposit Approvals</h3>
                <div class="space-y-3">
                  \${res.deposits.length === 0 ? '<p class="text-xs text-slate-500 italic">No pending deposits.</p>' : ''}
                  \${res.deposits.map(d => \`
                    <div class="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="font-bold text-white">User #\${d.userId} | Requested: <span class="text-amber-400">\${d.planName} (Rs. \${d.amount})</span></p>
                          <p class="text-slate-400 text-[11px] mt-0.5">Gateway: \${d.method}</p>
                        </div>
                      </div>

                      \${d.screenshot ? \`
                        <div class="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center">
                          <p class="text-[10px] text-amber-300 font-bold uppercase mb-1"><i class="fas fa-search-plus mr-1"></i> Payment Proof (Tap image to zoom)</p>
                          <img src="\${d.screenshot}" onclick="viewFullImage(this.src)" class="max-h-48 mx-auto rounded-lg cursor-pointer border border-amber-500/30 hover:border-amber-400 transition object-contain" />
                        </div>
                      \` : \`
                        <p class="text-slate-400 font-mono">TID: \${d.tid || 'N/A'}</p>
                      \`}

                      <div class="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
                        <label class="text-[10px] uppercase text-slate-400 font-bold">Verify Screenshot Amount & Select Plan to Activate:</label>
                        <select id="overridePlan_\${d.id}" class="w-full bg-slate-900 border border-amber-500/40 rounded-lg px-2.5 py-2 text-white text-xs">
                          <option value="1" \${d.planId == 1 ? 'selected' : ''}>VIP 1 - Rs. 500 (30 Days)</option>
                          <option value="2" \${d.planId == 2 ? 'selected' : ''}>VIP 2 - Rs. 1,500 (30 Days)</option>
                          <option value="3" \${d.planId == 3 ? 'selected' : ''}>VIP 3 - Rs. 3,000 (20 Days)</option>
                          <option value="4" \${d.planId == 4 ? 'selected' : ''}>VIP 4 - Rs. 6,000 (20 Days)</option>
                          <option value="5" \${d.planId == 5 ? 'selected' : ''}>VIP 5 - Rs. 15,000 (20 Days - Req 3 Invites)</option>
                          <option value="6" \${d.planId == 6 ? 'selected' : ''}>VIP 6 - Rs. 50,000 (20 Days - Req 5 Invites)</option>
                        </select>
                        <div class="flex gap-2 pt-1">
                          <button onclick="approveDeposit(\${d.id}, 'Approved')" class="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2 rounded-lg font-black uppercase">Approve Plan</button>
                          <button onclick="approveDeposit(\${d.id}, 'Rejected')" class="bg-rose-500 hover:bg-rose-400 text-white px-4 py-2 rounded-lg font-black uppercase">Reject</button>
                        </div>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              </div>

              <!-- Pending Withdrawals -->
              <div class="glass-card p-5 rounded-2xl">
                <h3 class="text-sm font-black text-rose-400 mb-3 uppercase tracking-wider"><i class="fas fa-money-bill-wave mr-1"></i> Pending Withdrawals (Min 300)</h3>
                <div class="space-y-3">
                  \${res.withdrawals.length === 0 ? '<p class="text-xs text-slate-500 italic">No pending withdrawals.</p>' : ''}
                  \${res.withdrawals.map(w => \`
                    <div class="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p class="font-bold text-white">User #\${w.userId} | <span class="text-rose-400 font-black">Rs. \${w.amount}</span></p>
                        <p class="text-slate-300 mt-1">\${w.method}: <span class="font-mono text-yellow-300 font-bold">\${w.account}</span></p>
                      </div>
                      <div class="flex gap-2">
                        <button onclick="approveWithdraw(\${w.id}, 'Approved')" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-lg font-black">Approve</button>
                        <button onclick="approveWithdraw(\${w.id}, 'Rejected')" class="bg-rose-500 hover:bg-rose-400 text-white px-3 py-1.5 rounded-lg font-black">Reject</button>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              </div>

              <!-- All Registered Users -->
              <div class="glass-card p-5 rounded-2xl">
                <h3 class="text-sm font-black text-amber-400 mb-3 uppercase tracking-wider"><i class="fas fa-users mr-1"></i> Registered Elite Users (\${res.users.length})</h3>
                <div class="space-y-3">
                  \${res.users.length === 0 ? '<p class="text-xs text-slate-500 italic">No registered users yet.</p>' : ''}
                  \${res.users.map(u => \`
                    <div class="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="font-black text-white">#\${u.id} \${u.name} <span class="text-amber-300 font-mono">(\${u.phone})</span></p>
                          <p class="text-amber-400 font-bold mt-0.5">Balance: Rs. \${Number(u.balance).toLocaleString()} | Active Invites: <span class="text-emerald-400">\${u.teamCount}</span></p>
                          <p class="text-[11px] text-slate-400 mt-0.5">Plan: <span class="text-emerald-300 font-semibold">\${u.activePlan ? u.activePlan.name : 'None'}</span> | Ref By: \${u.referredBy || 'None'}</p>
                        </div>
                      </div>
                      <div class="grid grid-cols-4 gap-1.5 pt-1 border-t border-slate-800/80">
                        <button onclick="editBalance(\${u.id}, \${u.balance})" class="bg-amber-400 hover:bg-amber-300 text-slate-950 py-1.5 rounded-lg font-black text-[11px]">Edit Bal</button>
                        <button onclick="editPlan(\${u.id}, \${u.activePlan ? u.activePlan.id : 0})" class="bg-purple-400 hover:bg-purple-300 text-slate-950 py-1.5 rounded-lg font-black text-[11px]">Edit Plan</button>
                        <button onclick="editPhone(\${u.id}, '\${u.phone}')" class="bg-sky-400 hover:bg-sky-300 text-slate-950 py-1.5 rounded-lg font-black text-[11px]">Edit Phone</button>
                        <button onclick="editTeam(\${u.id}, \${u.teamCount})" class="bg-emerald-400 hover:bg-emerald-300 text-slate-950 py-1.5 rounded-lg font-black text-[11px]">Edit Team</button>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              </div>
            </div>
          \`;
        }

        async function approveDeposit(id, status) {
          const selectEl = document.getElementById('overridePlan_' + id);
          const approvedPlanId = selectEl ? Number(selectEl.value) : null;
          await api('/api/admin/deposit', { id, status, approvedPlanId });
          renderAdmin();
        }

        async function approveWithdraw(id, status) {
          await api('/api/admin/withdraw', { id, status });
          renderAdmin();
        }

        async function editBalance(userId, currentBal) {
          const newBal = prompt('Enter new wallet balance (Rs.):', currentBal);
          if(newBal === null || newBal === '') return;
          await api('/api/admin/bal', { userId: Number(userId), balance: Number(newBal) });
          renderAdmin();
        }

        async function editPlan(userId, currentPlanId) {
          const newPlan = prompt('Enter Plan ID (1=500, 2=1500, 3=3000, 4=6000, 5=15000, 6=50000, or 0 for None):', currentPlanId);
          if(newPlan === null || newPlan === '') return;
          await api('/api/admin/plan', { userId: Number(userId), planId: Number(newPlan) });
          renderAdmin();
        }

        async function editPhone(userId, currentPhone) {
          const newPhone = prompt('Enter new mobile number for User #' + userId + ':', currentPhone);
          if(newPhone === null || newPhone.trim() === '') return;
          await api('/api/admin/phone', { userId: Number(userId), phone: newPhone.trim() });
          renderAdmin();
        }

        async function editTeam(userId, currentTeam) {
          const newTeam = prompt('Enter new Active Team Invites count for User #' + userId + ':', currentTeam);
          if(newTeam === null || newTeam === '') return;
          await api('/api/admin/team', { userId: Number(userId), teamCount: Number(newTeam) });
          renderAdmin();
        }

        function logout() {
          currentUser = null;
          renderLogin();
        }

        if(refFromUrl) renderRegister();
        else renderLogin();
      </script>
    </body>
    </html>
  `);
});

app.post('/api/register', (req, res) => {
  const { name, phone, pass, referredBy } = req.body;
  const cleanPhone = normalizePhone(phone);
  if(db.users.find(u => normalizePhone(u.phone) === cleanPhone)) {
    return res.send({ ok: false, msg: 'Phone number already registered!' });
  }
  const refId = referredBy ? Number(referredBy) : null;
  let randomId;
  do {
    randomId = Math.floor(100000 + Math.random() * 900000);
  } while(db.users.find(u => u.id === randomId));

  const user = {
    id: randomId,
    name,
    phone: phone.trim(),
    pass,
    balance: 0,
    activePlan: null,
    lastClaimTime: null,
    referredBy: refId,
    refEarnings: 0,
    customTeamCount: null,
    isAdmin: false
  };
  db.users.push(user);
  saveDB();
  res.send({ ok: true });
});

app.post('/api/login', (req, res) => {
  const { phone, pass } = req.body;
  const cleanPhone = normalizePhone(phone);
  if(cleanPhone === normalizePhone(ADMIN_PHONE) && pass === ADMIN_PASS) {
    return res.send({ ok: true, user: { id: 999, name: 'Syndicate Boss', phone: ADMIN_PHONE, isAdmin: true } });
  }
  const user = db.users.find(u => normalizePhone(u.phone) === cleanPhone);
  if(!user) return res.send({ ok: false, msg: 'Invalid mobile number or password!' });

  if (!user.pass) {
    user.pass = pass;
    saveDB();
  } else if (user.pass !== pass) {
    return res.send({ ok: false, msg: 'Invalid mobile number or password!' });
  }

  res.send({ ok: true, user });
});

app.post('/api/user', (req, res) => {
  const userId = Number(req.body.id);
  const user = db.users.find(u => u.id === userId);
  const teamCount = getUserTeamCount(user);
  const deposits = db.deposits
    .filter(d => d.userId === userId)
    .map(({ screenshot, ...rest }) => rest);
  const withdrawals = db.withdrawals.filter(w => w.userId === userId);
  res.send({ user, plans: db.plans, teamCount, deposits, withdrawals });
});

app.post('/api/deposit', (req, res) => {
  const { userId, planId, screenshot } = req.body;
  if (!screenshot) {
    return res.send({ ok: false, msg: 'Please upload a valid payment screenshot!' });
  }
  const user = db.users.find(u => u.id === Number(userId));
  const p = db.plans.find(x => x.id === Number(planId)) || db.plans[0];
  
  // Check automatic invite unlock condition for VIP 5 and VIP 6
  const teamCount = getUserTeamCount(user);
  if (p.reqInvites && teamCount < p.reqInvites) {
    return res.send({ ok: false, msg: '🔒 This tier is locked! You need at least ' + p.reqInvites + ' active team invites to deposit in ' + p.name + '. Your current active invites: ' + teamCount });
  }

  db.deposits.push({
    id: db.deposits.length + 1,
    userId: Number(userId),
    planId: p.id,
    planName: p.name,
    amount: p.price,
    screenshot,
    method: 'NayaPay',
    status: 'Pending'
  });
  saveDB();
  res.send({ ok: true, msg: 'Payment Screenshot uploaded successfully! Once verified by Admin, your 10% daily ROI will start automatically.' });
});

app.post('/api/withdraw', (req, res) => {
  const { userId, method, account, amount } = req.body;
  const numAmount = Number(amount);
  if (numAmount < 300) {
    return res.send({ ok: false, msg: 'Minimum withdrawal limit is Rs. 300!' });
  }
  const user = db.users.find(u => u.id === Number(userId));
  if (!user || user.balance < numAmount) {
    return res.send({ ok: false, msg: 'Insufficient wallet balance!' });
  }
  db.withdrawals.push({
    id: db.withdrawals.length + 1,
    userId: Number(userId),
    method,
    account,
    amount: numAmount,
    status: 'Pending'
  });
  saveDB();
  res.send({ ok: true, msg: 'Withdrawal request of Rs. ' + numAmount + ' submitted successfully! Pending Admin approval.' });
});

app.post('/api/claim', (req, res) => {
  const user = db.users.find(u => u.id === Number(req.body.userId));
  if(!user || !user.activePlan) return res.send({ ok: false, msg: 'No active VIP plan found! Please deposit via NayaPay to activate a tier.' });
  
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  if(user.lastClaimTime && (now - user.lastClaimTime < TWENTY_FOUR_HOURS)) {
    const hoursLeft = Math.ceil((TWENTY_FOUR_HOURS - (now - user.lastClaimTime)) / (1000 * 60 * 60));
    return res.send({ ok: false, msg: 'Your 10% Daily ROI is auto-credited every 24 hours! Next automatic credit in ' + hoursLeft + ' hour(s).' });
  }

  creditUserROI(user);
  res.send({ ok: true, msg: '10% Daily ROI (Rs. ' + user.activePlan.daily + ') successfully added to your wallet!' });
});

app.post('/api/admin/data', (req, res) => {
  const usersWithTeam = db.users.map(u => ({
    ...u,
    teamCount: getUserTeamCount(u)
  }));
  res.send({
    deposits: db.deposits.filter(d => d.status === 'Pending'),
    withdrawals: db.withdrawals.filter(w => w.status === 'Pending'),
    users: usersWithTeam
  });
});

app.post('/api/admin/deposit', (req, res) => {
  const { id, status, approvedPlanId } = req.body;
  const d = db.deposits.find(x => x.id === Number(id));
  if(d && d.status === 'Pending') {
    d.status = status;
    delete d.screenshot;

    if(status === 'Approved') {
      const u = db.users.find(x => x.id === d.userId);
      const finalPlanId = approvedPlanId ? Number(approvedPlanId) : d.planId;
      const p = db.plans.find(x => x.id === finalPlanId);
      if(u && p) {
        d.planId = p.id;
        d.planName = p.name;
        d.amount = p.price;

        const hadPlanBefore = u.activePlan !== null;
        u.activePlan = p;
        u.lastClaimTime = Date.now();

        if (!hadPlanBefore && u.referredBy) {
          const referrer = db.users.find(r => r.id === Number(u.referredBy));
          if (referrer && typeof referrer.customTeamCount === 'number') {
            referrer.customTeamCount += 1;
          }
        }
      }
    }
    saveDB();
  }
  res.send({ ok: true });
});

app.post('/api/admin/withdraw', (req, res) => {
  const { id, status } = req.body;
  const w = db.withdrawals.find(x => x.id === Number(id));
  if(w && w.status === 'Pending') {
    w.status = status;
    if(status === 'Approved') {
      const u = db.users.find(x => x.id === w.userId);
      if(u && u.balance >= w.amount) {
        u.balance = Number((u.balance - w.amount).toFixed(2));
      }
    }
    saveDB();
  }
  res.send({ ok: true });
});

app.post('/api/admin/bal', (req, res) => {
  const { userId, balance } = req.body;
  const u = db.users.find(x => x.id === Number(userId));
  if(u) {
    u.balance = Number(balance);
    saveDB();
  }
  res.send({ ok: true });
});

app.post('/api/admin/plan', (req, res) => {
  const { userId, planId } = req.body;
  const u = db.users.find(x => x.id === Number(userId));
  if(u) {
    if (Number(planId) === 0) {
      u.activePlan = null;
      u.lastClaimTime = null;
    } else {
      const p = db.plans.find(x => x.id === Number(planId));
      if (p) {
        u.activePlan = p;
        u.lastClaimTime = Date.now();
      }
    }
    saveDB();
  }
  res.send({ ok: true });
});

app.post('/api/admin/phone', (req, res) => {
  const { userId, phone } = req.body;
  const u = db.users.find(x => x.id === Number(userId));
  if(u && phone) {
    u.phone = String(phone);
    saveDB();
  }
  res.send({ ok: true });
});

app.post('/api/admin/team', (req, res) => {
  const { userId, teamCount } = req.body;
  const u = db.users.find(x => x.id === Number(userId));
  if(u) {
    u.customTeamCount = Number(teamCount);
    saveDB();
  }
  res.send({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`VIP Millionaire Portal Running on Port ${PORT}`);
});
