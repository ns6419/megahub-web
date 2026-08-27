const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const NTFY_TOPIC = 'megahub_alerts_9988'; 
const ADMIN_USER = 'ADMIN';
const ADMIN_PASS = 'MEGAHUBSECRET2026';

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'SCREENSHOT-' + uniqueSuffix + path.extname(file.originalname).toUpperCase());
    }
});
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const getTickets = () => {
    const dbPath = path.join(__dirname, 'database.json');
    if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};
const saveTickets = (tickets) => {
    fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify(tickets, null, 2));
};

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MEGAHUB | PREMIUM SOCIAL INFRASTRUCTURE</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-tap-highlight-color: transparent; text-transform: uppercase; font-weight: 950; letter-spacing: 2px; }
            body { background-color: #000000; color: #ffffff; padding: 20px; overflow-x: hidden; }
            .container { max-width: 600px; margin: 0 auto; padding-bottom: 120px; }
            header { text-align: center; margin: 50px 0; }
            header h1 { font-size: 3rem; font-weight: 950; letter-spacing: 8px; line-height: 1; }
            header p { color: #444; font-size: 0.8rem; margin-top: 10px; letter-spacing: 3px; }
            .btn-download { display: block; background: #0d0d0d; color: #fff; text-align: center; padding: 18px; border: 2px solid #1c1c1c; text-decoration: none; border-radius: 40px; font-size: 0.85rem; letter-spacing: 3px; margin-top: 30px; transition: all 0.3s ease; }
            .btn-download:hover { background: #ffffff; color: #000000; border-color: #ffffff; }
            .section-title { font-size: 0.9rem; color: #ffffff; border-left: 4px solid #ffffff; padding-left: 10px; margin-bottom: 20px; margin-top: 40px; }
            .services-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
            .option-card { background: #050505; border: 2px solid #111; padding: 24px; border-radius: 16px; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); display: flex; justify-content: space-between; align-items: center; }
            .option-card:active { transform: scale(0.98); background: #0c0c0c; }
            .option-card h3 { font-size: 1.1rem; font-weight: 950; letter-spacing: 1.5px; }
            .option-card p { color: #555; font-size: 0.75rem; margin-top: 6px; letter-spacing: 1px; font-weight: 800; }
            .arrow-icon { color: #333; font-size: 1.4rem; }
            .option-card:hover { border-color: #333; }
            .option-card:hover .arrow-icon { color: #fff; }
            .drawer-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); opacity: 0; pointer-events: none; transition: opacity 0.4s ease; z-index: 999; }
            .drawer-overlay.active { opacity: 1; pointer-events: auto; }
            .slide-drawer { position: fixed; bottom: 0; left: 0; width: 100%; background: #050505; border-top: 2px solid #1c1c1c; border-top-left-radius: 30px; border-top-right-radius: 30px; padding: 40px 24px; transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.1, 0.76, 0.55, 0.94); z-index: 1000; max-height: 90vh; overflow-y: auto; }
            .slide-drawer.active { transform: translateY(0); }
            .drawer-handle { width: 50px; height: 6px; background: #222; border-radius: 10px; margin: -20px auto 30px auto; }
            .drawer-header h2 { font-size: 1.5rem; font-weight: 950; letter-spacing: 3px; }
            .drawer-header p { color: #444; font-size: 0.8rem; margin-top: 5px; letter-spacing: 1.5px; }
            label { display: block; font-size: 0.75rem; color: #ffffff; letter-spacing: 2px; margin-bottom: 12px; margin-top: 25px; }
            input, textarea { width: 100%; padding: 16px; background: #0c0c0c; border: 2px solid #1a1a1a; color: #ffffff; border-radius: 14px; font-size: 1rem; letter-spacing: 1px; }
            input:focus, textarea:focus { border-color: #ffffff; outline: none; background: #111; }
            input::placeholder, textarea::placeholder { color: #333; }
            .logo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 15px; }
            .logo-item { background: #0c0c0c; border: 2px solid #1a1a1a; border-radius: 14px; padding: 22px 10px; text-align: center; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; }
            .logo-item svg { width: 34px; height: 34px; fill: #333; transition: fill 0.2s ease; margin-bottom: 10px; }
            .logo-item span { font-size: 0.7rem; color: #333; letter-spacing: 1px; font-weight: 900; }
            .logo-item.selected { border-color: #ffffff; background: #111; }
            .logo-item.selected svg { fill: #ffffff; }
            .logo-item.selected span { color: #ffffff; }
            .file-wrapper { position: relative; overflow: hidden; display: inline-block; width: 100%; }
            .file-btn { border: 2px dashed #222; color: #444; background: #0c0c0c; padding: 16px; border-radius: 14px; width: 100%; display: block; text-align: center; font-size: 0.85rem; cursor: pointer; }
            .file-wrapper input[type=file] { font-size: 100px; position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; }
            .btn-submit { background: #ffffff; color: #000000; font-weight: 950; letter-spacing: 3px; padding: 18px; border-radius: 40px; border: none; width: 100%; cursor: pointer; margin-top: 35px; font-size: 1rem; box-shadow: 0 4px 20px rgba(255,255,255,0.15); }
            .whatsapp-float { position: fixed; bottom: 30px; right: 30px; width: 65px; height: 65px; background-color: #ffffff; border-radius: 50px; display: flex; justify-content: center; align-items: center; box-shadow: 0 6px 25px rgba(255,255,255,0.2); z-index: 998; text-decoration: none; transition: transform 0.2s ease; }
            .whatsapp-float:active { transform: scale(0.9); }
            .whatsapp-svg { width: 28px; height: 28px; fill: #000000; }
        </style>
    </head>
    <body>
    <div class="container">
        <header>
            <h1>MEGAHUB</h1>
            <p>// PREMIUM SOCIAL ARCHITECTURE SYSTEM MODULE</p>
            <a href="#" class="btn btn-download">👑 ACCESS SECURITY APP MODULE</a>
        </header>
        <div class="section-title">CHOOSE OPERATIONAL ROUTE</div>
        <div class="services-grid">
            <div class="option-card" onclick="openDrawer('ACCOUNT RECOVERY')">
                <div>
                    <h3>🛡️ RECOVERY DESK SUPPORT</h3>
                    <p>APPEAL SYSTEM BANS AND ENFORCE RESTORATION</p>
                </div>
                <div class="arrow-icon">→</div>
            </div>
            <div class="option-card" onclick="openDrawer('FOLLOWER PACKAGES')">
                <div>
                    <h3>📈 GROWTH METRIC INJECTION</h3>
                    <p>DEPLOY HIGH RETENTION METRIC ENGINE BOOSTS</p>
                </div>
                <div class="arrow-icon">→</div>
            </div>
            <div class="option-card" onclick="openDrawer('BUY AGED PROFILE')">
                <div>
                    <h3>🛍️ SECURED ASSET REPOSITORY</h3>
                    <p>BROWSE HANDLES AND AUTHENTICATED CHANNELS</p>
                </div>
                <div class="arrow-icon">→</div>
            </div>
        </div>
    </div>
    <div class="drawer-overlay" id="overlay" onclick="closeDrawer()"></div>
    <div class="slide-drawer" id="drawer">
        <div class="drawer-handle" onclick="closeDrawer()"></div>
        <div class="drawer-header">
            <h2 id="drawer-title">ROUTE CONFIGURATION</h2>
            <p>// PROVIDE ESSENTIAL SPECIFICATIONS BELOW</p>
        </div>
        <form action="/submit-ticket" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="serviceType" id="serviceTypeInput">
            <label>CHOOSE PLATFORM NETWORK</label>
            <div class="logo-grid">
                <div class="logo-item selected" onclick="selectPlatform(this, 'INSTAGRAM')">
