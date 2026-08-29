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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MEGAHUB</title>
    <style>
        * { box-sizing: border-box; }
        body { 
            margin: 0; 
            padding: 0; 
            background: #000; 
            color: #fff; 
            font-family: sans-serif; 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            overflow-x: hidden; 
        }
        
        /* Top Navigation Bar Overlay */
        .top-navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            z-index: 20;
            background: transparent;
        }

        /* 3-Line Menu Trigger Button Style */
        .menu-trigger {
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 24px;
            height: 16px;
            padding: 0;
            z-index: 21;
        }
        .menu-trigger span {
            display: block;
            width: 100%;
            height: 2.5px;
            background-color: #fff;
            border-radius: 2px;
            transition: all 0.3s ease;
        }

        /* Full Screen Animated Nav Section Panel */
        .nav-section {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #0d0d0d;
            z-index: 30;
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            padding: 20px;
            display: flex;
            flex-direction: column;
        }
        .nav-section.active {
            transform: translateX(0);
        }

        .nav-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 60px;
            margin-bottom: 40px;
        }

        .logo-brand-combo {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        /* Morphing App Icon Animation Rules */
        .app-logo {
            width: 44px;
            height: 44px;
            opacity: 0;
            transform: scale(0.6) rotate(-45deg);
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;
        }
        .nav-section.active .app-logo {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }

        /* Sliding Brand Text Dynamic Reveal */
        .sliding-title {
            font-size: 1.5rem;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #fff;
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.4s ease 0.4s;
        }
        .nav-section.active .sliding-title {
            opacity: 1;
            transform: translateX(0);
        }

        /* Close Window 'X' Button on Right Corner Edge */
        .close-btn {
            background: none;
            border: none;
            color: #fff;
            font-size: 2rem;
            cursor: pointer;
            line-height: 1;
            padding: 5px;
        }

        /* Integrated AI Section Layout Component */
        .menu-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
            max-width: 400px;
            width: 100%;
            margin: 0 auto;
        }
        .ai-section-box {
            background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
            border: 1px solid #262626;
            border-radius: 16px;
            padding: 24px;
            position: relative;
            overflow: hidden;
        }
        .ai-section-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #ffffff, #444444);
        }
        .ai-badge {
            background: #fff;
            color: #000;
            font-size: 0.65rem;
            font-weight: bold;
            padding: 3px 8px;
            border-radius: 20px;
            text-transform: uppercase;
            display: inline-block;
            margin-bottom: 12px;
        }
        .ai-title {
            margin: 0 0 8px 0;
            font-size: 1.25rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .ai-desc {
            color: #a3a3a3;
            font-size: 0.85rem;
            line-height: 1.4;
            margin: 0 0 20px 0;
        }
        .ai-action-btn {
            width: 100%;
            padding: 14px;
            background: #ffffff;
            color: #000000;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.85rem;
            cursor: pointer;
        }

        /* Landing Dashboard Spatial realignments */
        .brand-header {
            width: 100%;
            text-align: center;
            padding-top: 85px; /* Clearing room for top pinned navbar */
            padding-bottom: 10px;
            position: relative;
            z-index: 5;
        }
        h1, p { 
            text-align: center; 
            position: relative; 
            z-index: 5; 
            text-transform: uppercase; 
        }
        h1 { margin: 0 0 5px; font-size: 2.5rem; font-weight: bold; }
        p { color: #888; font-size: 0.8rem; margin: 0 0 35px; }

        .panel { 
            width: 100%; 
            max-width: 400px; 
            padding: 20px; 
            border-radius: 12px; 
            background: transparent; 
            position: relative; 
            z-index: 5; 
            margin-top: 15px;
        }
        .card { 
            background: #0d0d0d; 
            border: 1px solid #1a1a1a; 
            border-radius: 12px; 
            padding: 20px 16px; 
            margin-bottom: 12px; 
            cursor: pointer; 
            transition: transform 0.2s, border-color 0.2s;
        }
        .card:hover { border-color: #444; transform: translateY(-1px); }
        h3 { margin: 0 0 6px; text-transform: uppercase; font-size: 1rem; color: #fff; }
        span { font-size: 0.78rem; color: #666; display: block; }
        
        /* Premium Floating Fluid Wave Layout Layer Area */
        .wave-container { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            z-index: 1; 
            pointer-events: none;
        }
        canvas { display: block; width: 100%; height: 100%; pointer-events: auto; }
        
        .drawer { 
            position: fixed; 
            bottom: 0; 
            left: 50%; 
            transform: translate(-50%, 100%); 
            width: 100%; 
            max-width: 400px; 
            background: #111; 
            border-top: 2px solid #222; 
            border-radius: 16px 16px 0 0; 
            padding: 20px; 
            z-index: 10; 
            transition: transform 0.3s; 
            color: #fff; 
        }
        .drawer.open { transform: translate(-50%, 0); }
        .overlay { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            background: rgba(0,0,0,0.7); 
            display: none; 
            z-index: 9; 
        }
        .overlay.open { display: block; }
        label { display: block; margin: 12px 0 4px; font-size: 0.75rem; color: #888; text-transform: uppercase; }
        input, textarea { width: 100%; padding: 12px; background: #222; border: 1px solid #333; border-radius: 6px; color: #fff; }
        textarea { height: 70px; resize: none; }
        button { 
            width: 100%; 
            padding: 14px; 
            background: #fff; 
            color: #000; 
            border: none; 
            border-radius: 6px; 
            font-weight: 700; 
            margin-top: 15px; 
            cursor: pointer; 
            text-transform: uppercase; 
        }
    </style>
</head>
<body>

    <!-- Pinned Top Navbar Component Frame Trigger Row -->
    <div class="top-navbar">
        <button class="menu-trigger" onclick="toggleMenu(true)" aria-label="Open Menu Section">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>

    <!-- Pinned Slide-Out Full Screen Sidebar Navigation Overlay Frame -->
    <div class="nav-section" id="navSection">
        <div class="nav-header">
            <div class="logo-brand-combo">
                <!-- Custom "M" Embedded SVG Vector App Icon Matrix -->
                <svg class="app-logo" viewBox="0 0 100 100" xmlns="http://w3.org">
                    <rect x="2" y="2" width="96" height="96" rx="26" fill="#171717" stroke="#333" stroke-width="2"/>
                    <path d="M 28 66 C 26 38, 44 32, 44 48 C 44 54, 50 60, 50 60 C 50 60, 56 54, 56 48 C 56 32, 74 38, 72 66" 
                          fill="none" stroke="#ffffff" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
                          
