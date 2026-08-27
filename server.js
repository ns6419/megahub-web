const express = require('express');
const https = require('https');
const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Stable high-speed stream pulls your custom premium layout instantly from a rock-solid CDN mirror
app.get('/', (req, res) => {
    https.get('https://pages.dev', (htmlRes) => {
        let data = '';
        htmlRes.on('data', (chunk) => { data += chunk; });
        htmlRes.on('end', () => { 
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(data); 
        });
    }).on('error', () => {
        // High-speed instant fallback template so your page NEVER goes blank or error-loops
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="2"></head><body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;letter-spacing:2px;"><h1 style="margin-top:100px;">⚡ INITIALIZING OPERATIONAL REQUEST... ⚡</h1><p style="color:#666;margin-top:20px;">ESTABLISHING HIGH-SPEED INFRASTRUCTURE CONNECTION. STANDBY.</p></body></html>');
    });
});

// Ticket Submission Handler Pipeline
app.post('/submit-ticket', (req, res) => {
    const { serviceType, platform, targetUser, contactPhone, customerNotes } = req.body;
    const textMsg = "NEW REQUEST - ROUTE: " + (serviceType || "NONE") + " - PLATFORM: " + (platform || "NONE") + " - USER: " + (targetUser || "NONE") + " - PHONE: " + (contactPhone || "NONE") + " - NOTES: " + (customerNotes || "NONE");
    const dataBuffer = Buffer.from(textMsg, 'utf-8');

    const options = {
        hostname: 'ntfy.sh',
        path: '/' + NTFY_TOPIC,
        method: 'POST',
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': dataBuffer.length }
    };

    const ntfyReq = https.request(options, () => {
        res.send('<body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;letter-spacing:2px;"><meta http-equiv="refresh" content="3;url=/"><h1 style="font-size:2rem;color:#fff;margin-top:100px;">⚡ REQUEST RECEIVED ⚡</h1><p style="color:#666;margin-top:20px;">OPERATIONAL ENGINE DEPLOYED. RETURNING HOME...</p></body>');
    });

    ntfyReq.on('error', (e) => { res.status(500).send('ERROR: ' + e.message); });
    ntfyReq.write(dataBuffer);
    ntfyReq.end();
});

module.exports = app;
                          
