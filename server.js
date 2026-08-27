const express = require('express');
const https = require('https');
const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// High-speed instant dynamic lookup fetches your premium theme with 0 risk of clipping
app.get('/', (req, res) => {
    https.get('https://githubusercontent.com', (htmlRes) => {
        let data = '';
        htmlRes.on('data', (chunk) => { data += chunk; });
        htmlRes.on('end', () => { 
            // Injects explicit schema ownership data directly into the active browser runtime pool
            let verifiedHtml = data.replace('<head>', `<head>
                <meta name="author" content="HADI">
                <meta name="owner" content="HADI">
                <meta property="og:site_name" content="MEGAHUB BY HADI">
                <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"MEGAHUB","url":"https://vercel.app","author":{"@type":"Person","name":"HADI"}}</script>`);
            
            // Appends a premium visible ownership claim and your custom WhatsApp float button link
            verifiedHtml = verifiedHtml.replace('</div></div><div class="drawer-overlay"', `
                <a href="https://wa.me." class="whatsapp-float" target="_blank" style="position:fixed;bottom:30px;right:30px;width:60px;height:60px;background-color:#000;border:2px solid #fff;border-radius:50px;display:flex;justify-content:center;align-items:center;z-index:998;box-shadow:0 4px 20px rgba(255,255,255,0.15);"><svg style="width:28px;height:28px;fill:none;stroke:#fff;stroke-width:2;" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.3 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.3 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></a>
                <footer>// PLATFORM ARCHITECTURE DESIGNED AND OWNED BY HADI</footer>
                </div></div><div class="drawer-overlay"`);
            
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(verifiedHtml); 
        });
    }).on('error', () => {
        // High-speed local fallback backup page layout configuration
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
                                                
