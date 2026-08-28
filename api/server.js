const HTML_CONTENT = `
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
            background: #000000;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
        }
        
        .header-section {
            background: #000000;
            color: #ffffff;
            text-align: center;
            padding: 40px 20px 20px 20px;
        }
        .header-section h1 {
            font-size: 3.5rem;
            font-weight: 900;
            margin: 0 0 10px 0;
            letter-spacing: 4px;
            text-transform: uppercase;
        }
        .header-section p {
            font-size: 0.75rem;
            color: #ffffff;
            margin: 0 0 25px 0;
            letter-spacing: 3px;
            text-transform: uppercase;
            font-weight: 600;
            opacity: 0.8;
        }

        .sec-btn {
            display: inline-block;
            background: transparent;
            color: #ffffff;
            border: 2px solid #ffffff;
            padding: 14px 30px;
            border-radius: 30px;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            text-decoration: none;
            margin-bottom: 20px;
        }

        .content-section {
            background: #000000;
            padding: 10px 20px 40px 20px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .panel-container {
            width: 100%;
            max-width: 420px;
        }

        .section-title {
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 700;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .section-title::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 16px;
            background: #ffffff;
        }

        .route-card {
            background: #000000;
            border: 1px solid #222222;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 20px;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
            position: relative;
        }
        .route-card:hover, .route-card.active-card {
            border-color: #ffffff;
        }
        .card-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
        }
        .card-icon svg {
            width: 100%;
            height: 100%;
            fill: none;
            stroke: #ffffff;
            stroke-width: 2;
        }
        .card-info {
            flex-grow: 1;
        }
        .card-info h3 {
            margin: 0 0 6px 0;
            font-size: 1.05rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 700;
        }
        .card-info p {
            margin: 0;
            font-size: 0.65rem;
            color: #666666;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            line-height: 1.4;
        }
        .card-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .card-arrow svg {
            width: 18px;
            height: 18px;
            fill: none;
            stroke: #444444;
            stroke-width: 2.5;
            transition: stroke 0.2s;
        }
        .route-card:hover .card-arrow svg, .route-card.active-card .card-arrow svg {
            stroke: #ffffff;
        }

        .detail-drawer {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 100%);
            width: 100%;
            max-width: 440px;
            background: #111111;
            border-top: 2px solid #222222;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            padding: 30px 24px;
            z-index: 10;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
        }
        .detail-drawer.open {
            transform: translate(-50%, 0);
        }
        
        .drawer-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.7);
            z-index: 9;
            display: none;
            backdrop-filter: blur(2px);
        }
        .drawer-overlay.open {
            display: block;
        }

        .drawer-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
        }
        .drawer-title-group h2 {
            margin: 0 0 4px 0;
            font-size: 1.25rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }
        .drawer-title-group span {
            font-size: 0.7rem;
            color: #888888;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .close-btn {
            background: transparent;
            border: none;
            color: #666666;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0 5px;
            line-height: 1;
        }
        .close-btn:hover {
            color: #ffffff;
        }

        .form-group {
            margin-bottom: 20px;
            position: relative;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888888;
            font-weight: 700;
        }
        input, textarea {
            width: 100%;
            padding: 14px;
            background: #1a1a1a;
            border: 1px solid #333333;
            border-radius: 8px;
            color: #ffffff;
            font-size: 0.95rem;
            transition: border-color 0.2s;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #ffffff;
        }
        textarea {
            min-height: 85px;
            resize: none;
        }
        .char-counter {
            text-align: right;
            font-size: 0.65rem;
            color: #555555;
            margin-top: 4px;
            letter-spacing: 1px;
        }

        button.submit-btn {
            width: 100%;
            padding: 16px;
            background: #ffffff;
            color: #000000;
            border: none;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }
        button.submit-btn:disabled {
            background: #444444;
            color: #888888;
            cursor: not-allowed;
        }
        .spinner {
            display: none;
            width: 16px;
            height: 16px;
            border: 2px solid #000000;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>

<div class="header-section">
    <h1>MEGAHUB</h1>
    <p>DESIGNED & OWNED BY: HADI</p>
    <a href="#" class="sec-btn">Access Security App Module</a>
</div>

<div class="content-section">
    <div class="panel-container">
        <div class="section-title">Choose Operational Route</div>

        <!-- Route 1 -->
        <div class="route-card" onclick="openRoute('Recovery Desk', 'Appeal system bans / restore blocked accounts')">
            <div class="card-icon">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="card-info">
                <h3>Recovery Desk</h3>
                <p>Appeal system bans / restore blocked accounts</p>
            </div>
            <div class="card-arrow">
                <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
        </div>

        <!-- Route 2 -->
        <div class="route-card" onclick="openRoute('Acc Engagement Increaser', 'Follower and views increase engine boost')">
            <div class="card-icon">
                <svg viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6"/></svg>
            </div>
            <div class="card-info">
                <h3>Acc Engagement Increaser</h3>
                <p>Follower and views increase engine boost</p>
            </div>
            <div class="card-arrow">
                <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
        </div>

        <!-- Route 3 -->
        <div class="route-card" onclick="openRoute('Buy Old Instagram Accounts', 'Old Insta Accounts / Old Insta UNC\\'s Available')">
            <div class="card-icon">
            
