const express = require('express');
const axios = require('axios');
const app = express();

const NTFY_TOPIC = 'megahub_alerts_9988'; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MEGAHUB | PREMIUM SOCIAL INFRASTRUCTURE</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; text-transform: uppercase; font-weight: 950; letter-spacing: 2px; }
            body { background-color: #000000; color: #ffffff; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; padding-bottom: 120px; }
            header { text-align: center; margin: 50px 0; }
            header h1 { font-size: 3rem; letter-spacing: 8px; line-height: 1; }
            header p { color: #444; font-size: 0.8rem; margin-top: 10px; }
            .btn-download { display: block; background: #0d0d0d; color: #fff; text-align: center; padding: 18px; border: 2px solid #1c1c1c; text-decoration: none; border-radius: 40px; margin-top: 30px; }
            .section-title { font-size: 0.9rem; border-left: 4px solid #ffffff; padding-left: 10px; margin-bottom: 20px; margin-top: 40px; }
            .services-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
            .option-card { background: #050505; border: 2px solid #111; padding: 24px; border-radius: 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
            .option-card p { color: #555; font-size: 0.75rem; margin-top: 6px; line-height: 1.4; }
            .drawer-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); opacity: 0; pointer-events: none; transition: opacity 0.4s; z-index: 999; }
            .drawer-overlay.active { opacity: 1; pointer-events: auto; }
            .slide-drawer { position: fixed; bottom: 0; left: 0; width: 100%; background: #050505; border-top: 2px solid #1c1c1c; border-top-left-radius: 30px; border-top-right-radius: 30px; padding: 40px 24px; transform: translateY(100%); transition: transform 0.4s; z-index: 1000; max-height: 90vh; overflow-y: auto; }
            .slide-drawer.active { transform: translateY(0); }
            .drawer-handle { width: 50px; height: 6px; background: #222; border-radius: 10px; margin: -20px auto 30px auto; }
            label { display: block; font-size: 0.75rem; margin-bottom: 12px; margin-top: 25px; }
            input, textarea { width: 100%; padding: 16px; background: #0c0c0c; border: 2px solid #1a1a1a; color: #ffffff; border-radius: 14px; font-size: 1rem; }
            input:focus, textarea:focus { border-color: #ffffff; outline: none; }
            textarea { resize: none; font-family: sans-serif; text-transform: uppercase; }
            
            .logo-grid { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
            .logo-grid::-webkit-scrollbar { display: none; }
            .logo-item { background: #0c0c0c; border: 2px solid #1a1a1a; border-radius: 14px; padding: 22px 28px; text-align: center; cursor: pointer; flex-shrink: 0; }
            .logo-item.selected { border-color: #ffffff; background: #111; }
            
            .btn-submit { background: #ffffff; color: #000000; padding: 18px; border-radius: 40px; border: none; width: 100%; margin-top: 35px; cursor: pointer; font-weight: 950; letter-spacing: 2px; }
        </style>
    </head>
    <body>
    <div class="container">
        <header>
            <h1>MEGAHUB</h1>
            <p>// PREMIUM SOCIAL ARCHITECTURE SYSTEM MODULE</p>
            <a href="#" class="btn-download">👑 ACCESS SECURITY APP MODULE</a>
        </header>
        <div class="section-title">CHOOSE OPERATIONAL ROUTE</div>
        <div class="services-grid">
            <div class="option-card" onclick="openDrawer('ACCOUNT RECOVERY')">
                <div>
                    <h3>🛡️ RECOVERY DESK</h3>
                    <p>APPEAL SYSTEM BANS / RESTORE BLOCKED ACCOUNTS</p>
                </div>
                <div>→</div>
            </div>
            <div class="option-card" onclick="openDrawer('FOLLOWER PACKAGES')">
                <div>
                    <h3>📈 METRIC INJECTION</h3>
                    <p>FOLLOWER AND VIEWS INCREASE ENGINE BOOST</p>
                </div>
                <div>→</div>
            </div>
            <div class="option-card" onclick="openDrawer('BUY AGED PROFILE')">
                <div>
                    <h3>🛍️ SECURED ASSET REPOSITORY</h3>
                    <p>OLD INSTA ACCOUNTS / OLD INSTA UNC'S AVAILABLE</p>
                </div>
                <div>→</div>
            </div>
        </div>
    </div>
    
    <div class="drawer-overlay" id="overlay" onclick="closeDrawer()"></div>
    <div class="slide-drawer" id="drawer">
        <div class="drawer-handle" onclick="closeDrawer()"></div>
        <h2 id="drawer-title">ROUTE CONFIGURATION</h2>
        <form action="/submit-ticket" method="POST">
            <input type="hidden" name="serviceType" id="serviceTypeInput">
            <input type="hidden" name="platform" id="platformInput" value="INSTAGRAM">
            
            <label>CHOOSE PLATFORM NETWORK</label>
            <div class="logo-grid">
                <div class="logo-item selected" onclick="selectPlatform(this, 'INSTAGRAM')">INSTAGRAM</div>
                <div class="logo-item" onclick="selectPlatform(this, 'FACEBOOK')">FACEBOOK</div>
                <div class="logo-item" onclick="selectPlatform(this, 'TIKTOK')">TIKTOK</div>
                <div class="logo-item" onclick="selectPlatform(this, 'SNAPCHAT')">SNAPCHAT</div>
                <div class="logo-item" onclick="selectPlatform(this, 'YOUTUBE')">YOUTUBE</div>
                <div class="logo-item" onclick="selectPlatform(this, 'WHATSAPP')">WHATSAPP</div>
            </div>
            
            <label>TARGET ACCOUNT USERNAME</label>
            <input type="text" name="targetUser" placeholder="@USERNAME" required>
            
            <label>YOUR CONTACT WHATSAPP NUMBER</label>
            <input type="tel" name="contactPhone" placeholder="+1234567890" required>

            <label>SPECIFY WHAT HELP YOU NEED</label>
            <textarea name="customerNotes" rows="3" placeholder="UNBAN MY ACCOUNT / NEED 10K FOLLOWERS..." required></textarea>
            
            <button type="submit" class="btn-submit">INITIALIZE ROUTE REQUEST</button>
        </form>
    </div>

    <script>
        function openDrawer(serviceName) {
            document.getElementById('drawer-title').innerText = serviceName;
            document.getElementById('serviceTypeInput').value = serviceName;
            document.getElementById('overlay').classList.add('active');
            document.getElementById('drawer').classList.add('active');
        }
        function closeDrawer() {
            document.getElementById('overlay').classList.remove('active');
            document.getElementById('drawer').classList.remove('active');
        }
        function selectPlatform(element, platformName) {
            document.querySelectorAll('.logo-item').forEach(item => item.classList.remove('selected'));
            element.classList.add('selected');
            document.getElementById('platformInput').value = platformName;
        }
    </script>
    </body>
    </html>
    `);
});

app.post('/submit-ticket', async (req, res) => {
    const { serviceType, platform, targetUser, contactPhone, customerNotes } = req.body;
    
    const textMessage = `🚨 NEW MEGAHUB REQUEST\n\n` +
                        `• ROUTE: ${serviceType}\n` +
                        `• PLATFORM: ${platform}\n` +
                        `• TARGET USER: ${targetUser}\n` +
                        `• PHONE: ${contactPhone}\n` +
                        `• SERVICE HELP DESK: ${customerNotes}`;

    try {
        await axios.post('https://ntfy.sh' + NTFY_TOPIC, textMessage, {
            headers: {
                'Content-Type': 'text/plain',
                'Title': '🚨 MEGAHUB ALERT'
            }
        });
        
        res.send(`
            <body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;letter-spacing:2px;">
                <h1 style="font-size:2rem;color:#fff;margin-top:100px;">⚡ REQUEST RECEIVED ⚡</h1>
                <p style="color:#666;margin-top:20px;">OPERATIONAL ENGINE DEPLOYED. YOU CAN CLOSE THIS TAB.</p>
            </body>
        `);
    } catch (error) {
        console.error('Transmission fail:', error.message);
        res.status(500).send('ERROR: ' + error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
             
