#!/usr/bin/env python3
"""
Generate a high-voltage maximalist SVG wallpaper.
Colors: Solar Flare Orange (#FF5500), Acid Lime (#D4FF00), Cobalt Blue (#0052FF), Sun Yellow (#FFD600), Signal Red (#FF2A3A).
Strictly 0% purple.
"""

import math

width = 1920
height = 1080

svg = []
svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">')

# Definitions: gradients, patterns, filters
svg.append('''<defs>
  <!-- Solar & Electric Gradients -->
  <linearGradient id="solarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#FF5500" stop-opacity="0.85" />
    <stop offset="60%" stop-color="#FF2A3A" stop-opacity="0.7" />
    <stop offset="100%" stop-color="#FFD600" stop-opacity="0.2" />
  </linearGradient>

  <linearGradient id="cobaltSweep" x1="100%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#0052FF" stop-opacity="0.8" />
    <stop offset="60%" stop-color="#0038D1" stop-opacity="0.6" />
    <stop offset="100%" stop-color="#00E599" stop-opacity="0.2" />
  </linearGradient>

  <linearGradient id="acidLimeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#D4FF00" stop-opacity="0.9" />
    <stop offset="100%" stop-color="#FFD600" stop-opacity="0.6" />
  </linearGradient>

  <linearGradient id="stripeSolar" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#FF5500" />
    <stop offset="50%" stop-color="#FFD600" />
    <stop offset="100%" stop-color="#D4FF00" />
  </linearGradient>

  <!-- Dot Matrix Pattern -->
  <pattern id="dotGrid" width="32" height="32" patternUnits="userSpaceOnUse">
    <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" fill-opacity="0.08" />
    <circle cx="16" cy="16" r="0.75" fill="#D4FF00" fill-opacity="0.3" />
  </pattern>

  <!-- Fine Technical Grid -->
  <pattern id="techGrid" width="64" height="64" patternUnits="userSpaceOnUse">
    <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#FFFFFF" stroke-width="0.7" stroke-opacity="0.06" />
    <circle cx="0" cy="0" r="2" fill="#FF5500" fill-opacity="0.3" />
  </pattern>

  <!-- Diagonal Hazard / Caution Pattern -->
  <pattern id="hazardPattern" width="28" height="28" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
    <line x1="0" y1="0" x2="0" y2="28" stroke="#FF5500" stroke-width="12" stroke-opacity="0.25" />
    <line x1="14" y1="0" x2="14" y2="28" stroke="#D4FF00" stroke-width="12" stroke-opacity="0.25" />
  </pattern>

  <!-- Dither Halftone Pattern -->
  <pattern id="halftone" width="16" height="16" patternUnits="userSpaceOnUse">
    <circle cx="8" cy="8" r="3" fill="#0052FF" fill-opacity="0.12" />
    <circle cx="2" cy="2" r="1" fill="#FFD600" fill-opacity="0.15" />
  </pattern>
</defs>''')

# 1. Base Canvas - Deep Ink / Obsidian
svg.append(f'<rect width="{width}" height="{height}" fill="#0A0C10" />')

# 2. Underglow Radial Volumes (Solar Flare + Cobalt Blue)
svg.append('<circle cx="350" cy="250" r="420" fill="url(#solarGlow)" opacity="0.35" filter="blur(80px)" />')
svg.append('<circle cx="1600" cy="850" r="500" fill="url(#cobaltSweep)" opacity="0.4" filter="blur(90px)" />')
svg.append('<circle cx="1100" cy="200" r="320" fill="#D4FF00" opacity="0.12" filter="blur(100px)" />')
svg.append('<circle cx="150" cy="950" r="380" fill="#FF2A3A" opacity="0.2" filter="blur(80px)" />')

# 3. Full Screen Dot and Technical Grid Overlays
svg.append(f'<rect width="{width}" height="{height}" fill="url(#techGrid)" />')
svg.append(f'<rect width="{width}" height="{height}" fill="url(#dotGrid)" />')

# 4. Large Constructivist Bold Geometry & Shapes

# Giant Solar Flare Quarter-Arc (Top Left)
svg.append('''<g opacity="0.85">
  <path d="M -50 -50 L 520 -50 A 570 570 0 0 1 -50 520 Z" fill="none" stroke="#FF5500" stroke-width="2.5" />
  <path d="M -50 -50 L 460 -50 A 510 510 0 0 1 -50 460 Z" fill="none" stroke="#FFD600" stroke-width="1.5" stroke-dasharray="12 8" />
  <path d="M -50 -50 L 380 -50 A 430 430 0 0 1 -50 380 Z" fill="none" stroke="#D4FF00" stroke-width="3" stroke-dasharray="40 20" />
  <circle cx="-50" cy="-50" r="280" fill="#FF5500" fill-opacity="0.08" />
</g>''')

