const express = require('express');
const https = require('https');
const app = express();

const TOPIC = 'megahub_alerts_9988';
const GEMINI_API_KEY = 'AQ.Ab8RN6LEPSJmSJrnva51M_Qmy2ZcFKuFt0cNI6s1I14EghAHTw'; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Pulls your complete original HTML interface structure securely from GitHub production streams
app.get('/', (req, res) => {
    https.get('https://githubusercontent.com', (rawRes) => {
        let html = '';
        rawRes.on('data', (chunk) => { html += chunk; });
        rawRes.on('end', () => { 
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(html); 
        });
    }).on('error', () => { res.send('<h3>MEGAHUB Connection Busy. Reload Page...</h3>'); });
});

app.post('/api/ask-ai', (req, res) => {
    const { prompt } = req.body;
    const sys = "You are MEGA.AI by HADI. Help with social media growth, boosts, and account recovery. Keep answers short.";
    const postData = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } });
    const options = { hostname: '://googleapis.com', path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) } };
    
    const aiReq = https.request(options, (aiRes) => {
        let body = ''; aiRes.on('data', (chunk) => body += chunk);
        aiRes.on('end', () => {
            try {
                res.json({ reply: JSON.parse(body).candidates[0].content.parts[0].text.trim() });
            } catch (err) { res.json({ reply: "MEGA.AI line busy. Try again." }); }
        });
    });
    aiReq.on('error', () => res.json({ reply: "AI engine connection offline." }));
    aiReq.write(postData); aiReq.end();
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
