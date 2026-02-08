// Game World - Interactive Canvas Navigation
(function() {
    const canvas = document.getElementById('worldCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Canvas sizing
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Player state
    const player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: 12,
        speed: 3,
        vx: 0,
        vy: 0,
        friction: 0.85
    };

    // Input handling
    const keys = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    const keyMap = {
        'ArrowUp': 'up', 'w': 'up', 'W': 'up',
        'ArrowDown': 'down', 's': 'down', 'S': 'down',
        'ArrowLeft': 'left', 'a': 'left', 'A': 'left',
        'ArrowRight': 'right', 'd': 'right', 'D': 'right'
    };

    document.addEventListener('keydown', (e) => {
        if (keyMap[e.key]) {
            keys[keyMap[e.key]] = true;
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (keyMap[e.key]) {
            keys[keyMap[e.key]] = false;
        }
    });

    // Hotspots (portal zones)
    const hotspots = [
        { x: 200, y: 150, id: 'accueil', label: '🏠' },
        { x: 600, y: 200, id: 'projets', label: '📦' },
        { x: 400, y: 400, id: 'experience', label: '💼' },
        { x: 800, y: 350, id: 'contact', label: '📧' },
        { x: 300, y: 600, id: 'stats', label: '📊' },
        { x: 700, y: 600, id: 'game', label: '🎮' },
        { x: 500, y: 300, id: 'certificates', label: '🏆' }
    ];

    // Animated particles
    const particles = [];
    for (let i = 0; i < 6; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            r: Math.random() * 100 + 150,
            opacity: 0.1 + Math.random() * 0.1,
            color: Math.random() > 0.5 ? '#00f0ff' : '#ff2d95'
        });
    }

    // Game state
    let gameMode = false;
    let gameActive = false;

    const gameToggle = document.getElementById('gameToggle');
    if (gameToggle) {
        gameToggle.addEventListener('click', toggleGameMode);
    }

    function toggleGameMode() {
        console.log('game-world: toggleGameMode called, current gameMode=', gameMode);
        gameMode = !gameMode;
        gameActive = gameMode;
        document.body.classList.toggle('in-game', gameMode);
        canvas.style.pointerEvents = gameMode ? 'auto' : 'none';
        
        if (gameToggle) {
            gameToggle.textContent = gameMode ? '⏹ Exit' : '▶ Play';
            gameToggle.style.color = gameMode ? '#ff2d95' : '#00f0ff';
        }

        if (gameMode) {
            player.x = canvas.width / 2;
            player.y = canvas.height / 2;
        }
    }

    // Drawing functions
    function drawBackground() {
        // Dark gradient background
        const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grd.addColorStop(0, '#060310');
        grd.addColorStop(0.5, '#0b0720');
        grd.addColorStop(1, '#05020a');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Animated grid
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    function drawParticles() {
        particles.forEach(p => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Bounce at edges
            if (p.x < -p.r) p.x = canvas.width + p.r;
            if (p.x > canvas.width + p.r) p.x = -p.r;
            if (p.y < -p.r) p.y = canvas.height + p.r;
            if (p.y > canvas.height + p.r) p.y = -p.r;

            // Draw glow
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            grad.addColorStop(0, `rgba(${p.color === '#00f0ff' ? '0, 240, 255' : '255, 45, 149'}, ${p.opacity})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        });
    }

    function drawPlayer() {
        // Player glow aura
        const aura = ctx.createRadialGradient(player.x, player.y, 0, player.x, player.y, 40);
        aura.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
        aura.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(player.x, player.y, 40, 0, Math.PI * 2);
        ctx.fill();

        // Player body (circle)
        ctx.fillStyle = '#00f0ff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00f0ff';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Player inner glow
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.r - 3, 0, Math.PI * 2);
        ctx.stroke();

        // Direction indicator
        const angle = Math.atan2(player.vy, player.vx);
        ctx.strokeStyle = '#ff2d95';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x + Math.cos(angle) * 20, player.y + Math.sin(angle) * 20);
        ctx.stroke();
    }

    function drawHotspots() {
        hotspots.forEach((h, idx) => {
            const dist = Math.hypot(h.x - player.x, h.y - player.y);
            const isNear = dist < 80;

            // Hotspot circle
            ctx.strokeStyle = isNear ? '#ff2d95' : '#00f0ff';
            ctx.lineWidth = isNear ? 3 : 2;
            ctx.beginPath();
            ctx.arc(h.x, h.y, 28, 0, Math.PI * 2);
            ctx.stroke();

            // Inner glow
            if (isNear) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#ff2d95';
            } else {
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00f0ff';
            }
            ctx.fillStyle = isNear ? 'rgba(255, 45, 149, 0.15)' : 'rgba(0, 240, 255, 0.1)';
            ctx.beginPath();
            ctx.arc(h.x, h.y, 28, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Label
            ctx.fillStyle = isNear ? '#ff2d95' : '#00f0ff';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(h.label, h.x, h.y);
        });
    }

    function drawHUD() {
        // Coordinates display
        ctx.fillStyle = '#00f0ff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`X: ${Math.floor(player.x)} | Y: ${Math.floor(player.y)}`, 10, 20);
        ctx.fillText(`SPEED: ${Math.floor(Math.hypot(player.vx, player.vy))}`, 10, 40);
        
        // Instructions
        ctx.font = '11px monospace';
        ctx.fillText('WASD/ARROWS to move', 10, canvas.height - 20);
        ctx.fillText('Approach hotspots to navigate', 10, canvas.height - 5);
    }

    function update() {
        if (!gameActive) return;

        // Apply input
        const moveX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
        const moveY = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);

        if (moveX !== 0 || moveY !== 0) {
            const length = Math.hypot(moveX, moveY);
            player.vx = (moveX / length) * player.speed;
            player.vy = (moveY / length) * player.speed;
        } else {
            player.vx *= player.friction;
            player.vy *= player.friction;
        }

        // Update position
        player.x += player.vx;
        player.y += player.vy;

        // Boundary clamping
        player.x = Math.max(player.r, Math.min(canvas.width - player.r, player.x));
        player.y = Math.max(player.r, Math.min(canvas.height - player.r, player.y));

        // Hotspot proximity detection
        hotspots.forEach(h => {
            const dist = Math.hypot(h.x - player.x, h.y - player.y);
            if (dist < 28 && h.id) {
                gotoSection(h.id);
            }
        });
    }

    function gotoSection(sectionId) {
        if (!sectionId) return;
        gameMode = false;
        gameActive = false;
        document.body.classList.remove('in-game');
        
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        
        if (gameToggle) {
            gameToggle.textContent = '▶ Play';
            gameToggle.style.color = '#00f0ff';
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameMode) {
            drawBackground();
            drawParticles();
            drawHotspots();
            update();
            drawPlayer();
            drawHUD();
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Resize handler for responsive design
    window.addEventListener('resize', () => {
        resizeCanvas();
        player.x = Math.min(player.x, canvas.width);
        player.y = Math.min(player.y, canvas.height);
    });
})();