# Focal Particle Ring / Radial Accelerator (Center-Right: 1450, 420)
cx, cy = 1480, 380
svg.append(f'<g transform="translate({cx}, {cy})" opacity="0.9">')
svg.append('  <circle cx="0" cy="0" r="320" fill="none" stroke="#0052FF" stroke-width="2" stroke-opacity="0.6" />')
svg.append('  <circle cx="0" cy="0" r="280" fill="none" stroke="#D4FF00" stroke-width="1.5" stroke-dasharray="8 12" stroke-opacity="0.7" />')
svg.append('  <circle cx="0" cy="0" r="230" fill="none" stroke="#FF5500" stroke-width="4" stroke-dasharray="80 30" stroke-opacity="0.85" />')
svg.append('  <circle cx="0" cy="0" r="170" fill="none" stroke="#FFD600" stroke-width="1" stroke-dasharray="4 6" />')
svg.append('  <circle cx="0" cy="0" r="110" fill="url(#halftone)" stroke="#0052FF" stroke-width="2" />')
svg.append('  <circle cx="0" cy="0" r="45" fill="#FF5500" fill-opacity="0.25" stroke="#FF5500" stroke-width="2" />')
svg.append('  <circle cx="0" cy="0" r="8" fill="#D4FF00" />')

# Accelerator Tick Marks
for deg in range(0, 360, 15):
    rad = math.radians(deg)
    r1 = 305 if deg % 45 == 0 else 312
    r2 = 328
    x1, y1 = r1 * math.cos(rad), r1 * math.sin(rad)
    x2, y2 = r2 * math.cos(rad), r2 * math.sin(rad)
    color = "#FFD600" if deg % 45 == 0 else "#FFFFFF"
    opacity = "0.8" if deg % 45 == 0 else "0.3"
    svg.append(f'  <line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{color}" stroke-width="1.8" stroke-opacity="{opacity}" />')

svg.append('</g>')

# 5. Bold Kinetic Diagonal Caution & Hazard Bands
svg.append('''<g opacity="0.65">
  <!-- Diagonal Stripe Bar at Bottom Left -->
  <polygon points="40,1040 380,700 440,700 100,1040" fill="url(#hazardPattern)" stroke="#FF5500" stroke-width="1.5" />
  <line x1="30" y1="1050" x2="370" y2="710" stroke="#D4FF00" stroke-width="2" />
  <line x1="110" y1="1050" x2="450" y2="710" stroke="#0052FF" stroke-width="2" />
</g>''')

# 6. Isometric 3D Wireframe Prisms & Tech Cubes (Bottom Center-Right)
def draw_iso_cube(x, y, size, stroke_color="#D4FF00", fill_color="#FF5500", fill_op=0.15):
    h = size * 0.577
    pts_top = f"{x},{y - h*2} {x + size},{y - h} {x},{y} {x - size},{y - h}"
    pts_left = f"{x - size},{y - h} {x},{y} {x},{y + h*2} {x - size},{y + h}"
    pts_right = f"{x},{y} {x + size},{y - h} {x + size},{y + h} {x},{y + h*2}"
    return f'''<g opacity="0.8">
      <polygon points="{pts_top}" fill="{fill_color}" fill-opacity="{fill_op*1.8}" stroke="{stroke_color}" stroke-width="1.5" />
      <polygon points="{pts_left}" fill="#0052FF" fill-opacity="{fill_op}" stroke="{stroke_color}" stroke-width="1.5" />
      <polygon points="{pts_right}" fill="{fill_color}" fill-opacity="{fill_op*0.7}" stroke="{stroke_color}" stroke-width="1.5" />
    </g>'''

svg.append(draw_iso_cube(920, 920, 70, stroke_color="#D4FF00", fill_color="#FF5500", fill_op=0.2))
svg.append(draw_iso_cube(1040, 850, 45, stroke_color="#FFD600", fill_color="#0052FF", fill_op=0.25))
svg.append(draw_iso_cube(820, 870, 50, stroke_color="#0052FF", fill_color="#FF2A3A", fill_op=0.2))

