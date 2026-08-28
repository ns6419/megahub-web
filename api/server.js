const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>⚡ MegaHub Support Hub</title>
    <style>
        body {
            background: #0d0d11;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .form-container {
            background: #16161f;
            border: 1px solid #2a2a3a;
            border-radius: 12px;
            padding: 30px;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        h2 {
            margin-top: 0;
            text-align: center;
            letter-spacing: 2px;
            color: #0070f3;
            text-transform: uppercase;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #aaa;
        }
        input, select, textarea {
            width: 100%;
            padding: 12px;
            background: #22222e;
            border: 1px solid #3a3a4f;
            border-radius: 6px;
            color: #fff;
            font-size: 1rem;
            box-sizing: border-box;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #0070f3;
        }
        textarea {
            resize: vertical;
            min-height: 80px;
        }
        button {
            width: 100%;
            padding: 14px;
            background: #0070f3;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: background 0.2s;
        }
        button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>

<div class="form-container">
    <h2>⚡ MegaHub Alert Pipeline </h2>
    <form action="/submit-ticket" method="POST">
        <div class="form-group">
            <label for="serviceType">Route / Service Type</label>
            <input type="text" id="serviceType" name="serviceType" placeholder="e.g. Premium Support, API Check" required>
        </div>

        <div class="form-group">
            <label for="platform">Platform</label>
            <select id="platform" name="platform">
                <option value="Web Dashboard">Web Dashboard</option>
                <option value="Android Mobile">Android Mobile</option>
                <option value="iOS App">iOS App</option>
                <option value="External API">External API</option>
            </select>
        </div>

        <div class="form-group">
            <label for="targetUser">Your Name / User ID</label>
            <input type="text" id="targetUser" name="targetUser" placeholder="e.g. John Doe" required>
        </div>

        <div class="form-group">
            <label for="contactPhone">Contact Phone</label>
            <input type="tel" id="contactPhone" name="contactPhone" placeholder="e.g. +1234567890">
        </div>

        <div class="form-group">
            <label for="customerNotes">Operational Notes</label>
            <textarea id="customerNotes" name="customerNotes" placeholder="Provide additional ticket requirements..."></textarea>
        </div>

        <button type="submit">Deploy Request</button>
    </form>
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
    
