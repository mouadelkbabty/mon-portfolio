# Implementation & Technical Notes

## Architecture Overview

```
index.html (main entry point)
├── style.css (main neon cyberpunk stylesheet)
├── game-style.css (game UI overlays & HUD)
├── game-world.js (interactive canvas world)
├── theme.js (i18n & theme toggle)
├── script.js (general utilities)
├── effects.js (particle & glitch effects)
├── project.js (project filtering)
├── charts.js (Chart.js configurations)
└── games/ (separate game files)
```

## CSS Architecture

### Color Palette (CSS Variables)
```css
:root {
    --neon-cyan: #00f0ff;
    --neon-pink: #ff2d95;
    --neon-purple: #a855f7;
    --neon-orange: #ff6b35;
    --bg-dark: #05020a;
    --bg-card: rgba(10, 15, 35, 0.7);
    --text-primary: #e8edf2;
    --text-muted: #8892a6;
}
```

### Key Styling Patterns

1. **Glass Morphism**:
```css
background: linear-gradient(135deg, rgba(0,240,255,0.1), rgba(255,45,149,0.05));
border: 1px solid rgba(0,240,255,0.25);
backdrop-filter: blur(10px);
```

2. **Neon Glow**:
```css
box-shadow: 0 0 20px rgba(0,240,255,0.4);
text-shadow: 0 0 10px rgba(0,240,255,0.3);
```

3. **Gradient Text**:
```css
background: linear-gradient(135deg, var(--neon-cyan), var(--neon-pink));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

4. **Card Hover Effect**:
```css
.card:hover {
    border-color: var(--neon-cyan);
    background: linear-gradient(135deg, rgba(0,240,255,0.15), rgba(255,45,149,0.08));
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0,240,255,0.2);
}
```

## JavaScript Architecture

### game-world.js Structure

```javascript
(function() {
    // Canvas setup & sizing
    const canvas = document.getElementById('worldCanvas');
    const ctx = canvas.getContext('2d');
    
    // Player state management
    const player = { x, y, r, speed, vx, vy, friction };
    
    // Input handling (keyboard)
    const keys = { up, down, left, right };
    const keyMap = { /* key mappings */ };
    
    // Game entities
    const hotspots = [ /* portal zones */ ];
    const particles = [ /* animated glows */ ];
    
    // Game state
    let gameMode = false;
    let gameActive = false;
    
    // Functions
    - resizeCanvas()
    - toggleGameMode()
    - drawBackground() - Grid & dark gradient
    - drawParticles() - Floating glows
    - drawPlayer() - Avatar with aura
    - drawHotspots() - Portal zones
    - drawHUD() - Stats display
    - update() - Physics & collision
    - gotoSection() - Navigate & exit
    - animate() - Main loop (RAF)
})();
```

### Event Listeners
- `keydown/keyup` - Player movement
- `click` (#gameToggle) - Game mode toggle
- `resize` (window) - Canvas responsiveness
- `scroll` - Section navigation

## Performance Considerations

### Canvas Optimization
- Use `requestAnimationFrame` instead of `setInterval`
- Batch drawing operations
- Clear canvas once per frame
- Minimize shadow/blur operations

### CSS Optimization
- Use CSS transitions over JS animations
- Hardware acceleration with `transform` and `opacity`
- Minimal repaints with `:not()` selectors
- Defer non-critical animations

### DOM Optimization
- Minimal DOM traversal
- Cache element references
- Use event delegation where possible
- Remove unused styles

## Responsive Design Strategy

### Mobile-First Approach
```css
/* Base styles (mobile) */
.section { padding: 4rem 3%; }

/* Tablet up */
@media (min-width: 768px) {
    .section { padding: 6rem 5%; }
}

/* Desktop up */
@media (min-width: 1024px) {
    .hero-content { grid-template-columns: 1.2fr 1fr; }
}
```

### Breakpoints
- **480px**: Small phones
- **768px**: Tablets
- **900px**: Large tablets
- **1024px**: Desktops
- **1400px**: Large displays (max-width container)

## Internationalization (i18n)

### System (theme.js)
```javascript
// Data attributes
<span data-i18n="key">Default French Text</span>

// Language data
const translations = {
    'key': {
        'fr': 'Texte français',
        'en': 'English text'
    }
};

