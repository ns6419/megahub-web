const express = require('express');
const https = require('https');
const app = express();
const NTFY_TOPIC = 'megahub_alerts_9988';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serves the full 8:00 PM original layout safely using compression to prevent phone cutoffs
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
