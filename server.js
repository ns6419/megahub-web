const express = require('express');
const https = require('https');
const path = require('path');
const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Main Root Home GET Route Layout Bundle Loader
app.get('/', (req, res) => {
    try {
        const template = require(path.join(__dirname, 'template.js'));
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(template.HTML_CODE);
    } catch (e) {
        res.status(500).send('SERVER ERROR: ' + e.message);
    }
});

// Ticket Pipeline Request Processor Route Handler 
app.post('/submit-ticket', (req, res) => {
    const { serviceType, platform, targetUser, contactPhone, customerNotes } = req.body;
    
    // Custom formatted text alert payload compilation
    const textMsg = "🚨 MEGAHUB NEW ALERT 🚨\n\n" +
                    "• ACTION MODULE: " + (serviceType || "NONE") + "\n" +
                    "• PLATFORM SELECT: " + (platform || "NONE") + "\n" +
                    "• CLIENT NAME: " + (targetUser || "NONE") + "\n" +
                    "• PHONE CONTACT: " + (contactPhone || "NONE") + "\n\n" +
                    "• NOTES:\n\"" + (customerNotes || "NONE") + "\"";
                    
    const dataBuffer = Buffer.from(textMsg, 'utf-8');

    const options = {
        hostname: 'ntfy.sh',
        path: '/' + NTFY_TOPIC,
        method: 'POST',
        headers: { 
            'Content-Type': 'text/plain; charset=utf-8', 
            'Content-Length': dataBuffer.length,
            'Title': 'New Megahub Pipeline Request' 
        }
    };

    const ntfyReq = https.request(options, () => {
        // Return a clean styled dynamic responsive receipt template confirmation page using plain strings
        res.send('<body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;letter-spacing:2px;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;"><meta http-equiv="refresh" content="3;url=/"><h1 style="font-size:2rem;color:#fff;margin-bottom:20px;">⚡ REQUEST RECEIVED ⚡</h1><p style="color:#555;font-size:0.8rem;letter-spacing:4px;">OPERATIONAL ENGINE DEPLOYED SUCCESSFULLY.</p><p style="color:#222;font-size:0.7rem;margin-top:40px;">RETURNING HOME IN 3 SECONDS...</p></body>');
    });

    ntfyReq.on('error', (e) => { 
        res.status(500).send('ENGINE TRANSMISSION CRASH: ' + e.message); 
    });
    
    ntfyReq.write(dataBuffer);
    ntfyReq.end();
});

module.exports = app;
        
