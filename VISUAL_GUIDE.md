# 🎮 Neon Cyberpunk Portfolio - Visual Guide

## What You'll See

### Main Navigation Bar
- **Logo**: "MEK." with cyan-to-pink gradient
- **Navigation Links**: Uppercase, cyan text with underline glow on hover
- **Controls**: Theme toggle (🌙), Language toggle (EN/FR), Play button (▶)
- **Style**: Dark transparent background with neon border

### Hero Section
- **Headline**: Large uppercase gradient text (cyan → pink)
- **Badges**: Animated pulsing badge with cyan glow
- **Stats**: Gradient numbers showing portfolio metrics
- **CTA Buttons**: Glowing primary button (cyan gradient) and secondary button (outline)
- **Hero Card**: Contains skill categories with animated progress bars
  - Each skill bar has cyan-to-pink gradient fill
  - Shimmer animation across the fill

### Projects Section
- **Project Cards**: 
  - Dark background with cyan border
  - Gradient overlay on hover
  - Neon cyan titles
  - Tech tags with orange tint
  - Smooth translateY animation on hover

### Experience Section
- **Timeline**:
  - Vertical cyan-to-pink gradient line
  - Cyan glowing dots at each point
  - Content cards with neon borders
  - Icons and company names in cyan
  - Tech badges with orange accents

### Statistics Section
- **Chart Cards**:
  - Neon cyan borders and glow
  - Title in uppercase cyan
  - Chart.js visualization
  - Hover effects with color change

### Certificates Section
- **Certificate Grid**:
  - Dark cards with neon borders
  - Icon badges in corner
  - Title in cyan
  - Description text
  - Date badges

### Game World (NEW!)
- **Interactive Canvas**:
  - Animated grid background (cyan lines)
  - Floating particle glows (cyan & pink)
  - Player avatar (glowing cyan circle)
  - 7 Hotspots with emoji labels (🏠📦💼📧📊🎮🏆)
  - Proximity-based glow effect (hotspots glow pink when near)

### Contact Section
- **Contact Cards**:
  - Large circular icons with gradient background
  - Cyan text and borders
  - Smooth hover with scale and rotate
  - All with glowing neon effects

### Footer
- **Dark gradient background**
- **Cyan text**
- **Logo and copyright info**

## Color System

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary Accent | Neon Cyan | #00f0ff | Text, borders, glows |
| Secondary Accent | Neon Pink | #ff2d95 | Buttons, highlights |
| Purple Accent | Neon Purple | #a855f7 | Category badges |
| Background | Deep Purple | #05020a | Main background |
| Card BG | Dark Blue | rgba(10,15,35,0.7) | Sections |
| Text Primary | Light Gray | #e8edf2 | Main text |
| Text Muted | Gray Blue | #8892a6 | Secondary text |

## Animation Effects

### Text & Borders
- Text glowing with `text-shadow: 0 0 10px rgba(0,240,255,0.5)`
- Neon borders with `box-shadow: 0 0 20px rgba(0,240,255,0.3)`

### Interactive Elements
- Hover glow increases opacity
- Cards translateY(-8px to -10px) on hover
- Scale(1.15) on contact icons
- Color transitions 0.3s ease

### Canvas Animations
- Animated grid background
- Pulsing hotspot markers
- Rotating marker borders
- Particle movement with drift
- Flicker effect on scanlines

## Responsive Behavior

### Desktop (> 1024px)
- Full layout with all effects
- Sidebar-like navigation
- Multi-column grids

### Tablet (768px - 1024px)
- Condensed navigation
- Single column for some sections
- Smaller hotspots in game

### Mobile (< 768px)
- Hamburger menu (hidden by default)
- Single column everything
- Smaller fonts and spacing
- Compact game HUD

### Small Phone (< 480px)
- Extra condensed spacing
- Larger touch targets
- Simplified HUD
- Stack all elements vertically

## Game Mode Details

### How to Enter:
1. Click the "▶ Play" button in top navigation
2. Button changes to "⏹ Exit"
3. Button color changes from cyan to pink
4. Canvas becomes interactive

### Controls:
- **W or ↑**: Move up
- **A or ←**: Move left
- **S or ↓**: Move down
- **D or →**: Move right
- **Mouse**: Not used (future enhancement)

### Game Elements:
- **Player Avatar**: Cyan glowing circle in center
- **Hotspots**: Pink circles with emoji (approach < 28px to trigger)
- **Background**: Animated cyan grid with particles
- **HUD Display**: Current position and speed

### Exit Game:
- Click a hotspot to navigate and exit
- Click "⏹ Exit" button
- Smooth scroll to target section

## CSS Classes

### Structure Classes
- `.btn`, `.btn-primary`, `.btn-secondary` - Buttons
- `.section-title`, `.section-subtitle` - Section headers
- `.card`, `.project-card`, `.contact-card` - Card containers
- `.badge`, `.tech-badge`, `.date-badge` - Badges

### Neon Classes
- `.gradient-text` - Gradient text effect
- `.neon-border` - Neon border styling (via CSS vars)
- `.glow` - Glow effect
- `.scanlines` - Screen scanlines effect

### Game Classes
- `.game-hud` - HUD overlay container
- `.hud-panel` - Individual HUD panels
- `.hotspot-marker` - Hotspot visual
- `.health-bar` - Status bar
- `.minimap` - Mini map (framework)

## Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ Mobile browsers (full features)

## Performance Notes

- Canvas rendering at 60fps
- CSS animations for reduced CPU usage
- Particles optimized for smooth movement
- Responsive canvas resizing
- Efficient hotspot detection

## Future Enhancements

Possible additions:
- Sound effects for game world
- Mouse controls for game
- Particle effects on landing
- Boss encounters/mini-games
- Leaderboard integration
- Achievement system
- More interactive elements
