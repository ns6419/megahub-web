const express = require('express');
const https = require('https');
const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Entry point route loads the layout straight from memory variables safely
app.get('/', (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(HTML_CONTENT);
    } catch (e) {
        res.status(500).send('SERVER ENGINE RENDERING ERROR: ' + e.message);
    }
});

// Post form submit pipeline handler
app.post('/submit-ticket', (req, res) => {
    const { serviceType, platform, targetUser, contactPhone, customerNotes } = req.body;
    
    const textMsg = "🚨 MEGAHUB ALERT 🚨\n\n" +
                    "• ROUTE: " + (serviceType || "NONE") + "\n" +
                    "• PLATFORM: " + (platform || "NONE") + "\n" +
                    "• NAME: " + (targetUser || "NONE") + "\n" +
                    "• PHONE: " + (contactPhone || "NONE") + "\n\n" +
                    "• NOTES:\n" + (customerNotes || "NONE");
                    
    const dataBuffer = Buffer.from(textMsg, 'utf-8');

    const options = {
        hostname: 'ntfy.sh',
        path: '/' + NTFY_TOPIC,
        method: 'POST',
        headers: { 
            'Content-Type': 'text/plain; charset=utf-8', 
            'Content-Length': dataBuffer.length
        }
    };

    const ntfyReq = https.request(options, () => {
        res.send('<body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;letter-spacing:2px;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;"><meta http-equiv="refresh" content="3;url=/"><h1 style="font-size:2rem;color:#fff;margin-bottom:20px;">⚡ REQUEST RECEIVED ⚡</h1><p style="color:#555;font-size:0.8rem;letter-spacing:4px;">OPERATIONAL ENGINE DEPLOYED SUCCESSFULLY.</p></body>');
    });

    ntfyReq.on('error', (e) => { 
        res.status(500).send('ENGINE TRANSMISSION CRASH: ' + e.message); 
    });
    
    ntfyReq.write(dataBuffer);
    ntfyReq.end();
});

// Export the application instance for Vercel Serverless
module.exports = app;
        
