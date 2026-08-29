const express = require('express');
const https = require('https');
const app = express();
const TOPIC = 'megahub_alerts_9988';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>MEGAHUB</title><style>*{box-sizing:border-box;margin:0;padding:0;font-family:sans-serif;}body,html{background:#000;height:100%;overflow-x:hidden;color:#fff;}.wrapper{min-height:85vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;position:relative;z-index:2;}h1{font-size:2.5rem;font-weight:800;margin-bottom:4px;}.card{background:#0c0c0c;border:1px solid #1c1c1c;border-radius:14px;padding:24px;cursor:pointer;width:100%;max-width:440px;margin-bottom:16px;color:#fff;}.nav-header{position:fixed;top:0;right:0;padding:20px;z-index:1000;}#toggle{background:#0c0c0c;border:1px solid #1c1c1c;padding:12px;border-radius:12px;cursor:pointer;font-weight:700;}.wave-box{position:relative;width:100%;height:15vh;background:#000;z-index:1;}canvas{position:absolute;top:0;left:0;width:100%;height:100%;}.bottom-half{width:100%;height:20vh;background:#fff;position:relative;z-index:1;}#drawer{position:fixed;top:0;right:-100%;width:100%;max-width:400px;height:100%;background:#050505;border-left:1px solid #111;transition:0.4s;z-index:999;display:flex;flex-direction:column;}#drawer.open{right:0;}.chat-box{flex:1;padding:24px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;}.msg{padding:12px 16px;border-radius:10px;max-width:85%;}.user{background:#fff;color:#000;align-self:flex-end;}.ai{background:#111;color:#fff;border:1px solid #222;}#overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:none;align-items:center;justify-content:center;z-index:2000;}#overlay.open{display:flex;}.modal{background:#0c0c0c;border:1px solid #1c1c1c;border-radius:14px;padding:28px;width:90%;max-width:400px;}input,textarea{width:100%;background:#111;border:1px solid #222;padding:14px;color:#fff;border-radius:8px;margin-bottom:12px;outline:none;}button{width:100%;background:#fff;color:#000;border:none;padding:14px;border-radius:8px;font-weight:700;cursor:pointer;}</style></head><body><header class="nav-header"><div id="toggle" onclick="tMenu()">MEGA.AI</div></header><div class="wrapper"><h1>MEGAHUB</h1><p style="color:#666;margin-bottom:30px;text-transform:uppercase;font-size:0.8rem;">Designed & Owned By: Hadi</p><div class="card" onclick="oForm('RECOVERY DESK')"><h3>RECOVERY DESK</h3><p style="color:#555;font-size:0.9rem;">Appeal system bans / restore blocked accounts</p></div><div class="card" onclick="oForm('ACC ENGAGEMENT INCREASER')"><h3>ACC ENGAGEMENT INCREASER</h3><p style="color:#555;font-size:0.9rem;">Follower and views increase engine boost</p></div><div class="card" onclick="oForm('BUY OLD INSTAGRAM ACCOUNTS')"><h3>BUY OLD INSTAGRAM ACCOUNTS</h3><p style="color:#555;font-size:0.9rem;">Old Instagram profiles available</p></div></div><div class="wave-box"><canvas id="canvas"></canvas></div><div class="bottom-half"></div><div id="drawer"><div style="padding:32px 24px 20px;border-bottom:1px solid #111;"><h2>MEGA.AI HELP DESK</h2></div><div class="chat-box" id="cBox"><div class="msg ai">Hello! I am MEGA.AI by HADI. How can I help?</div></div><div style="padding:20px;display:flex;gap:12px;"><input id="aiInp" placeholder="Type a message..."><button onclick="askAI()">Send</button></div></div><div id="overlay"><div class="modal"><h3 id="mTitle" style="margin-bottom:18px;">Submit Ticket</h3><input type="hidden" id="sType"><input id="tUser" placeholder="Your Username"><input id="tPhone" placeholder="Your Contact Details"><textarea id="tNotes" placeholder="Explain your problem..." style="height:100px;resize:none;"></textarea><button onclick="subT()">Submit Request</button><button onclick="cForm()" style="background:#222;color:#fff;margin-top:8px;">Cancel</button></div></div><script>function tMenu(){document.getElementById('drawer').classList.toggle('open');}function oForm(n){document.getElementById('sType').value=n;document.getElementById('mTitle').innerText=n;document.getElementById('overlay').classList.add('open');}function cForm(){document.getElementById('overlay').classList.remove('open');}async function subT(){const s=document.getElementById('sType').value,u=document.getElementById('tUser').value.trim(),p=document.getElementById('tPhone').value.trim(),n=document.getElementById('tNotes').value.trim();if(!u||!p||!n)return alert('Fill all options');try{const res=await fetch('/submit-ticket',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({serviceType:s,targetUser:u,contactPhone:p,customerNotes:n})});const d=await res.json();if(d.success){alert('Request sent!');cForm();}}catch{alert('Error');}}async function askAI(){const inp=document.getElementById('aiInp'),box=document.getElementById('cBox'),prompt=inp.value.trim();if(!prompt)return;const u=document.createElement('div');u.className='msg user';u.innerText=prompt;box.appendChild(u);inp.value='';const a=document.createElement('div');a.className='msg ai';a.innerText='Thinking...';box.appendChild(a);box.scrollTop=box.scrollHeight;try{const res=await fetch('/api/ask-ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});const d=await res.json();a.innerText=d.reply;}catch{a.innerText='AI Offline.';}box.scrollTop=box.scrollHeight;}const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');let w=canvas.width=canvas.offsetWidth,h=canvas.height=canvas.offsetHeight,rip=0;function draw(){ctx.clearRect(0,0,w,h);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(0,h);for(let i=0;i<=8;i++){let x=(w/8)*i,y=h/2+Math.sin(Date.now()*0.003+i)*(12+rip);ctx.lineTo(x,y);}ctx.lineTo(w,h);ctx.closePath();ctx.fill();if(rip>0)rip*=0.96;requestAnimationFrame(draw);}window.addEventListener('click',()=>{rip=45;});draw();</script></body></html>`;

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
});

