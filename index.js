const express = require('express');
const app = express();
app.use(express.json());

// In-Memory Database
const db = {
  users: [],
  plans: [
    { id: 1, name: 'VIP 1 - Starter Elite', price: 500, daily: 50, days: 30 },
    { id: 2, name: 'VIP 2 - Bronze Venture', price: 1500, daily: 150, days: 30 },
    { id: 3, name: 'VIP 3 - Silver Capital', price: 3000, daily: 300, days: 30 },
    { id: 4, name: 'VIP 4 - Gold Tycoon', price: 6000, daily: 600, days: 30 },
    { id: 5, name: 'VIP 5 - Platinum Empire', price: 15000, daily: 1500, days: 30 },
    { id: 6, name: 'VIP 6 - Diamond Syndicate', price: 50000, daily: 5000, days: 30 }
  ],
  deposits: [],
  withdrawals: []
};

const ADMIN_PHONE = '03256098796';
const ADMIN_PASS = 'admin123';

// Helper function to credit Daily ROI + 1% Referral Bonus
function creditUserROI(user) {
  if (!user || !user.activePlan) return false;
  const dailyProfit = Number(user.activePlan.daily);
  user.balance = Number((user.balance + dailyProfit).toFixed(2));
  user.lastClaimTime = Date.now();

  // Credit 1% of Daily ROI to the Referrer (Inviter)
  if (user.referredBy) {
    const referrer = db.users.find(u => u.id === Number(user.referredBy));
    if (referrer) {
      const refBonus = Number((dailyProfit * 0.01).toFixed(2));
      referrer.balance = Number((referrer.balance + refBonus).toFixed(2));
      referrer.refEarnings = Number(((referrer.refEarnings || 0) + refBonus).toFixed(2));
    }
  }
  return true;
}

