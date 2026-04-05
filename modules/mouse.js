import { keys } from './input.js';

const THRESHOLD = 0.3;
const DEAD_ZONE = 84;  // ~30% smaller than 120
const TURN_ZONE = 280;

let mode = 'dead';
let mouseX = null, mouseY = null;
let held = false;

// internal state — read by ship.js via getMouseState()
const state = { up: false, down: false, left: false, right: false };

export function getMouseState() { return state; }

export function drawTurnZone(ctx, ship, hidden = false) {
    if (hidden || mouseX === null) return;
    const dist = Math.hypot(mouseX - ship.x, mouseY - ship.y);
    const inTurnZone = dist <= TURN_ZONE;
    if (!(!held && inTurnZone) && !(held && mode === 'turn')) return;

    const t = held && mode === 'turn'
        ? 1
        : 1 - Math.min(Math.max(dist - DEAD_ZONE, 0) / (TURN_ZONE - DEAD_ZONE), 1);
    const alpha = (t * 0.6).toFixed(3);

    const angle = Math.atan2(mouseX - ship.x, -(mouseY - ship.y));
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(angle + Math.PI);

    const grad = ctx.createConicGradient(-Math.PI / 2, 0, 0);
    grad.addColorStop(0,    'rgba(255,255,255,0)');
    grad.addColorStop(0.3,  'rgba(255,255,255,0)');
    grad.addColorStop(0.5,  `rgba(255,255,255,${alpha})`);
    grad.addColorStop(0.7,  'rgba(255,255,255,0)');
    grad.addColorStop(1,    'rgba(255,255,255,0)');

    ctx.beginPath();
    ctx.arc(0, 0, TURN_ZONE, 0, Math.PI * 2);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

function update(ship) {
    state.up = state.down = state.left = state.right = false;

    if (!held || mouseX === null) return;

    const dx = mouseX - ship.x;
    const dy = mouseY - ship.y;
    const dist = Math.hypot(dx, dy);

    if (dist < DEAD_ZONE) return;

    const a = ((Math.atan2(dx, -dy) - ship.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;

    if (mode === 'turn') {
        ship.angle += Math.abs(a) > ship.rotSpeed ? Math.sign(a) * ship.rotSpeed : a;
    } else {
        const fwd  = Math.cos(a);
        const side = Math.sin(a);
        state.up    = fwd  >  THRESHOLD;
        state.down  = fwd  < -THRESHOLD;
        state.left  = side < -THRESHOLD;
        state.right = side >  THRESHOLD;
    }
}

export function initMouse(getShip) {
    window.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('mousedown', e => {
        if (e.button === 0) {
            held = true;
            const ship = getShip();
            const dist = Math.hypot(e.clientX - ship.x, e.clientY - ship.y);
            mode = dist < DEAD_ZONE ? 'dead' : dist < TURN_ZONE ? 'turn' : 'full';
        }
        if (e.button === 2) keys.set(' ', true);
    });
    window.addEventListener('mouseup', e => {
        if (e.button === 0) { held = false; mode = 'dead'; }
        if (e.button === 2) keys.set(' ', false);
    });
    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (held && mode === 'dead') {
            const ship = getShip();
            const dist = Math.hypot(mouseX - ship.x, mouseY - ship.y);
            if (dist >= DEAD_ZONE) mode = 'turn';
        }
    });

    (function tick() { update(getShip()); requestAnimationFrame(tick); })();
}
