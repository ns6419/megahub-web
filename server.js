const express = require('express');
const axios = require('axios');

const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988'; 
const ADMIN_USER = 'ADMIN';
const ADMIN_PASS = 'MEGAHUBSECRET2026';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let localTicketsMemory = [];

app.get('/', function (req, res) {
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
        <form action="/submit-ticket" method="POST">
            <input type="hidden" name="serviceType" id="serviceTypeInput">
            <label>CHOOSE PLATFORM NETWORK</label>
            <div class="logo-grid">
                <div class="logo-item selected" onclick="selectPlatform(this, 'INSTAGRAM')">
                    <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    <span>INSTAGRAM</span>
                </div>
                <div class="logo-item" onclick="selectPlatform(this, 'FACEBOOK')">
                    <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span>FACEBOOK</span>
                </div>
                <div class="logo-item" onclick="selectPlatform(this, 'TIKTOK')">
                    <svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.6 4.17 1.22 1.43 2.97 2.34 4.83 2.61v3.6c-1.63-.03-3.23-.49-4.62-1.36-.23-.15-.45-.3-.67-.47-.04 2.89-.04 5.79-.05 8.68-.07 2.29-.75 4.59-2.09 6.47a9.42 9.42 0 01-8.23 4.26 9.5 9.5 0 01-6.19-2.5 9.77 9.77 0 01-3.04-6.49 9.68 9.68 0 013.25-8.28A9.39 9.39 0 0110.1 5.31c.01 1.43.01 2.86.01 4.28a5.27 5.27 0 00-3.32 1.7 5.16 5.16 0 00-1.37 3.52c.03 1.25.56 2.47 1.47 3.33a5.35 5.35 0 005.19 1.42 5.24 5.24 0 003.74-4.52c.07-2.53.04-5.06.05-7.58-.01-2.5-.01-5-.02-7.49z"/></svg>
                    <span>TIKTOK</span>
                </div>
            </div>
    
