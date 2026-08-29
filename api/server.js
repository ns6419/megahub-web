const express = require('express');
const https = require('https');
const zlib = require('zlib');
const app = express();

const TOPIC = 'megahub_alerts_9988';
const GEMINI_API_KEY = 'AQ.Ab8RN6LEPSJmSJrnva51M_Qmy2ZcFKuFt0cNI6s1I14EghAHTw'; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Compressed native data string containing your absolute entire premium dashboard UI
const gzipData = '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';

app.get('/', (req, res) => {
    // Synchronously decodes your single-line UI inside Vercel memory
    zlib.gunzip(Buffer.from(gzipData, 'base64'), (err, buffer) => {
        if (!err) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(buffer.toString('utf-8'));
        } else {
            res.send('<h3>MEGAHUB Stream Error</h3>');
        }
    });
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
                 
