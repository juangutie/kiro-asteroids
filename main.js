import { canvas, ctx, onResize } from './modules/canvas.js';
import { input } from './modules/input.js';
import ship, { INVULN_FRAMES } from './modules/ship.js';
import asteroids from './modules/asteroids.js';
import bullets from './modules/bullets.js';
import ui from './modules/ui.js';
import sound from './modules/sound.js';
import { initMobile } from './modules/mobile.js';
import { initMouse, drawTurnZone } from './modules/mouse.js';

// 'playing' | 'gameover' | 'complete'
let state = 'playing';
let score = 0;
let restartAllowed = false;

function setState(s) {
    state = s;
    if (s !== 'playing') {
        restartAllowed = false;
        setTimeout(() => { restartAllowed = true; }, 1500);
    }
}

function onAsteroidScored(pts) {
    score += pts;
}

function onShipHit() {
    if (ship.invulnerableFrames > 0) return;
    sound.collision();
    ship.lives--;
    if (ship.lives > 0) {
        ship.invulnerableFrames = INVULN_FRAMES;
        ship.reset();
    } else {
        setState('gameover');
    }
}

function init() {
    score = 0;
    restartAllowed = false;
    ship.fullReset();
    bullets.list.length = 0;
    asteroids.list.length = 0;
    asteroids.spawnInitial();
    setState('playing');
}

function scaleEntities(entities, scaleX, scaleY) {
    for (const e of entities) { e.x *= scaleX; e.y *= scaleY; }
}

onResize((scaleX, scaleY) => {
    scaleEntities([ship, ...asteroids.list, ...bullets.list], scaleX, scaleY);
});

initMobile(() => ship.angle, () => { if (restartAllowed) init(); });
initMouse(() => ship);

init();

requestAnimationFrame(function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (input.isRestarting() && restartAllowed) init();

    ship.update();
    asteroids.drift();
    bullets.update();

    if (state === 'playing') {
        asteroids.checkCollisions(bullets.list, ship, onAsteroidScored, onShipHit);
        if (asteroids.list.length === 0) setState('complete');
    }

    ship.draw();
    asteroids.draw();
    ui.draw(state, score, ship.lives);
    drawTurnZone(ctx, ship, state === 'gameover');
});

navigator?.serviceWorker.register('/kiro-asteroids/service-worker.js', { scope: '/kiro-asteroids/' });
