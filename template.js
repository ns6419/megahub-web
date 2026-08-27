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
            background: #000;
        }
        body {
            display: flex;
            flex-direction: column;
            position: relative;
        }
        /* Visual split screen backdrop configuration */
        .split-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            z-index: 1;
            pointer-events: none;
        }
        .bg-top {
            flex: 1;
            background: #000;
        }
        .bg-bottom {
            flex: 1;
            background: #fff;
        }
        /* Canvas layer sits on top of background but behind text panels */
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
            top: 15%;
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

    <div class="split-bg">
        <div class="bg-top"></div>
        <div class="bg-bottom"></div>
    </div>

    <canvas id="waveCanvas"></canvas>

    <div class="container">
        <header>
            <h1>MEGAHUB</h1>
        </header>
    </div>

    <a href="https://wa.me" class="whatsapp-float" target="_blank">
        <svg class="whatsapp-icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.3 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.3 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
    </a>

    <script>
        const canvas = document.getElementById('waveCanvas');
        const ctx = canvas.getContext('2d');

        let width, height, midY;
        
        // Fluid simulator core tracking parameters
        let waves = [
            { length: 0.01, amplitude: 25, speed: 0.03, phase: 0 },
            { length: 0.02, amplitude: 15, speed: 0.04, phase: 1 },
            { length: 0.007, amplitude: 10, speed: 0.02, phase: 2 }
        ];

        let targetAmplitudeModifier = 1.0;
        let currentAmplitudeModifier = 1.0;
        let targetYShift = 0;
        let currentYShift = 0;

        let startY = 0;
        let isSwiping = false;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            midY = height / 2;
        }
        window.addEventListener('resize', resize);
        resize();

        // High performance touch/drag mechanics for swipe gestures
        function handleStart(yPos) {
            startY = yPos;
            isSwiping = true;
            targetAmplitudeModifier = 2.5; // Amplifies waves during active swiping
        }

        function handleMove(yPos) {
            if (!isSwiping) return;
            let deltaY = yPos - startY;
            
            // Adjusts current baseline level offset based on swipe translation velocity
            targetYShift = Math.max(-150, Math.min(150, deltaY * 0.8));
        }

        function handleEnd() {
            isSwiping = false;
            targetAmplitudeModifier = 1.0; // Gradually settles back to stable liquid physics
            targetYShift = 0; 
        }

        // Screen interactions
        window.addEventListener('mousedown', (e) => handleStart(e.clientY));
        window.addEventListener('mousemove', (e) => handleMove(e.clientY));
        window.addEventListener('mouseup', handleEnd);

        window.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientY));
        window.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientY));
        window.addEventListener('touchend', handleEnd);

        // Core animation matrix loop running inside browser repaint routine
        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Smooth linear interpolation dampening framework
            currentAmplitudeModifier += (targetAmplitudeModifier - currentAmplitudeModifier) * 0.1;
            currentYShift += (targetYShift - currentYShift) * 0.1;

            let baselineY = midY + currentYShift;

            // Generate fluid composite wave geometric shape arrays
            ctx.beginPath();
            ctx.moveTo(0, height);
            ctx.lineTo(0, baselineY);

            for (let x = 0; x <= width; x += 2) {
                let y = baselineY;
                
                // Add overlapping sound waves mathematically for realistic organic movement
                waves.forEach(wave => {
                    y += Math.sin(x * wave.length + wave.phase) * wave.amplitude * currentAmplitudeModifier;
                });

                ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();

            // Render bottom inverse color fill logic
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Render matching counter-color boundary stroke outline
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#000000';
            ctx.stroke();

            // Loop updating velocity phasing metrics independently
            waves.forEach(wave => {
                wave.phase += wave.speed;
            });

            requestAnimationFrame(animate);
        }

        animate();
    </script>
</body>
</html>`
};
