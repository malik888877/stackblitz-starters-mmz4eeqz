const http = require('http');

// In-Memory Database (6 Plans + Default Admin 03256098796)
const db = {
  plans: [
    { id: 1, name: 'VIP 1 - Starter', price: 500, daily: 50 },
    { id: 2, name: 'VIP 2 - Bronze', price: 1500, daily: 150 },
    { id: 3, name: 'VIP 3 - Silver', price: 5000, daily: 500 },
    { id: 4, name: 'VIP 4 - Gold', price: 10000, daily: 1000 },
    { id: 5, name: 'VIP 5 - Platinum', price: 25000, daily: 2500 },
    { id: 6, name: 'VIP 6 - Diamond', price: 50000, daily: 5000 },
  ],
  users: [
    {
      id: 1,
      name: 'Admin',
      phone: '03256098796',
      pass: 'admin123',
      balance: 0,
      withdrawn: 0,
      planId: 0,
      lastClaim: 0,
      isAdmin: true,
    },
  ],
  deposits: [],
  withdrawals: [],
};

const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIP Daily Earning Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white min-h-screen font-sans pb-20">

  <!-- Top Bar -->
  <nav class="bg-gray-900 border-b border-yellow-500/30 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
    <h1 class="text-xl font-extrabold text-yellow-400">💎 VIP Earn PK</h1>
    <div id="nav-btns" class="hidden flex items-center gap-2">
      <span id="nav-phone" class="text-xs text-gray-300"></span>
      <button onclick="logout()" class="bg-red-600 text-xs px-3 py-1.5 rounded font-bold">Logout</button>
    </div>
  </nav>

  <!-- AUTH BOX -->
  <div id="auth-box" class="max-w-md mx-auto mt-10 p-6 bg-gray-900 rounded-2xl border border-yellow-500/30 shadow-xl">
    <h2 id="auth-title" class="text-2xl font-bold text-center text-yellow-400 mb-2">Login Account</h2>
    <p class="text-xs text-center text-gray-400 mb-5">Admin Login: <b>03256098796</b> | Pass: <b>admin123</b></p>
    <div class="space-y-3">
      <input id="u-name" type="text" placeholder="Full Name" class="hidden w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white">
      <input id="u-phone" type="text" placeholder="Mobile Number (e.g. 03001234567)" class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white">
      <input id="u-pass" type="password" placeholder="Password" class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white">
      <button onclick="handleAuth()" id="auth-btn" class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg">Login</button>
      <p class="text-center text-sm text-gray-400 pt-2">
        <span id="toggle-txt">New user?</span>
        <button onclick="toggleMode()" id="toggle-link" class="text-yellow-400 font-bold underline ml-1">Create Account</button>
      </p>
    </div>
  </div>

  <!-- USER DASHBOARD -->
  <div id="user-sec" class="hidden max-w-4xl mx-auto p-4 space-y-6">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-gray-900 p-4 rounded-xl border border-yellow-500/40">
        <p class="text-xs text-gray-400">Wallet Balance</p>
        <p class="text-2xl font-extrabold text-yellow-400">Rs. <span id="u-bal">0</span></p>
      </div>
      <div class="bg-gray-900 p-4 rounded-xl border border-gray-800">
        <p class="text-xs text-gray-400">Active Plan</p>
        <p id="u-plan" class="text-lg font-bold text-white">None</p>
      </div>
      <div class="bg-gray-900 p-4 rounded-xl border border-gray-800">
        <p class="text-xs text-gray-400">Daily Profit</p>
        <p class="text-xl font-bold text-green-400">Rs. <span id="u-daily">0</span></p>
      </div>
      <div class="bg-gray-900 p-4 rounded-xl border border-gray-800">
        <p class="text-xs text-gray-400">Total Withdrawn</p>
        <p class="text-xl font-bold text-blue-400">Rs. <span id="u-with">0</span></p>
      </div>
    </div>

    <!-- Claim & Withdraw Bar -->
    <div class="bg-gray-900 p-5 rounded-2xl border border-yellow-500/30 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h3 class="text-lg font-bold text-yellow-400">🎁 Daily Profit Center</h3>
        <p class="text-xs text-gray-400">Click every 24 hours to add your daily profit to wallet.</p>
      </div>
      <div class="flex gap-3 w-full md:w-auto">
        <button onclick="claimProfit()" class="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-3 rounded-xl">⚡ Claim Daily Profit</button>
        <button onclick="document.getElementById('w-modal').classList.remove('hidden')" class="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl">🏦 Withdraw</button>
      </div>
    </div>

    <!-- 6 Plans Grid -->
    <div>
      <h3 class="text-xl font-bold text-yellow-400 mb-3">🔥 Investment Plans (10% Daily Return)</h3>
      <div id="plans-grid" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
    </div>

    <!-- User History -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-900 p-4 rounded-xl border border-gray-800">
        <h4 class="font-bold text-yellow-400 mb-2">My Deposits</h4>
        <div id="u-deps" class="space-y-2 text-xs"></div>
      </div>
      <div class="bg-gray-900 p-4 rounded-xl border border-gray-800">
        <h4 class="font-bold text-yellow-400 mb-2">My Withdrawals</h4>
        <div id="u-withs" class="space-y-2 text-xs"></div>
      </div>
    </div>
  </div>

  <!-- ADMIN PANEL SECTION -->
  <div id="admin-sec" class="hidden max-w-5xl mx-auto p-4 space-y-6">
    <div class="bg-yellow-500/10 border border-yellow-500 p-4 rounded-xl flex justify-between items-center">
      <h2 class="text-xl font-bold text-yellow-400">⚙️ Admin Control Panel (03256098796)</h2>
      <button onclick="loadState()" class="bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded">🔄 Refresh Data</button>
    </div>

    <div class="bg-gray-900 p-4 rounded-xl border border-gray-800">
      <h3 class="font-bold text-yellow-400 mb-3">📥 Deposit Requests (Approve TID to Activate Plan)</h3>
      <div id="a-deps" class="space-y-2 text-sm"></div>
    </div>

    <div class="bg-gray-900 p-4 rounded-xl border border-gray-800">
      <h3 class="font-bold text-green-400 mb-3">💸 Withdrawal Requests</h3>
      <div id="a-withs" class="space-y-2 text-sm"></div>
    </div>

    <div class="bg-gray-900 p-4 rounded-xl border border-gray-800">
      <h3 class="font-bold text-blue-400 mb-3">👥 All Users (Add / Edit Balance Manually)</h3>
      <div id="a-users" class="space-y-2 text-sm"></div>
    </div>
  </div>

  <!-- DEPOSIT MODAL -->
  <div id="d-modal" class="hidden fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
    <div class="bg-gray-900 border border-yellow-500 rounded-2xl max-w-md w-full p-6 space-y-4">
      <h3 class="text-xl font-bold text-yellow-400" id="d-title">Activate Plan</h3>
      <div class="bg-gray-800 p-4 rounded-xl border border-gray-700 space-y-1">
        <p class="text-xs text-gray-400">Send Amount to EasyPaisa / JazzCash:</p>
        <div class="flex justify-between items-center">
          <span class="text-xl font-extrabold text-green-400">03256098796</span>
          <button onclick="navigator.clipboard.writeText('03256098796');alert('Number Copied!')" class="bg-gray-700 text-xs px-2 py-1 rounded">Copy</button>
        </div>
        <p class="text-sm text-yellow-400 font-bold">Amount: Rs. <span id="d-price">0</span></p>
      </div>
      <select id="d-method" class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700">
        <option>EasyPaisa</option>
        <option>JazzCash</option>
      </select>
      <input id="d-tid" type="text" placeholder="Enter Transaction ID (TID)" class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700">
      <div class="flex gap-2">
        <button onclick="sendDeposit()" class="flex-1 bg-yellow-500 text-black font-bold py-2.5 rounded-lg">Submit TID</button>
        <button onclick="document.getElementById('d-modal').classList.add('hidden')" class="bg-gray-700 px-4 py-2.5 rounded-lg">Close</button>
      </div>
    </div>
  </div>

  <!-- WITHDRAW MODAL -->
  <div id="w-modal" class="hidden fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
    <div class="bg-gray-900 border border-yellow-500 rounded-2xl max-w-md w-full p-6 space-y-3">
      <h3 class="text-xl font-bold text-yellow-400">Withdraw Money</h3>
      <input id="w-amt" type="number" placeholder="Amount (PKR)" class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700">
      <select id="w-method" class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700">
        <option>EasyPaisa</option>
        <option>JazzCash</option>
      </select>
      <input id="w-num" type="text" placeholder="Account Number" class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700">
      <input id="w-title" type="text" placeholder="Account Holder Name" class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700">
      <div class="flex gap-2 pt-2">
        <button onclick="sendWithdraw()" class="flex-1 bg-green-500 text-black font-bold py-2.5 rounded-lg">Submit Request</button>
        <button onclick="document.getElementById('w-modal').classList.add('hidden')" class="bg-gray-700 px-4 py-2.5 rounded-lg">Close</button>
      </div>
    </div>
  </div>

  <a href="https://wa.me/923256098796" target="_blank" class="fixed bottom-4 right-4 bg-green-500 text-white font-bold px-4 py-2.5 rounded-full shadow-lg text-sm">💬 WhatsApp Support</a>

  <script>
    let isLogin = true;
    let currentUser = JSON.parse(localStorage.getItem('vip_user') || 'null');
    let selectedPlan = null;

    if (currentUser) loadState();

    function toggleMode() {
      isLogin = !isLogin;
      document.getElementById('u-name').classList.toggle('hidden', isLogin);
      document.getElementById('auth-title').innerText = isLogin ? 'Login Account' : 'Create Account';
      document.getElementById('auth-btn').innerText = isLogin ? 'Login' : 'Sign Up';
      document.getElementById('toggle-txt').innerText = isLogin ? 'New user?' : 'Already have account?';
      document.getElementById('toggle-link').innerText = isLogin ? 'Create Account' : 'Login';
    }

    async function api(path, body) {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return res.json();
    }

    async function handleAuth() {
      const name = document.getElementById('u-name').value;
      const phone = document.getElementById('u-phone').value.trim();
      const pass = document.getElementById('u-pass').value;
      const res = await api('/api/auth', { isLogin, name, phone, pass });
      if (res.error) return alert(res.error);
      currentUser = res.user;
      localStorage.setItem('vip_user', JSON.stringify(currentUser));
      loadState();
    }

    async function loadState() {
      const res = await api('/api/state', { userId: currentUser.id });
      if (res.error) return logout();
      currentUser = res.user;
      document.getElementById('auth-box').classList.add('hidden');
      document.getElementById('nav-btns').classList.remove('hidden');
      document.getElementById('nav-phone').innerText = currentUser.phone;

      if (currentUser.isAdmin) {
        document.getElementById('admin-sec').classList.remove('hidden');
        renderAdmin(res);
      } else {
        document.getElementById('user-sec').classList.remove('hidden');
        renderUser(res);
      }
    }

    function renderUser(data) {
      const u = data.user;
      const activePlan = data.plans.find(p => p.id === u.planId);
      document.getElementById('u-bal').innerText = u.balance;
      document.getElementById('u-plan').innerText = activePlan ? activePlan.name : 'No Active Plan';
      document.getElementById('u-daily').innerText = activePlan ? activePlan.daily : 0;
      document.getElementById('u-with').innerText = u.withdrawn;

      document.getElementById('plans-grid').innerHTML = data.plans.map(p => \`
        <div class="bg-gray-900 border \${u.planId === p.id ? 'border-green-500' : 'border-yellow-500/30'} p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <span class="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2.5 py-1 rounded-full">\${p.name}</span>
            <h4 class="text-2xl font-extrabold mt-3">Rs. \${p.price}</h4>
            <p class="text-green-400 font-bold mt-1">Daily Profit: Rs. \${p.daily}</p>
            <p class="text-xs text-gray-400 mt-1">Monthly Total: Rs. \${p.daily * 30}</p>
          </div>
          <button onclick="openDep(\${p.id}, '\${p.name}', \${p.price})" class="mt-4 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 rounded-xl">
            \${u.planId === p.id ? '✅ Active Plan' : 'Invest Now'}
          </button>
        </div>
      \`).join('');

      document.getElementById('u-deps').innerHTML = data.deposits.map(d => \`
        <div class="flex justify-between bg-gray-800 p-2 rounded">
          <span>\${d.planName} (Rs.\${d.amount}) - TID: \${d.tid}</span>
          <b class="\${d.status==='Approved'?'text-green-400':d.status==='Rejected'?'text-red-400':'text-yellow-400'}">\${d.status}</b>
        </div>
      \`).join('') || '<p class="text-gray-500">No deposits yet.</p>';

      document.getElementById('u-withs').innerHTML = data.withdrawals.map(w => \`
        <div class="flex justify-between bg-gray-800 p-2 rounded">
          <span>Rs. \${w.amount} (\${w.method} - \${w.number})</span>
          <b class="\${w.status==='Paid'?'text-green-400':w.status==='Rejected'?'text-red-400':'text-yellow-400'}">\${w.status}</b>
        </div>
      \`).join('') || '<p class="text-gray-500">No withdrawals yet.</p>';
    }

    function renderAdmin(data) {
      document.getElementById('a-deps').innerHTML = data.allDeposits.map(d => \`
        <div class="bg-gray-800 p-3 rounded flex justify-between items-center">
          <div><b>\${d.userPhone}</b> | \${d.planName} (Rs.\${d.amount}) | \${d.method} | <span class="text-yellow-400">TID: \${d.tid}</span></div>
          <div class="flex gap-2 items-center">
            <span class="text-xs px-2 py-1 bg-gray-700 rounded">\${d.status}</span>
            \${d.status === 'Pending' ? \`
              <button onclick="adminDep(\${d.id}, 'Approved')" class="bg-green-600 px-3 py-1 rounded text-xs font-bold">Approve</button>
              <button onclick="adminDep(\${d.id}, 'Rejected')" class="bg-red-600 px-3 py-1 rounded text-xs font-bold">Reject</button>
            \` : ''}
          </div>
        </div>
      \`).join('') || '<p class="text-gray-500">No deposit requests.</p>';

      document.getElementById('a-withs').innerHTML = data.allWithdrawals.map(w => \`
        <div class="bg-gray-800 p-3 rounded flex justify-between items-center">
          <div><b class="text-green-400">Rs.\${w.amount}</b> | \${w.userPhone} -> <b>\${w.method}: \${w.number} (\${w.title})</b></div>
          <div class="flex gap-2 items-center">
            <span class="text-xs px-2 py-1 bg-gray-700 rounded">\${w.status}</span>
            \${w.status === 'Pending' ? \`
              <button onclick="adminWith(\${w.id}, 'Paid')" class="bg-green-600 px-3 py-1 rounded text-xs font-bold">Mark Paid</button>
              <button onclick="adminWith(\${w.id}, 'Rejected')" class="bg-red-600 px-3 py-1 rounded text-xs font-bold">Reject</button>
            \` : ''}
          </div>
        </div>
      \`).join('') || '<p class="text-gray-500">No withdrawal requests.</p>';

      document.getElementById('a-users').innerHTML = data.allUsers.map(u => \`
        <div class="bg-gray-800 p-3 rounded flex justify-between items-center">
          <div><b>\${u.name}</b> (\${u.phone}) | Plan ID: \${u.planId} | Wallet: <b class="text-yellow-400">Rs. \${u.balance}</b></div>
          <div class="flex gap-2">
            <input id="bal-\${u.id}" type="number" value="\${u.balance}" class="w-24 px-2 py-1 rounded bg-gray-900 border border-gray-700">
            <button onclick="saveBal(\${u.id})" class="bg-blue-600 px-3 py-1 rounded text-xs font-bold">Update</button>
          </div>
        </div>
      \`).join('') || '<p class="text-gray-500">No regular users yet.</p>';
    }

    function openDep(id, name, price) {
      selectedPlan = id;
      document.getElementById('d-title').innerText = 'Buy ' + name;
      document.getElementById('d-price').innerText = price;
      document.getElementById('d-modal').classList.remove('hidden');
    }

    async function sendDeposit() {
      const method = document.getElementById('d-method').value;
      const tid = document.getElementById('d-tid').value.trim();
      if (!tid) return alert('Please enter TID!');
      const res = await api('/api/deposit', { userId: currentUser.id, planId: selectedPlan, method, tid });
      alert(res.message);
      document.getElementById('d-modal').classList.add('hidden');
      loadState();
    }

    async function claimProfit() {
      const res = await api('/api/claim', { userId: currentUser.id });
      alert(res.message || res.error);
      loadState();
    }

    async function sendWithdraw() {
      const amount = Number(document.getElementById('w-amt').value);
      const method = document.getElementById('w-method').value;
      const number = document.getElementById('w-num').value;
      const title = document.getElementById('w-title').value;
      const res = await api('/api/withdraw', { userId: currentUser.id, amount, method, number, title });
      if (res.error) return alert(res.error);
      alert(res.message);
      document.getElementById('w-modal').classList.add('hidden');
      loadState();
    }

    async function adminDep(id, status) {
      await api('/api/admin/dep', { id, status });
      loadState();
    }

    async function adminWith(id, status) {
      await api('/api/admin/with', { id, status });
      loadState();
    }

    async function saveBal(userId) {
      const balance = Number(document.getElementById('bal-' + userId).value);
      await api('/api/admin/bal', { userId, balance });
      alert('Balance Updated!');
      loadState();
    }

    function logout() {
      localStorage.removeItem('vip_user');
      location.reload();
    }
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(htmlPage);
  }

  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    const data = JSON.parse(body || '{}');
    const send = (obj) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(obj));
    };

    if (req.url === '/api/auth') {
      if (data.isLogin) {
        const u = db.users.find(
          (x) => x.phone === data.phone && x.pass === data.pass
        );
        if (!u) return send({ error: 'Invalid phone or password!' });
        return send({ user: u });
      } else {
        if (!data.phone || !data.pass)
          return send({ error: 'Fill all fields!' });
        if (db.users.find((x) => x.phone === data.phone))
          return send({ error: 'Phone already registered!' });
        const u = {
          id: db.users.length + 1,
          name: data.name || 'User',
          phone: data.phone,
          pass: data.pass,
          balance: 0,
          withdrawn: 0,
          planId: 0,
          lastClaim: 0,
          isAdmin: false,
        };
        db.users.push(u);
        return send({ user: u });
      }
    }

    if (req.url === '/api/state') {
      const u = db.users.find((x) => x.id === data.userId);
      if (!u) return send({ error: 'Not found' });
      return send({
        user: u,
        plans: db.plans,
        deposits: db.deposits.filter((d) => d.userId === u.id).reverse(),
        withdrawals: db.withdrawals.filter((w) => w.userId === u.id).reverse(),
        allDeposits: u.isAdmin ? db.deposits.slice().reverse() : [],
        allWithdrawals: u.isAdmin ? db.withdrawals.slice().reverse() : [],
        allUsers: u.isAdmin ? db.users.filter((x) => !x.isAdmin) : [],
      });
    }

    if (req.url === '/api/deposit') {
      const u = db.users.find((x) => x.id === data.userId);
      const p = db.plans.find((x) => x.id === data.planId);
      db.deposits.push({
        id: db.deposits.length + 1,
        userId: u.id,
        userPhone: u.phone,
        planId: p.id,
        planName: p.name,
        amount: p.price,
        method: data.method,
        tid: data.tid,
        status: 'Pending',
      });
      return send({
        message: 'Deposit TID submitted! Waiting for Admin approval.',
      });
    }

    if (req.url === '/api/claim') {
      const u = db.users.find((x) => x.id === data.userId);
      const p = db.plans.find((x) => x.id === u.planId);
      if (!p) return send({ error: 'Please buy and activate a plan first!' });
      const now = Date.now();
      if (now - u.lastClaim < 24 * 60 * 60 * 1000) {
        return send({
          error: 'Already claimed today! Come back after 24 hours.',
        });
      }
      u.balance += p.daily;
      u.lastClaim = now;
      return send({
        message: 'Success! Rs. ' + p.daily + ' added to your wallet!',
      });
    }

    if (req.url === '/api/withdraw') {
      const u = db.users.find((x) => x.id === data.userId);
      if (!data.amount || data.amount <= 0 || u.balance < data.amount)
        return send({ error: 'Insufficient wallet balance!' });
      u.balance -= data.amount;
      db.withdrawals.push({
        id: db.withdrawals.length + 1,
        userId: u.id,
        userPhone: u.phone,
        amount: data.amount,
        method: data.method,
        number: data.number,
        title: data.title,
        status: 'Pending',
      });
      return send({ message: 'Withdrawal request sent to Admin!' });
    }

    if (req.url === '/api/admin/dep') {
      const d = db.deposits.find((x) => x.id === data.id);
      if (d && d.status === 'Pending') {
        d.status = data.status;
        if (data.status === 'Approved') {
          const u = db.users.find((x) => x.id === d.userId);
          if (u) {
            u.planId = d.planId;
            u.lastClaim = 0;
          }
        }
      }
      return send({ ok: true });
    }

    if (req.url === '/api/admin/with') {
      const w = db.withdrawals.find((x) => x.id === data.id);
      if (w && w.status === 'Pending') {
        w.status = data.status;
        const u = db.users.find((x) => x.id === w.userId);
        if (u && data.status === 'Paid') u.withdrawn += w.amount;
        if (u && data.status === 'Rejected') u.balance += w.amount;
      }
      return send({ ok: true });
    }

    if (req.url === '/api/admin/bal') {
      const u = db.users.find((x) => x.id === data.userId);
      if (u) u.balance = data.balance;
      return send({ ok: true });
    }
  });
});

server.listen(3000, () => console.log('VIP Portal Running on Port 3000'));
