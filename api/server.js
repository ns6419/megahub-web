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
<meta name="viewport" 
content="width=device-width,
initial-scale=1.0">
<title>MEGAHUB</title>
<style>
*{box-sizing:border-box}
body{
margin:0;
padding:0;
background:#000;
color:#fff;
font-family:sans-serif;
min-height:100vh;
display:flex;
flex-direction:column;
overflow-x:hidden;
}
.header-section{
background:#000;
color:#fff;
text-align:center;
padding:50px 20px 0;
position:relative;
height:45vh;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
}
.header-section h1{
font-size:3.5rem;
font-weight:900;
margin:0 0 10px;
letter-spacing:4px;
text-transform:uppercase;
}
.header-section p{
color:#fff;
font-size:.8rem;
margin:0 0 20px;
text-transform:uppercase;
letter-spacing:2px;
opacity:.8;
}
.wave-container{
position:absolute;
bottom:-2px;
left:0;
width:100%;
height:90px;
z-index:2;
cursor:pointer;
}
canvas{
display:block;
width:100%;
height:100%;
}
.content-section{
background:#fff;
padding:40px 20px;
flex-grow:1;
display:flex;
flex-direction:column;
align-items:center;
}
.panel{
width:100%;
max-width:400px;
padding:20px;
border:1px solid #e2e2e8;
border-radius:12px;
background:#fff;
}
.card{
background:#f4f4f6;
border:1px solid #e2e2e8;
border-radius:8px;
padding:15px;
margin-bottom:12px;
cursor:pointer;
}
.card:hover{
border-color:#000;
}
h3{
margin:0 0 4px;
text-transform:uppercase;
font-size:1rem;
color:#000;
}
span{
font-size:.75rem;
color:#666;
}
.drawer{
position:fixed;
bottom:0;
left:50%;
transform:translate(-50%,100%);
width:100%;
max-width:400px;
background:#111;
border-top:2px solid #222;
border-radius:16px 16px 0 0;
padding:20px;
z-index:10;
transition:transform .3s;
color:#fff;
}
.drawer.open{
transform:translate(-50%,0);
}
.overlay{
position:fixed;
top:0;
left:0;
width:100vw;
height:100vh;
background:rgba(0,0,0,.7);
display:none;
z-index:9;
}
.overlay.open{
display:block;
}
label{
display:block;
margin:12px 0 4px;
font-size:.75rem;
color:#888;
text-transform:uppercase;
}
input,textarea{
width:100%;
padding:12px;
background:#222;
border:1px solid #333;
border-radius:6px;
color:#fff;
}
textarea{
height:70px;
resize:none;
}
button{
width:100%;
padding:14px;
background:#fff;
color:#000;
border:none;
border-radius:6px;
font-weight:700;
margin-top:15px;
cursor:pointer;
text-transform:uppercase;
}
</style>
</head>
<body>
<div class="header-section">
<h1>MEGAHUB</h1>
<p>DESIGNED & OWNED BY: HADI</p>
<div class="wave-container" 
id="waveBox">
<canvas id="waveCanvas">
</canvas>
</div>
</div>
<div class="content-section">
<div class="panel">
<div class="card" 
onclick="op('Recovery Desk')">
<h3>Recovery Desk</h3>
<span>Appeal system bans</span>
</div>
<div class="card" 
onclick="op('Acc Engagement')">
<h3>Acc Engagement</h3>
<span>Follower engine boost</span>
</div>
<div class="card" 
onclick="op('Buy Old Accounts')">
<h3>Buy Old Accounts</h3>
<span>Instagram profiles</span>
</div>
</div>
</div>
<div class="overlay" 
id="bg" onclick="cl()">
</div>
<div class="drawer" id="box">
<h2 id="title" 
style="margin:0 0 15px;
text-transform:uppercase;
font-size:1.25rem;">Route</h2>
<form action="/submit-ticket" 
method="POST">
<input type="hidden" 
id="route" name="serviceType">
<label>Your Username</label>
<input type="text" 
name="targetUser" required 
placeholder="@username">
<label>Contact Info</label>
<input type="text" 
name="contactPhone" required 
placeholder="Phone or email">
<label>Explain Your Problem</label>
<textarea name="customerNotes" 
maxlength="150" required 
placeholder="What help do you need?">
</textarea>
<button type="submit">
Confirm Request
</button>
</form>
</div>
<script>
const box=
document.getElementById('box');
const bg=
document.getElementById('bg');
const title=
document.getElementById('title');
const route=
document.getElementById('route');
function op(name){
title.textContent=name;
route.value=name;
box.classList.add('open');
bg.classList.add('open');
}
function cl(){
box.classList.remove('open');
bg.classList.remove('remove');
bg.classList.remove('open');
}
const canvas=
document.getElementById('waveCanvas');
const ctx=
canvas.getContext('2d');
const waveBox=
document.getElementById('waveBox');
let width=
canvas.width=waveBox.offsetWidth;
let height=
canvas.height=waveBox.offsetHeight;
const POINTS=25;
const BASE_Y=height*.5;
const TENSION=.02;
const DAMPING=.96;
let springs=[];
for(let i=0;i<POINTS;i++){
springs.push({
y:BASE_Y,
targetY:BASE_Y,
vel:0
});
}
window.addEventListener(
'resize',
()=>{
width=
canvas.width=
waveBox.offsetWidth;
height=
canvas.height=
waveBox.offsetHeight;
}
);
function splash(x,force){
const idx=
Math.floor((x/width)*POINTS);
if(idx>=0&&idx<POINTS)
springs[idx].vel=force;
}
function trigger(e){
const r=
canvas.getBoundingClientRect();
const cx=
e.touches?
e.touches[0].clientX:e.clientX;
splash(cx-r.left,10);
}
canvas.addEventListener(
'mousedown',trigger
);
canvas.addEventListener(
'touchstart',trigger,
{passive:true}
);
let t=0;
function loop(){
t+=.05;
ctx.clearRect(0,0,width,height);
for(let i=0;i<POINTS;i++){
springs[i].targetY=
BASE_Y+Math.sin(t+i*.4)*2;
let diff=
springs[i].y-springs[i].targetY;
springs[i].vel+=
-TENSION*diff-
springs[i].vel*(1-DAMPING);
springs[i].y+=springs[i].vel;
}
let l=new Array(POINTS).fill(0);
let r=new Array(POINTS).fill(0);
for(let k=0;k<4;k++){
for(let i=0;i<POINTS;i++){
if(i>0){
l[i]=
.15*(springs[i].y-
springs[i-1].y);
springs[i-1].vel+=l[i];
}
if(i<POINTS-1){
r[i]=
.15*(springs[i].y-
springs[i+1].y);
springs[i+1].vel+=r[i];
}
}
}
ctx.fillStyle='#fff';
ctx.beginPath();
ctx.moveTo(0,height);
ctx.lineTo(0,springs[0].y);
for(let i=0;i<POINTS-1;i++){
const xc=
(i*(width/(POINTS-1))+
(i+1)*(width/(POINTS-1)))/2;
const yc=
(springs[i].y+
springs[i+1].y)/2;
ctx.quadraticCurveTo(
i*(width/(POINTS-1)),
springs[i].y,xc,yc
);
}
ctx.lineTo(
width,
springs[POINTS-1].y
);
ctx.lineTo(width,height);
ctx.closePath();
ctx.fill();
requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>
\`;
app.get('/',(req,res)=>{
res.setHeader(
'Content-Type',
'text/html; charset=utf-8'
);
res.send(UI);
});
app.post(
'/submit-ticket',
(req,res)=>{
const {
serviceType,
targetUser,
contactPhone,
customerNotes
}=req.body;
const msg=
"🚨ALERT🚨\n\n• ROUTE: "+
serviceType+
"\n• USER: "+targetUser+
"\n• CONTACT: "+contactPhone+
"\n• NOTES:\n"+customerNotes;
const buf=
Buffer.from(msg,'utf-8');
const opt={
hostname:'ntfy.sh',
path:'/'+TOPIC,
method:'POST',
headers:{
'Content-Type':
'text/plain; charset=utf-8',
'Content-Length':
buf.length
}
};
const nreq=
https.request(opt,()=>{
res.send(
'<body style="background:#000;color:#fff;text-align:center;padding:50px;font-family:sans-serif;text-transform:uppercase;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;"><meta http-equiv="refresh" content="3;url=/"><h1>⚡ DATA TRANSMITTED ⚡</h1></body>'
);
});
nreq.on('error',(e)=>{
console.log(e.message);
});
nreq.write(buf);
nreq.end();
});
module.exports = app;
    
