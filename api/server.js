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
            overflow-x: hidden;
        }
        .header-section {
            background: #000000;
            color: #ffffff;
            text-align: center;
            padding: 60px 20px 80px 20px;
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
            position: relative;
            z-index: 10;
        }
        /* Dynamic interactive water canvas container */
        .wave-divider {
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 60px;
            line-height: 0;
            z-index: 5;
        }
        canvas {
            width: 100%;
            height: 100%;
            display: block;
        }
        .content-section {
            background: #ffffff;
            padding: 30px 24px 60px 24px;
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            position: relative;
            z-index: 10;
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
        <canvas id="waterCanvas"></canvas>
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

<script>
    const canvas = document.getElementById('waterCanvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const springCount = 60;
    const springs = [];
    
    const K = 0.04; 
    const DAMPING = 0.03; 
    const SPREAD = 0.2;

    class WaterNode {
        constructor(x) {
            this.x = x;
            this.currentHeight = height * 0.5;
            this.targetHeight = height * 0.5;
            this.velocity = 0;
        }
        update() {
            const currentDelta = this.targetHeight - this.currentHeight;
            this.velocity += K * currentDelta - this.velocity * DAMPING;
            this.currentHeight += this.velocity;
        }
    }

    for (let i = 0; i < springCount; i++) {
        springs.push(new WaterNode((width / (springCount - 1)) * i));
    }

    function splash(clientX) {
        const rect = canvas.getBoundingClientRect();
        const touchX = clientX - rect.left;
        const targetIndex = Math.floor((touchX / width) * springCount);
        if (targetIndex >= 0 && targetIndex < springCount) {
            springs[targetIndex].velocity = -25;
        }
    }

    // Fixed mobile touch event target handling
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 0) splash(e.touches[0].clientX);
    }, { passive: true });
    
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) splash(e.touches[0].clientX);
    }, { passive: true });

    canvas.addEventListener('mousemove', (e) => {
        splash(e.clientX);
    });

    let loopTracker = 0;
    function runFluidSimulation() {
        loopTracker += 0.04;
        ctx.clearRect(0, 0, width, height);

        const defaultSway = Math.sin(loopTracker) * 3;
        springs.forEach(node => node.targetHeight = (height * 0.5) + defaultSway);

        for (let i = 0; i < springCount; i++) {
            springs[i].update();
        }

        const leftSideDeltas = new Array(springCount).fill(0);
        const rightSideDeltas = new Array(springCount).fill(0);

        for (let calculationPass = 0; calculationPass < 8; calculationPass++) {
            for (let i = 0; i < springCount; i++) {
                if (i > 0) {
                    leftSideDeltas[i] = SPREAD * (springs[i].currentHeight - springs[i - 1].currentHeight);
                    springs[i - 1].velocity += leftSideDeltas[i];
                }
                if (i < springCount - 1) {
                    rightSideDeltas[i] = SPREAD * (springs[i].currentHeight - springs[i + 1].currentHeight);
                    springs[i + 1].velocity += rightSideDeltas[i];
                }
            }
        }

        // Fixed text drawing syntax
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, springs[0].currentHeight);

        for (let i = 1; i < springCount; i++) {
            ctx.lineTo(springs[i].x, springs[i].currentHeight);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        requestAnimationFrame(runFluidSimulation);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    });

    runFluidSimulation();
</script>

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
        
