const express = require('express');
const https = require('https');
const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serves a lightweight operational screen that works 100% on any mobile device
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MEGAHUB BY HADI</title>
    </head>
    <body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;letter-spacing:2px;">
        <h1 style="margin-top:100px;">⚡ MEGAHUB OPERATIONAL MODULE ⚡</h1>
        <p style="color:#666;margin-top:20px;">OWNED AND OPERATED BY HADI.</p>
        <a href="https://wa.me" style="display:inline-block;margin-top:30px;color:#000;background:#fff;padding:15px 30px;text-decoration:none;border-radius:40px;font-weight:bold;">CONTACT VIA WHATSAPP</a>
    </body>
    </html>
    `);
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
        res.send('<body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;letter-spacing:2px;"><meta http-equiv="refresh" content="3;url=/"><h1 style="font-size:2rem;color:#fff;margin-top:100px;">⚡ REQUEST RECEIVED ⚡</h1></body>');
    });

    ntfyReq.on('error', (e) => { res.status(500).send('ERROR: ' + e.message); });
    ntfyReq.write(dataBuffer);
    ntfyReq.end();
});

// Port listener for local environments, handles Vercel requirements
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
    
