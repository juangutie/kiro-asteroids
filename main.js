import { canvas, ctx, onResize } from './modules/canvas.js';
import { keys } from './modules/input.js';
import ship from './modules/ship.js';
import asteroids from './modules/asteroids.js';
import bullets from './modules/bullets.js';
import ui from './modules/ui.js';
import sound from './modules/sound.js';
import { initMobile } from './modules/mobile.js';
import { initMouse, drawTurnZone } from './modules/mouse.js';

initMobile(() => ship.angle, () => {
    const canRestart = (state.gameOver || state.complete) && restartAllowed;
    if (canRestart) init();
});
initMouse(() => ship);

const INITIAL_ASTEROIDS = 5;
const INVULN_FRAMES     = 120;

const state = {
    score: 0,
    lives: 3,
    invulnerableFrames: 0,
    get gameOver() { return this.lives <= 0; },
    get complete() { return asteroids.list.length === 0 && !this.gameOver; },
};

function onAsteroidScored(pts) {
    state.score += pts;
}

function onShipHit() {
    const isInvulnerable = state.invulnerableFrames > 0;
    if (isInvulnerable) return;
    sound.collision();
    state.lives--;
    const hasLivesRemaining = state.lives > 0;
    if (hasLivesRemaining) {
        state.invulnerableFrames = INVULN_FRAMES;
        ship.reset();
    } else {
        onGameEnd();
    }
}

let restartAllowed = false;

function onGameEnd() {
    restartAllowed = false;
    setTimeout(() => { restartAllowed = true; }, 1500);
}

function init() {
    state.score = 0;
    state.lives = 3;
    state.invulnerableFrames = 0;
    state._endTriggered = false;
    ship.reset();
    bullets.list.length = 0;
    asteroids.list.length = 0;
    for (let i = 0; i < INITIAL_ASTEROIDS; i++) asteroids.spawnAtEdge('large');
}

onResize((scaleX, scaleY) => {
    ship.x *= scaleX; ship.y *= scaleY;
    for (const a of asteroids.list) { a.x *= scaleX; a.y *= scaleY; }
    for (const b of bullets.list)   { b.x *= scaleX; b.y *= scaleY; }
});

init();

requestAnimationFrame(function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const restartPressed = keys.get('r') || keys.get('R');
    const canRestart     = (state.gameOver || state.complete) && restartAllowed;
    if (restartPressed && canRestart) init();

    if (!state.gameOver) {
        ship.update();
        bullets.tryShoot(keys.get(' '));
        asteroids.update(bullets.list, ship, onAsteroidScored, onShipHit);
    }
    if (state.invulnerableFrames > 0) state.invulnerableFrames--;

    ship.draw(state.lives, state.invulnerableFrames);
    ui.score.draw(state.score);
    ui.lives.draw(state.lives);
    bullets.updateAndDraw();
    asteroids.draw();

    if ((state.gameOver || state.complete) && !restartAllowed && !state._endTriggered) {
        state._endTriggered = true;
        onGameEnd();
    }
    if (state.gameOver || state.complete) ui.overlay.draw(state.complete);
    drawTurnZone(ctx, ship);
});

navigator?.serviceWorker.register('/kiro-asteroids/service-worker.js', { scope: '/kiro-asteroids/' });
