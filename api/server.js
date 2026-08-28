const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEGAHUB</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header-section {
            background: #000000;
            color: #ffffff;
            text-align: center;
            padding: 60px 20px 60px 20px;
            position: relative;
        }
        .header-section h1 {
            font-size: 3rem;
            font-weight: 900;
            margin: 0 0 10px 0;
            letter-spacing: 4px;
            text-transform: uppercase;
        }
        .header-section p {
            font-size: 0.75rem;
            color: #ffffff;
            margin: 0;
            letter-spacing: 3px;
            text-transform: uppercase;
            font-weight: 600;
            opacity: 0.8;
        }
        /* Curved wave divider separating the black and white zones */
        .wave-divider {
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            overflow: hidden;
            line-height: 0;
        }
        .wave-divider svg {
            position: relative;
            display: block;
            width: calc(150% + 1.3px);
            height: 50px;
        }
        .wave-divider .shape-fill {
            fill: #ffffff;
        }
        .content-section {
            background: #ffffff;
            padding: 30px 24px 60px 24px;
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }
        .form-container {
            width: 100%;
            max-width: 420px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #000000;
            font-weight: 700;
        }
        input, select, textarea {
            width: 100%;
            padding: 14px;
            background: #f4f4f6;
            border: 1px solid #e2e2e8;
            border-radius: 8px;
            color: #000000;
            font-size: 1rem;
            transition: border-color 0.2s, background 0.2s;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #000000;
            background: #ffffff;
        }
        textarea {
            min-height: 90px;
            resize: vertical;
        }
        button {
            width: 100%;
            padding: 16px;
            background: #000000;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: background 0.2s;
            margin-top: 10px;
        }
        button:hover {
            background: #222222;
        }
    </style>
</head>
<body>

<div class="header-section">
    <h1>Megahub</h1>
    <p>Designed & Owned by: Hadi</p>
    
    <div class="wave-divider">
        <svg data-name="Layer 1" xmlns="http://w3.org" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
        </svg>
    </div>
</div>

<div class="content-section">
    <div class="form-container">
        <form action="/submit-ticket" method="POST">
            <div class="form-group">
                <label for="serviceType">Route / Service Type</label>
                <input type="text" id="serviceType" name="serviceType" required>
            </div>
            <div class="form-group">
                <label for="platform">Platform</label>
                <select id="platform" name="platform">
                    <option value="Web Dashboard">Web Dashboard</option>
                    <option value="Android Mobile">Android Mobile</option>
                    <option value="iOS App">iOS App</option>
                </select>
            </div>
            <div class="form-group">
                <label for="targetUser">Your Name</label>
                <input type="text" id="targetUser" name="targetUser" required>
            </div>
            <div class="form-group">
                <label for="contactPhone">Contact Phone</label>
                <input type="tel" id="contactPhone" name="contactPhone">
            </div>
            <div class="form-group">
                <label for="customerNotes">Operational Notes</label>
                <textarea id="customerNotes" name="customerNotes"></textarea>
            </div>
            <button type="submit">Deploy Request</button>
        </form>
    </div>
</div>

</body>
</html>
`;

const express = require('express');
const https = require('https');
const app = express();
const NTFY_TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(HTML_CONTENT);
    } catch (e) {
        res.status(500).send('SERVER ENGINE RENDERING ERROR: ' + e.message);
    }
});

app.post('/submit-ticket', (req, res) => {
    const { serviceType, platform, targetUser, contactPhone, customerNotes } = req.body;
    const textMsg = "🚨 MEGAHUB ALERT 🚨\n\n• ROUTE: " + (serviceType || "NONE") + "\n• PLATFORM: " + (platform || "NONE") + "\n• NAME: " + (targetUser || "NONE") + "\n• PHONE: " + (contactPhone || "NONE") + "\n\n• NOTES:\n" + (customerNotes || "NONE");
    const dataBuffer = Buffer.from(textMsg, 'utf-8');
    const options = {
        hostname: 'ntfy.sh',
        path: '/' + NTFY_TOPIC,
        method: 'POST',
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': dataBuffer.length }
    };
    const ntfyReq = https.request(options, () => {
        res.send('<body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;"><meta http-equiv="refresh" content="3;url=/"><h1 style="font-size:2rem;">⚡ REQUEST RECEIVED ⚡</h1></body>');
    });
    ntfyReq.on('error', (e) => { res.status(500).send('ENGINE TRANSMISSION CRASH: ' + e.message); });
    ntfyReq.write(dataBuffer);
    ntfyReq.end();
});

module.exports = app;
