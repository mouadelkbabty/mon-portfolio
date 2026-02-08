// ADVANCED 3D/CANVAS EFFECTS
// ============================

// 1. INTERACTIVE MOUSE-FOLLOWING BACKGROUND
class MouseFollower {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'mouseFollowerCanvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.3;
        `;
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    onMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        
        // Crée des particules autour du curseur
        for (let i = 0; i < 2; i++) {
            this.particles.push(new Particle(
                this.mouse.x + (Math.random() - 0.5) * 50,
                this.mouse.y + (Math.random() - 0.5) * 50,
                Math.random() * 2 + 1
            ));
        }
    }
    
    animate() {
        // Efface avec trail effect
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.02)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Met à jour et dessine les particules
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.update(this.mouse);
            
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.alpha = 1;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.decay = Math.random() * 0.01 + 0.005;
    }
    
    update(mouse) {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        
        // Attraction légère vers la souris
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
            this.vx += (dx / distance) * 0.1;
            this.vy += (dy / distance) * 0.1;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.strokeStyle = `rgba(0, 240, 255, ${this.alpha * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
}

// 2. ANIMATED SCROLL PARTICLES
class ScrollParticles {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'scrollParticlesCanvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.scrollY = 0;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
            this.spawnParticles();
        });
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    spawnParticles() {
        // Crée des particules au scroll
        for (let i = 0; i < 1; i++) {
            this.particles.push(new ScrollParticle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            ));
        }
    }
    
    animate() {
        // Clear avec dégradé très léger
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dessine les particules
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.update(this.scrollY);
            
            if (p.life <= 0 || p.y < -50) {
                this.particles.splice(i, 1);
            } else {
                p.draw(this.ctx);
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

class ScrollParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 1;
        this.size = Math.random() * 2 + 0.5;
        this.vy = Math.random() * -2 - 1;
        this.vx = (Math.random() - 0.5) * 2;
    }
    
    update(scrollY) {
        this.y += this.vy;
        this.x += this.vx;
        this.life -= 0.005;
        this.size *= 0.98;
    }
    
    draw(ctx) {
        ctx.fillStyle = `rgba(0, 240, 255, ${this.life * 0.4})`;
        ctx.shadowColor = `rgba(0, 240, 255, ${this.life * 0.2})`;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 3. GLITCH EFFECT ON HOVER
class GlitchEffect {
    constructor() {
        this.setupGlitchStyle();
        this.attachGlitchListeners();
    }
    
    setupGlitchStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .glitch-container {
                position: relative;
            }
            
            .glitch-element {
                transition: all 0.3s ease;
            }
            
            .glitch-element::before,
            .glitch-element::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                font-weight: inherit;
                z-index: -1;
            }
            
            .glitch-element::before {
                animation: glitch-anim-1 0.3s;
                color: #0ff;
                z-index: -2;
            }
            
            .glitch-element::after {
                animation: glitch-anim-2 0.3s;
                color: #f0f;
                z-index: -3;
            }
            
            .glitch-element.active::before,
            .glitch-element.active::after {
                opacity: 0.8;
            }
            
            @keyframes glitch-anim-1 {
                0% {
                    clip-path: polygon(0 0, 100% 0, 100% 2px, 0 2px);
                    transform: translate(-2px, -2px);
                }
                20% {
                    clip-path: polygon(0 10px, 100% 10px, 100% 12px, 0 12px);
                    transform: translate(2px, 2px);
                }
                40% {
                    clip-path: polygon(0 20px, 100% 20px, 100% 22px, 0 22px);
                    transform: translate(-2px, 2px);
                }
                60% {
                    clip-path: polygon(0 30px, 100% 30px, 100% 32px, 0 32px);
                    transform: translate(2px, -2px);
                }
                80% {
                    clip-path: polygon(0 40px, 100% 40px, 100% 42px, 0 42px);
                    transform: translate(-2px, -2px);
                }
                100% {
                    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                    transform: translate(0);
                }
            }
            
            @keyframes glitch-anim-2 {
                0% {
                    clip-path: polygon(0 60px, 100% 60px, 100% 62px, 0 62px);
                    transform: translate(2px, 2px);
                }
                20% {
                    clip-path: polygon(0 70px, 100% 70px, 100% 72px, 0 72px);
                    transform: translate(-2px, -2px);
                }
                40% {
                    clip-path: polygon(0 80px, 100% 80px, 100% 82px, 0 82px);
                    transform: translate(2px, -2px);
                }
                60% {
                    clip-path: polygon(0 90px, 100% 90px, 100% 92px, 0 92px);
                    transform: translate(-2px, 2px);
                }
                80% {
                    clip-path: polygon(0 50px, 100% 50px, 100% 52px, 0 52px);
                    transform: translate(2px, 2px);
                }
                100% {
                    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                    transform: translate(0);
                }
            }
            
            /* Glitch sur les sections */
            section:hover .section-title {
                filter: brightness(1.1);
            }
            
            @keyframes color-glitch {
                0% {
                    text-shadow: -2px 0 #0ff, 2px 0 #f0f;
                }
                50% {
                    text-shadow: 2px 0 #0ff, -2px 0 #f0f;
                }
                100% {
                    text-shadow: -2px 0 #0ff, 2px 0 #f0f;
                }
            }
            
            section:hover .section-title.glitch-text {
                animation: color-glitch 0.3s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }
    
    attachGlitchListeners() {
        // Ajoute l'effet glitch aux titres des sections
        document.querySelectorAll('.section-title').forEach(title => {
            title.classList.add('glitch-text');
            
            title.parentElement.addEventListener('mouseenter', () => {
                title.style.letterSpacing = '0.1em';
                title.style.textShadow = `-2px 0 #0ff, 2px 0 #f0f, 0 0 10px rgba(0, 240, 255, 0.5)`;
            });
            
            title.parentElement.addEventListener('mouseleave', () => {
                title.style.letterSpacing = 'normal';
                title.style.textShadow = 'none';
            });
        });
        
        // Ajoute l'effet glitch aux boutons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.filter = 'brightness(1.3) saturate(1.5)';
                btn.style.textShadow = '0 0 10px rgba(0, 240, 255, 0.8)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.filter = 'brightness(1)';
                btn.style.textShadow = 'none';
            });
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que le DOM soit complètement chargé
    setTimeout(() => {
        new MouseFollower();      // Fond qui suit la souris
        new ScrollParticles();    // Particules au scroll
        new GlitchEffect();       // Effet glitch au survol
    }, 100);
});
