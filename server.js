const express = require('express');
const https = require('https');
const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988'; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Main Route
app.get('/', (req, res) => {
    res.send(HTML_PAGE);
});

// Submit Route Handler
app.post('/submit-ticket', (req, res) => {
    const { serviceType, platform, targetUser, contactPhone, customerNotes } = req.body;
    const textMsg = "NEW REQUEST - ROUTE: " + (serviceType || "NONE") + " - PLATFORM: " + (platform || "NONE") + " - USER: " + (targetUser || "NONE") + " - PHONE: " + (contactPhone || "NONE") + " - NOTES: " + (customerNotes || "NONE");
    const dataBuffer = Buffer.from(textMsg, 'utf-8');

    const options = {
        hostname: 'ntfy.sh',
        path: '/' + NTFY_TOPIC,
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Length': dataBuffer.length
        }
    };

    const ntfyReq = https.request(options, (ntfyRes) => {
        res.send(`<body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;letter-spacing:2px;"><meta http-equiv="refresh" content="3;url=/"><h1 style="font-size:2rem;color:#fff;margin-top:100px;">⚡ REQUEST RECEIVED ⚡</h1><p style="color:#666;margin-top:20px;">OPERATIONAL ENGINE DEPLOYED. RETURNING HOME...</p></body>`);
    });

    ntfyReq.on('error', (e) => { res.status(500).send('ERROR: ' + e.message); });
    ntfyReq.write(dataBuffer);
    ntfyReq.end();
});

// The local development port listener required by Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

// ==========================================
// PREMIUM FRONTEND WITH INTERACTIVE WAVE
// ==========================================
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEGAHUB BY HADI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background: #000;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
            padding: 40px 20px;
        }
        
        /* Interactive Swipe Wave Styling */
        .wave-container {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }
        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }

        /* Interface Wrapper */
        .app-container {
            position: relative;
            z-index: 10;
            max-width: 500px;
            margin: 0 auto;
            text-align: center;
            min-height: 110vh; /* Keeps space scrollable for wave swipes */
        }

        .main-title {
            font-size: 2.8rem;
            font-weight: 900;
            letter-spacing: 4px;
            margin-top: 20px;
            text-transform: uppercase;
        }

        .subtitle {
            font-size: 0.75rem;
            color: #666;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 5px;
            margin-bottom: 40px;
            font-weight: bold;
        }

        .security-btn {
            display: block;
            width: 100%;
            border: 2px solid #fff;
            background: transparent;
            color: #fff;
            padding: 18px;
            border-radius: 50px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-decoration: none;
            font-size: 0.85rem;
            margin-bottom: 50px;
        }

        .section-label {
            text-align: left;
            font-size: 0.9rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 20px;
            font-weight: bold;
        }

        /* Dashboard Menu Cards */
        .route-card {
            background: rgba(10, 10, 10, 0.85);
            border: 2px solid #222;
            border-radius: 20px;
            padding: 25px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            text-align: left;
            text-decoration: none;
            color: #fff;
            cursor: pointer;
            transition: border-color 0.2s;
        }
        .route-card:active {
            border-color: #555;
        }

        .card-icon {
            font-size: 1.8rem;
            margin-right: 20px;
            width: 40px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .card-body {
            flex-grow: 1;
        }

        .card-title {
            font-size: 1.1rem;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .card-desc {
            font-size: 0.7rem;
            color: #666;
            letter-spacing: 1px;
            text-transform: uppercase;
            line-height: 1.4;
        }

        .card-arrow {
            font-size: 1.2rem;
            color: #444;
            margin-left: 10px;
        }
    </style>
</head>
<body>

    <!-- Liquid Wave Canvas Element Layer -->
    <div class="wave-container">
        <canvas id="waveCanvas"></canvas>
    </div>

    <div class="app-container">
        <h1 class="main-title">Megahub</h1>
        <div class="subtitle">// Premium Social Architecture System Module</div>

        <a href="#" class="security-btn">Access Security App Module</a>

        <div class="section-label">| Choose Operational Route</div>

        <!-- Route Card 1 -->
        <div class="route-card" onclick="sendTicket('RECOVERY DESK')">
            <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="card-body">
                <div class="card-title">Recovery Desk</div>
                <div class="card-desc">Appeal System Bans /<br>Restore Blocked Accounts</div>
            </div>
            <div class="card-arrow">➔</div>
        </div>

        <!-- Route Card 2 -->
        <div class="route-card" onclick="sendTicket('ACC ENGAGEMENT INCREASER')">
            <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div class="card-body">
                <div class="card-title">Acc Engagement Increaser</div>
                <div class="card-desc">Follower and Views<br>Increase Engine Boost</div>
            </div>
            <div class="card-arrow">➔</div>
        </div>

        <!-- Route Card 3 -->
        <div class="route-card" onclick="sendTicket('BUY OLD INSTAGRAM ACCOUNTS')">
            <div class="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
            <div class="card-body">
                <div class="card-title">Buy Old Instagram Accounts</div>
                <div class="card-desc">Old Insta Accounts /<br>Old Insta Unc's Available</div>
            </div>
            <div class="card-arrow">➔</div>
        </div>
    </div>

    <script>
        // 🌊 Fluid Wave Mechanics
        const canvas = document.getElementById('waveCanvas');
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        let targetHeight = 0.15; 
        let currentHeight = 0.15;
        let lastY = window.scrollY;

        // Dynamic reactive response during swipe
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            if (currentY > lastY) {
                targetHeight = 0.05; // Swipe up moves wave down
            } else if (currentY < lastY) {
                targetHeight = 0.38; // Swipe down draws white water up
            }
            clearTimeout(window.wt);
            window.wt = setTimeout(() => { targetHeight = 0.15; }, 450);
            lastY = currentY;
        });

        let tick = 0;
        function loop() {
            tick += 0.025;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            currentHeight += (targetHeight - currentHeight) * 0.08;
            
            const baseY = canvas.height * (1 - currentHeight);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            ctx.lineTo(0, baseY);

            for (let x = 0; x <= canvas.width; x++) {
                const y = baseY + Math.sin(x * 0.006 + tick) * 16 + Math.cos(x * 0.012 + tick * 0.5) * 6;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.closePath();
            ctx.fill();
            requestAnimationFrame(loop);
        }
        loop();

