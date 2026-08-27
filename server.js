const express = require('express');
const https = require('https');
const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serves the full premium dashboard with the interactive swipe/scroll white wave background
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
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
            
            /* Fluid Liquid Wave Background */
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

            /* Main Premium App Interface Layout */
            .app-container {
                position: relative;
                z-index: 10;
                max-width: 500px;
                margin: 0 auto;
                text-align: center;
                min-height: 120vh; /* Ensures scrolling capability for swipe animations */
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
                display: flex;
                align-items: center;
            }
            .section-label::before {
                content: "|";
                color: #fff;
                margin-right: 8px;
                font-weight: 900;
            }

            /* Interactive Dashboard Action Cards */
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
                transition: transform 0.2s, border-color 0.2s;
                cursor: pointer;
            }
            .route-card:active {
                transform: scale(0.98);
                border-color: #555;
            }

            .card-icon {
                font-size: 1.8rem;
                margin-right: 20px;
                width: 40px;
                text-align: center;
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
                line-height: 1.3;
            }

            .card-arrow {
                font-size: 1.2rem;
                color: #444;
                margin-left: 10px;
            }
        </style>
    </head>
    <body>

        <!-- Animated Wave Canvas Background -->
        <div class="wave-container">
            <canvas id="waveCanvas"></canvas>
        </div>

        <!-- Dashboard User Interface Elements -->
        <div class="app-container">
            <h1 class="main-title">Megahub</h1>
            <div class="subtitle">// Premium Social Architecture System Module</div>

            <a href="#" class="security-btn">Access Security App Module</a>

            <div class="section-label">Choose Operational Route</div>

            <!-- Route 1: Recovery Desk -->
            <div class="route-card" onclick="submitPipeline('RECOVERY DESK', 'INSTAGRAM')">
                <div class="card-icon">🛡️</div>
                <div class="card-body">
                    <div class="card-title">Recovery Desk</div>
                    <div class="card-desc">Appeal System Bans /<br>Restore Blocked Accounts</div>
                </div>
                <div class="card-arrow">➔</div>
            </div>

            <!-- Route 2: Account Engagement Increaser -->
            <div class="route-card" onclick="submitPipeline('ACC ENGAGEMENT INCREASER', 'INSTAGRAM')">
                <div class="card-icon">📈</div>
                <div class="card-body">
                    <div class="card-title">Acc Engagement Increaser</div>
                    <div class="card-desc">Follower and Views<br>Increase Engine Boost</div>
                </div>
                <div class="card-arrow">➔</div>
            </div>

            <!-- Route 3: Buy Accounts -->
            <div class="route-card" onclick="submitPipeline('BUY OLD INSTAGRAM ACCOUNTS', 'MARKETPLACE')">
                <div class="card-icon">🛍️</div>
                <div class="card-body">
                    <div class="card-title">Buy Old Instagram Accounts</div>
                    <div class="card-desc">Old Insta Accounts /<br>Old Insta Unc's Available</div>
                </div>
                <div class="card-arrow">➔</div>
            </div>
        </div>

        <script>
            // 🌊 Dynamic Interactive Swipe Wave Logic
            const canvas = document.getElementById('waveCanvas');
            const ctx = canvas.getContext('2d');

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            let targetHeightFactor = 0.15; 
            let currentHeightFactor = 0.15;
            let lastScrollY = window.scrollY;

            // Track swipe up/down motion via page scrolling events
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > lastScrollY) {
                    // Swiping Up -> Wave retreats down out of view
                    targetHeightFactor = 0.05;
                } else if (currentScrollY < lastScrollY) {
                    // Swiping Down -> White wave fluid builds up on viewport
                    targetHeightFactor = 0.40;
                }
                
                clearTimeout(window.scrollTimeout);
                window.scrollTimeout = setTimeout(() => {
                    targetHeightFactor = 0.15; // Returns to resting baseline height smoothly
                }, 500);

                lastScrollY = currentScrollY;
            });

            let animationTick = 0;
            function animate() {
                animationTick += 0.025;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                currentHeightFactor += (targetHeightFactor - currentHeightFactor) * 0.08;
                const waveBaseY = canvas.height * (1 - currentHeightFactor);

                // Drawing fluid solid wave layout overlay
                ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                ctx.beginPath();
                ctx.moveTo(0, canvas.height);
                ctx.lineTo(0, waveBaseY);

                for (let x = 0; x <= canvas.width; x++) {
                    const y = waveBaseY + 
                              Math.sin(x * 0.006 + animationTick) * 18 + 
                              Math.cos(x * 0.012 + animationTick * 0.6) * 8;
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(canvas.width, canvas.height);
                ctx.closePath();
                ctx.fill();

                requestAnimationFrame(animate);
            }
            animate();

            // Pipeline handler engine to process card clicks seamlessly
            function submitPipeline(serviceType, platform) {
                fetch('/submit-ticket', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        serviceType: serviceType,
                        platform: platform,
                        
