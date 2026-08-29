const express = require('express');
const https = require('https');
const cookieParser = require('cookie-parser');
const app = express();

const TOPIC = 'megahub_alerts_9988';
const ADMIN_SECRET = 'HadiHub9988'; 

// Unified Key: Safely embedded directly into your server configuration stream
const GEMINI_API_KEY = 'AQ.Ab8RN6LEPSJmSJrnva51M_Qmy2ZcFKuFt0cNI6s1I14EghAHTw'; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Shared Universal Premium HTML/CSS Layout
const getHTML = (pageContent, scriptExtension = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEGAHUB</title>
    <style>
        * { box-sizing: border-box; }
        body { 
            margin: 0; padding: 0; background: #000; color: #fff; 
            font-family: sans-serif; min-height: 100vh; 
            display: flex; flex-direction: column; align-items: center; justify-content: center; 
            overflow: hidden; position: relative;
        }
        
        /* Advanced Morphing Menu Trigger Box Component */
        .burger-container {
            position: absolute; top: 20px; right: 20px; width: 44px; height: 44px;
            cursor: pointer; z-index: 120; display: flex; align-items: center; justify-content: center;
        }
        .burger-svg {
            width: 32px; height: 32px; fill: none; stroke: #fff; 
            stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round;
        }

        /* 3-Lines Baseline Path Layout configurations */
        .line-top { d: path("M 4 8 L 28 8"); transition: d 0.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s; }
        .line-mid { d: path("M 4 16 L 28 16"); transition: opacity 0.3s; opacity: 1; }
        .line-bot { d: path("M 4 24 L 28 24"); transition: d 0.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s; }

        /* Morph Animation Target: Coordinates mathematically matched to replicate your Interlinked "M" Logo */
        .burger-container.active .line-top {
            d: path("M 4 24 L 4 10 C 4 6, 9 6, 9 10 L 9 20 C 9 24, 14 24, 14 20 L 16 14 L 18 20 C 18 24, 23 24, 23 20 L 23 10 C 23 6, 28 6, 28 10 L 28 24");
            stroke: #fff;
        }
        .burger-container.active .line-mid { opacity: 0; }
        .burger-container.active .line-bot {
            d: path("M 11 14 L 14 10 L 16 15 L 18 10 L 21 14");
            stroke: #fff;
        }

        /* Sliding Navigation Panel Sidebar Menu overlay */
        .nav-menu {
            position: fixed; top: 0; right: -100%; width: 250px; height: 100vh;
            background: rgba(10, 10, 10, 0.96); border-left: 1px solid #222;
            display: flex; flex-direction: column; padding: 90px 25px; gap: 20px;
            z-index: 110; transition: right 0.3s ease-in-out; box-shadow: -10px 0 30px rgba(0,0,0,0.6);
        }
        .nav-menu.open { right: 0; }
        .nav-menu a {
            color: #888; text-decoration: none; text-transform: uppercase;
            font-size: 0.95rem; font-weight: 600; letter-spacing: 1px; transition: color 0.2s;
        }
        .nav-menu a:hover { color: #fff; }

        /* Floating MEGA.AI Pill Trigger UI button */
        .ai-trigger-btn {
            position: absolute; top: 20px; left: 20px; background: #fff; color: #000;
            padding: 8px 18px; border-radius: 20px; font-weight: bold; font-size: 0.8rem;
            cursor: pointer; z-index: 90; text-transform: uppercase; border: none; letter-spacing: 0.5px;
        }

        /* Slide-Up Support AI Chat Drawer Interface */
        .ai-drawer {
            position: fixed; bottom: 0; left: 50%; transform: translate(-50%, 100%);
            width: 100%; max-width: 400px; height: 65vh; background: #0c0c0c;
            border-top: 2px solid #222; border-radius: 20px 20px 0 0; z-index: 105;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column;
        }
        .ai-drawer.open { transform: translate(-50%, 0); }
        .ai-header { padding: 15px 20px; border-bottom: 1px solid #222; display: flex; justify-content: space-between; align-items: center; }
        .ai-header h3 { margin: 0; font-size: 1.05rem; letter-spacing: 1px; font-weight: bold; }
        .ai-close { cursor: pointer; color: #666; font-size: 1.2rem; transition: color 0.2s; }
        .ai-close:hover { color: #fff; }
        .ai-chat-box { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem; }
        
        .msg { max-width: 80%; padding: 10px 14px; border-radius: 12px; line-height: 1.45; }
        .msg.user { background: #222; color: #fff; align-self: flex-end; border-bottom-right-radius: 2px; }
        .msg.bot { background: #fff; color: #000; align-self: flex-start; border-bottom-left-radius: 2px; font-weight: 500; }

        .ai-input-area { padding: 12px; border-top: 1px solid #222; display: flex; gap: 8px; background: #0a0a0a; }
        .ai-input-area input { flex: 1; background: #151515; border: 1px solid #222; padding: 12px; color: #fff; border-radius: 8px; outline: none; }
        .ai-input-area button { width: auto; margin: 0; padding: 0 20px; border-radius: 8px; }

        .panel { 
            width: 100%; max-width: 400px; padding: 20px; 
            border: 1px solid #222; border-radius: 12px; background: #000; 
            position: relative; z-index: 5; 
        }
        h1, p { text-align: center; position: relative; z-index: 5; text-transform: uppercase; }
        h1 { margin: 40px 0 5px; font-size: 2.5rem; }
        p { color: #888; font-size: 0.8rem; margin: 0 0 20px; }
        
        .card { 
            background: #111; border: 1px solid #222; border-radius: 8px; 
            padding: 15px; margin-bottom: 12px; cursor: pointer; transition: border-color 0.2s;
        }
        .card:hover { border-color: #fff; }
        h3 { margin: 0 0 4px; text-transform: uppercase; font-size: 1rem; color: #fff; }
        span { font-size: 0.75rem; color: #666; }
        
        .wave-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; }
        canvas { display: block; width: 100%; height: 100%; }
        
        .drawer { 
            position: fixed; bottom: 0; left: 50%; transform: translate(-50%, 100%); 
            width: 100%; max-width: 400px; background: #111; border-top: 2px solid #222; 
            border-radius: 16px 16px 0 0; padding: 20px; z-index: 10; transition: transform 0.3s; color: #fff; 
        }
        .drawer.open { transform: translate(-50%, 0); }
        .overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: none; z-index: 9; }
        .overlay.open { display: block; }
        label { display: block; margin: 12px 0 4px; font-size: 0.75rem; color: #888; text-transform: uppercase; }
        input, textarea { width: 100%; padding: 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: #fff; margin-bottom: 5px;}
        textarea { height: 70px; resize: none; }
        button { 
            width: 100%; padding: 14px; background: #fff; color: #000; border: none; 
            border-radius: 6px; font-weight: 700; margin-top: 15px; cursor: pointer; text-transform: uppercase; 
        }
        button:disabled { background: #555; cursor: not-allowed; }
        .log-box { background:#111; border:1px solid #222; padding:12px; border-radius:6px; margin-bottom:10px; font-family:monospace; font-size:0.85rem; text-align:left; white-space: pre-wrap; }
    </style>
</head>
<body>

    <!-- Native MEGA.AI Support Button -->
    <button class="ai-trigger-btn" onclick="openAI()">MEGA.AI</button>

    <!-- Morphing Menu Trigger Element Layout -->
    <div class="burger-container" id="burgerToggle" onclick="toggleMenu()">
        <svg class="burger-svg" viewBox="0 0 32 32">
            <path class="line-top" />
            <path class="line-mid" />
            <path class="line-bot" />
        </svg>
    </div>

    <!-- Sliding Sidebar Overlay Navigation Panel menu -->
    <nav class="nav-menu" id="navMenu">
        <a href="/">Home Menu</a>
        <a href="/admin">Portal Login</a>
        <a href="/admin-dashboard">Admin Panel</a>
    </nav>

    <!-- Conversational AI Drawer Window -->
    <div class="ai-drawer" id="aiDrawer">
        <div class="ai-header">
            <h3>🤖 MEGA.AI ASSISTANT</h3>
            <span class="ai-close" onclick="closeAI()">✕</span>
        </div>
        <div class="ai-chat-box" id="aiChatBox">
            <div class="msg bot">Hello! I am MEGA.AI, built by HADI. How can I assist you with our platform operations today?</div>
        </div>
        <div class="ai-input-area">
            <input type="text" id="aiInputField" placeholder="Ask MEGA.AI something..." onkeydown="if(event.key==='Enter') sendAIChat()">
            <button onclick="sendAIChat()" id="aiSendBtn">SEND</button>
        </div>
    </div>

    <div class="wave-container" id="waveBox">
        <canvas id="waveCanvas"></canvas>
    </div>

    ${pageContent}

    <script>
        function toggleMenu() {
            document.getElementById('burgerToggle').classList.toggle('active');
            document.getElementById('navMenu').classList.toggle('open');
        }

        function openAI() { document.getElementById('aiDrawer').classList.add('open'); }
        function closeAI() { document.getElementById('aiDrawer').classList.remove('open'); }

        async function sendAIChat() {
            const input = document.getElementById('aiInputField');
            const chatBox = document.getElementById('aiChatBox');
            const btn = document.getElementById('aiSendBtn');
            const query = input.value.trim();
            if(!query) return;

            const userMsg = document.createElement('div');
            userMsg.className = 'msg user';
            