// Functions
initLanguage() // Initialize from localStorage
toggleLanguage() // Switch between FR/EN
updateAllContent() // Update all i18n elements
```

### Coverage
- All section headings
- Buttons and labels
- Descriptions
- Footer text
- Certificate entries

## Theme System

### Light Mode Toggle
```css
/* CSS Variables change automatically */
body.light-mode {
    --bg-dark: #f5f5f5;
    --text-primary: #1f2937;
    --neon-cyan: #0066cc;
}
```

### Persistence
- Stored in localStorage
- Restored on page load
- Works with all components

## Game World Features

### Physics
- **Velocity**: Independent X/Y velocity
- **Friction**: 0.85x deceleration when not moving
- **Speed**: Scaled movement (3 pixels/frame)
- **Clamping**: Boundary detection to keep player in viewport

### Collision Detection
```javascript
const dist = Math.hypot(h.x - player.x, h.y - player.y);
if (dist < 28) gotoSection(h.id); // Proximity trigger
```

### Visual Feedback
- Hotspot color change (cyan → pink) when near
- Text shadow increase on approach
- Player direction indicator (ray from center)
- HUD coordinate display

## Deployment

### Vercel Configuration (vercel.json)
```json
{
    "buildCommand": null,
    "installCommand": null,
    "outputDirectory": "."
}
```

### GitHub Pages (.nojekyll)
- Prevents Jekyll processing
- Allows underscores in filenames
- Required for proper asset serving

## Testing Checklist

### Functionality
- [ ] Game mode toggle works
- [ ] WASD/arrow keys move player
- [ ] Hotspots detect proximity
- [ ] Sections scroll smoothly
- [ ] Language toggle works
- [ ] Theme toggle works
- [ ] All links functional

### Visual
- [ ] Neon glows display correctly
- [ ] Animations smooth at 60fps
- [ ] Colors accurate across browsers
- [ ] Text readable in both themes
- [ ] Borders crisp and glowing

### Responsive
- [ ] Mobile layout works (480px)
- [ ] Tablet layout works (768px)
- [ ] Desktop layout works (1024px+)
- [ ] Canvas resizes properly
- [ ] Touch-friendly elements

### Performance
- [ ] Game at 60fps
- [ ] No significant frame drops
- [ ] Smooth scrolling
- [ ] Fast page load
- [ ] Low memory usage

## Browser DevTools Tips

### Debugging Game
1. Open Console (F12)
2. Check for JS errors
3. Monitor FPS in Performance tab
4. Check Network for asset load times

### CSS Debugging
1. Inspect elements
2. Check computed styles
3. Toggle classes on body for theme
4. Use Color Picker for accurate hex codes

## Future Enhancement Ideas

### Short Term
- [ ] Sound effects for game world
- [ ] Mouse click controls for game
- [ ] Particle effects on section reach
- [ ] More hotspot locations
- [ ] Skill bars animation

### Medium Term
- [ ] Mini-games at each section
- [ ] Achievement system
- [ ] Score/ranking system
- [ ] Leaderboard
- [ ] Mobile touch controls

### Long Term
- [ ] 3D WebGL effects
- [ ] Multiplayer mode
- [ ] Persistent progress
- [ ] Advanced physics
- [ ] Dynamic content

## Maintenance Notes

### Regular Updates
- Keep Chart.js CDN updated
- Monitor CSS compatibility
- Test new browser versions
- Update i18n content

### Common Issues & Fixes

**Issue**: Canvas appears black
- Check if gameMode is active
- Verify canvas element exists
- Check JavaScript console for errors

**Issue**: Text isn't glowing
- Verify --neon-cyan variable is set
- Check text-shadow syntax
- Ensure color is not overridden

**Issue**: Hotspots not triggering
- Check proximity distance (< 28px)
- Verify section IDs match
- Test canvas bounds

**Issue**: Mobile layout broken
- Check media query order
- Verify viewport meta tag
- Test device pixel ratio

## Code Style Guide

### CSS
- Use CSS variables for colors
- Use lowercase hex codes
- Group related rules
- Use proper nesting structure
- Always include units (px, rem, etc)

### JavaScript
- Use const/let, avoid var
- Use arrow functions where appropriate
- Add comments for complex logic
- Use meaningful variable names
- Keep functions focused and small

### HTML
- Use semantic HTML5 elements
- Add data-i18n attributes
- Use proper heading hierarchy
- Alt text for images
- Accessible form labels