# 7. Optical Wave Lines (flowing horizontally across middle)
svg.append('<g opacity="0.4">')
for i in range(12):
    y_offset = 520 + i * 16
    amp = 30 + i * 4
    freq1 = 0.003
    freq2 = 0.007
    d = [f"M 0 {y_offset}"]
    for x in range(0, 1920, 40):
        y_val = y_offset + math.sin(x * freq1 + i*0.4) * amp + math.cos(x * freq2) * 15
        d.append(f"L {x} {y_val:.1f}")
    color = "#FF5500" if i % 3 == 0 else ("#D4FF00" if i % 3 == 1 else "#0052FF")
    svg.append(f'  <path d="{" ".join(d)}" fill="none" stroke="{color}" stroke-width="1.2" stroke-opacity="0.45" />')
svg.append('</g>')

# 8. Technical Crosshairs & HUD Elements (Corner Coordinates, Targets, Framing)
crosshairs = [
    (120, 100), (960, 80), (1800, 120),
    (140, 540), (1780, 680),
    (240, 960), (1720, 960)
]
svg.append('<g opacity="0.75">')
for x, y in crosshairs:
    svg.append(f'''  <!-- Crosshair at ({x}, {y}) -->
  <line x1="{x-14}" y1="{y}" x2="{x+14}" y2="{y}" stroke="#D4FF00" stroke-width="1.4" />
  <line x1="{x}" y1="{y-14}" x2="{x}" y2="{y+14}" stroke="#D4FF00" stroke-width="1.4" />
  <circle cx="{x}" cy="{y}" r="6" fill="none" stroke="#FF5500" stroke-width="1" />
  <rect x="{x-18}" y="{y-18}" width="36" height="36" fill="none" stroke="#FFFFFF" stroke-width="0.6" stroke-opacity="0.4" stroke-dasharray="3 3" />''')
svg.append('</g>')

# 9. Maximalist Typographic Watermarks & Data Telemetry
svg.append('''<g font-family="'JetBrains Mono', 'Courier New', monospace" font-size="11" font-weight="600" opacity="0.65" fill="#E2E8F0">
  <!-- Top Bar Telemetry -->
  <text x="120" y="60" fill="#FF5500">SYS_REV // 2026.MAXIMAL</text>
  <text x="320" y="60" fill="#D4FF00">FREQ: 104.8 MHZ</text>
  <text x="520" y="60" fill="#0052FF">CORE_STATE: HIGH_VOLTAGE</text>
  <text x="1560" y="60" fill="#FFD600" text-anchor="end">DOMAIN: AAYUSHBABU.LIVE</text>
  <text x="1800" y="60" fill="#FFFFFF" text-anchor="end">[ ONLINE ]</text>

  <!-- Left Side Technical Rail -->
  <g transform="translate(60, 400) rotate(-90)">
    <text x="0" y="0" letter-spacing="4" fill="#FF5500">SUBDOMAIN GATEWAY &#8226; MULTI-SERVICE LAUNCHPAD &#8226; 0% PURPLE</text>
  </g>

  <!-- Right Side Technical Rail -->
  <g transform="translate(1860, 750) rotate(90)">
    <text x="0" y="0" letter-spacing="3" fill="#D4FF00">HIGH-VOLTAGE SOLAR PALETTE &#8226; EST 2026</text>
  </g>

  <!-- Giant Faint Watermark Text Behind Cards -->
  <text x="960" y="340" font-family="'Space Grotesk', 'Impact', sans-serif" font-size="140" font-weight="900" 
        fill="#FFFFFF" fill-opacity="0.03" text-anchor="middle" letter-spacing="16">
    MAXIMAL
  </text>
  <text x="960" y="470" font-family="'Space Grotesk', 'Impact', sans-serif" font-size="110" font-weight="900" 
        fill="#FF5500" fill-opacity="0.03" text-anchor="middle" letter-spacing="24">
    GATEWAY
  </text>
</g>''')

# 10. Frame Corner Badges
svg.append('''<g opacity="0.9">
  <!-- Top-left bracket -->
  <path d="M 40 70 L 40 40 L 70 40" fill="none" stroke="#FF5500" stroke-width="3" />
  <!-- Top-right bracket -->
  <path d="M 1850 40 L 1880 40 L 1880 70" fill="none" stroke="#D4FF00" stroke-width="3" />
  <!-- Bottom-left bracket -->
  <path d="M 40 1010 L 40 1040 L 70 1040" fill="none" stroke="#0052FF" stroke-width="3" />
  <!-- Bottom-right bracket -->
  <path d="M 1850 1040 L 1880 1040 L 1880 1010" fill="none" stroke="#FFD600" stroke-width="3" />
</g>''')

svg.append('</svg>')

content = '\n'.join(svg)
with open('public/wallpaper.svg', 'w') as f:
    f.write(content)

with open('wallpaper.svg', 'w') as f:
    f.write(content)

print("Wallpaper SVG generated successfully: public/wallpaper.svg and wallpaper.svg")
