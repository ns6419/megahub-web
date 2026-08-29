const express = require('express');
const https = require('https');
const app = express();
const TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const UI = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEGAHUB</title>
    <style>
        * { box-sizing: border-box; }
        body { 
            margin: 0; 
            padding: 0; 
            background: #000; 
            color: #fff; 
            font-family: sans-serif; 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden; 
        }
        .panel { 
            width: 100%; 
            max-width: 400px; 
            padding: 20px; 
            border: 1px solid #222; 
            border-radius: 12px; 
            background: #000; 
            position: relative; 
            z-index: 5; 
        }
        h1, p { 
            text-align: center; 
            position: relative; 
            z-index: 5; 
            text-transform: uppercase; 
        }
        h1 { margin: 40px 0 5px; font-size: 2.5rem; }
        p { color: #888; font-size: 0.8rem; margin: 0 0 20px; }
        .card { 
            background: #111; 
            border: 1px solid #222; 
            border-radius: 8px; 
            padding: 15px; 
            margin-bottom: 12px; 
            cursor: pointer; 
        }
        .card:hover { border-color: #fff; }
        h3 { margin: 0 0 4px; text-transform: uppercase; font-size: 1rem; color: #fff; }
        span { font-size: 0.75rem; color: #666; }
        
        /* Premium Floating Fluid Wave Area */
        .wave-container { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            z-index: 1; 
        }
        canvas { display: block; width: 100%; height: 100%; }
        
        /* Bottom Request Drawer */
        .drawer { 
            position: fixed; 
            bottom: 0; 
            left: 50%; 
            transform: translate(-50%, 100%); 
            width: 100%; 
            max-width: 400px; 
            background: #111; 
            border-top: 2px solid #222; 
            border-radius: 16px 16px 0 0; 
            padding: 20px; 
            z-index: 10; 
            transition: transform 0.3s; 
            color: #fff; 
        }
        .drawer.open { transform: translate(-50%, 0); }
        .overlay { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            background: rgba(0,0,0,0.7); 
            display: none; 
            z-index: 9; 
        }
        .overlay.open { display: block; }
        label { display: block; margin: 12px 0 4px; font-size: 0.75rem; color: #888; text-transform: uppercase; }
        input, textarea { width: 100%; padding: 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: #fff; }
        textarea { height: 70px; resize: none; }
        button { 
            width: 100%; 
            padding: 14px; 
            background: #fff; 
            color: #000; 
            border: none; 
            border-radius: 6px; 
            font-weight: 700; 
            margin-top: 15px; 
            cursor: pointer; 
            text-transform: uppercase; 
        }

        /* --- PREMIUM TRANSFORMING MENU BUTTON --- */
        .menu-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            background: #111;
            border: 1px solid #222;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 100;
            transition: all 0.3s ease;
        }
        .menu-btn:hover { border-color: #fff; }
        .menu-btn .line {
            width: 24px;
            height: 2px;
            background: #fff;
            margin: 3px 0;
            transition: all 0.3s ease;
            border-radius: 2px;
        }
        .menu-btn.open {
            background: #000;
            border-color: #fff;
            border-radius: 12px;
        }
        .menu-btn.open .line:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
            width: 28px;
        }
        .menu-btn.open .line:nth-child(2) {
            opacity: 0;
            transform: scale(0);
        }
        .menu-btn.open .line:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
            width: 28px;
        }

        /* --- SIDEBAR MENU & MEGA.AI STYLING --- */
        .sidebar {
            position: fixed;
            top: 0;
            right: -320px;
            width: 320px;
            height: 100vh;
            background: #0a0a0a;
            border-left: 1px solid #222;
            z-index: 90;
            transition: right 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
            padding: 80px 20px 20px;
            display: flex;
            flex-direction: column;
        }
        .sidebar.open { right: 0; }
        
        .ai-container {
            background: #111;
            border: 1px solid #222;
            border-radius: 12px;
            padding: 15px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .ai-header {
            font-weight: bold;
            font-size: 1.1rem;
            letter-spacing: 1px;
            border-bottom: 1px solid #222;
            padding-bottom: 10px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .ai-header::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #00ff66;
            border-radius: 50%;
            box-shadow: 0 0 8px #00ff66;
        }
        .ai-bubble {
            background: #1a1a1a;
            border: 1px solid #222;
            padding: 12px;
            border-radius: 8px;
            font-size: 0.85rem;
            line-height: 1.4;
            color: #ccc;
            margin-bottom: 15px;
        }
        .ai-bubble strong { color: #fff; }
        .ai-hint-btn {
            background: #222;
            border: 1px solid #333;
            color: #fff;
            padding: 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            cursor: pointer;
            text-align: center;
            transition: background 0.2s;
            text-transform: uppercase;
            font-weight: 600;
        }
        .ai-hint-btn:hover { background: #333; border-color: #444; }

        @keyframes pulseAlert {
            0% { border-color: #222; }
            50% { border-color: #00ff66; }
            100% { border-color: #222; }
        }
        .repair-flash { animation: pulseAlert 0.8s ease 2; }
    </style>
</head>
<body>

    <!-- Menu Trigger Button -->
    <div class="menu-btn" id="menuToggle" onclick="toggleMenu()">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
    </div>

    <!-- Sidebar Navigation with MEGA.AI Workspace -->
    <div class="sidebar" id="sideNav">
        <div class="ai-container">
            <div>
                <div class="ai-header">MEGA.AI CORE</div>
                <div class="ai-bubble" id="aiResponse">
                    Greetings! I am your dynamic recovery assistant. If you experience performance lags or rendering issues on our engine dashboard, simply <strong>tap the fluid wave 3 times</strong> or shake your terminal window to safely reset configuration loops!
                </div>
            </div>
            <button class="ai-hint-btn" onclick="triggerManualReset()">Execute Self-Repair</button>
        </div>
    </div>

    <div class="wave-container" id="waveBox">
        <canvas id="waveCanvas"></canvas>
    </div>

    <h1>MEGAHUB</h1>
    <p>DESIGNED & OWNED BY: HADI</p>

    <div class="panel" id="mainPanel">
        <div class="card" onclick="op('Recovery Desk')">
            <h3>Recovery Desk</h3>
            <span>Appeal system bans / restore blocked accounts</span>
        </div>
        <div class="card" onclick="op('Acc Engagement Increaser')">
            <h3>Acc Engagement Increaser</h3>
            <span>Follower and views increase engine boost</span>
        </div>
        <div class="card" onclick="op('Buy Old Instagram Accounts')">
            <h3>Buy Old Instagram Accounts</h3>
            <span>Old Instagram profiles available</span>
        </div>
    </div>

    <div class="overlay" id="bg" onclick="clAll()"></div>

    <div class="drawer" id="box">
        <h2 id="title" style="margin:0 0 15px;text-transform:uppercase;font-size:1.25rem;">Route</h2>
        <form action="/submit-ticket" method="POST">
            <input type="hidden" id="route" name="serviceType">
            <label>Your Username</label>
            <input type="text" name="targetUser" required placeholder="@username">
            <label>Contact Info</label>
            <input type="text" name="contactPhone" required placeholder="Phone or email">
            <label>Explain Your Problem</label>
            <textarea name="customerNotes" maxlength="150" required placeholder="What help do you need with your platform?"></textarea>
            <button type="submit">Confirm Request</button>
        </form>
    </div>

    <script>
        const box = document.getElementById('box');
        const bg = document.getElementById('bg');
               const title = document.getElementById('title');
        const route = document.getElementById('route');
        const menuToggle = document.getElementById('menuToggle');
        const sideNav = document.getElementById('sideNav');
        const mainPanel = document.getElementById('mainPanel');
        const aiResponse = document.getElementById('aiResponse');

        function op(name) { 
            title.textContent = name; 
            route.value = name; 
            box.classList.add('open'); 
            bg.classList.add('open'); 
        }
        function cl() { 
            box.classList.remove('open'); 
            bg.classList.remove('open'); 
        }

        function toggleMenu() {
            menuToggle.classList.toggle('open');
            sideNav.classList.toggle('open');
            if(sideNav.classList.contains('open')) {
                bg.classList.add('open');
            } else if(!box.classList.contains('open')) {
                bg.classList.remove('open');
            }
        }

        function clAll() {
            cl();
            menuToggle.classList.remove('open');
            sideNav.classList.remove('open');
        }

        const canvas = document.getElementById('waveCanvas');
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const POINTS = 22;
        let BASE_Y = height * 0.81; 
        const TENSION = 0.015;
        const DAMPING = 0.96;

        let springs = [];
        function initSprings() {
            springs = [];
            for (let i = 0; i < POINTS; i++) {
                springs.push({ y: BASE_Y, targetY: BASE_Y, vel: 0 });
            }
        }
        initSprings();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            BASE_Y = height * 0.81;
            initSprings();
        });

        function splash(x, force) {
            const idx = Math.floor((x / width) * POINTS);
            if (idx >= 0 && idx < POINTS) springs[idx].vel = force;
        }

        let lastTap = 0;
        let tapCount = 0;
        let lastX, lastY, lastZ;
        let lastMoveTime = 0;
        const SHAKE_THRESHOLD = 15; 

        function trigger(e) {
            const r = canvas.getBoundingClientRect();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            splash(cx - r.left, 16); 

            const now = Date.now();
            if (now - lastTap < 400) {
                tapCount++;
                if (tapCount === 3) executeWaveReset();
            } else {
                tapCount = 1;
            }
            lastTap = now;
        }

        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (e) => {
                const acc = e.accelerationIncludingGravity;
                if (!acc) return;
                const curTime = Date.now();
                if ((curTime - lastMoveTime) > 100) {
                    const diffTime = curTime - lastMoveTime;
                    lastMoveTime = curTime;
                    const speed = Math.abs(acc.x + acc.y + acc.z - lastX - lastY - lastZ) / diffTime * 10000;
                    if (speed > SHAKE_THRESHOLD) executeWaveReset();
                    lastX = acc.x; lastY = acc.y; lastZ = acc.z;
                }
            }, false);
        }

        function executeWaveReset() {
            initSprings(); 
            if (navigator.vibrate) navigator.vibrate(150); 
            mainPanel.classList.add('repair-flash');
            aiResponse.innerHTML = "⚡ <strong>SYSTEM RESTORED:</strong> Diagnostics complete! Fluid wave engine re-calibrated successfully.";
            setTimeout(() => mainPanel.classList.remove('repair-flash'), 1600);
            tapCount = 0;
        }

        function triggerManualReset() {
            executeWaveReset();
            clAll();
        }

        canvas.addEventListener('mousedown', trigger);
        canvas.addEventListener('touchstart', trigger, { passive: true });

        let t = 0;
        function loop() {
            t += 0.03;
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < POINTS; i++) {
                springs[i].targetY = BASE_Y + Math.sin(t + i * 0.5) * 8;
                let diff = springs[i].y - springs[i].targetY;
                springs[i].vel += -TENSION * diff - springs[i].vel * (1 - DAMPING);
                springs[i].y += springs[i].vel;
            }
            let l = new Array(POINTS).fill(0), r = new Array(POINTS).fill(0);
            for (let k = 0; k < 4; k++) {
                for (let i = 0; i < POINTS; i++) {
                    if (i > 0) { l[i] = 0.18 * (springs[i].y - springs[i-1].y); springs[i-1].vel += l[i]; }
                    if (i < POINTS - 1) { r[i] = 0.18 * (springs[i].y - springs[i+1].y); springs[i+1].vel += r[i]; }
                }
            }
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(0, height);
            ctx.lineTo(0, springs[0].y);
            for (let i = 0; i < POINTS - 1; i++) {
                const xc = (i * (width / (POINTS - 1)) + (i + 1) * (width / (POINTS - 1))) / 2;
                const yc = (springs[i].y + springs[i + 1].y) / 2;
                ctx.quadraticCurveTo(i * (width / (POINTS - 1)), springs[i].y, xc, yc);
            }
            ctx.lineTo(width, springs[POINTS - 1].y);
            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();
            requestAnimationFrame(loop);
        }
        loop();
    </script>
</body>
</html>
\`;

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(UI);
});

app.post('/submit-ticket', (req, res) => {
    const { serviceType, targetUser, contactPhone, customerNotes } = req.body;
    const msg = "🚨 MEGAHUB ALERT 🚨\\n\\n• SERVICE: " + serviceType + "\\n• CUSTOMER: " + targetUser + "\\n• CONTACT: " + contactPhone + "\\n\\n• USER NOTES:\\n" + customerNotes;
    const buf = Buffer.from(msg, 'utf-8');
    const opt = {
        hostname: 'ntfy.sh',
        path: '/' + TOPIC,
        method: 'POST',
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': buf.length }
    };
    const nreq = https.request(opt, () => { res.redirect(302, '/'); });
    nreq.on('error', (e) => { res.status(500).send('TRANSMISSION FAILURE: ' + e.message); });
    nreq.write(buf);
    nreq.end();
});

module.exports = app;
