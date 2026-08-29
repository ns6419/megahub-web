const express = require('express');
const https = require('https');
const app = express();

const TOPIC = 'megahub_alerts_9988';
const GEMINI_API_KEY = 'AQ.Ab8RN6LEPSJmSJrnva51M_Qmy2ZcFKuFt0cNI6s1I14EghAHTw';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Natively streams your complete original HTML dashboard theme layout 
app.get('/', (req, res) => {
    https.get('https://githubusercontent.com', (rawRes) => {
        let html = '';
        rawRes.on('data', (chunk) => { html += chunk; });
        rawRes.on('end', () => {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(html);
        });
    }).on('error', () => { res.send('<h3>MEGAHUB Stream Syncing... Reload Page</h3>'); });
});

app.post('/api/ask-ai', (req, res) => {
    const { prompt } = req.body;
    const sys = "You are MEGA.AI by HADI. Help with social media views, boosts, and account recovery. Keep answers very short.";
    const t = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } });
    const n = { hostname: '://googleapis.com', path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(t) } };
    const a = https.request(n, t => {
        let n = ''; t.on('data', e => n += e), t.on('end', () => {
            try { res.json({ reply: JSON.parse(n).candidates[0].content.parts[0].text.trim() }); } 
            catch { res.json({ reply: 'AI line fluctuation. Try again.' }); }
        });
    });
    a.on('error', () => res.json({ reply: 'AI endpoint error.' })), a.write(t), a.end();
});

app.post('/submit-ticket', (req, res) => {
    const { serviceType, targetUser, contactPhone, customerNotes } = req.body;
    const msg = "🚨 ALERT 🚨\n\n• ROUTE: " + serviceType + "\n• USER: " + targetUser + "\n• CONTACT: " + contactPhone + "\n• NOTES:\n" + customerNotes;
    const o = Buffer.from(msg, 'utf-8');
    const s = { hostname: 'ntfy.sh', path: '/' + TOPIC, method: 'POST', headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': o.length } };
    const i = https.request(s, () => { res.json({ success: true }); });
    i.on('error', e => res.status(500).json({ error: e.message })), i.write(o), i.end();
});

module.exports = app;
                         
