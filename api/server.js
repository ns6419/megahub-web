const express = require('express');
const https = require('https');
const app = express();
const TOPIC = 'megahub_alerts_9988';
const NTFY_TOPIC = 'megahub_alerts_9988';

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
    </style>
            .top-navbar { position: fixed; top: 0; left: 0; width: 100%; height: 60px; display: flex; align-items: center; padding: 0 20px; z-index: 20; background: transparent; }
        .menu-trigger { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; width: 24px; height: 16px; padding: 0; z-index: 21; }
        .menu-trigger span { display: block; width: 100%; height: 2.5px; background-color: #fff; border-radius: 2px; transition: all 0.3s ease; }
        .nav-section { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0d0d0d; z-index: 30; transform: translateX(-100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); padding: 20px; display: flex; flex-direction: column; }
        .nav-section.active { transform: translateX(0); }
        .nav-header { display: flex; align-items: center; justify-content: space-between; width: 100%; height: 60px; margin-bottom: 40px; }
        .logo-brand-combo { display: flex; align-items: center; gap: 12px; }
        .app-logo { width: 44px; height: 44px; opacity: 0; transform: scale(0.6) rotate(-45deg); transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s; }
        .nav-section.active .app-logo { opacity: 1; transform: scale(1) rotate(0deg); }
        .sliding-title { font-size: 1.5rem; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #fff; opacity: 0; transform: translateX(-20px); transition: all 0.4s ease 0.4s; }
        .nav-section.active .sliding-title { opacity: 1; transform: translateX(0); }
        .close-btn { background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; line-height: 1; padding: 5px; }
        .ai-section-box { background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%); border: 1px solid #262626; border-radius: 16px; padding: 24px; position: relative; overflow: hidden; margin: 0 auto; max-width: 400px; width: 100%; }
        .ai-section-box::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, #ffffff, #444444); }
        .ai-badge { background: #fff; color: #000; font-size: 0.65rem; font-weight: bold; padding: 3px 8px; border-radius: 20px; text-transform: uppercase; display: inline-block; margin-bottom: 12px; }
        .ai-title { margin: 0 0 8px 0; font-size: 1.25rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .ai-desc { color: #a3a3a3; font-size: 0.85rem; line-height: 1.4; margin: 0 0 20px 0; }
        .ai-action-btn { width: 100%; padding: 14px; background: #ffffff; color: #000000; border: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; font-size: 0.85rem; cursor: pointer; }
        
</head>
<body>

    <div class="wave-container" id="waveBox">
        <canvas id="waveCanvas"></canvas>
    </div>
        <!-- Pinned Top Navbar Trigger Row -->
    <div class="top-navbar">
        <button class="menu-trigger" onclick="toggleMenu(true)">
            <span></span><span></span><span></span>
        </button>
    </div>

    <!-- Pinned Slide-Out Full Screen Sidebar Navigation Overlay Frame -->
    <div class="nav-section" id="navSection">
        <div class="nav-header">
            <div class="logo-brand-combo">
                <!-- Custom "M" Embedded SVG Vector App Icon Matrix -->
                <svg class="app-logo" viewBox="0 0 100 100" xmlns="http://w3.org">
                    <rect x="2" y="2" width="96" height="96" rx="26" fill="#171717" stroke="#333" stroke-width="2"/>
                    <path d="M 28 66 C 26 38, 44 32, 44 48 C 44 54, 50 60, 50 60 C 50 60, 56 54, 56 48 C 56 32, 74 38, 72 66" fill="none" stroke="#ffffff" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M 38 46 L 50 56 L 62 46" fill="none" stroke="#ffffff" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="sliding-title">Megahub</div>
            </div>
            <button class="close-btn" onclick="toggleMenu(false)">&times;</button>
        </div>
        <div class="ai-section-box">
            <span class="ai-badge">System Core</span>
            <h4 class="ai-title">MEGA.AI SUPPORT</h4>
            <p class="ai-desc">Is the website crashing, or are you facing issues with your account boost configurations? Run our diagnostic core to repair system routes automatically.</p>
            <button class="ai-action-btn" onclick="runAIDiagnostics()">Launch AI Recovery</button>
        </div>
    </div>
    

    <h1>MEGAHUB</h1>
    <p>DESIGNED & OWNED BY: HADI</p>

    <div class="panel">
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

    <div class="overlay" id="bg" onclick="cl()"></div>

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
           function toggleMenu(open) {
            const nav = document.getElementById('navSection');
            if (open) { nav.classList.add('active'); } 
            else { nav.classList.remove('active'); }
        }

        function runAIDiagnostics() {
            alert("⚡ MEGA.AI SUPPORT: Diagnostics complete! System pipelines refreshed and account node routes stabilized successfully.");
            toggleMenu(false);
        }
        function op(name) { title.textContent = name; route.value = name; box.classList.add('open'); bg.classList.add('open'); }
        function cl() { box.classList.remove('open'); bg.classList.remove('open'); }

        // --- Premium Real Fluid Wave Physics Simulation Engine ---
        const canvas = document.getElementById('waveCanvas');
        const ctx = canvas.getContext('2d');
        const waveBox = document.getElementById('waveBox');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const POINTS = 22;
        const BASE_Y = height * 0.81; // Waves float calmly under your panel cards
        const TENSION = 0.015;
        const DAMPING = 0.96;

        let springs = [];
        for (let i = 0; i < POINTS; i++) {
            springs.push({ y: BASE_Y, targetY: BASE_Y, vel: 0 });
        }

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        function splash(x, force) {
            const idx = Math.floor((x / width) * POINTS);
            if (idx >= 0 && idx < POINTS) springs[idx].vel = force;
        }

        function trigger(e) {
            const r = canvas.getBoundingClientRect();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            splash(cx - r.left, 16); // Gives a deep premium splash ripple
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

            // Translucent glowing liquid white color brush overlay
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
`;

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(UI);
});

app.post('/submit-ticket', (req, res) => {
    const { serviceType, targetUser, contactPhone, customerNotes } = req.body;
    const msg = "🚨 MEGAHUB ALERT 🚨\n\n• ROUTE: " + serviceType + "\n• USER: " + targetUser + "\n• CONTACT: " + contactPhone + "\n\n• NOTES:\n" + customerNotes;
    const buf = Buffer.from(msg, 'utf-8');
    const opt = {
        hostname: 'ntfy.sh',
        path: '/' + TOPIC,
        method: 'POST',
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': buf.length }
    };
    const nreq = https.request(opt, () => {
        res.send('<body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;"><meta http-equiv="refresh" content="3;url=/"><h1>⚡ DATA TRANSMITTED ⚡</h1></body>');
    });
    nreq.on('error', (e) => { res.status(500).send('ERROR: ' + e.message); });
    nreq.write(buf);
    nreq.end();
});

module.exports = app;
