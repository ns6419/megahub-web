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
            padding: 160px 20px 180px 20px;
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
        
        /* Interactive Liquid Canvas Container */
        .wave-container {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 220px;
            pointer-events: auto;
        }
        #waterCanvas {
            display: block;
            width: 100%;
            height: 100%;
        }

        .content-section {
            background: #ffffff;
            padding: 50px 24px 60px 24px;
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
    
    <div class="wave-container">
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

    let width, height;
    let points = [];
    const numPoints = 25;       
    const springConstant = 0.035; 
    const damping = 0.93;        
    const spread = 0.12;        
    let baseHeight;

    let lastMouseX = null;
    let lastMouseY = null;

    function resize() {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
        baseHeight = height * 0.45; 

        points = [];
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: (width / (numPoints - 1)) * i,
                y: baseHeight,
                targetY: baseHeight,
                velocity: 0
            });
        }
    }

    function splash(x, force) {
        if (x < 0 || x > width) return;
        const index = Math.round((x / width) * (numPoints - 1));
        if (points[index]) {
            points[index].velocity += force;
        }
    }

    function handleInteraction(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        if (y > baseHeight - 60 && y < baseHeight + 100) {
            if (lastMouseX !== null) {
                const speed = Math.abs(x - lastMouseX);
                const force = Math.min(speed * 0.25, 12); 
                splash(x, (y > baseHeight) ? -force : force);
            }
        }
        lastMouseX = x;
        lastMouseY = y;
    }

    window.addEventListener('mousemove', (e) => handleInteraction(e.clientX, e.clientY));
    
    window.addEventListener('touchmove', (e) => {
        if(e.touches && e.touches.length > 0) {
            handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    window.addEventListener('touchend', () => { lastMouseX = null; });
    window.addEventListener('mouseleave', () => { lastMouseX = null; });

    function updatePhysics() {
        for (let i = 0; i < numPoints; i++) {
            const p = points[i];
            const displacement = p.targetY - p.y;
            p.velocity += springConstant * displacement;
            p.y += p.velocity;
            p.velocity *= damping;
        }

        for (let iteration = 0; iteration < 4; iteration++) {
            for (let i = 0; i < numPoints; i++) {
                if (i > 0) {
                    const leftImpact = spread * (points[i].y - points[i - 1].y);
                    points[i - 1].velocity += leftImpact;
                    points[i - 1].y += leftImpact;
                }
                if (i < numPoints - 1) {
                    const rightImpact = spread * (points[i].y - points[i + 1].y);
                    points[i + 1].velocity += rightImpact;
                    points[i + 1].y += rightImpact;
                }
            }
        }
    }

    function animate() {
        updatePhysics();
        ctx.clearRect(0, 0, width, height);

        const time = Date.now() * 0.002;
        for (let i = 0; i < numPoints; i++) {
            points[i].targetY = baseHeight + Math.sin(time + (i * 0.3)) * 8;
        }

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(points[0].x, points[0].y);

        for (let i = 0; i < numPoints - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        ctx.lineTo(points[numPoints - 1].x, points[numPoints - 1].y);
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
</script>

</body>
</html>
\`;

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
    const textMsg = "🚨 MEGAHUB ALERT 🚨\\n\\n• ROUTE: " + (serviceType || "NONE") + "\\n• PLATFORM: " + (platform || "NONE") + "\\n• NAME: " + (targetUser || "NONE") + "\\n• PHONE: " + (contactPhone || "NONE") + "\\n\\n• NOTES:\\n" + (customerNotes || "NONE");
    const dataBuffer = Buffer.from(textMsg, 'utf-8');
    const options = {
        hostname: 'ntfy.sh',
        path: '/' + NTFY_TOPIC,
        method: 'POST',
        
