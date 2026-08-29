const express = require('express');
const https = require('https');
const app = express();

const TOPIC = 'megahub_alerts_9988';
const GEMINI_API_KEY = 'AQ.Ab8RN6LEPSJmSJrnva51M_Qmy2ZcFKuFt0cNI6s1I14EghAHTw'; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const UI = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEGAHUB</title>
    <style>
        body { background: #000; color: #fff; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .panel { border: 1px solid #333; padding: 20px; border-radius: 8px; width: 90%; max-width: 400px; text-align: center; }
        input, textarea, button { width: 100%; padding: 12px; margin: 8px 0; background: #111; border: 1px solid #333; color: #fff; border-radius: 4px; box-sizing: border-box; }
        button { background: #fff; color: #000; font-weight: bold; cursor: pointer; text-transform: uppercase; }
        .chat { height: 150px; overflow-y: auto; text-align: left; padding: 10px; background: #111; border: 1px solid #222; margin-bottom: 10px; font-size: 0.85rem; }
    </style>
</head>
<body>
    <h1>MEGAHUB</h1>
    <p>OWNER: HADI</p>
    <div class="panel">
        <h3>🤖 MEGA.AI ASSISTANT</h3>
        <div class="chat" id="box">System active. Ask a question below.</div>
        <input type="text" id="inp" placeholder="Ask AI...">
        <button onclick="ask()">Send to AI</button>
    </div>
    <script>
        async function ask() {
            const i = document.getElementById('inp');
            const b = document.getElementById('box');
            const q = i.value.trim(); if(!q) return;
            b.innerHTML += '<br><b>You:</b> ' + q; i.value = '';
            try {
                const res = await fetch('/api/ask-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: q }) });
                const data = await res.json();
                b.innerHTML += '<br><b>AI:</b> ' + data.reply;
            } catch { b.innerHTML += '<br><i>Error connecting...</i>'; }
            b.scrollTop = b.scrollHeight;
        }
    </script>
</body>
</html>`;

app.get('/', (req, res) => { res.send(UI); });

app.post('/api/ask-ai', (req, res) => {
    const { prompt } = req.body;
    const sys = "You are MEGA.AI by HADI. Help with social media growth, engagement boosts, and account recovery.";
    const data = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } });
    const opt = { hostname: '://googleapis.com', path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } };
    const aiReq = https.request(opt, (aiRes) => {
        let body = ''; aiRes.on('data', (c) => body += c);
        aiRes.on('end', () => { try { res.json({ reply: JSON.parse(body).candidates[0].content.parts[0].text.trim() }); } catch { res.json({ reply: "AI line busy. Try again." }); } });
    });
    aiReq.on('error', () => res.json({ reply: "AI endpoint connection error." }));
    aiReq.write(data); aiReq.end();
});

module.exports = app;
    
