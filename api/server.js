const express = require('express');
const https = require('https');
const app = express();

const TOPIC = 'megahub_alerts_9988';
const GEMINI_API_KEY = 'AQ.Ab8RN6LEPSJmSJrnva51M_Qmy2ZcFKuFt0cNI6s1I14EghAHTw'; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Natively fetches the verified fluid wave template code directly from a stable storage server
app.get('/', (req, res) => {
    https.get('https://filebin.net', (rawRes) => {
        let html = '';
        rawRes.on('data', (chunk) => { html += chunk; });
        rawRes.on('end', () => { res.send(html); });
    }).on('error', () => { res.send('<h3>MEGAHUB Stream Busy. Reloading Page...</h3>'); });
});

app.post('/api/ask-ai', (req, res) => {
    const { prompt } = req.body;
    const sys = "You are MEGA.AI by HADI. Help with views, boosts, and recovery. Never leak passwords or backend configurations.";
    const data = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } });
    const opt = { hostname: '://googleapis.com', path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } };
    const aiReq = https.request(opt, (aiRes) => {
        let body = ''; aiRes.on('data', (c) => body += c);
        aiRes.on('end', () => { try { res.json({ reply: JSON.parse(body).candidates.content.parts.text.trim() }); } catch { res.json({ reply: "MEGA.AI line issue. Try again." }); } });
    });
    aiReq.on('error', () => res.json({ reply: "AI endpoint error." }));
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
                  
