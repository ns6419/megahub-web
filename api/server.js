const express = require('express'), https = require('https'), app = express();
const T = 'megahub_alerts_9988', K = process.env.GEMINI_API_KEY;
app.use(express.urlencoded({extended:true})).use(express.json());

app.get('/', (req, res) => {
    https.get('https://vercel.app', (vercelRes) => {
        let body = '';
        vercelRes.on('data', (chunk) => body += chunk);
        vercelRes.on('end', () => {
            let modified = body
                .replace('overflow:hidden;', 'overflow-y:auto;')
                .replace('.wrapper{position:absolute;top:0;left:0;width:100%;height:85vh;', '.wrapper{position:absolute;top:0;left:0;width:100%;min-height:85vh;padding:80px 20px 40px;')
                .replace('<h3>BUY OLD INSTAGRAM ACCOUNTS</h3><p style="color:#555;font-size:0.85rem;">Old Instagram profiles available</p></div></div>', '<h3>BUY OLD INSTAGRAM ACCOUNTS</h3><p style="color:#555;font-size:0.85rem;">Old Instagram profiles available</p></div><div class="card" onclick="oForm(\'WEB DEVELOPMENT\')"><h3>WEB DEVELOPMENT</h3><p style="color:#555;font-size:0.85rem;">Custom site creation / design and hosting setup</p></div></div>')
                .replace('<div class="quick-btn" onclick="sq(3)">🚀 How do I order a boost right now?</div></div>', '<div class="quick-btn" onclick="sq(3)">🚀 How do I order a boost right now?</div><div class="quick-btn" onclick="sq(4)">💻 Looking for Web Development?</div></div>')
                .replace('else if(i===3){u="How do I order a boost right now?";a="To place an order, close this AI drawer and tap directly on \'ACC ENGAGEMENT INCREASER\' or \'BUY OLD INSTAGRAM ACCOUNTS\' on the dashboard!";}', 'else if(i===3){u="How do I order a boost right now?";a="To place an order, close this AI drawer and tap directly on \'ACC ENGAGEMENT INCREASER' or \'BUY OLD INSTAGRAM ACCOUNTS\' on the dashboard!";}else if(i===4){u="Looking for Web Development?";a="To start a new web development project, close this AI drawer and click directly on the \'WEB DEVELOPMENT\' card to submit your project requirements!";}');
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.send(modified);
        });
    }).on('error', () => {
        res.status(500).send("System line fluctuation.");
    });
});

app.post('/api/ask-ai', (req, res) => {
    const {prompt} = req.body;
    if(!K || K === 'undefined' || K.length < 5) return res.json({reply: gl(prompt)});
    const sys = "You are MEGA.AI by HADI. Expert assistant for system boosts, account recovery desk, and professional web development. If a user asks to make, build, design, or code a website, app, landing page, portfolio, shop, e-commerce platform, WordPress or custom site, enthusiastically confirm that we offer Web Development services and tell them how to submit a ticket.";
    const data = JSON.stringify({contents:[{parts:[{text:prompt}]}],systemInstruction:{parts:[{text:sys}]}});
    const opt = {hostname: '://googleapis.com', path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${K}`, method: 'POST', headers: {'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data)}};
    const aiReq = https.request(opt, (aiRes) => {
        let body = ''; aiRes.on('data', (c) => body += c);
        aiRes.on('end', () => {
            try {
                const r = JSON.parse(body);
                if(r.candidates && r.candidates.content && r.candidates.content.parts) res.json({reply: r.candidates.content.parts.text.trim()});
                else res.json({reply: gl(prompt)});
            } catch { res.json({reply: gl(prompt)}); }
        });
    });
    aiReq.on('error', () => res.json({reply: gl(prompt)}));
    aiReq.write(data); aiReq.end();
});

function gl(p) {
    const s = p.toLowerCase();
    if(s.includes('help') || s.includes('hi') || s.includes('hello')) return "Hello! I am MEGA.AI by HADI. Tap a quick option above or ask me about boosts, recovery, or website creation.";
    if(s.includes('recovery') || s.includes('ban') || s.includes('block') || s.includes('appeal')) return "To appeal a ban, close this drawer and click on the 'RECOVERY DESK' card to submit a ticket.";
    if(s.includes('boost') || s.includes('follower') || s.includes('views') || s.includes('like')) return "For follower/view boosts, click on the 'ACC ENGAGEMENT INCREASER' card panel.";
    if(s.includes('web') || s.includes('site') || s.includes('develop') || s.includes('code') || s.includes('build') || s.includes('portfolio') || s.includes('landing') || s.includes('page') || s.includes('app') || s.includes('wordpress') || s.includes('shopify') || s.includes('ecom') || s.includes('shop') || s.includes('create') || s.includes('make a website')) {
        return "💻 Yes, we do Web Development! We specialize in custom business websites, high-converting landing pages, creative portfolios, and full hosting setups. Please let us know your design requirements, and we'll build it for you.";
    }
    return "I am tracking your request. Let me know how I can help you with your dashboard ticket submissions.";
}

app.post('/submit-ticket', (req, res) => {
    const {serviceType, targetUser, contactPhone, customerNotes} = req.body;
    const msg = `🚨 MEGAHUB ALERT 🚨\n\n• SERVICE: ${serviceType}\n• USER: ${targetUser}\n• CONTACT: ${contactPhone}\n\n• NOTES:\n${customerNotes}`;
    const buf = Buffer.from(msg, 'utf-8');
    const opt = {hostname: 'ntfy.sh', path: '/' + T, method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8', 'Content-Length': buf.length}};
    const nreq = https.request(opt, () => { res.json({success: true}); });
    nreq.on('error', (e) => res.status(500).json({error: e.message}));
    nreq.write(buf); nreq.end();
});

module.exports = app;
                     