app.post('/api/ask-ai', (req, res) => {
    const { prompt } = req.body;
    const sys = "You are MEGA.AI by HADI. Help with boosts and recovery.";
    const data = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } });
    const opt = { 
        hostname: '://googleapis.com', 
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } 
    };
    const aiReq = https.request(opt, (aiRes) => {
        let body = ''; aiRes.on('data', (c) => body += c);
        aiRes.on('end', () => { 
            try { 
                const resJson = JSON.parse(body);
                // Fixed layout indices structure [0] to target properties correctly
                res.json({ reply: resJson.candidates[0].content.parts[0].text.trim() }); 
            } catch(e) { res.json({ reply: "AI line fluctuation." }); } 
        });
    });
    aiReq.on('error', () => res.json({ reply: "AI error." }));
    aiReq.write(data); aiReq.end();
});

app.post('/submit-ticket', (req, res) => {
    const { serviceType, targetUser, contactPhone, customerNotes } = req.body;
    const msg = `🚨 MEGAHUB ALERT 🚨\n\n• SERVICE: ${serviceType}\n• USER: ${targetUser}\n• CONTACT: ${contactPhone}\n\n• NOTES:\n${customerNotes}`;
    const buf = Buffer.from(msg, 'utf-8');
    const opt = { hostname: 'ntfy.sh', path: '/' + TOPIC, method: 'POST', headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': buf.length } };
    const nreq = https.request(opt, () => { res.json({ success: true }); });
    nreq.on('error', (e) => res.status(500).json({ error: e.message }));
    nreq.write(buf); nreq.end();
});

module.exports = app;
                                              
