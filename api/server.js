const express = require('express');
const https = require('https');
const app = express();
const TOPIC = 'megahub_alerts_9988';
const NTFY_TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const UI = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>MEGAHUB</title>
    <style>
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { 
            margin: 0; 
            padding: 0; 
            background: #000; 
            color: #fff; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden; 
        }

        /* --- MOBILE CONTAINER SPACING --- */
        .app-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 85px;
            padding: 16px;
            position: relative;
            z-index: 5;
        }

        .panel { 
            width: 100%; 
            max-width: 400px; 
            padding: 20px; 
            border: 1px solid #222; 
            border-radius: 12px; 
            background: #000; 
            position: relative; 
            z-index: 5; 
        }
        h1, p { 
            text-align: center; 
            position: relative; 
            z-index: 5; 
            text-transform: uppercase; 
        }
        h1 { margin: 10px 0 5px; font-size: 2.2rem; }
        p { color: #888; font-size: 0.75rem; margin: 0 0 20px; }
        .card { 
            background: #111; 
            border: 1px solid #222; 
            border-radius: 8px; 
            padding: 16px; 
            margin-bottom: 12px; 
            cursor: pointer; 
            touch-action: manipulation;
        }
        .card:active { border-color: #fff; background: #161616; }
        h3 { margin: 0 0 4px; text-transform: uppercase; font-size: 0.95rem; color: #fff; }
        span { font-size: 0.72rem; color: #666; }
        
        /* --- HIGH PERFORMANCE HARDWARE NAV HEADERS --- */
        .megahub-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 70px;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border-bottom: 1px solid #111;
            display: flex;
            align-items: center;
            padding: 0 20px;
            z-index: 1000;
            transform: translateZ(0); /* Forces GPU Acceleration on Mobile Phones */
        }

        /* Rounded badge container matching image profile geometry exactly */
        .menu-btn {
            width: 44px;
            height: 44px;
            background: #111111;
            border: 1px solid #222;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            touch-action: manipulation;
        }
        .menu-btn:active {
            border-color: #555;
            background: #1a1a1a;
        }
        .vector-container {
            width: 100%;
            height: 100%;
        }

        /* Continuous monoline configuration matching image aesthetics */
        .burger-line, .custom-logo-path {
            fill: none;
            stroke: #ffffff;
            stroke-width: 8.5;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .custom-logo-path {
            stroke-dasharray: 400;
            stroke-dashoffset: 400;
            opacity: 0;
        }

        /* Hamburger bars transition sequence mapping */
        .menu-btn.active .burger-line.top { transform: translateY(18px) rotate(45deg); transform-origin: center; opacity: 0; }
        .menu-btn.active .burger-line.mid { transform: scaleX(0); opacity: 0; }
        .menu-btn.active .burger-line.bot { transform: translateY(-18px) rotate(-45deg); transform-origin: center; opacity: 0; }

        /* Direct transformation trace visibility reveal */
        .menu-btn.active .custom-logo-path {
            opacity: 1;
            stroke-dashoffset: 0;
            transition-delay: 0.08s;
        }

        /* Slow swipe horizontal display text slide */
        .swipe-text {
            color: #ffffff;
            font-size: 1.15rem;
            font-weight: 800;
            letter-spacing: 3px;
            margin-left: 14px;
            opacity: 0;
            transform: translateX(-20px);
            transition: opacity 0.65s cubic-bezier(0.25, 1, 0.5, 1), transform 0.65s cubic-bezier(0.25, 1, 0.5, 1);
            transition-delay: 0.28s;
            text-transform: uppercase;
        }
        .menu-btn.active + .swipe-text {
            opacity: 1;
            transform: translateX(0);
        }

        /* --- MOBILE OPTIMIZED DRAWER MECHANICS --- */
        .mega-ai-alert {
            position: fixed;
            bottom: -220px;
            left: 50%;
            transform: translateX(-50%);
            width: 92%;
            max-width: 380px;
            background: #111;
            border: 1px solid #ff3333;
            border-radius: 14px;
            padding: 18px;
            text-align: center;
            transition: bottom 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.15);
            z-index: 999;
            box-shadow: 0 8px 30px rgba(255, 51, 51, 0.2);
        }
        .mega-ai-alert.show { bottom: 20px; }
        .ai-headline { color: #ff3333; font-size: 0.8rem; margin: 0; letter-spacing: 1px; font-weight: bold; text-transform: uppercase; }
        .ai-instructions { color: #777; font-size: 0.72rem; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }

        .wave-container { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            z-index: 1; 
        }
        canvas { display: block; width: 100%; height: 100%; }
            <!-- Delete everything from here down in your old file and paste this: -->
    <div class="drawer" id="box">
        <h2 id="title" style="margin:0 0 15px;text-transform:uppercase;font-size:1.15rem;">Route</h2>
        <form action="/submit-ticket" method="POST">
            <input type="hidden" id="route" name="serviceType">
            <label>Your Username</label>
            <input type="text" name="targetUser" required placeholder="@username">
            <label>Contact Info</label>
            <input type="text" name="contactPhone" required placeholder="Phone or email">
            <label>Explain Your Problem</label>
            <textarea name="customerNotes" maxlength="150" required placeholder="What help do you need?"></textarea>
            <button type="submit">Confirm Request</button>
        </form>
    </div>

    <script>
        const box = document.getElementById('box');
        const bg = document.getElementById('bg');
        const title = document.getElementById('title');
        const route = document.getElementById('route');
        const menuToggle = document.getElementById('menuToggle');
        const megaAiWidget = document.getElementById('megaAiWidget');

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
        });

        function op(name) { title.textContent = name; route.value = name; box.classList.add('open'); bg.classList.add('open'); }
        function cl() { box.classList.remove('open'); bg.classList.remove('open'); }

        const canvas = document.getElementById('waveCanvas');
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const POINTS = 16;
        let BASE_Y = height * 0.83; 
        const TENSION = 0.015;
        const DAMPING = 0.95;

        let springs = [];
        for (let i = 0; i < POINTS; i++) {
            springs.push({ y: BASE_Y, targetY: BASE_Y, vel: 0 });
        }

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            BASE_Y = height * 0.83;
        });

        let waveTapSequenceCounter = 0;
        let waveSequenceResetTimer;

        function splash(x, force) {
            const idx = Math.floor((x / width) * POINTS);
            if (idx >= 0 && idx < POINTS) springs[idx].vel = force;

            if (megaAiWidget.classList.contains('show')) {
                waveTapSequenceCounter++;
                clearTimeout(waveSequenceResetTimer);
                waveSequenceResetTimer = setTimeout(() => { waveTapSequenceCounter = 0; }, 1000);

                if (waveTapSequenceCounter >= 3) {
                    processHardwareSystemReboot();
                }
            }
        }

        function handleInteraction(e) {
            const r = canvas.getBoundingClientRect();
            const cx = e.touches && e.touches.length > 0 ? e.touches.clientX : e.clientX;
            if(cx !== undefined) {
                splash(cx - r.left, 26);
            }
        }

        canvas.addEventListener('mousedown', handleInteraction);
        canvas.addEventListener('touchstart', handleInteraction, { passive: true });

        if (window.DeviceMotionEvent) {
            let previousX, previousY;
            let totalShakePointsAccumulated = 0;

            window.addEventListener('devicemotion', (event) => {
                let motionAccel = event.accelerationIncludingGravity;
                if (!motionAccel || !motionAccel.x || !megaAiWidget.classList.contains('show')) return;

                if (previousX !== undefined) {
                    let diffMotionX = Math.abs(previousX - motionAccel.x);
                    let diffMotionY = Math.abs(previousY - motionAccel.y);

                    if (diffMotionX > 14 && diffMotionY > 14) {
                        totalShakePointsAccumulated++;
                        if (totalShakePointsAccumulated > 5) {
                            processHardwareSystemReboot();
                        }
                    }
                }
                previousX = motionAccel.x;
                previousY = motionAccel.y;
            });
        }

        function processHardwareSystemReboot() {
            megaAiWidget.querySelector('.ai-headline').innerText = "⚡ MEGA.AI: PURGING CACHE... REBOOTING";
            for (let i = 0; i < POINTS; i++) {
                springs[i].vel = (Math.random() - 0.5) * 70;
            }
            setTimeout(() => {
                location.reload();
            }, 900);
        }

        window.addEventListener('error', () => {
            megaAiWidget.classList.add('show');
        });

        window.simulateBug = function() {
            window.dispatchEvent(new Event('error'));
        };

        let t = 0;
        function loop() {
            t += 0.035;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < POINTS; i++) {
                springs[i].targetY = BASE_Y + Math.sin(t + i * 0.6) * 7;
                let diff = springs[i].y - springs[i].targetY;
                springs[i].vel += -TENSION * diff - springs[i].vel * (1 - DAMPING);
                springs[i].y += springs[i].vel;
            }

            let l = new Array(POINTS).fill(0), r = new Array(POINTS).fill(0);
            for (let k = 0; k < 4; k++) {
                for (let i = 0; i < POINTS; i++) {
                    if (i > 0) { l[i] = 0.18 * (springs[i].y - springs[i-1].y); springs[i-1].vel += l[i]; }
                    if (i < POINTS - 1) { r[i] = 0.18 * (springs[i].y - springs[i+1].y); springs[i+1].vel += r[i]; }
                }
            }

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(0, height);
            ctx.lineTo(0, springs[0].y); // Fixed typo here

            for (let i = 0; i < POINTS - 1; i++) {
                const xc = (i * (width / (POINTS - 1)) + (i + 1) * (width / (POINTS - 1))) / 2;
                const yc = (springs[i].y + springs[i + 1].y) / 2;
                ctx.quadraticCurveTo(i * (width / (POINTS - 1)), springs[i].y, xc, yc);
            }

            ctx.lineTo(width, springs[POINTS - 1].y);
            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();

            requestAnimationFrame(loop);
        }
        loop();
    </script>
</body>
</html>
\`;

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(UI);
});

app.post('/submit-ticket', (req, res) => {
    const { serviceType, targetUser, contactPhone, customerNotes } = req.body;
    const msg = "🚨 MEGAHUB ALERT 🚨\\n\\n• ROUTE: " + serviceType + "\\n• USER: " + targetUser + "\\n• CONTACT: " + contactPhone + "\\n\\n• NOTES:\\n" + customerNotes;
    const buf = Buffer.from(msg, 'utf-8');
    const opt = {
        hostname: 'ntfy.sh',
        path: '/' + TOPIC,
        method: 'POST',
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': buf.length }
    };
    const nreq = https.request(opt, () => {
        res.send('<body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;"><meta http-equiv="refresh" content="3;url=/"><h1>⚡ DATA TRANSMITTED ⚡</h1></body>');
    });
    nreq.on('error', (e) => { res.status(500).send('ERROR: ' + e.message); });
    nreq.write(buf);
    nreq.end();
});

module.exports = app;

        
