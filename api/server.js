const express = require('express');
const https = require('https');
const app = express();

const TOPIC = 'megahub_alerts_9988';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Natively serves your complete customized dark frontend interface directly as a text string
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEGAHUB</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #000; color: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
        
        .title-container { text-align: center; margin-bottom: 40px; }
        .title-container h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: 2px; margin-bottom: 4px; }
        .title-container p { color: #666; font-size: 0.8rem; letter-spacing: 1px; font-weight: 600; text-transform: uppercase; }

        .dashboard { width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 16px; }
        .card { background: #0c0c0c; border: 1px solid #1c1c1c; border-radius: 14px; padding: 24px; cursor: pointer; transition: background 0.2s; }
        .card:active { background: #161616; }
        .card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.5px; }
        .card p { color: #555; font-size: 0.9rem; font-weight: 500; }

        .nav-header { position: fixed; top: 0; right: 0; padding: 20px; z-index: 1000; }
        .menu-toggle { width: 44px; height: 44px; cursor: pointer; position: relative; display: flex; flex-direction: column; justify-content: center; gap: 6px; padding: 12px; background: #0c0c0c; border-radius: 12px; border: 1px solid #1c1c1c; transition: all 0.3s ease; }
        .bar { width: 100%; height: 2.5px; background-color: #fff; border-radius: 4px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

        .menu-toggle.open { background: #000; border-color: #fff; gap: 0; }
        .menu-toggle.open .bar { height: 3px; }
        .menu-toggle.open .bar1 { transform: translateY(4.5px) rotate(45deg) scaleX(0.75); transform-origin: left center; }
        .menu-toggle.open .bar2 { opacity: 0; transform: scale(0); }
        .menu-toggle.open .bar3 { transform: translateY(-4.5px) rotate(-45deg) scaleX(0.75); transform-origin: right center; }

        .ai-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 400px; height: 100%; background: #050505; border-left: 1px solid #111; box-shadow: -10px 0 30px rgba(0,0,0,0.9); transition: right 0.4s cubic-bezier(0.1, 0.9, 0.2, 1); z-index: 999; display: flex; flex-direction: column; }
        .ai-drawer.open { right: 0; }
        .drawer-header { padding: 32px 24px 20px; border-bottom: 1px solid #111; }
        .drawer-header h2 { font-size: 1.4rem; font-weight: 800; }
        .drawer-header p { font-size: 0.85rem; color: #444; margin-top: 4px; }

        .chat-box { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
        .msg { padding: 12px 16px; border-radius: 10px; max-width: 85%; font-size: 0.9rem; line-height: 1.4; font-weight: 500; }
        .msg.system { background: #0c0c0c; color: #666; align-self: flex-start; border: 1px solid #151515; }
        .msg.user { background: #fff; color: #000; align-self: flex-end; }
        .msg.ai { background: #111; color: #fff; align-self: flex-start; border: 1px solid #222; }
        .chat-input-area { padding: 20px 24px 32px; border-top: 1px solid #111; display: flex; gap: 12px; background: #020202; }
        .chat-input-area input { flex: 1; background: #0c0c0c; border: 1px solid #1c1c1c; padding: 14px; color: #fff; border-radius: 8px; outline: none; font-size: 0.95rem; }
        .chat-input-area button { background: #fff; color: #000; border: none; padding: 0 22px; border-radius: 8px; font-weight: 700; cursor: pointer; }
    </style>
</head>
<body>

    <header class="nav-header">
        <div class="menu-toggle" id="menuToggle" onclick="toggleMenu()">
            <div class="bar bar1"></div>
            <div class="bar bar2"></div>
            <div class="bar bar3"></div>
        </div>
    </header>

    <div class="title-container">
        <h1>MEGAHUB</h1>
        <p>Designed & Owned By: Hadi</p>
    </div>

    <div class="dashboard">
        <div class="card">
            <h3>RECOVERY DESK</h3>
            <p>Appeal system bans / restore blocked accounts</p>
        </div>
        <div class="card">
            <h3>ACC ENGAGEMENT INCREASER</h3>
            <p>Follower and views increase engine boost</p>
        </div>
        <div class="card">
            <h3>BUY OLD INSTAGRAM ACCOUNTS</h3>
            <p>Old Instagram profiles available</p>
        </div>
    </div>

    <div class="ai-drawer" id="aiDrawer">
        <div class="drawer-header">
            <h2>MEGA.AI HELP DESK</h2>
            <p>Report crashes or ask for direct assistance</p>
        </div>
        <div class="chat-box" id="chatBox">
            <div class="msg system">Hello! I am MEGA.AI by HADI. How can I assist you with layout crashes, boosts, or account recovery?</div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="aiPrompt" placeholder="Type your message...">
            <button onclick="askAI()">Send</button>
        </div>
    </div>

    <script>
        function toggleMenu() {
            document.getElementById('menuToggle').classList.toggle('open');
            document.getElementById('aiDrawer').classList.toggle('open');
        }

        async function askAI() {
            const inputEl = document.getElementById('aiPrompt');
            const chatBox = document.getElementById('chatBox');
            const prompt = inputEl.value.trim();
            if (!prompt) return;

            const userDiv = document.createElement('div');
            userDiv.className = 'msg user';
            userDiv.innerText = prompt;
            chatBox.appendChild(userDiv);
            inputEl.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;

            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'msg ai';
            loadingDiv.innerText = 'Connecting to service line...';
            chatBox.appendChild(loadingDiv);
            chatBox.scrollTop = chatBox.scrollHeight;

            try {
                const res = await fetch('/api/ask-ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                });
                const data = await res.json();
                loadingDiv.innerText = data.reply;
            } catch {
                loadingDiv.innerText = 'System connection drop. Please resend.';
            }
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        document.getElementById('aiPrompt').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') askAI();
        });
    </script>
</body>
</html>
    `);
});

// Fixed AI integration array mapping data logic
app.post('/api/ask-ai', (req, res) => {
    const { prompt } = req.body;
    const sys = "You are MEGA.AI by HADI. Help with boosts and recovery.";
    const data = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } });
    
    const opt = { 
        hostname: '://googleapis.com', 
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json', 
            'Content-Length': Buffer.byteLength(data) 
        } 
    };
    
    const aiReq = https.request(opt, (aiRes) => {
        let body = ''; aiRes.on('data', (c) => body += c);
        aiRes.on('end', () => { 
            try { 
                const resJson = JSON.parse(body);
                // Correctly accesses Gemini components nested array parameters
                res.json({ reply: resJson.candidates[0].content.parts[0].text.trim() }); 
            } catch { 
                res.json({ reply: "AI line fluctuation." }); 
            } 
        });
    });
    aiReq.on('error', () => res.json({ reply: "AI error." }));
    aiReq.write(data); aiReq.end();
});

app.post('/submit-ticket', (req, res) => {
    const { serviceType, targetUser, contactPhone, customerNotes } = req.body;
    const msg = `🚨 MEGAHUB ALERT 🚨\n\n• SERVICE: ${serviceType}\n• USER: ${targetUser}\n• CONTACT: ${contactPhone}\n\n• NOTES:\n${customerNotes}`;
    const buf = Buffer.from(msg, 'utf-8');
    const opt = { hostname: 'ntfy.sh', path: '/' + TOPIC, method: 'POST', headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': buf.length } };
    const nreq = https.request(opt, () => { res.json({ success: true }); });
    nreq.on('error', (e) => res.status(500).json({ error: e.message }));
    nreq.write(buf); nreq.end();
});

module.exports = app;
