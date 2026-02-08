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

    // Large right-side face creature that watches the player with its eyes
    const creatures = [
        {
            // x will be anchored to the right during resize
            x: canvas.width - 160,
            y: canvas.height / 2,
            vx: 0,
            vy: 0,
            r: 90,
            blink: 0,
            blinkTimer: Date.now() + 2000,
            speechTimer: Date.now() + 4000
        }
    ];

    const creaturePhrases = [
        'Mouad is good at Java.',
        'Mouad loves innovations.',
        'Ask me about Rust and security.',
        'I build reliable systems.',
        'I enjoy designing distributed systems.'
    ];

    // Game state
    let gameMode = false;
    let gameActive = false;
    let soundEnabled = localStorage.getItem('soundEnabled') === 'true';

    const gameToggle = document.getElementById('gameToggle');
    if (gameToggle) {
        gameToggle.addEventListener('click', toggleGameMode);
    }

    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        updateSoundButton();
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            localStorage.setItem('soundEnabled', soundEnabled);
            // replaced short beep with softer cyberpunk tone when enabling
            if (soundEnabled) {
                playCyberpunk(420, 0.12);
                if (gameMode) startAmbient();
            } else {
                // stop ambient if sound disabled
                stopAmbient();
            }
            updateSoundButton();
        });
    }

    function updateSoundButton() {
        if (!soundToggle) return;
        soundToggle.textContent = soundEnabled ? '🔊' : '🔈';
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
                // Start fresh in the center when entering Play mode
                player.x = canvas.width / 2;
                player.y = canvas.height / 2;
                // Clear saved position so Play always restarts fresh
                try { localStorage.removeItem('gamePlayerPos'); } catch (e) {}

            // show onboarding if not seen
            const seen = localStorage.getItem('gameOnboardSeen');
            if (!seen) showOnboard();
            // start ambient background when entering
            startAmbient();
        }
        else {
            // stop ambient when exiting game mode
            stopAmbient();
        }
    }

    // Simple WebAudio sound helper
    let audioCtx = null;
    function ensureAudio() {
        if (audioCtx) return audioCtx;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            return audioCtx;
        } catch (e) {
            return null;
        }
    }

    // Ambient nature-like sound state
    let ambientNodes = null;
    let ambientPlaying = false;

    function startAmbient() {
        if (!soundEnabled) return;
        if (ambientPlaying) return;
        const ctx = ensureAudio();
        if (!ctx) return;

        // Nature-like ambient: filtered noise (soft wind) + occasional soft chime
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.0001, ctx.currentTime);

        // wind noise buffer
        const bufferSize = ctx.sampleRate * 2.0;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        // gentle filtering to make it like wind/ambience
        const highpass = ctx.createBiquadFilter(); highpass.type = 'highpass'; highpass.frequency.value = 200;
        const lowpass = ctx.createBiquadFilter(); lowpass.type = 'lowpass'; lowpass.frequency.value = 1200;

        // small stereo spread using gain nodes
        const noiseGain = ctx.createGain(); noiseGain.gain.value = 0.04; // low volume

        // routing: noise -> hp -> lp -> master -> destination
        noise.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(noiseGain);
        noiseGain.connect(master);
        master.connect(ctx.destination);

        // occasional soft chime scheduler
        let chimeTimer = null;
        function scheduleChime() {
            const t = 6000 + Math.random() * 8000; // 6-14s
            chimeTimer = setTimeout(() => {
                if (soundEnabled) playChime(ctx);
                scheduleChime();
            }, t);
        }

        function playChime(ctx) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'triangle';
            const freq = 600 + Math.random() * 700;
            o.frequency.setValueAtTime(freq, ctx.currentTime);
            g.gain.setValueAtTime(0.0001, ctx.currentTime);
            g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
            // gentle highpass for clarity
            const chp = ctx.createBiquadFilter(); chp.type = 'highpass'; chp.frequency.value = 420;
            o.connect(chp);
            chp.connect(g);
            g.connect(ctx.destination);
            o.start();
            o.stop(ctx.currentTime + 1.25);
        }

        // slow amplitude modulation to simulate breeze
        const ampLFO = ctx.createOscillator(); ampLFO.type = 'sine'; ampLFO.frequency.value = 0.08; // ~12s cycle
        const ampGain = ctx.createGain(); ampGain.gain.value = 0.02;
        ampLFO.connect(ampGain);
        ampGain.connect(master.gain);

        // start sources
        ampLFO.start();
        noise.start();
        // fade in master
        master.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.8);

        // start chime loop
        scheduleChime();

        ambientNodes = { ctx, noise, highpass, lowpass, noiseGain, master, ampLFO, ampGain, chimeTimer };
        ambientPlaying = true;
    }

    function stopAmbient() {
        if (!ambientPlaying || !ambientNodes) return;
        const ctx = ambientNodes.ctx;
        const now = ctx.currentTime;
        try {
            ambientNodes.master.gain.cancelScheduledValues(now);
            ambientNodes.master.gain.linearRampToValueAtTime(0.0001, now + 0.6);
            // clear chime timer
            try { clearTimeout(ambientNodes.chimeTimer); } catch (e) {}
            setTimeout(() => {
                try { ambientNodes.noise.stop(); } catch (e) {}
                try { ambientNodes.ampLFO.stop(); } catch (e) {}
                try { ambientNodes.noise.disconnect(); } catch (e) {}
                try { ambientNodes.highpass.disconnect(); } catch (e) {}
                try { ambientNodes.lowpass.disconnect(); } catch (e) {}
                try { ambientNodes.master.disconnect(); } catch (e) {}
            }, 700);
        } catch (e) {}
        ambientPlaying = false;
        ambientNodes = null;
    }

    function playSound(freq = 440, duration = 0.05) {
        if (!soundEnabled) return;
        const ctx = ensureAudio();
        if (!ctx) return;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration + 0.02);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + duration + 0.03);
    }

    // Cyberpunk-style synth blip using sawtooth + filter + pitch sweep
    function playCyberpunk(baseFreq = 440, duration = 0.18) {
        if (!soundEnabled) return;
        const ctx = ensureAudio();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.value = baseFreq;

        filter.type = 'lowpass';
        filter.frequency.value = baseFreq * 3;
        filter.Q.value = 8;

        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration + 0.02);

        // pitch glide for cyberpunk feel
        osc.frequency.setValueAtTime(baseFreq * 0.7, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, ctx.currentTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration + 0.04);
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

    function drawCreatures() {
        creatures.forEach(c => {
            // constantly anchor to right side so the face stays at right
            c.x = canvas.width - 160;
            c.y = canvas.height / 2;
            ctx.save();
            ctx.translate(c.x, c.y);

            // subtle head sway based on time
            const sway = Math.sin(Date.now() / 1200) * 4;
            ctx.rotate((sway * Math.PI) / 180);

            // shadow under head
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.beginPath();
            ctx.ellipse(0, c.r + 12, c.r * 0.95, c.r * 0.35, 0, 0, Math.PI * 2);
            ctx.fill();

            // face circle
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.strokeStyle = 'rgba(0,240,255,0.08)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, c.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // eyes positions (relative)
            const leftEye = { x: -c.r * 0.38, y: -c.r * 0.18 };
            const rightEye = { x: c.r * 0.38, y: -c.r * 0.18 };

            // compute pupil offset pointing to player
            const angleL = Math.atan2(player.y - (c.y + leftEye.y), player.x - (c.x + leftEye.x));
            const angleR = Math.atan2(player.y - (c.y + rightEye.y), player.x - (c.x + rightEye.x));
            const maxOffset = c.r * 0.18;
            const exL = Math.cos(angleL) * maxOffset;
            const eyL = Math.sin(angleL) * maxOffset;
            const exR = Math.cos(angleR) * maxOffset;
            const eyR = Math.sin(angleR) * maxOffset;

            // eyes (white)
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.ellipse(leftEye.x, leftEye.y, c.r * 0.28, c.r * 0.34, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(rightEye.x, rightEye.y, c.r * 0.28, c.r * 0.34, 0, 0, Math.PI * 2); ctx.fill();

            // pupils
            ctx.fillStyle = '#000';
            ctx.beginPath(); ctx.arc(leftEye.x + exL * 0.5, leftEye.y + eyL * 0.5, c.r * 0.08, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(rightEye.x + exR * 0.5, rightEye.y + eyR * 0.5, c.r * 0.08, 0, Math.PI * 2); ctx.fill();

            // eyelid blink effect
            const now = Date.now();
            if (now > c.blinkTimer) {
                c.blink = 1;
                c.blinkTimer = now + 250 + Math.random() * 3000;
            }
            if (c.blink > 0) {
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                const t = c.blink;
                // draw lid rectangles that shrink quickly
                ctx.beginPath();
                ctx.ellipse(leftEye.x, leftEye.y, c.r * 0.28, c.r * 0.34 * (1 - t), 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(rightEye.x, rightEye.y, c.r * 0.28, c.r * 0.34 * (1 - t), 0, 0, Math.PI * 2);
                ctx.fill();
                // decay blink
                c.blink -= 0.08;
                if (c.blink < 0) c.blink = 0;
            }

            // mouth
            ctx.strokeStyle = 'rgba(255,45,149,0.18)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, c.r * 0.22, c.r * 0.32, 0.15 * Math.PI, 0.85 * Math.PI);
            ctx.stroke();

            ctx.restore();
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

        // Creature AI: chase when player is near
        creatures.forEach(c => {
            // show random phrases occasionally when in game mode
            const now = Date.now();
            if (now > c.speechTimer) {
                const phrase = creaturePhrases[Math.floor(Math.random() * creaturePhrases.length)];
                showSpeech(phrase, c);
                // schedule next speech
                c.speechTimer = now + 5000 + Math.random() * 8000;
                playCyberpunk(520, 0.12);
            }
            // creatures anchored, no movement needed here
        });
    }

    function gotoSection(sectionId) {
        if (!sectionId) return;
        // save position
        try { localStorage.setItem('gamePlayerPos', JSON.stringify({ x: player.x, y: player.y })); } catch (e) {}
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
        // subtle cyberpunk exit tone
        playCyberpunk(260, 0.10);
        // ensure ambient stops on exit
        stopAmbient();
    }

    // Onboarding DOM
    function showOnboard() {
        let overlay = document.querySelector('.game-onboard');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'game-onboard';
            overlay.innerHTML = `
                <div class="card">
                    <h2>Mode Jeu</h2>
                    <p>Utilise les flèches ou ZQSD pour te déplacer. Approche-toi des hotspots pour naviguer sur le site. Appuie sur le bouton son pour activer/désactiver les effets sonores.</p>
                    <div style="display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;">
                        <button class="got-it">J'ai compris</button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);
            overlay.querySelector('.got-it').addEventListener('click', () => {
                localStorage.setItem('gameOnboardSeen', 'true');
                overlay.classList.remove('active');
                setTimeout(() => overlay.remove(), 300);
                playCyberpunk(800, 0.16);
            });
        }
        overlay.classList.add('active');
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameMode) {
            drawBackground();
            drawParticles();
            drawHotspots();
            drawCreatures();
            update();
            drawPlayer();
            drawHUD();
        }

        requestAnimationFrame(animate);
    }

    function showShushMessage(text) {
        const el = document.createElement('div');
        el.className = 'creature-shush';
        el.textContent = text;
        document.body.appendChild(el);
        setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 1400);
    }

    function showSpeech(text, creature) {
        // only one speech bubble at a time
        let el = document.querySelector('.creature-speech');
        if (!el) {
            el = document.createElement('div');
            el.className = 'creature-speech';
            el.innerHTML = `<span class="who">MEK:</span> <span class="msg"></span>`;
            document.body.appendChild(el);
        }
        const msg = el.querySelector('.msg');
        msg.textContent = text;
        // position vertically aligned with creature
        const top = Math.max(40, Math.min(window.innerHeight - 120, (creature.y - creature.r - 40)));
        el.style.top = top + 'px';
        el.classList.add('show');
        // cyberpunk voice cue
        playCyberpunk(880, 0.18);
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => { if (el && el.parentNode) el.parentNode.removeChild(el); }, 300);
        }, 4200);
    }

    animate();

    // Resize handler for responsive design
    window.addEventListener('resize', () => {
        resizeCanvas();
        player.x = Math.min(player.x, canvas.width);
        player.y = Math.min(player.y, canvas.height);
        // re-anchor creature to right side
        if (creatures && creatures[0]) {
            creatures[0].x = canvas.width - 160;
            creatures[0].y = canvas.height / 2;
        }
    });
})();
