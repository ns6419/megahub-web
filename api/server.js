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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>MEGAHUB</title>
    <style>
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { 
            margin: 0; 
            padding: 0; 
            background: #000; 
            color: #fff; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden; 
        }

        /* --- MOBILE CONTAINER SPACING --- */
        .app-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 85px;
            padding: 16px;
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
        h1 { margin: 10px 0 5px; font-size: 2.2rem; }
        p { color: #888; font-size: 0.75rem; margin: 0 0 20px; }
        .card { 
            background: #111; 
            border: 1px solid #222; 
            border-radius: 8px; 
            padding: 16px; 
            margin-bottom: 12px; 
            cursor: pointer; 
            touch-action: manipulation;
        }
        .card:active { border-color: #fff; background: #161616; }
        h3 { margin: 0 0 4px; text-transform: uppercase; font-size: 0.95rem; color: #fff; }
        span { font-size: 0.72rem; color: #666; }
        
        /* --- HIGH PERFORMANCE HARDWARE NAV HEADERS --- */
        .megahub-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 70px;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border-bottom: 1px solid #111;
            display: flex;
            align-items: center;
            padding: 0 20px;
            z-index: 1000;
            transform: translateZ(0); /* Forces GPU Acceleration on Mobile Phones */
        }

        /* Rounded badge container matching image profile geometry exactly */
        .menu-btn {
            width: 44px;
            height: 44px;
            background: #111111;
            border: 1px solid #222;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            touch-action: manipulation;
        }
        .menu-btn:active {
            border-color: #555;
            background: #1a1a1a;
        }
        .vector-container {
            width: 100%;
            height: 100%;
        }

        /* Continuous monoline configuration matching image aesthetics */
        .burger-line, .custom-logo-path {
            fill: none;
            stroke: #ffffff;
            stroke-width: 8.5;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .custom-logo-path {
            stroke-dasharray: 400;
            stroke-dashoffset: 400;
            opacity: 0;
        }

        /* Hamburger bars transition sequence mapping */
        .menu-btn.active .burger-line.top { transform: translateY(18px) rotate(45deg); transform-origin: center; opacity: 0; }
        .menu-btn.active .burger-line.mid { transform: scaleX(0); opacity: 0; }
        .menu-btn.active .burger-line.bot { transform: translateY(-18px) rotate(-45deg); transform-origin: center; opacity: 0; }

        /* Direct transformation trace visibility reveal */
        .menu-btn.active .custom-logo-path {
            opacity: 1;
            stroke-dashoffset: 0;
            transition-delay: 0.08s;
        }

        /* Slow swipe horizontal display text slide */
        .swipe-text {
            color: #ffffff;
            font-size: 1.15rem;
            font-weight: 800;
            letter-spacing: 3px;
            margin-left: 14px;
            opacity: 0;
            transform: translateX(-20px);
            transition: opacity 0.65s cubic-bezier(0.25, 1, 0.5, 1), transform 0.65s cubic-bezier(0.25, 1, 0.5, 1);
            transition-delay: 0.28s;
            text-transform: uppercase;
        }
        .menu-btn.active + .swipe-text {
            opacity: 1;
            transform: translateX(0);
        }

        /* --- MOBILE OPTIMIZED DRAWER MECHANICS --- */
        .mega-ai-alert {
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
        .mega-ai-alert.show { bottom: 20px; }
        .ai-headline { color: #ff3333; font-size: 0.8rem; margin: 0; letter-spacing: 1px; font-weight: bold; text-transform: uppercase; }
        .ai-instructions { color: #777; font-size: 0.72rem; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }

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
            padding: 22px; 
            z-index: 10; 
            transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1); 
            color: #fff; 
        }
        .drawer.open { transform: translate(-50%, 0); }
        .overlay { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            background: rgba(0,0,0,0.75); 
            display: none; 
            z-index: 9; 
        }
        .overlay.open { display: block; }
        label { display: block; margin: 12px 0 4px; font-size: 0.72rem; color: #888; text-transform: uppercase; }
        input, textarea { width: 100%; padding: 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: #fff; font-size: 16px; /* Prevents auto-zoom on iOS Safari */ }
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
</head>
<body>

    <!-- Top Sticky Bar -->
    <nav class="megahub-header">
        <div class="menu-btn" id="menuToggle">
            <svg viewBox="0 0 100 100" class="vector-container">
                <line class="burger-line top" x1="22" y1="34" x2="78" y2="34" />
                <line class="burger-line mid" x1="22" y1="50" x2="78" y2="50" />
                <line class="burger-line bot" x1="22" y1="66" x2="78" y2="66" />
                <path class="custom-logo-path" d="M25,73 L25,37 C25,29 33,29 33,37 L33,61 C33,66 39,66 39,61 L50,44 L61,61 C61,66 67,66 67,61 L67,37 C67,29 75,29 75,37 L75,73" />
            </svg>
        </div>
        <div class="swipe-text">MEGAHUB</div>
    </nav>

    <div class="wave-container" id="waveBox">
        <canvas id="waveCanvas"></canvas>
    </div>

    <div class="app-container">
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

    <!-- MEGA.AI Emergency Layout Component -->
    <div class="mega-ai-alert" id="megaAiWidget">
        <p class="ai-headline">⚠️ MEGA.AI: CORE INSTABILITY TRACKED</p>
        <div class="ai-instructions">Tap Fluid Surface 3x or Shake Phone to Reset</div>
    </div>

    <div class="overlay" id="bg" onclick="cl()"></div>

    <div class="drawer" id="box">
    
