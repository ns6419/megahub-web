const express = require('express');
const https = require('https');
const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988'; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Main Route - V3 Build Update
app.get('/', (req, res) => {
    res.send(HTML_PAGE);
});

// Submit Route Handler
app.post('/submit-ticket', (req, res) => {
    const { serviceType, platform, targetUser, contactPhone, customerNotes } = req.body;
    const textMsg = "NEW REQUEST - ROUTE: " + (serviceType || "NONE") + " - PLATFORM: " + (platform || "NONE") + " - USER: " + (targetUser || "NONE") + " - PHONE: " + (contactPhone || "NONE") + " - NOTES: " + (customerNotes || "NONE");
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

    const ntfyReq = https.request(options, (ntfyRes) => {
        res.send(`<body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;letter-spacing:2px;"><meta http-equiv="refresh" content="3;url=/"><h1 style="font-size:2rem;color:#fff;margin-top:100px;">⚡ REQUEST RECEIVED ⚡</h1><p style="color:#666;margin-top:20px;">OPERATIONAL ENGINE DEPLOYED. RETURNING HOME...</p></body>`);
    });

    ntfyReq.on('error', (e) => { res.status(500).send('ERROR: ' + e.message); });
    ntfyReq.write(dataBuffer);
    ntfyReq.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

// ==========================================
// PREMIUM FRONTEND V3 (CACHE FORCE)
// ==========================================
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEGAHUB OVERHAUL V3</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background: #000 !important;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-height: 100vh;
            position: relative;
            overflow: hidden;
            padding: 40px 20px;
        }
        
        /* Force Wave Canvas layer over pure black background */
        .wave-container {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            pointer-events: none;
        }
        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }

        .app-container {
            position: relative;
            z-index: 10;
            max-width: 500px;
            margin: 0 auto;
            text-align: center;
        }

        .main-title {
            font-size: 2.8rem;
            font-weight: 900;
            letter-spacing: 4px;
            margin-top: 20px;
            text-transform: uppercase;
        }

        .subtitle {
            font-size: 0.75rem;
            color: #666;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 5px;
            margin-bottom: 40px;
            font-weight: bold;
        }

        .security-btn {
            display: block;
            width: 100%;
            border: 2px solid #fff;
            background: transparent;
            color: #fff;
            padding: 18px;
            border-radius: 50px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-decoration: none;
            font-size: 0.85rem;
            margin-bottom: 50px;
        }

        .section-label {
            text-align: left;
            font-size: 0.9rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 20px;
            font-weight: bold;
        }

        /* Menu Cards */
        .route-card {
            background: rgba(15, 15, 15, 0.9) !important;
            border: 2px solid #222 !important;
            border-radius: 20px;
            padding: 25px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            text-align: left;
            color: #fff !important;
            cursor: pointer !important;
            transition: border-color 0.2s;
        }
        .route-card:active {
            border-color: #fff !important;
        }

        .card-icon {
            font-size: 1.8rem;
            margin-right: 20px;
            width: 40px;
            text-align: center;
        }

        .card-body {
            flex-grow: 1;
        }

        .card-title {
            font-size: 1.1rem;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .card-desc {
            font-size: 0.7rem;
            color: #666;
            letter-spacing: 1px;
            text-transform: uppercase;
            line-height: 1.4;
        }

        .card-arrow {
            font-size: 1.2rem;
            color: #444;
            margin-left: 10px;
        }

        /* Modal Overlays */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99999 !important;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .modal-overlay.active {
            display: flex !important;
        }
        .modal-box {
            background: #111;
            border: 2px solid #333;
            border-radius: 24px;
            width: 100%;
            max-width: 420px;
            padding: 30px;
            text-align: left;
        }
        .modal-header {
            font-size: 1.2rem;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 20px;
            border-bottom: 1px solid #222;
            padding-bottom: 10px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            font-size: 0.75rem;
            color: #888;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 8px;
            font-weight: bold;
        }
        .form-group input, .form-group textarea {
            width: 100%;
            background: #000;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 12px;
            color: #fff;
            font-family: inherit;
            font-size: 0.9rem;
        }
        .form-group input:focus, .form-group textarea:focus {
            outline: none;
            border-color: #fff;
        }
        .modal-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        .btn {
            flex: 1;
            padding: 14px;
            border-radius: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.8rem;
            cursor: pointer;
            border: none;
        }
        .btn-cancel {
            background: #222;
            color: #aaa;
        }
        .btn-submit {
            background: #fff;
            color: #000;
        }
    </style>
</head>
<body>

    <div class="wave-container">
        <canvas id="waveCanvas"></canvas>
    </div>

    <div class="app-container">
        <h1 class="main-title">Megahub</h1>
        <div class="subtitle">// Premium Social Architecture System Module</div>

        <a href="#" class="security-btn">Access Security App Module</a>

        <div class="section-label">| Choose Operational Route</div>

        <!-- Card 1 -->
        <div class="route-card" onclick="openForm('RECOVERY DESK')">
            <div class="card-icon">🛡️</div>
            <div class="card-body">
                <div class="card-title">Recovery Desk</div>
                <div class="card-desc">Appeal System Bans /<br>Restore Blocked Accounts</div>
            </div>
            <div class="card-arrow">➔</div>
        </div>

        <!-- Card 2 -->
        <div class="route-card" onclick="openForm('ACC ENGAGEMENT INCREASER')">
            <div class="card-icon">📈</div>
            <div class="card-body">
                <div class="card-title">Acc Engagement Increaser</div>
                <div class="card-desc">Follower and Views<br>Increase Engine Boost</div>
            </div>
            <div class="card-arrow">➔</div>
        </div>

        <!-- Card 3 -->
        <div class="route-card" onclick="openForm('BUY OLD INSTAGRAM ACCOUNTS')">
            <div class="card-icon">🛍️</div>
            <div class="card-body">
                <div class="card-title">Buy Old Instagram Accounts</div>
                <div class="card-desc">Old Insta Accounts /<br>Old Insta Unc's Available</div>
            </div>
            <div class="card-arrow">➔</div>
        </div>
    </div>

    <!-- Popup Window Form Entry -->
    <div class="modal-overlay" id="ticketModal">
        <div class="modal-box">
            <div class="modal-header" id="modalTitle">Request Option Form</div>
            <form id="pipelineForm" method="POST" action="/submit-ticket">
                <input type="hidden" id="formServiceType" name="serviceType" value="">
                <input type="hidden" name="platform" value="INSTAGRAM">

    
