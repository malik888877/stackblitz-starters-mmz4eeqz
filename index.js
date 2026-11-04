const express = require('express');
const app = express();
app.use(express.json());

// In-Memory Database
const db = {
  users: [],
  plans: [
    { id: 1, name: 'VIP 1 - Starter', price: 500, daily: 50, days: 30 },
    { id: 2, name: 'VIP 2 - Bronze', price: 1500, daily: 150, days: 30 },
    { id: 3, name: 'VIP 3 - Silver', price: 3000, daily: 300, days: 30 },
    { id: 4, name: 'VIP 4 - Gold', price: 6000, daily: 600, days: 30 },
    { id: 5, name: 'VIP 5 - Platinum', price: 15000, daily: 1500, days: 30 },
    { id: 6, name: 'VIP 6 - Diamond', price: 50000, daily: 5000, days: 30 }
  ],
  deposits: [],
  withdrawals: []
};

const ADMIN_PHONE = '03256098796';
const ADMIN_PASS = 'admin123';

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VIP Earn PK - Official Portal</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col justify-between">
      <div id="app" class="max-w-md mx-auto w-full p-4 flex-grow"></div>
      
      <!-- WhatsApp Support Floating Button -->
      <a href="https://wa.me/923256098796" target="_blank" class="fixed bottom-5 right-5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold z-50 transition transform hover:scale-105">
        <i class="fab fa-whatsapp text-xl"></i> WhatsApp Support
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
            <div class="flex items-center justify-center mt-12">
              <div class="bg-slate-900 border border-amber-500/30 p-8 rounded-2xl shadow-2xl w-full relative overflow-hidden">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                <div class="text-center mb-8">
                  <div class="inline-block p-3 bg-amber-500/10 text-amber-400 rounded-full text-3xl mb-3 shadow-inner">
                    <i class="fas fa-gem"></i>
                  </div>
                  <h1 class="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">VIP Earn PK</h1>
                  <p class="text-xs text-slate-400 mt-1 uppercase tracking-widest">Secure Investment Portal</p>
                </div>
                
                <form onsubmit="handleLogin(event)" class="space-y-5">
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-semibold mb-1">Mobile Number</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><i class="fas fa-phone"></i></span>
                      <input type="text" id="phone" required placeholder="03001234567" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-amber-500 transition">
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-semibold mb-1">Password</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><i class="fas fa-lock"></i></span>
                      <input type="password" id="pass" required placeholder="••••••••" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-amber-500 transition">
                    </div>
                  </div>
                  <button type="submit" class="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg hover:from-amber-400 hover:to-yellow-300 transition transform active:scale-95">
                    Secure Login
                  </button>
                </form>
                <div class="text-center mt-6">
                  <button onclick="renderRegister()" class="text-amber-400 text-sm hover:underline font-medium">New member? Create Account</button>
                </div>
              </div>
            </div>
          \`;
        }

        function renderRegister() {
          document.getElementById('app').innerHTML = \`
            <div class="flex items-center justify-center mt-12">
              <div class="bg-slate-900 border border-amber-500/30 p-8 rounded-2xl shadow-2xl w-full">
                <div class="text-center mb-8">
                  <h1 class="text-2xl font-bold text-amber-400">Create Account</h1>
                  <p class="text-xs text-slate-400 mt-1">Join VIP Earn PK Today</p>
                </div>
                <form onsubmit="handleRegister(event)" class="space-y-4">
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-semibold mb-1">Full Name</label>
                    <input type="text" id="name" required placeholder="Ali Khan" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-semibold mb-1">Mobile Number</label>
                    <input type="text" id="phone" required placeholder="03001234567" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500">
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-slate-400 font-semibold mb-1">Password</label>
                    <input type="password" id="pass" required placeholder="••••••••" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500">
                  </div>
                  <button type="submit" class="w-full bg-amber-500 text-slate-950 font-bold py-3.5 rounded-xl hover:bg-amber-400 transition">Register Now</button>
                </form>
                <div class="text-center mt-4">
                  <button onclick="renderLogin()" class="text-slate-400 text-sm hover:text-amber-400">Already have an account? Login</button>
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
            alert('Account created successfully! Please login.');
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
            <div class="py-4 space-y-6">
              <div class="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
                <div>
                  <h2 class="text-lg font-bold text-amber-400">Welcome, \${currentUser.name}</h2>
                  <p class="text-xs text-slate-400">\${currentUser.phone}</p>
                </div>
                <button onclick="logout()" class="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition">Logout</button>
              </div>

              <div class="bg-gradient-to-br from-amber-600 to-yellow-500 p-6 rounded-2xl shadow-2xl text-slate-950">
                <p class="text-xs uppercase font-extrabold tracking-wider opacity-80">Total Wallet Balance</p>
                <h1 class="text-3xl font-black mt-1">Rs. \${currentUser.balance.toLocaleString()}</h1>
                <div class="mt-4 flex gap-3">
                  <button onclick="claimDaily()" class="flex-1 bg-slate-950 text-amber-400 font-bold py-2.5 px-4 rounded-xl text-sm shadow hover:bg-slate-900 transition flex items-center justify-center gap-2">
                    <i class="fas fa-bolt"></i> Claim Daily Profit
                  </button>
                </div>
              </div>

              \${currentUser.activePlan ? \`
                <div class="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl">
                  <div class="flex justify-between items-center">
                    <div>
                      <span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">Active VIP Plan</span>
                      <h3 class="font-bold text-lg text-white mt-1">\${currentUser.activePlan.name}</h3>
                      <p class="text-xs text-slate-400 mt-0.5">Daily Profit: Rs. \${currentUser.activePlan.daily}</p>
                    </div>
                  </div>
                </div>
              \` : ''}

              <div>
                <h3 class="text-md font-bold mb-3 text-slate-200">Investment Tiers</h3>
                <div class="grid grid-cols-1 gap-3">
                  \${plans.map(p => \`
                    <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <h4 class="font-bold text-amber-400">\${p.name}</h4>
                        <p class="text-xs text-slate-400">Price: Rs. \${p.price} | Daily: <span class="text-emerald-400 font-bold">Rs. \${p.daily}</span></p>
                      </div>
                      <button onclick="buyPlan(\${p.id})" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition">Invest Now</button>
                    </div>
                  \`).join('')}
                </div>
              </div>
            </div>
          \`;
        }

        async function buyPlan(planId) {
          const tid = prompt('Please send money to EasyPaisa/JazzCash (Admin: 03256098796) and enter your Transaction ID (TID):');
          if(!tid) return;
          const res = await api('/api/deposit', { userId: currentUser.id, planId, tid, method: 'EasyPaisa' });
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
            <div class="py-4 space-y-6">
              <div class="flex justify-between items-center bg-slate-900 border border-amber-500/30 p-4 rounded-2xl">
                <div>
                  <h2 class="text-lg font-bold text-amber-400">Admin Control Panel</h2>
                  <p class="text-xs text-slate-400">\${currentUser.phone}</p>
                </div>
                <button onclick="logout()" class="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold">Logout</button>
              </div>

              <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <h3 class="text-sm font-bold text-amber-400 mb-3 uppercase tracking-wider">Deposit Requests (Pending TIDs)</h3>
                <div class="space-y-3">
                  \${res.deposits.length === 0 ? '<p class="text-xs text-slate-500">No pending deposits.</p>' : ''}
                  \${res.deposits.map(d => \`
                    <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p class="font-bold text-white">User ID: \${d.userId} | Plan: \${d.planName}</p>
                        <p class="text-amber-400 mt-0.5">TID: \${d.tid} (Rs. \${d.amount})</p>
                      </div>
                      <div class="flex gap-2">
                        <button onclick="approveDeposit(\${d.id}, 'Approved')" class="bg-emerald-500 text-slate-950 px-3 py-1 rounded font-bold">Approve</button>
                        <button onclick="approveDeposit(\${d.id}, 'Rejected')" class="bg-red-500 text-white px-3 py-1 rounded font-bold">Reject</button>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              </div>

              <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <h3 class="text-sm font-bold text-amber-400 mb-3 uppercase tracking-wider">All Registered Users</h3>
                <div class="space-y-3">
                  \${res.users.map(u => \`
                    <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p class="font-bold text-white">\${u.name} (\${u.phone})</p>
                        <p class="text-slate-400">Balance: Rs. \${u.balance}</p>
                      </div>
                      <button onclick="editBalance(\${u.id})" class="bg-amber-500 text-slate-950 px-3 py-1 rounded font-bold">Edit Balance</button>
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

        async function editBalance(userId) {
          const newBal = prompt('Enter new balance amount:');
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
    return res.send({ ok: true, user: { id: 999, name: 'Admin', phone: ADMIN_PHONE, isAdmin: true } });
  }
  const user = db.users.find(u => u.phone === phone && u.pass === pass);
  if(!user) return res.send({ ok: false, msg: 'Invalid phone or password!' });
  res.send({ ok: true, user });
});

app.post('/api/user', (req, res) => {
  const user = db.users.find(u => u.id === req.body.id);
  res.send({ user, plans: db.plans });
});

app.post('/api/deposit', (req, res) => {
  const { userId, planId, tid, method } = req.body;
  const p = db.plans.find(x => x.id === planId);
  db.deposits.push({ id: db.deposits.length + 1, userId, planId, planName: p.name, amount: p.price, tid, method, status: 'Pending' });
  res.send({ ok: true, msg: 'Deposit TID submitted! Waiting for Admin approval.' });
});

app.post('/api/claim', (req, res) => {
  const user = db.users.find(u => u.id === req.body.userId);
  if(!user || !user.activePlan) return res.send({ ok: false, msg: 'No active plan found!' });
  
  const today = new Date().toDateString();
  if(user.lastClaim === today) return res.send({ ok: false, msg: 'Already claimed today! Try again tomorrow.' });

  user.balance += user.activePlan.daily;
  user.lastClaim = today;
  res.send({ ok: true, msg: 'Daily profit successfully claimed!' });
});

app.post('/api/admin/data', (req, res) => {
  res.send({ deposits: db.deposits.filter(d => d.Status === 'Pending'), users: db.users });
});

app.post('/api/admin/deposit', (req, res) => {
  const { id, status } = req.body;
  const d = db.deposits.find(x => x.id === id);
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

app.post('/api/admin/bal', (req, res) => {
  const { userId, balance } = req.body;
  const u = db.users.find(x => x.id === userId);
  if(u) u.balance = balance;
  res.send({ ok: true });
});

const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`VIP Portal Running on Port ${PORT}`);
});
