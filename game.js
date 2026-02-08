// Game Logic - Interactive Portfolio
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 30,
    height: 40,
    speed: 5,
    vx: 0,
    vy: 0,
    color: '#00F0FF'
};

// Interactive zones
const zones = [
    {
        x: 150,
        y: 150,
        width: 120,
        height: 120,
        emoji: '💻',
        label: 'Projets',
        section: '#projets'
    },
    {
        x: canvas.width - 270,
        y: 150,
        width: 120,
        height: 120,
        emoji: '📚',
        label: 'Compétences',
        section: '#accueil'
    },
    {
        x: canvas.width / 2 - 60,
        y: canvas.height - 200,
        width: 120,
        height: 120,
        emoji: '☎️',
        label: 'Contact',
        section: '#contact'
    }
];

// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Update player velocity based on input
function updateInput() {
    player.vx = 0;
    player.vy = 0;

    if (keys['arrowup'] || keys['w'] || keys['z']) player.vy = -player.speed;
    if (keys['arrowdown'] || keys['s']) player.vy = player.speed;
    if (keys['arrowleft'] || keys['a'] || keys['q']) player.vx = -player.speed;
    if (keys['arrowright'] || keys['d']) player.vx = player.speed;
}

// Update player position
function updatePlayer() {
    player.x += player.vx;
    player.y += player.vy;

    // Boundary checking
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Draw player (pixel character)
function drawPlayer() {
    // Simple pixel art character
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Head
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(player.x + 5, player.y - 8, 20, 20);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 8, player.y - 5, 4, 4);
    ctx.fillRect(player.x + 18, player.y - 5, 4, 4);
}

// Draw interactive zones
function drawZones() {
    zones.forEach(zone => {
        const isNear = isPlayerNear(zone);
        
        ctx.fillStyle = isNear ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 240, 255, 0.1)';
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        
        ctx.strokeStyle = isNear ? '#00F0FF' : 'rgba(0, 240, 255, 0.5)';
        ctx.lineWidth = isNear ? 3 : 2;
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        
        // Draw emoji
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(zone.emoji, zone.x + zone.width / 2, zone.y + zone.height / 2 - 15);
        
        // Draw label
        ctx.font = isNear ? 'bold 14px Arial' : '12px Arial';
        ctx.fillStyle = isNear ? '#00F0FF' : '#8892A6';
        ctx.fillText(zone.label, zone.x + zone.width / 2, zone.y + zone.height - 10);
        
        // Draw interaction hint
        if (isNear) {
            ctx.font = 'bold 11px Arial';
            ctx.fillStyle = '#FF6B35';
            ctx.fillText('Appuie sur ESPACE', zone.x + zone.width / 2, zone.y + 10);
        }
    });
}

// Check if player is near a zone
function isPlayerNear(zone) {
    const dx = (player.x + player.width / 2) - (zone.x + zone.width / 2);
    const dy = (player.y + player.height / 2) - (zone.y + zone.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 100;
}

// Draw background grid
function drawBackground() {
    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid pattern
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

// Draw HUD
function drawHUD() {
    ctx.font = '14px Arial';
    ctx.fillStyle = '#00F0FF';
    ctx.textAlign = 'left';
    ctx.fillText('🎮 Bienvenue dans mon Portfolio Interactif', 10, 20);
    ctx.fillText('Utilise les Flèches ou ZQSD pour te déplacer', 10, 40);
}

// Game loop
function gameLoop() {
    updateInput();
    updatePlayer();
    
    // Clear canvas
    drawBackground();
    
    // Draw game elements
    drawZones();
    drawPlayer();
    drawHUD();
    
    // Check interactions
    zones.forEach(zone => {
        if (isPlayerNear(zone) && keys[' ']) {
            // Navigate to section
            const target = document.querySelector(zone.section);
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                // Show message
                showGameMessage(`Tu as trouvé ${zone.label}!`);
            }
        }
    });
    
    requestAnimationFrame(gameLoop);
}

// Show floating message
function showGameMessage(text) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 240, 255, 0.9);
        color: #0A0E27;
        padding: 1.5rem 3rem;
        border-radius: 12px;
        font-weight: bold;
        font-size: 1.5rem;
        z-index: 9999;
        pointer-events: none;
        animation: fadeInOut 2s ease forwards;
    `;
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 2000);
}

// Start game
gameLoop();

// Add animation for message
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -60%); }
        20% { opacity: 1; transform: translate(-50%, -50%); }
        80% { opacity: 1; transform: translate(-50%, -50%); }
        100% { opacity: 0; transform: translate(-50%, -40%); }
    }
`;
document.head.appendChild(style);
