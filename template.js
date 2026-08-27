module.exports = {
    HTML_CODE: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>MEGAHUB</title>
    <meta name="author" content="HADI">
    <meta name="owner" content="HADI">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: sans-serif;
            text-transform: uppercase;
            font-weight: 950;
            letter-spacing: 2px;
            user-select: none;
            -webkit-user-select: none;
        }
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000000;
        }
        body {
            display: flex;
            flex-direction: column;
            position: relative;
        }
        canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            pointer-events: auto;
            touch-action: none;
        }
        .container {
            position: absolute;
            top: 18%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            max-width: 600px;
            text-align: center;
            z-index: 3;
            pointer-events: none;
        }
        header h1 {
            font-size: 3.2rem;
            letter-spacing: 8px;
            color: #fff;
            text-shadow: 0 4px 15px rgba(0,0,0,0.6);
        }
        .owner-badge {
            margin-top: 12px;
            font-size: 0.75rem;
            color: #666;
            letter-spacing: 4px;
            font-weight: 700;
        }
        .owner-badge span {
            color: #fff;
            font-weight: 950;
        }
        .whatsapp-float {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #000;
            border: 2px solid #fff;
            border-radius: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 998;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: all .3s ease;
            pointer-events: auto;
        }
        .whatsapp-icon {
            width: 28px;
            height: 28px;
            fill: none;
            stroke: #fff;
            stroke-width: 2;
        }
    </style>
</head>
<body>

    <canvas id="liquidCanvas"></canvas>

    <div class="container">
        <header>
            <h1>MEGAHUB</h1>
            <div class="owner-badge">DESIGNED & OWNED BY: <span>HADI</span></div>
        </header>
    </div>

    <a href="https://whatsapp.com" class="whatsapp-float" target="_blank">
        <svg class="whatsapp-icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.3 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.3 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
    </a>

    <script>
        const canvas = document.getElementById('liquidCanvas');
        const ctx = canvas.getContext('2d');

        let width, height, points = [];
        const numPoints = 8; 
        let time = 0;
        
        let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initPoints();
        }

        function initPoints() {
            points = [];
            let spacing = width / (numPoints - 1);
            let baseHeight = height * 0.55; 
            
            for (let i = 0; i < numPoints; i++) {
                points.push({
                    x: i * spacing,
                    y: baseHeight,
                    baselineY: baseHeight,
                    vy: 0,
                    force: 0
                });
            }
        }

        window.addEventListener('resize', resize);
        resize();

        // Premium organic gesture dynamics handlers
        function touchStart(x, y) {
            mouse.active = true;
            mouse.targetX = x;
            mouse.targetY = y;
        }

        function touchMove(x, y) {
            mouse.targetX = x;
            mouse.targetY = y;
        }

        function touchEnd() {
            mouse.active = false;
        }

        window.addEventListener('mousedown', (e) => touchStart(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => touchMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', touchEnd);

        window.addEventListener('touchstart', (e) => {
            if(e.touches.length > 0) touchStart(e.touches[0].clientX, e.touches[0].clientY);
        });
        window.addEventListener('touchmove', (e) => {
            if(e.touches.length > 0) touchMove(e.touches[0].clientX, e.touches[0].clientY);
        });
        window.addEventListener('touchend', touchEnd);

        function animate() {
            time += 0.015;
            
            // Clear screen correctly without color artifacting
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            // Interpolated responsive input smooth follow tracker
            mouse.x += (mouse.targetX - mouse.x) * 0.1;
            mouse.y += (mouse.targetY - mouse.y) * 0.1;

            // Physics calculation engine loop
            points.forEach((p, idx) => {
                // Multi-layered smooth wave oscillation
                let waveNoise = Math.sin(time + idx * 0.8) * 15 + Math.cos(time * 1.5 + idx * 0.4) * 8;
                
                // Interactive dynamic cursor proximity distortion
                if (mouse.active) {
                    let dx = mouse.x - p.x;
                    let dy = mouse.y - p.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 180) {
                        // Creates organic fluid displacement force logic push
                        let push = (180 - distance) * 0.35;
                        p.force = (mouse.y > p.baselineY) ? push : -push;
                    } else {
                        p.force *= 0.85;
                    }
                } else {
                    p.force *= 0.85;
                }

                // Spring hooks relaxation arithmetic calculation
                let targetY = p.baselineY + waveNoise + p.force;
                let diffY = targetY - p.y;
                p.vy += diffY * 0.04; // Tension spring elasticity coefficient
                p.vy *= 0.82;         // Organic drag friction damping parameter
                p.y += p.vy;
            });

            // Smooth cubic vector draw sequence pipeline 
            ctx.beginPath();
            ctx.moveTo(0, height);
            ctx.lineTo(0, points[0].y);

            for (let i = 0; i < points.length - 1; i++) {
                let xc = (points[i].x + points[i + 1].x) / 2;
                let yc = (points[i].y + points[i + 1].y) / 2;
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }

            ctx.lineTo(width, points[points.length - 1].y);
            ctx.lineTo(width, height);
            ctx.closePath();

            // Liquid color fill execution
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            requestAnimationFrame(animate);
        }

        animate();
    </script>
</body>
</html>`
};
