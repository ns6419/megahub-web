const express = require('express'), https = require('https'), app = express();
const T = 'megahub_alerts_9988', K = process.env.GEMINI_API_KEY;
const html = require('./html');

app.use(express.urlencoded({extended:true})).use(express.json());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.send(html);
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
        
