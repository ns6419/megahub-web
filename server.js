const express = require('express');
const https = require('https');
const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serves the operational screen with the dynamic black and white wave background
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MEGAHUB BY HADI</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                background: #000;
                color: #fff;
                text-align: center;
                font-family: sans-serif;
                text-transform: uppercase;
                letter-spacing: 2px;
                min-height: 100vh;
                position: relative;
                overflow-x: hidden;
            }
            /* Wave Canvas Container */
            .wave-container {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                pointer-events: none;
            }
            canvas {
                display: block;
                width: 100%;
                height: 100%;
            }
            /* Main Content Container */
            .content {
                position: relative;
                z-index: 10;
                padding: 50px 20px;
                min-height: 150vh; /* Allows scrolling to trigger swipe/scroll mechanics */
            }
            h1 {
                margin-top: 100px;
                font-size: 2rem;
                text-shadow: 0 0 10px rgba(0,0,0,0.8);
            }
            p {
                color: #aaa;
                margin-top: 20px;
                text-shadow: 0 0 5px rgba(0,0,0,0.8);
            }
            a {
                display: inline-block;
                margin-top: 40px;
                color: #000;
                background: #fff;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 40px;
                font-weight: bold;
                box-shadow: 0 4px 15px rgba(255,255,255,0.2);
                transition: transform 0.2s;
            }
            a:active {
                transform: scale(0.95);
            }
        </style>
    </head>
    <body>

        <!-- Wave Canvas Layer -->
        <div class="wave-container">
            <canvas id="waveCanvas"></canvas>
        </div>

        <!-- Foreground Content Layer -->
        <div class="content">
            <h1>⚡ MEGAHUB OPERATIONAL MODULE ⚡</h1>
            <p>OWNED AND OPERATED BY HADI.</p>
            <a href="https://wa.me">CONTACT VIA WHATSAPP</a>
        </div>

        <script>
            const canvas = document.getElementById('waveCanvas');
            const ctx = canvas.getContext('2d');

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            let targetHeightFactor = 0.2; // Base height of the white wave (20% of screen)
            let currentHeightFactor = 0.2;
            let lastScrollY = window.scrollY;

            // Track scrolling and swipe-driven viewport changes
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > lastScrollY) {
                    // Swiping Up / Scrolling Down -> Wave moves down
                    targetHeightFactor = 0.1;
                } else if (currentScrollY < lastScrollY) {
                    // Swiping Down / Scrolling Up -> White water wave comes up
                    targetHeightFactor = 0.45;
                }
                
                // Return smoothly to default resting height after a small delay
                clearTimeout(window.scrollTimeout);
                window.scrollTimeout = setTimeout(() => {
                    targetHeightFactor = 0.2;
                }, 400);

                lastScrollY = currentScrollY;
            });

            let aliasTime = 0;
            function animate() {
                aliasTime += 0.03;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Smoothly ease the wave position changes
                currentHeightFactor += (targetHeightFactor - currentHeightFactor) * 0.1;
                const waveBaseY = canvas.height * (1 - currentHeightFactor);

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.moveTo(0, canvas.height);
                ctx.lineTo(0, waveBaseY);

                // Create fluid organic wave structures across the layout
                for (let x = 0; x <= canvas.width; x++) {
                    const y = waveBaseY + 
                              Math.sin(x * 0.005 + aliasTime) * 20 + 
                              Math.cos(x * 0.01 + aliasTime * 0.5) * 10;
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(canvas.width, canvas.height);
                ctx.closePath();
                ctx.fill();

                requestAnimationFrame(animate);
            }
            animate();
        </script>
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
        
