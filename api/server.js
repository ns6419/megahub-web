const express = require('express');
const https = require('https');
const app = express();

const TOPIC = 'megahub_alerts_9988';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEGAHUB</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
        body { background: #000; color: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
        .title-container { text-align: center; margin-bottom: 40px; }
        .dashboard { width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 16px; }
        .card { background: #0c0c0c; border: 1px solid #1c1c1c; border-radius: 14px; padding: 24px; cursor: pointer; }
        .card h3 { margin-bottom: 6px; }
        .card p { color: #555; font-size: 0.9rem; }
        .nav-header { position: fixed; top: 0; right: 0; padding: 20px; z-index: 1000; }
        .menu-toggle { width: 44px; height: 44px; cursor: pointer; display: flex; flex-direction: column; justify-content: center; gap: 6px; padding: 12px; background: #0c0c0c; border-radius: 12px; }
        .bar { width: 100%; height: 2.5px; background: #fff; transition: 0.3s; }
        .menu-toggle.open .bar1 { transform: translateY(8.5px) rotate(45deg); }
        .menu-toggle.open .bar2 { opacity: 0; }
        .menu-toggle.open .bar3 { transform: translateY(-8.5px) rotate(-45deg); }
        .ai-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 400px; height: 100%; background: #050505; border-left: 1px solid #111; transition: 0.4s; z-index: 999; display: flex; flex-direction: column; }
        .ai-drawer.open { right: 0; }
        .chat-box { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
        .msg { padding: 12px 16px; border-radius: 10px; max-width: 85%; }
        .msg.user { background: #fff; color: #000; align-self: flex-end; }
        .msg.ai { background: #111; color: #fff; align-self: flex-start; }
        .chat-input-area { padding: 20px; display: flex; gap: 12px; }
        .chat-input-area input { flex: 1; background: #0c0c0c; border: 1px solid #1c1c1c; padding: 14px; color: #fff; border-radius: 8px; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: none; align-items: center; justify-content: center; z-index: 2000; }
        .modal-overlay.open { display: flex; }
        .modal-content { background: #0c0c0c; border: 1px solid #1c1c1c; border-radius: 14px; padding: 28px; width: 100%; max-width: 400px; }
        .modal-content input, .modal-content textarea { width: 100%; background: #111; border: 1px solid #222; padding: 14px; color: #fff; border-radius: 8px; margin-bottom: 12px; }
        .modal-content button { width: 100%; background: #fff; color: #000; border: none; padding: 14px; border-radius: 8px; font-weight: 700; }
    </style>
</head>
<body>
    <header class="nav-header">
        <div class="menu-toggle" onclick="toggleMenu(this)">
            <div class="bar bar1"></div>
            <div class="bar bar2"></div>
            <div class="bar bar3"></div>
        </div>
    </header>
    <div class="title-container">
        <h1>MEGAHUB</h1>
        <p>Designed & Owned By: Hadi</p>
    </div>
    <div class="dashboard">
        <div class="card" onclick="openForm('RECOVERY DESK')">
            <h3>RECOVERY DESK</h3>
            <p>Appeal system bans / restore blocked accounts</p>
        </div>
        <div class="card" onclick="openForm('ACC ENGAGEMENT INCREASER')">
            <h3>ACC ENGAGEMENT INCREASER</h3>
            <p>Follower and views increase engine boost</p>
        </div>
        <div class="card" onclick="openForm('BUY OLD INSTAGRAM ACCOUNTS')">
            <h3>BUY OLD INSTAGRAM ACCOUNTS</h3>
            <p>Old Instagram profiles available</p>
        </div>
    </div>
    <div class="ai-drawer" id="aiDrawer">
        <div class="chat-box" id="chatBox"><div class="msg ai">Hello! I am MEGA.AI by HADI.</div></div>
        <div class="chat-input-area">
            <input type="text" id="aiPrompt" placeholder="Type a message...">
            <button onclick="askAI()">Send</button>
        </div>
    </div>
    <div class="modal-overlay" id="modalOverlay">
        <div class="modal-content">
            <h3 id="modalTitle">Submit Ticket</h3>
            <input type="hidden" id="serviceType">
            <input type="text" id="targetUser" placeholder="Username">
            <input type="text" id="contactPhone" placeholder="Contact Details">
            <textarea id="customerNotes" placeholder="Explain your problem..."></textarea>
            <button onclick="submitTicket()">Submit Request</button>
            <button onclick="closeForm()" style="background:#222;color:#fff;margin-top:8px;">Close</button>
        </div>
    </div>
    <script>
        function toggleMenu(el) { el.classList.toggle('open'); document.getElementById('aiDrawer').classList.toggle('open'); }
        function openForm(n) { document.getElementById('serviceType').value = n; document.getElementById('modalTitle').innerText = n; document.getElementById('modalOverlay').classList.add('open'); }
        function closeForm() { document.getElementById('modalOverlay').classList.remove('open'); }
        async function submitTicket() {
            const serviceType = document.getElementById('serviceType').value;
            const targetUser = document.getElementById('targetUser').value;
            const contactPhone = document.getElementById('contactPhone').value;
            const customerNotes = document.getElementById('customerNotes').value;
            if(!targetUser || !contactPhone || !customerNotes) return alert('Fill all fields');
            try {
                const res = await fetch('/submit-ticket', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ serviceType, targetUser, contactPhone, customerNotes })
                });
                const d = await res.json();
                if(d.success) { alert('Sent successfully!'); closeForm(); }
            } catch { alert('Error.'); }
        }
        async function askAI() {
            const inp = document.getElementById('aiPrompt'); const box = document.getElementById('chatBox'); const prompt = inp.value.trim();
            if(!prompt) return;
            const u = document.createElement('div'); u.className = 'msg user'; u.innerText = prompt; box.appendChild(u); inp.value = '';
            const a = document.createElement('div'); a.className = 'msg ai'; a.innerText = 'Thinking...'; box.appendChild(a);
            try {
                const res = await fetch('/api/ask-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
                const d = await res.json(); a.innerText = d.reply;
            } catch { a.innerText = 'AI Offline.'; }
        }
    </script>
</body>
</html>
    `);
});

app.post('/api/ask-ai', (req, res) => {
    const { prompt } = req.body;
    const sys = "You are MEGA.AI by HADI. Help with boosts and recovery.";
    const data = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } });
    const opt = { 
        hostname: '://googleapis.com', 
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } 
    };
    const aiReq = https.request(opt, (aiRes) => {
        let body = ''; aiRes.on('data', (c) => body += c);
        aiRes.on('end', () => { 
            try { 
                const resJson = JSON.parse(body);
                res.json({ reply: resJson.candidates[0].content.parts[0].text.trim() }); 
            } catch { res.json({ reply: "AI line fluctuation." }); } 
        });
    });
    aiReq.on('error', () => res.json({ reply: "AI error." }));
    aiReq.write(data); aiReq.end();
});

app.post('/submit-ticket', (req, res) => {
    const { serviceType, targetUser, contactPhone, customerNotes } = req.body;
    const msg = `🚨 MEGAHUB ALERT 🚨\n\n• SERVICE: ${serviceType}\n• USER: ${targetUser}\n• CONTACT: ${contactPhone}\n\n• NOTES:\n${customerNotes}`;
    const buf = Buffer.from(msg, 'utf-8');
    const opt = { hostname: 'ntfy.sh', path: '/' + TOPIC, method: 'POST', headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': buf.length } };
    const nreq = https.request(opt, () => { res.json({ success: true }); });
    nreq.on('error', (e) => res.status(500).json({ error: e.message }));
    nreq.write(buf); nreq.end();
});

module.exports = app;
                
