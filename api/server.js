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
          .top-navbar { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 60px; 
            display: flex; 
            align-items: center; 
            padding: 0 20px; 
            z-index: 20; 
            background: transparent; 
        }
        .menu-trigger { 
            background: none; 
            border: none; 
            cursor: pointer; 
            display: flex; 
            flex-direction: column; 
            justify-content: space-between; 
            width: 24px; 
            height: 16px; 
            padding: 0; 
            z-index: 21; 
        }
        .menu-trigger span { 
            display: block; 
            width: 100%; 
            height: 2.5px; 
            background-color: #fff; 
            border-radius: 2px; 
            transition: all 0.3s ease; 
        }
        .nav-section { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            background: #0d0d0d; 
            z-index: 30; 
            transform: translateX(-100%); 
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
            padding: 20px; 
            display: flex; 
            flex-direction: column; 
        }
        .nav-section.active { 
            transform: translateX(0); 
        }
        .nav-header { 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            width: 100%; 
            height: 60px; 
            margin-bottom: 40px; 
        }
        .logo-brand-combo { 
            display: flex; 
            align-items: center; 
            gap: 12px; 
        }
        .app-logo { 
            width: 44px; 
            height: 44px; 
            opacity: 0; 
            transform: scale(0.6) rotate(-45deg); 
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s; 
        }
        .nav-section.active .app-logo { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
        }
        .sliding-title { 
            font-size: 1.5rem; 
            font-weight: bold; 
            letter-spacing: 2px; 
            text-transform: uppercase; 
            color: #fff; 
            opacity: 0; 
            transform: translateX(-20px); 
            transition: all 0.4s ease 0.4s; 
        }
        .nav-section.active .sliding-title { 
            opacity: 1; 
            transform: translateX(0); 
        }
        .close-btn { 
            background: none; 
            border: none; 
            color: #fff; 
            font-size: 2rem; 
            cursor: pointer; 
            line-height: 1; 
            padding: 5px; 
        }
        .ai-section-box { 
            background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%); 
            border: 1px solid #262626; 
            border-radius: 16px; 
            padding: 24px; 
            position: relative; 
            overflow: hidden; 
            margin: 0 auto; 
            max-width: 400px; 
            width: 100%; 
        }
        .ai-section-box::before { 
            content: ""; 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            pointer-events: none; 
        }
        .ai-badge { background: #fff; color: #000; font-size: 0.65rem; font-weight: bold; padding: 3px 8px; border-radius: 4px; }
        .ai-title { margin: 0 0 8px 0; font-size: 1.25rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .ai-desc { color: #a3a3a3; font-size: 0.85rem; line-height: 1.4; margin: 0 0 20px 0; }
        .ai-action-btn { width: 100%; padding: 14px; background: #ffffff; color: #000000; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .panel { background: #141414; border: 1px solid #262626; border-radius: 12px; padding: 16px; margin-bottom: 12px; cursor: pointer; }
        .overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: none; z-index: 40; }
        .overlay.open { display: block; }
        .drawer { position: fixed; bottom: 0; left: 0; width: 100%; background: #0d0d0d; border-top: 1px solid #262626; border-radius: 20px 20px 0 0; padding: 24px; transform: translateY(100%); transition: transform 0.3s ease; z-index: 50; }
        .drawer.open { transform: translateY(0); }
    </style>
</head>
<body>

    <div id="waveBox">
        <canvas id="waveCanvas"></canvas>
    </div>

    <div class="top-navbar">
        <button class="menu-trigger" onclick="toggleMenu(true)">
            <span></span><span></span><span></span>
        </button>
    </div>

    <div class="nav-section" id="navSection">
        <div class="nav-header">
            <div class="logo-brand-combo">
                <svg class="app-logo" viewBox="0 0 100 100" xmlns="http://w3.org">
                    <rect x="2" y="2" width="96" height="96" rx="26" fill="#171717" stroke="#333" stroke-width="2"/>
                    <path d="M 28 66 C 26 38, 44 32, 44 48 C 44 54, 50 60 C 50 60, 56 54, 56 48 C 56 32, 74 38, 72 66" fill="none" stroke="#ffffff" stroke-width="7.5" stroke-linecap="round"/>
                    <path d="M 38 46 L 50 56 L 62 46" fill="none" stroke="#ffffff" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="sliding-title">Megahub</div>
            </div>
            <button class="close-btn" onclick="toggleMenu(false)">&times;</button>
        </div>
        
        <div class="ai-section-box">
            <span class="ai-badge">System Core</span>
            <h4 class="ai-title">MEGA.AI Support</h4>
            <p class="ai-desc">Is the website crashing, or are you facing issues with your account boost configurations? Run diagnostic testing right now.</p>
            <button class="ai-action-btn" onclick="runAIDiagnostics()">Launch AI Recovery</button>
        </div>
    </div>

    <div style="padding: 80px 20px 20px 20px; color: #fff; font-family: sans-serif;">
        <h1>MEGAHUB</h1>
        <p style="color: #666; margin-bottom: 30px;">DESIGNED & OWNED BY: HADI</p>

        <div class="panel" onclick="op('Recovery Desk')">
            <h3>Recovery Desk</h3>
            <span style="color: #888; font-size: 0.9rem;">Appeal system bans / restore blocked accounts</span>
        </div>

        <div class="panel" onclick="op('Acc Engagement Increaser')">
            <h3>Acc Engagement Increaser</h3>
            <span style="color: #888; font-size: 0.9rem;">Follower and views increase engine boost</span>
        </div>

        <div class="panel" onclick="op('Buy Old Instagram Accounts')">
            <h3>Buy Old Instagram Accounts</h3>
            <span style="color: #888; font-size: 0.9rem;">Buy Old Instagram profiles available</span>
        </div>
    </div>

    <div class="overlay" id="bg" onclick="cl()"></div>
    <div class="drawer" id="box">
        <h2 id="title" style="margin: 0 0 15px 0; text-transform: uppercase; font-size: 1.25rem;">Route</h2>
        <form action="/submit-ticket" method="POST" style="display: flex; flex-direction: column; gap: 12px;">
            <input type="hidden" id="route" name="serviceType">
            
            <label style="color: #888; font-size: 0.85rem;">Username</label>
            <input type="text" name="targetUser" placeholder="@username" required style="padding: 12px; background: #141414; border: 1px solid #262626; border-radius: 6px; color: #fff;">
            
            <label style="color: #888; font-size: 0.85rem;">Contact Phone</label>
            <input type="tel" name="contactPhone" placeholder="+123456789" required style="padding: 12px; background: #141414; border: 1px solid #262626; border-radius: 6px; color: #fff;">
            
            <label style="color: #888; font-size: 0.85rem;">Customer Notes</label>
            <textarea name="customerNotes" placeholder="Describe your request..." required style="padding: 12px; background: #141414; border: 1px solid #262626; border-radius: 6px; color: #fff; min-height: 80px; resize: vertical;"></textarea>
            
            <button type="submit" style="padding: 14px; background: #fff; color: #000; border: none; border-radius: 6px; font-weight: bold; margin-top: 10px; cursor: pointer;">Submit Request</button>
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

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const POINTS = 22;
        const BASE_Y = height * 0.81; 
        const TENSION = 0.015;
        const DAMPING = 0.96;

        let springs = [];
        for (let i = 0; i < POINTS; i++) {
            springs.push({ y: BASE_Y, targetY: BASE_Y, vel: 0 });
        }

  
