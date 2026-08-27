const express = require('express');
const https = require('https');
const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988'; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MEGAHUB | PREMIUM SOCIAL INFRASTRUCTURE</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; text-transform: uppercase; font-weight: 950; letter-spacing: 2px; }
            body { background-color: #000000; color: #ffffff; padding: 20px; overflow-x: hidden; position: relative; min-height: 100vh; }
            #waveCanvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; pointer-events: none; }
            .container { max-width: 600px; margin: 0 auto; padding-bottom: 120px; position: relative; z-index: 2; }
            header { text-align: center; margin: 50px 0; }
            header h1 { font-size: 3rem; letter-spacing: 8px; line-height: 1; }
            header p { color: #555; font-size: 0.8rem; margin-top: 10px; }
            .btn-download { display: block; background: #000000; color: #fff; text-align: center; padding: 18px; border: 2px solid #ffffff; text-decoration: none; border-radius: 40px; margin-top: 30px; font-size: 0.9rem; }
            .section-title { font-size: 0.9rem; border-left: 4px solid #ffffff; padding-left: 10px; margin-bottom: 20px; margin-top: 40px; }
            .services-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
            .option-card { background: rgba(5, 5, 5, 0.8); border: 2px solid #222; padding: 24px; border-radius: 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; backdrop-filter: blur(5px); transition: all 0.3s ease; }
            .option-card:hover { border-color: #ffffff; background: rgba(15, 15, 15, 0.9); }
            .option-card-left { display: flex; align-items: center; gap: 20px; }
            .option-card p { color: #555; font-size: 0.75rem; margin-top: 6px; line-height: 1.4; font-weight: 800; }
            .premium-icon { width: 32px; height: 32px; stroke: #ffffff; stroke-width: 2; fill: none; flex-shrink: 0; }
            .arrow-icon { stroke: #555; stroke-width: 2.5; fill: none; width: 24px; height: 24px; transition: all 0.3s; }
            .option-card:hover .arrow-icon { stroke: #ffffff; transform: translateX(4px); }
            .drawer-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); opacity: 0; pointer-events: none; transition: opacity 0.4s; z-index: 999; }
            .drawer-overlay.active { opacity: 1; pointer-events: auto; }
            .slide-drawer { position: fixed; bottom: 0; left: 0; width: 100%; background: #000000; border-top: 2px solid #ffffff; border-top-left-radius: 30px; border-top-right-radius: 30px; padding: 40px 24px; transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.1, 0.76, 0.55, 0.94); z-index: 1000; max-height: 90vh; overflow-y: auto; color: #ffffff; }
            .slide-drawer.active { transform: translateY(0); }
            .drawer-handle { width: 50px; height: 6px; background: #333; border-radius: 10px; margin: -20px auto 30px auto; }
            label { display: block; font-size: 0.75rem; margin-bottom: 12px; margin-top: 25px; color: #ffffff; }
            input, textarea { width: 100%; padding: 16px; background: #000000; border: 2px solid #333; color: #ffffff; border-radius: 14px; font-size: 1rem; }
            input:focus, textarea:focus { border-color: #ffffff; outline: none; }
            textarea { resize: none; font-family: sans-serif; text-transform: uppercase; }
            .logo-grid { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
            .logo-grid::-webkit-scrollbar { display: none; }
            .logo-item { background: #000000; border: 2px solid #333; border-radius: 14px; padding: 22px 28px; text-align: center; cursor: pointer; flex-shrink: 0; color: #555; }
            .logo-item.selected { border-color: #ffffff; background: #ffffff; color: #000000; }
            .btn-submit { background: #ffffff; color: #000000; padding: 18px; border-radius: 40px; border: none; width: 100%; margin-top: 35px; cursor: pointer; font-weight: 950; letter-spacing: 2px; }
            body.light-theme { color: #000000; }
            body.light-theme header p { color: #666; }
            body.light-theme .section-title { border-left-color: #000000; }
            body.light-theme .option-card { background: rgba(255,255,255,0.8); border-color: #ddd; }
            body.light-theme .option-card h3 { color: #000000; }
            body.light-theme .option-card p { color: #666; }
            body.light-theme .premium-icon { stroke: #000000; }
            body.light-theme .arrow-icon { stroke: #666; }
            body.light-theme .option-card:hover { border-color: #000000; background: rgba(245,245,245,0.9); }
            body.light-theme .option-card:hover .arrow-icon { stroke: #000000; }
        </style>
    </head>
    <body>
    <canvas id="waveCanvas"></canvas>
    <div class="container">
        <header>
            <h1>MEGAHUB</h1>
            <p>// PREMIUM SOCIAL ARCHITECTURE SYSTEM MODULE</p>
            <a href="#" class="btn-download">ACCESS SECURITY APP MODULE</a>
        </header>
        <div class="section-title">CHOOSE OPERATIONAL ROUTE</div>
        <div class="services-grid">
            <div class="option-card" onclick="openDrawer('ACCOUNT RECOVERY')">
                <div class="option-card-left">
                    <svg class="premium-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <div><h3>RECOVERY DESK</h3><p>APPEAL SYSTEM BANS / RESTORE BLOCKED ACCOUNTS</p></div>
                </div>
                <div><svg class="arrow-icon" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            </div>
            <div class="option-card" onclick="openDrawer('ACCOUNT ENGAGEMENT INCREASER')">
                <div class="option-card-left">
                    <svg class="premium-icon" viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <div><h3>ACC ENGAGEMENT INCREASER</h3><p>FOLLOWER AND VIEWS INCREASE ENGINE BOOST</p></div>
                </div>
                <div><svg class="arrow-icon" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            </div>
            <div class="option-card" onclick="openDrawer('BUY OLD INSTAGRAM ACCOUNTS')">
                <div class="option-card-left">
                    <svg class="premium-icon" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <div><h3>BUY OLD INSTAGRAM ACCOUNTS</h3><p>OLD INSTA ACCOUNTS / OLD INSTA UNC'S AVAILABLE</p></div>
                </div>
                <div><svg class="arrow-icon" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            </div>
        </div>
    </div>
    <div class="drawer-overlay" id="overlay" onclick="closeDrawer()"></div>
    <div class="slide-drawer" id="drawer">
        <div class="drawer-handle" onclick="closeDrawer()"></div>
        <h2 id="drawer-title">ROUTE CONFIGURATION</h2>
        <form action="/submit-ticket" method="POST">
            <input type="hidden" name="serviceType" id="serviceTypeInput">
            <input type="hidden" name="platform" id="platformInput" value="INSTAGRAM">
            <label>CHOOSE PLATFORM NETWORK</label>
            <div class="logo-grid">
                <div class="logo-item selected" onclick="selectPlatform(this, 'INSTAGRAM')">INSTAGRAM</div>
                <div class="logo-item" onclick="selectPlatform(this, 'FACEBOOK')">FACEBOOK</div>
                <div class="logo-item" onclick="selectPlatform(this, 'TIKTOK')">TIKTOK</div>
                <div class="logo-item" onclick="selectPlatform(this, 'SNAPCHAT')">SNAPCHAT</div>
                <div class="logo-item" onclick="selectPlatform(this, 'YOUTUBE')">YOUTUBE</div>
                <div class="logo-item" onclick="selectPlatform(this, 'WHATSAPP')">WHATSAPP</div>
            </div>
            <label>TARGET ACCOUNT USERNAME</label>
            <input type="text" name="targetUser" placeholder="@USERNAME" required>
            <label>YOUR CONTACT WHATSAPP NUMBER</label>
            <input type="tel" name="contactPhone" placeholder="+1234567890" required>
            <label>SPECIFY WHAT HELP YOU NEED</label>
            <textarea name="customerNotes" rows="3" placeholder="UNBAN MY ACCOUNT / NEED 10K FOLLOWERS..." required></textarea>
            <button type="submit" class="btn-submit">INITIALIZE ROUTE REQUEST</button>
        </form>
    </div>
    <script>
        const canvas = document.getElementById('waveCanvas');
        const ctx = canvas.getContext('2d');
        let scrollPercent = 0;
        function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        window.addEventListener('resize', resizeCanvas); resizeCanvas();
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;
            
