/**
 * =========================================================================================
 * [MODULE]: APEXFLOW OS — Stage 1: Holographic Tech Radar & Cinematic Hero
 * -----------------------------------------------------------------------------------------
 * [ARCHITECTURAL ROLE]:
 * Renders the Stage 1 interactive holographic radar. Features:
 *   1. Concentric distance rings (Range: 25km, 50km, 75km, 100km maturity)
 *   2. Rotating 360-degree radar sweep beam with sweep gradient fade
 *   3. Interactive ping targets representing detected architecture dependencies
 *   4. Glowing tech-stack badges with live version tags and documentation popups
 *
 * [THEME] UI/UX DESIGN (UI/UX Pro Max Intelligence):
 * - Deep contrast (#070A10 background, #00F0FF and #A855F7 neon sweeps)
 * - Hardware-accelerated SVG transform animations
 * - Interactive hover states showing tech-stack maturity and documentation
 * =========================================================================================
 */

/**
 * Mounts and animates the Holographic Radar inside a container element
 * @param {HTMLElement} container
 * @param {Array<Object>} techStack
 */
export function mountHolographicRadar(container, techStack = []) {
  if (!container) return;

  const size = 380;
  const cx = size / 2;
  const cy = size / 2;

  // Build SVG Radar
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.maxWidth = `${size}px`;
  svg.style.maxHeight = `${size}px`;
  svg.style.margin = '0 auto';

  // 1. Concentric Radar Rings
  [45, 90, 135, 175].forEach((r, i) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'rgba(0, 240, 255, 0.15)');
    circle.setAttribute('stroke-width', i === 3 ? '2' : '1');
    if (i === 1 || i === 2) {
      circle.setAttribute('stroke-dasharray', '4, 6');
    }
    svg.appendChild(circle);
  });

  // 2. Crosshair Axes
  const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  hLine.setAttribute('x1', '15');
  hLine.setAttribute('y1', cy);
  hLine.setAttribute('x2', size - 15);
  hLine.setAttribute('y2', cy);
  hLine.setAttribute('stroke', 'rgba(0, 240, 255, 0.1)');
  svg.appendChild(hLine);

  const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  vLine.setAttribute('x1', cx);
  vLine.setAttribute('y1', '15');
  vLine.setAttribute('x2', cx);
  vLine.setAttribute('y2', size - 15);
  vLine.setAttribute('stroke', 'rgba(0, 240, 255, 0.1)');
  svg.appendChild(vLine);

  // 3. Rotating Radar Sweep Beam Group
  const sweepGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  sweepGroup.setAttribute('class', 'radar-beam');
  sweepGroup.style.transformOrigin = `${cx}px ${cy}px`;

  // Defs for Sweep Gradient
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <radialGradient id="radarSweepGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.35" />
      <stop offset="80%" stop-color="#00F0FF" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#00F0FF" stop-opacity="0" />
    </radialGradient>
  `;
  svg.appendChild(defs);

  // Sweep Cone
  const cone = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  cone.setAttribute('d', `M ${cx} ${cy} L ${cx + 175} ${cy} A 175 175 0 0 1 ${cx + 120} ${cy - 120} Z`);
  cone.setAttribute('fill', 'url(#radarSweepGradient)');
  sweepGroup.appendChild(cone);

  // Sweep Leading Edge
  const leadLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  leadLine.setAttribute('x1', cx);
  leadLine.setAttribute('y1', cy);
  leadLine.setAttribute('x2', cx + 175);
  leadLine.setAttribute('y2', cy);
  leadLine.setAttribute('stroke', '#00F0FF');
  leadLine.setAttribute('stroke-width', '2');
  leadLine.setAttribute('filter', 'drop-shadow(0 0 4px #00F0FF)');
  sweepGroup.appendChild(leadLine);

  svg.appendChild(sweepGroup);

  // 4. Tech Stack Blips (Target Pings)
  techStack.forEach((tech, idx) => {
    const angle = (idx / Math.max(techStack.length, 1)) * Math.PI * 2 - Math.PI / 4;
    const dist = 70 + (idx % 3) * 45;
    const bx = cx + Math.cos(angle) * dist;
    const by = cy + Math.sin(angle) * dist;

    // Glowing blip circle
    const blip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    blip.setAttribute('cx', bx);
    blip.setAttribute('cy', by);
    blip.setAttribute('r', '5');
    blip.setAttribute('fill', tech.color || '#00F0FF');
    blip.setAttribute('filter', `drop-shadow(0 0 6px ${tech.color || '#00F0FF'})`);

    // Blip pulse ring
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', bx);
    ring.setAttribute('cy', by);
    ring.setAttribute('r', '9');
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', tech.color || '#00F0FF');
    ring.setAttribute('stroke-width', '1');
    ring.setAttribute('opacity', '0.6');

    // Text label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', bx + 10);
    label.setAttribute('y', by + 4);
    label.setAttribute('fill', '#F8FAFC');
    label.setAttribute('font-size', '10');
    label.setAttribute('font-weight', '600');
    label.setAttribute('font-family', 'JetBrains Mono');
    label.textContent = tech.name;

    svg.appendChild(ring);
    svg.appendChild(blip);
    svg.appendChild(label);
  });

  // Center Origin Pulse
  const centerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerDot.setAttribute('cx', cx);
  centerDot.setAttribute('cy', cy);
  centerDot.setAttribute('r', '4');
  centerDot.setAttribute('fill', '#00F0FF');
  centerDot.setAttribute('filter', 'drop-shadow(0 0 8px #00F0FF)');
  svg.appendChild(centerDot);

  container.innerHTML = '';
  container.appendChild(svg);
}
