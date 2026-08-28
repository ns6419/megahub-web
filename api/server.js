const express = require('express');
const https = require('https');
const app = express();
const TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const UI = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEGAHUB</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: #000; color: #fff; font-family: sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .panel { width: 100%; max-width: 400px; padding: 20px; border: 1px solid #222; border-radius: 12px; }
        h1 { margin: 0 0 5px; font-size: 2.5rem; text-transform: uppercase; }
        p { color: #888; font-size: 0.8rem; margin: 0 0 20px; text-transform: uppercase; }
        .card { background: #111; border: 1px solid #222; border-radius: 8px; padding: 15px; margin-bottom: 12px; cursor: pointer; }
        .card:hover { border-color: #fff; }
        h3 { margin: 0 0 4px; text-transform: uppercase; font-size: 1rem; }
        span { font-size: 0.75rem; color: #666; }
        .drawer { position: fixed; bottom: 0; left: 50%; transform: translate(-50%, 100%); width: 100%; max-width: 400px; background: #111; border-top: 2px solid #222; border-radius: 16px 16px 0 0; padding: 20px; z-index: 10; transition: transform 0.3s; }
        .drawer.open { transform: translate(-50%, 0); }
        .overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: none; z-index: 9; }
        .overlay.open { display: block; }
        label { display: block; margin: 12px 0 4px; font-size: 0.75rem; color: #888; text-transform: uppercase; }
        input, textarea { width: 100%; padding: 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: #fff; }
        textarea { height: 70px; resize: none; }
        button { width: 100%; padding: 14px; background: #fff; color: #000; border: none; border-radius: 6px; font-weight: 700; margin-top: 15px; cursor: pointer; text-transform: uppercase; }
    </style>
</head>
<body>

    <h1>MEGAHUB</h1>
    <p>DESIGNED & OWNED BY: HADI</p>

    <div class="panel">
        <div class="card" onclick="op('Recovery Desk')">
            <h3>Recovery Desk</h3>
            <span>Appeal system bans / restore blocked accounts</span>
        </div>
        <div class="card" onclick="op('Acc Engagement Increaser')">
            <h3>Acc Engagement Increaser</h3>
            <span>Follower and views increase engine boost</span>
        </div>
        <div class="card" onclick="op('Buy Old Instagram Accounts')">
            <h3>Buy Old Instagram Accounts</h3>
            <span>Old Instagram profiles available</span>
        </div>
    </div>

    <div class="overlay" id="bg" onclick="cl()"></div>

    <div class="drawer" id="box">
        <h2 id="title" style="margin:0 0 15px;text-transform:uppercase;font-size:1.25rem;">Route</h2>
        <form action="/submit-ticket" method="POST">
            <input type="hidden" id="route" name="serviceType">
            <label>Your Username</label>
            <input type="text" name="targetUser" required placeholder="@username">
            <label>Contact Info</label>
            <input type="text" name="contactPhone" required placeholder="Phone or email">
            <label>Explain Your Problem</label>
            <textarea name="customerNotes" maxlength="150" required placeholder="What help do you need with your platform?"></textarea>
            <button type="submit">Confirm Request</button>
        </form>
    </div>

    <script>
        const box = document.getElementById('box');
        const bg = document.getElementById('bg');
        const title = document.getElementById('title');
        const route = document.getElementById('route');
        function op(name) { title.textContent = name; route.value = name; box.classList.add('open'); bg.classList.add('open'); }
        function cl() { box.classList.remove('open'); bg.classList.remove('open'); }
    </script>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(UI);
});

app.post('/submit-ticket', (req, res) => {
    const { serviceType, targetUser, contactPhone, customerNotes } = req.body;
    const msg = "🚨 MEGAHUB ALERT 🚨\n\n• ROUTE: " + serviceType + "\n• USER: " + targetUser + "\n• CONTACT: " + contactPhone + "\n\n• NOTES:\n" + customerNotes;
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
