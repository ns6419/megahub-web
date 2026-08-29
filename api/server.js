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
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
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

        /* --- INJECTED CONTENT WRAPPER TO PREVENT HEADER OVERLAP --- */
        .app-content-wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 80px;
            position: relative;
            z-index: 5;
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
        h1 { margin: 10px 0 5px; font-size: 2.5rem; }
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

        /* --- INJECTED BRANDING NAV BAR --- */
        .megahub-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 70px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid #111;
            display: flex;
            align-items: center;
            padding: 0 20px;
            z-index: 1000;
        }
        .menu-btn {
            width: 44px;
            height: 44px;
            background: #111;
            border: 1px solid #222;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        .vector-box { width: 100%; height: 100%; }
        .line-bar, .logo-outline {
            fill: none;
            stroke: #fff;
            stroke-width: 8.5;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .logo-outline {
            stroke-dasharray: 400;
            stroke-dashoffset: 400;
            opacity: 0;
        }
        .menu-btn.active .line-bar.top { transform: translateY(18px) rotate(45deg); transform-origin: center; opacity: 0; }
        .menu-btn.active .line-bar.mid { transform: scaleX(0); opacity: 0; }
        .menu-btn.active .line-bar.bot { transform: translateY(-18px) rotate(-45deg); transform-origin: center; opacity: 0; }
        .menu-btn.active .logo-outline { opacity: 1; stroke-dashoffset: 0; transition-delay: 0.08s; }

        .brand-logo-text {
            color: #fff;
            font-size: 1.15rem;
            font-weight: 800;
            letter-spacing: 3px;
            margin-left: 14px;
            opacity: 0;
            transform: translateX(-20px);
            transition: opacity 0.65s cubic-bezier(0.25, 1, 0.5, 1), transform 0.65s cubic-bezier(0.25, 1, 0.5, 1);
            transition-delay: 0.28s;
        }
        .menu-btn.active + .brand-logo-text { opacity: 1; transform: translateX(0); }

        /* --- INJECTED MEGA.AI SUPPORT OVERLAY --- */
        .mega-ai-panel {
            position: fixed;
            bottom: -220px;
            left: 50%;
            transform: translateX(-50%);
            width: 92%;
            max-width: 380px;
            background: #111;
            border: 1px solid #ff3333;
            border-radius: 14px;
            padding: 18px;
            text-align: center;
            transition: bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.15);
            z-index: 999;
            box-shadow: 0 8px 30px rgba(255, 51, 51, 0.2);
        }
        .mega-ai-panel.show { bottom: 20px; }
        .ai-title-msg { color: #ff3333; font-size: 0.8rem; margin: 0; letter-spacing: 1px; font-weight: bold; }
        .ai-tip-msg { color: #777; font-size: 0.72rem; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    </style>
</head>
<body>

    <!-- Header Navigation Layout -->
    <nav class="megahub-header">
        <div class="menu-btn" id="menuToggle">
            <svg viewBox="0 0 100 100" class="vector-box">
                <line class="line-bar top" x1="22" y1="34" x2="78" y2="34" />
                <line class="line-bar mid" x1="22" y1="50" x2="78" y2="50" />
                <line class="line-bar bot" x1="22" y1="66" x2="78" y2="66" />
                <path class="logo-outline" d="M25,73 L25,37 C25,29 33,29 33,37 L33,61 C33,66 39,66 39,61 L50,44 L61,61 C61,66 67,66 67,61 L67,37 C67,29 75,29 75,37 L75,73" />
            </svg>
        </div>
        <div class="brand-logo-text">MEGAHUB</div>
    </nav>

    <div class="wave-container" id="waveBox">
        <canvas id="waveCanvas"></canvas>
    </div>

    <!-- Wrapped Original Page Structure to prevent overlapping headers -->
    <div class="app-content-wrapper">
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
    </div>

    <!-- Injected Recovery System Alert UI -->
    <div class="mega-ai-panel" id="megaAiWidget">
        <p class="ai-title-msg">⚠️ MEGA.AI: BUG DETECTED IN ENVIRONMENT</p>
        <div class="ai-tip-msg">Tap Fluid Wave 3x or Shake Phone to Restore Page</div>
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
        
