const express = require('express');
const https = require('https');
const cookieParser = require('cookie-parser');
const app = express();
const TOPIC = 'megahub_alerts_9988';
const ADMIN_SECRET = 'HadiHub9988'; 
const GEMINI_API_KEY = 'AQ.Ab8RN6LEPSJmSJrnva51M_Qmy2ZcFKuFt0cNI6s1I14EghAHTw'; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const UI = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MEGAHUB</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: #000; color: #fff; font-family: sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; position: relative; }
        .burger-container { position: absolute; top: 20px; right: 20px; width: 44px; height: 44px; cursor: pointer; z-index: 120; display: flex; align-items: center; justify-content: center; }
        .burger-svg { width: 32px; height: 32px; fill: none; stroke: #fff; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
        .line-top { d: path("M 4 8 L 28 8"); transition: d 0.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s; }
        .line-mid { d: path("M 4 16 L 28 16"); transition: opacity 0.3s; opacity: 1; }
        .line-bot { d: path("M 4 24 L 28 24"); transition: d 0.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s; }
        .burger-container.active .line-top { d: path("M 4 24 L 4 10 C 4 6, 9 6, 9 10 L 9 20 C 9 24, 14 24, 14 20 L 16 14 L 18 20 C 18 24, 23 24, 23 20 L 23 10 C 23 6, 28 6, 28 10 L 28 24"); stroke: #fff; }
        .burger-container.active .line-mid { opacity: 0; }
        .burger-container.active .line-bot { d: path("M 11 14 L 14 10 L 16 15 L 18 10 L 21 14"); stroke: #fff; }
        .nav-menu { position: fixed; top: 0; right: -100%; width: 250px; height: 100vh; background: rgba(10, 10, 10, 0.96); border-left: 1px solid #222; display: flex; flex-direction: column; padding: 90px 25px; gap: 20px; z-index: 110; transition: right 0.3s ease-in-out; box-shadow: -10px 0 30px rgba(0,0,0,0.6); }
        .nav-menu.open { right: 0; }
        .nav-menu a { color: #888; text-decoration: none; text-transform: uppercase; font-size: 0.95rem; font-weight: 600; letter-spacing: 1px; transition: color 0.2s; }
        .nav-menu a:hover { color: #fff; }
        .ai-trigger-btn { position: absolute; top: 20px; left: 20px; background: #fff; color: #000; padding: 8px 18px; border-radius: 20px; font-weight: bold; font-size: 0.8rem; cursor: pointer; z-index: 90; text-transform: uppercase; border: none; letter-spacing: 0.5px; }
        .ai-drawer { position: fixed; bottom: 0; left: 50%; transform: translate(-50%, 100%); width: 100%; max-width: 400px; height: 65vh; background: #0c0c0c; border-top: 2px solid #222; border-radius: 20px 20px 0 0; z-index: 105; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; }
        .ai-drawer.open { transform: translate(-50%, 0); }
        .ai-header { padding: 15px 20px; border-bottom: 1px solid #222; display: flex; justify-content: space-between; align-items: center; }
        .ai-header h3 { margin: 0; font-size: 1.05rem; letter-spacing: 1px; font-weight: bold; }
        .ai-close { cursor: pointer; color: #666; font-size: 1.2rem; }
        .ai-chat-box { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem; }
        .msg { max-width: 80%; padding: 10px 14px; border-radius: 12px; line-height: 1.45; }
        .msg.user { background: #222; color: #fff; align-self: flex-end; border-bottom-right-radius: 2px; }
        .msg.bot { background: #fff; color: #000; align-self: flex-start; border-bottom-left-radius: 2px; font-weight: 500; }
        .ai-input-area { padding: 12px; border-top: 1px solid #222; display: flex; gap: 8px; background: #0a0a0a; }
        .ai-input-area input { flex: 1; background: #151515; border: 1px solid #222; padding: 12px; color: #fff; border-radius: 8px; outline: none; }
        .ai-input-area button { width: auto; margin: 0; padding: 0 20px; border-radius: 8px; background: #fff; color: #000; border: none; font-weight: bold; cursor: pointer; }
        .panel { width: 100%; max-width: 400px; padding: 20px; border: 1px solid #222; border-radius: 12px; background: #000; position: relative; z-index: 5; }
        h1, p { text-align: center; position: relative; z-index: 5; text-transform: uppercase; }
        h1 { margin: 40px 0 5px; font-size: 2.5rem; }
        p { color: #888; font-size: 0.8rem; margin: 0 0 20px; }
        .card { background: #111; border: 1px solid #222; border-radius: 8px; padding: 15px; margin-bottom: 12px; cursor: pointer; transition: border-color 0.2s; }
        .card:hover { border-color: #fff; }
        h3 { margin: 0 0 4px; text-transform: uppercase; font-size: 1rem; color: #fff; }
        span { font-size: 0.75rem; color: #666; }
        .wave-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; }
        canvas { display: block; width: 100%; height: 100%; }
        .drawer { position: fixed; bottom: 0; left: 50%; transform: translate(-50%, 100%); width: 100%; max-width: 400px; background: #111; border-top: 2px solid #222; border-radius: 16px 16px 0 0; padding: 20px; z-index: 10; transition: transform 0.3s; color: #fff; }
        .drawer.open { transform: translate(-50%, 0); }
        .overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: none; z-index: 9; }
        .overlay.open { display: block; }
        label { display: block; margin: 12px 0 4px; font-size: 0.75rem; color: #888; text-transform: uppercase; }
        input, textarea { width: 100%; padding: 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: #fff; margin-bottom: 5px;}
        textarea { height: 70px; resize: none; }
        .drawer button { width: 100%; padding: 14px; background: #fff; color: #000; border: none; border-radius: 6px; font-weight: 700; margin-top: 15px; cursor: pointer; text-transform: uppercase; }
    </style>
</head>
<body>
    <button class="ai-trigger-btn" onclick="openAI()">MEGA.AI</button>
    <div class="burger-container" id="burgerToggle" onclick="toggleMenu()"><svg class="burger-svg" viewBox="0 0 32 32"><path class="line-top" /><path class="line-mid" /><path class="line-bot" /></svg></div>
    <nav class="nav-menu" id="navMenu"><a href="/">Home Menu</a><a href="/admin">Portal Login</a></nav>
    <div class="ai-drawer" id="aiDrawer">
        <div class="ai-header"><h3>🤖 MEGA.AI ASSISTANT</h3><span class="ai-close" onclick="closeAI()">✕</span></div>
        <div class="ai-chat-box" id="aiChatBox"><div class="msg bot">Hello! I am MEGA.AI, built by HADI. How can I assist you with our platform operations today?</div></div>
        <div class="ai-input-area"><input type="text" id="aiInputField" placeholder="Ask MEGA.AI something..."><button onclick="sendAIChat()" id="aiSendBtn">SEND</button></div>
    </div>
    <div class="wave-container"><canvas id="waveCanvas"></canvas></div>
    <h1>MEGAHUB</h1><p>DESIGNED & OWNED BY: HADI</p>
    <div class="panel">
        <div class="card" onclick="op('Recovery Desk')"><h3>Recovery Desk</h3><span>Appeal system bans / restore blocked accounts</span></div>
        <div class="card" onclick="op('Acc Engagement Increaser')"><h3>Acc Engagement Increaser</h3><span>Follower and views increase engine boost</span></div>
        <div class="card" onclick="op('Buy Old Instagram Accounts')"><h3>Buy Old Instagram Accounts</h3><span>Old Instagram profiles available</span></div>
    </div>
    <div class="overlay" id="bg" onclick="cl()"></div>
    <div class="drawer" id="box">
        <h2 id="title" style="margin:0 0 15px;text-transform:uppercase;font-size:1.25rem;">Route</h2>
        <form id="ticketForm">
            <input type="hidden" id="route" name="serviceType">
            <label>Your Username</label><input type="text" name="targetUser" required placeholder="@username">
            <label>Contact Info</label><input type="text" name="contactPhone" required placeholder="Phone or email">
            <label>Explain Your Problem</label><textarea name="customerNotes" maxlength="150" required placeholder="What help do you need?"></textarea>
            <button type="submit" id="submitBtn">Confirm Request</button>
        </form>
    </div>
    <script>
        function toggleMenu() { document.getElementById('burgerToggle').classList.toggle('active'); document.getElementById('navMenu').classList.toggle('open'); }
        function openAI() { document.getElementById('aiDrawer').classList.add('open'); }
        function closeAI() { document.getElementById('aiDrawer').classList.remove('open'); }
        const box = document.getElementById('box'); const bg = document.getElementById('bg'); const title = document.getElementById('title'); const route = document.getElementById('route'); const ticketForm = document.getElementById('ticketForm'); const submitBtn = document.getElementById('submitBtn');
        function op(name) { title.textContent = name; route.value = name; box.classList.add('open'); bg.classList.add('open'); }
        function cl() { box.classList.remove('open'); bg.classList.remove('open'); }
        ticketForm.addEventListener('submit', async (e) => {
            e.preventDefault(); submitBtn.disabled = true;
            try {
                const res = await fetch('/submit-ticket', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(ticketForm)) });
                if (res.ok) { alert('⚡ DATA TRANSMITTED ⚡'); ticketForm.reset(); cl(); }
            } catch {} finally { submitBtn.disabled = false; }
        });
        async function sendAIChat() {
        try {
const res = await fetch('/api/ask-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: document.getElementById('aiInputField').value.trim() }) });
const data = await res.json();
alert(data.reply);
} catch {}
}
const canvas = document.getElementById('waveCanvas'); const ctx = canvas.getContext('2d'); let width = canvas.width = window.innerWidth; let height = canvas.height = window.innerHeight;
let springs = []; for (let i = 0; i < 22; i++) springs.push({ y: height * 0.81, targetY: height * 0.81, vel: 0 });
window.addEventListener('resize', () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; for (let i = 0; i < 22; i++) springs[i].targetY = height * 0.81; });
canvas.addEventListener('touchstart', (e) => { const idx = Math.floor(((e.touches[0].clientX - canvas.getBoundingClientRect().left) / width) * 22); if (idx >= 0 && idx < 22) springs[idx].vel = 16; }, { passive: true });
let t = 0;
function loop() {
t += 0.03; ctx.clearRect(0, 0, width, height);
for (let i = 0; i < 22; i++) { springs[i].targetY = (height * 0.81) + Math.sin(t + i * 0.5) * 8; springs[i].vel += -0.015 * (springs[i].y - springs[i].targetY) - springs[i].vel * 0.04; springs[i].y += springs[i].vel; }
ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(0, height); ctx.lineTo(0, springs[0].y);
for (let i = 0; i < 21; i++) { ctx.quadraticCurveTo(i * (width / 21), springs[i].y, ((i * (width / 21)) + ((i + 1) * (width / 21))) / 2, (springs[i].y + springs[i + 1].y) / 2); }
ctx.lineTo(width, springs[21].y); ctx.lineTo(width, height); ctx.closePath(); ctx.fill(); requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>\`;

app.get('/', (req, res) => { res.send(UI); });

app.post('/api/ask-ai', (req, res) => {
const { prompt } = req.body;
const postData = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: "You are MEGA.AI assistant by HADI." }] } });
const options = { hostname: '://googleapis.com', path: \`/v1beta/models/gemini-1.5-flash:generateContent?key=\${GEMINI_API_KEY}\`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) } };
const aiReq = https.request(options, (aiRes) => {
let body = ''; aiRes.on('data', (chunk) => body += chunk);
aiRes.on('end', () => { try { res.json({ reply: JSON.parse(body).candidates[0].content.parts[0].text }); } catch { res.json({ reply: "AI fluctuation. Try again." }); } });
});
aiReq.write(postData); aiReq.end();
});

app.post('/submit-ticket', (req, res) => {
const { serviceType, targetUser, contactPhone, customerNotes } = req.body;
const msg = \`🚨 MEGAHUB ALERT 🚨\\n• ROUTE: \${serviceType}\\n• USER: \${targetUser}\\n• NOTES: \${customerNotes}\`;
const opt = { hostname: 'ntfy.sh', path: '/' + TOPIC, method: 'POST', headers: { 'Content-Type': 'text/plain; charset=utf-8' } };
const nreq = https.request(opt, () => { res.json({ success: true }); });
nreq.write(Buffer.from(msg, 'utf-8')); nreq.end();
});

module.exports = app;

        