// Background Auto-Credit Job (Checks every 60 seconds for 24-hour completion)
setInterval(() => {
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  db.users.forEach(user => {
    if (user.activePlan && user.lastClaimTime) {
      if (now - user.lastClaimTime >= TWENTY_FOUR_HOURS) {
        creditUserROI(user);
      }
    }
  });
}, 60 * 1000);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VIP Earn PK - Millionaire Investment Hub</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        @keyframes glow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.08); }
        }
        .animate-glow { animation: glow 5s ease-in-out infinite; }
        .glass-card {
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(234, 179, 8, 0.28);
        }
      </style>
    </head>
    <body class="bg-black text-slate-100 font-sans min-h-screen flex flex-col justify-between relative overflow-x-hidden">
      
      <!-- Luxury Background Glows -->
      <div class="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-glow"></div>
      <div class="fixed bottom-10 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none animate-glow"></div>

      <div id="app" class="max-w-md mx-auto w-full p-4 flex-grow z-10 pb-24"></div>
      
      <!-- Telegram Official Support Floating Button -->
      <a href="https://t.me/VIPEARNPK_SUPPORT" target="_blank" class="fixed bottom-5 right-5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-black uppercase tracking-wider z-50 transition transform hover:scale-105 border border-sky-300/40">
        <i class="fab fa-telegram-plane text-xl"></i> VIP Telegram Care
      </a>

      <script>
        let currentUser = null;
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

        function renderLogin() {
          document.getElementById('app').innerHTML = \`
            <div class="flex items-center justify-center min-h-[85vh]">
              <div class="glass-card p-8 rounded-3xl shadow-2xl w-full relative overflow-hidden">
                <div class="text-center mb-8">
                  <div class="inline-flex p-4 bg-gradient-to-tr from-amber-500/20 to-yellow-300/30 text-amber-400 rounded-2xl text-4xl mb-4 border border-amber-500/30">
                    <i class="fas fa-crown"></i>
                  </div>
                  <h1 class="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200">VIP EARN PK</h1>
                  <p class="text-xs text-amber-400/80 mt-1 uppercase tracking-widest font-semibold">Millionaire Wealth Syndicate</p>
                </div>
                
                <form onsubmit="handleLogin(event)" class="space-y-5">
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1.5">Mobile Number</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-amber-500/70"><i class="fas fa-mobile-alt"></i></span>
                      <input type="text" id="phone" required placeholder="03001234567" class="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3.5 pl-11 text-white focus:outline-none focus:border-amber-400">
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1.5">Security Password</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-amber-500/70"><i class="fas fa-lock"></i></span>
                      <input type="password" id="pass" required placeholder="••••••••" class="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3.5 pl-11 text-white focus:outline-none focus:border-amber-400">
                    </div>
                  </div>
                  <button type="submit" class="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black py-4 rounded-xl shadow-lg hover:brightness-110 transition uppercase text-sm">
                    Access VIP Vault <i class="fas fa-arrow-right ml-1"></i>
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
            <div class="flex items-center justify-center min-h-[85vh]">
              <div class="glass-card p-8 rounded-3xl shadow-2xl w-full">
                <div class="text-center mb-6">
                  <div class="inline-flex p-3 bg-amber-500/20 text-amber-400 rounded-2xl text-3xl mb-2 border border-amber-500/30">
                    <i class="fas fa-user-plus"></i>
                  </div>
                  <h1 class="text-2xl font-black text-amber-400">Join Elite Circle</h1>
                  <p class="text-xs text-slate-400 mt-1 uppercase tracking-widest">Auto 24h ROI & 1% Daily Team Commission</p>
                </div>
                <form onsubmit="handleRegister(event)" class="space-y-4">
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Full Name</label>
                    <input type="text" id="name" required placeholder="Muhammad Ali" class="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Mobile Number</label>
                    <input type="text" id="phone" required placeholder="03001234567" class="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Password</label>
                    <input type="password" id="pass" required placeholder="••••••••" class="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-amber-400/80 font-bold mb-1">Invite Code (Optional)</label>
                    <input type="text" id="refCode" value="\${refFromUrl}" placeholder="Referral ID" class="w-full bg-slate-950/90 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-300 focus:outline-none focus:border-amber-400">
                  </div>
                  <button type="submit" class="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black py-3.5 rounded-xl hover:brightness-110 transition uppercase shadow-lg">Register Account</button>
                </form>
                <div class="text-center mt-5">
                  <button onclick="renderLogin()" class="text-slate-400 text-sm hover:text-amber-400">Already a member? <span class="text-amber-400 underline font-semibold">Login</span></button>
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
          const inviteLink = window.location.origin + '/?ref=' + currentUser.id;

          document.getElementById('app').innerHTML = \`
            <div class="py-4 space-y-5">
              <!-- Top Profile Bar -->
              <div class="flex justify-between items-center glass-card p-4 rounded-2xl shadow-xl">
                <div>
                  <span class="text-[10px] uppercase tracking-widest bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded font-black border border-amber-500/30">VIP ID #\${currentUser.id}</span>
                  <h2 class="text-lg font-black text-white mt-1">\${currentUser.name}</h2>
                  <p class="text-xs text-slate-400">\${currentUser.phone}</p>
                </div>
                <button onclick="logout()" class="bg-red-500/10 text-red-400 border border-red-500/30 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition">Logout</button>
              </div>

              <!-- Main Portfolio Card -->
              <div class="bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 p-6 rounded-3xl shadow-2xl text-slate-950 relative overflow-hidden">
                <div class="absolute -right-6 -bottom-6 text-slate-950/10 text-9xl font-black pointer-events-none"><i class="fas fa-coins"></i></div>
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-xs uppercase font-black tracking-widest opacity-80">Total Wealth Balance</p>
                    <h1 class="text-4xl font-black mt-1">Rs. \${Number(currentUser.balance).toLocaleString()}</h1>
                  </div>
                  <span class="bg-slate-950 text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">Auto 24h ROI</span>
                </div>
                <div class="mt-5 grid grid-cols-3 gap-2.5">
                  <button onclick="claimDaily()" class="bg-slate-950 text-amber-400 font-extrabold py-3 px-2 rounded-xl text-xs shadow-xl hover:bg-slate-900 transition flex items-center justify-center gap-1.5 border border-amber-400/40">
                    <i class="fas fa-bolt"></i> Claim ROI
                  </button>
                  <button onclick="renderDepositModal(2)" class="bg-emerald-600 text-white font-extrabold py-3 px-2 rounded-xl text-xs shadow-xl hover:bg-emerald-500 transition flex items-center justify-center gap-1.5">
                    <i class="fas fa-plus-circle"></i> Deposit
                  </button>
                  <button onclick="renderWithdrawModal()" class="bg-slate-950 text-rose-400 font-extrabold py-3 px-2 rounded-xl text-xs shadow-xl hover:bg-slate-900 transition flex items-center justify-center gap-1.5 border border-rose-500/30">
                    <i class="fas fa-money-bill-wave"></i> Withdraw
                  </button>
                </div>
              </div>

              <!-- Active Membership Status -->
              \${currentUser.activePlan ? \`
                <div class="glass-card p-5 rounded-2xl border-emerald-500/50 shadow-xl relative overflow-hidden">
                  <div class="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">Active Membership</div>
                  <h3 class="font-black text-lg text-amber-300">\${currentUser.activePlan.name}</h3>
                  <p class="text-xs text-emerald-400 mt-1 font-bold"><i class="fas fa-sync-alt fa-spin mr-1"></i> Auto-Crediting Rs. \${currentUser.activePlan.daily} Every 24 Hours</p>
                </div>
              \` : \`
                <div class="glass-card p-4 rounded-2xl border-amber-500/30 text-center">
                  <p class="text-xs text-amber-300 font-bold"><i class="fas fa-info-circle mr-1"></i> Activate a VIP Membership below to start automated 24-hour profits!</p>
                </div>
              \`}

              <!-- Invite & Earn 1% Daily Banner (Pure English + Rs. 1,500 Example) -->
              <div class="glass-card p-5 rounded-3xl border border-amber-400/40 shadow-2xl relative overflow-hidden">
                <div class="flex items-center justify-between mb-2">
                  <span class="bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">🔥 Viral Team Program</span>
                  <span class="text-xs font-black text-emerald-400">Daily 1% Commission</span>
                </div>
                <h3 class="text-base font-black text-white mt-1">Invite Friends & Earn Unlimited Daily Royalties!</h3>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                  Share your unique referral link below! For example, when you deposit <span class="text-amber-300 font-bold">Rs. 1,500</span> and invite a friend through your link who also deposits <span class="text-amber-300 font-bold">Rs. 1,500</span>, you will automatically receive <span class="text-amber-400 font-bold">1%</span> of their <span class="text-emerald-400 font-bold">Rs. 150</span> daily profit every single day. The more members you invite, the bigger your daily passive income grows!
                </p>

                <div class="grid grid-cols-2 gap-2.5 my-3">
                  <div class="bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-center">
                    <p class="text-[10px] uppercase text-slate-400 font-bold">Total Team Invites</p>
                    <p class="text-lg font-black text-amber-400 mt-0.5">\${res.teamCount || 0} Members</p>
                  </div>
                  <div class="bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-center">
                    <p class="text-[10px] uppercase text-slate-400 font-bold">1% Referral Bonus</p>
                    <p class="text-lg font-black text-emerald-400 mt-0.5">Rs. \${Number(currentUser.refEarnings || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-amber-500/30">
                  <input type="text" readonly value="\${inviteLink}" class="bg-transparent text-[11px] text-amber-200 w-full px-2 focus:outline-none font-mono">
                  <button onclick="copyText('\${inviteLink}', 'Referral Link')" class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-2 rounded-lg text-xs uppercase shrink-0 transition">
                    <i class="fas fa-copy mr-1"></i> Copy Link
                  </button>
                </div>
              </div>

              <!-- Investment Tiers -->
              <div>
                <h3 class="text-sm font-black mb-3 text-amber-400 uppercase tracking-wider flex items-center gap-2"><i class="fas fa-gem"></i> VIP Investment Tiers (Auto 24h Credit)</h3>
                <div class="grid grid-cols-1 gap-3">
                  \${plans.map(p => \`
                    <div class="glass-card p-4 rounded-2xl flex justify-between items-center transition hover:border-amber-400/70 shadow-lg">
                      <div>
                        <h4 class="font-black text-amber-300 text-sm">\${p.name}</h4>
                        <p class="text-xs text-slate-300 mt-1">Deposit: <span class="font-bold text-white">Rs. \${p.price.toLocaleString()}</span> | 24h Profit: <span class="text-emerald-400 font-black">Rs. \${p.daily}</span></p>
                      </div>
                      <button onclick="renderDepositModal(\${p.id})" class="bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition">Activate</button>
                    </div>
                  \`).join('')}
                </div>
              </div>
            </div>
          \`;
        }

        function renderDepositModal(selectedPlanId = 2) {
          document.getElementById('app').innerHTML = \`
            <div class="py-6">
              <div class="glass-card p-6 rounded-3xl shadow-2xl relative">
                <div class="flex justify-between items-center mb-5">
                  <h2 class="text-lg font-black text-amber-400"><i class="fas fa-university mr-1"></i> Official NayaPay Deposit</h2>
                  <button onclick="renderDashboard()" class="text-slate-400 hover:text-white font-bold text-sm"><i class="fas fa-times text-lg"></i></button>
                </div>

                <!-- Official NayaPay Only Payment Details -->
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
                      <option value="1" \${selectedPlanId == 1 ? 'selected' : ''}>VIP 1 - Starter Elite (Rs. 500 -> Daily Rs. 50)</option>
                      <option value="2" \${selectedPlanId == 2 ? 'selected' : ''}>VIP 2 - Bronze Venture (Rs. 1500 -> Daily Rs. 150)</option>
                      <option value="3" \${selectedPlanId == 3 ? 'selected' : ''}>VIP 3 - Silver Capital (Rs. 3000 -> Daily Rs. 300)</option>
                      <option value="4" \${selectedPlanId == 4 ? 'selected' : ''}>VIP 4 - Gold Tycoon (Rs. 6000 -> Daily Rs. 600)</option>
                      <option value="5" \${selectedPlanId == 5 ? 'selected' : ''}>VIP 5 - Platinum Empire (Rs. 15000 -> Daily Rs. 1500)</option>
                      <option value="6" \${selectedPlanId == 6 ? 'selected' : ''}>VIP 6 - Diamond Syndicate (Rs. 50000 -> Daily Rs. 5000)</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Transaction ID (TID / Reference Number)</label>
                    <input type="text" id="depTid" required placeholder="Enter NayaPay TID after payment" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400">
                  </div>
                  <button type="submit" class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg transition">Submit Deposit for Activation</button>
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
          const planId = Number(document.getElementById('depPlan').value);
          const method = 'NayaPay';
          const tid = document.getElementById('depTid').value;
          const res = await api('/api/deposit', { userId: currentUser.id, planId, tid, method });
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
              <div class="flex justify-between items-center glass-card border-amber-500/40 p-5 rounded-2xl shadow-xl">
                <div>
                  <span class="text-[10px] uppercase font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded">Master Admin</span>
                  <h2 class="text-lg font-black text-amber-400 mt-1">Syndicate Control Panel</h2>
                  <p class="text-xs text-slate-400">\${currentUser.phone}</p>
                </div>
                <button onclick="logout()" class="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold">Logout</button>
              </div>

              <!-- Pending Deposits -->
              <div class="glass-card p-5 rounded-2xl shadow-xl">
                <h3 class="text-sm font-black text-amber-400 mb-3 uppercase tracking-wider"><i class="fas fa-clock mr-1"></i> Pending Deposit Approvals</h3>
                <div class="space-y-3">
                  \${res.deposits.length === 0 ? '<p class="text-xs text-slate-500 italic">No pending deposits.</p>' : ''}
                  \${res.deposits.map(d => \`
                    <div class="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p class="font-bold text-white">User #\${d.userId} | <span class="text-amber-400">\${d.planName}</span></p>
                        <p class="text-slate-300 mt-1">\${d.method} TID: <span class="font-mono text-yellow-300 font-bold">\${d.tid}</span> (Rs. \${d.amount})</p>
                      </div>
                      <div class="flex gap-2">
                        <button onclick="approveDeposit(\${d.id}, 'Approved')" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-lg font-black">Approve</button>
                        <button onclick="approveDeposit(\${d.id}, 'Rejected')" class="bg-rose-500 hover:bg-rose-400 text-white px-3 py-1.5 rounded-lg font-black">Reject</button>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              </div>

              <!-- Pending Withdrawals -->
              <div class="glass-card p-5 rounded-2xl shadow-xl">
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
              <div class="glass-card p-5 rounded-2xl shadow-xl">
                <h3 class="text-sm font-black text-amber-400 mb-3 uppercase tracking-wider"><i class="fas fa-users mr-1"></i> Registered Elite Users</h3>
                <div class="space-y-3">
                  \${res.users.map(u => \`
                    <div class="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p class="font-black text-white">#\${u.id} \${u.name} <span class="text-slate-400 font-normal">(\${u.phone})</span></p>
                        <p class="text-amber-400 font-bold mt-0.5">Balance: Rs. \${Number(u.balance).toLocaleString()} | Ref By: \${u.referredBy || 'None'}</p>
                      </div>
                      <button onclick="editBalance(\${u.id})" class="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-lg font-black">Edit Bal</button>
                    </div>
                  \`).join('')}
                </div>
              </div>
            </div>
          \`;
        }

        async function approveDeposit(id, status) {
          await api('/api/admin/deposit', { id, status });
          renderAdmin();
        }

        async function approveWithdraw(id, status) {
          await api('/api/admin/withdraw', { id, status });
          renderAdmin();
        }

        async function editBalance(userId) {
          const newBal = prompt('Enter new wallet balance amount:');
          if(newBal === null) return;
          await api('/api/admin/bal', { userId, balance: Number(newBal) });
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
  if(db.users.find(u => u.phone === phone)) {
    return res.send({ ok: false, msg: 'Phone number already registered!' });
  }
  const refId = referredBy ? Number(referredBy) : null;
  const user = {
    id: db.users.length + 1,
    name,
    phone,
    pass,
    balance: 0,
    activePlan: null,
    lastClaimTime: null,
    referredBy: refId,
    refEarnings: 0,
    isAdmin: false
  };
  db.users.push(user);
  res.send({ ok: true });
});

app.post('/api/login', (req, res) => {
  const { phone, pass } = req.body;
  if(phone === ADMIN_PHONE && pass === ADMIN_PASS) {
    return res.send({ ok: true, user: { id: 999, name: 'Syndicate Boss', phone: ADMIN_PHONE, isAdmin: true } });
  }
  const user = db.users.find(u => u.phone === phone && u.pass === pass);
  if(!user) return res.send({ ok: false, msg: 'Invalid mobile number or password!' });
  res.send({ ok: true, user });
});

app.post('/api/user', (req, res) => {
  const user = db.users.find(u => u.id === Number(req.body.id));
  const teamCount = db.users.filter(u => u.referredBy === Number(req.body.id)).length;
  res.send({ user, plans: db.plans, teamCount });
});

app.post('/api/deposit', (req, res) => {
  const { userId, planId, tid } = req.body;
  const p = db.plans.find(x => x.id === Number(planId)) || db.plans[0];
  db.deposits.push({
    id: db.deposits.length + 1,
    userId: Number(userId),
    planId: p.id,
    planName: p.name,
    amount: p.price,
    tid,
    method: 'NayaPay',
    status: 'Pending'
  });
  res.send({ ok: true, msg: 'NayaPay Deposit TID submitted successfully! Your 24-hour auto-profit plan will activate immediately upon Admin approval.' });
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
  res.send({ ok: true, msg: 'Withdrawal request of Rs. ' + numAmount + ' submitted successfully! Pending Admin approval.' });
});

app.post('/api/claim', (req, res) => {
  const user = db.users.find(u => u.id === Number(req.body.userId));
  if(!user || !user.activePlan) return res.send({ ok: false, msg: 'No active VIP plan found! Please deposit via NayaPay to activate a tier.' });
  
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  if(user.lastClaimTime && (now - user.lastClaimTime < TWENTY_FOUR_HOURS)) {
    const hoursLeft = Math.ceil((TWENTY_FOUR_HOURS - (now - user.lastClaimTime)) / (1000 * 60 * 60));
    return res.send({ ok: false, msg: 'Auto-credit system is active! Next daily profit will be credited in ' + hoursLeft + ' hour(s).' });
  }

  creditUserROI(user);
  res.send({ ok: true, msg: 'Rs. ' + user.activePlan.daily + ' Daily ROI added to your wallet! (1% referral bonus also credited to your inviter).' });
});

app.post('/api/admin/data', (req, res) => {
  res.send({
    deposits: db.deposits.filter(d => d.status === 'Pending'),
    withdrawals: db.withdrawals.filter(w => w.status === 'Pending'),
    users: db.users
  });
});

app.post('/api/admin/deposit', (req, res) => {
  const { id, status } = req.body;
  const d = db.deposits.find(x => x.id === Number(id));
  if(d && d.status === 'Pending') {
    d.status = status;
    if(status === 'Approved') {
      const u = db.users.find(x => x.id === d.userId);
      const p = db.plans.find(x => x.id === d.planId);
      if(u && p) {
        u.activePlan = p;
        // Start the 24-hour cycle from approval moment
        u.lastClaimTime = Date.now();
      }
    }
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
  }
  res.send({ ok: true });
});

app.post('/api/admin/bal', (req, res) => {
  const { userId, balance } = req.body;
  const u = db.users.find(x => x.id === Number(userId));
  if(u) u.balance = Number(balance);
  res.send({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`VIP Millionaire Portal Running on Port ${PORT}`);
});
