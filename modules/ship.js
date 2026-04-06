import { canvas, ctx, wrapPosition } from './canvas.js';
import { input } from './input.js';
import bullets from './bullets.js';
import sound from './sound.js';

const SHIP_PATH = new Path2D();
SHIP_PATH.moveTo(0, -40);
SHIP_PATH.lineTo(24, 30);
SHIP_PATH.lineTo(0, 16);
SHIP_PATH.lineTo(-24, 30);
SHIP_PATH.closePath();

function thrustPath() {
    const flicker = 18 + Math.random() * 16;
    const p = new Path2D();
    p.moveTo(-10, 22); p.lineTo(0, 16 + flicker);
    p.moveTo(10, 22);  p.lineTo(0, 16 + flicker);
    return p;
}

function leftJetPath() {
    const f = 1 + Math.random() * 2;
    const p = new Path2D();
    p.moveTo(12, -22); p.lineTo(16 + f, -25);
    p.moveTo(12, -20); p.lineTo(17 + f, -20);
    p.moveTo(12, -18); p.lineTo(16 + f, -15);
    return p;
}

function rightJetPath() {
    const f = 1 + Math.random() * 2;
    const p = new Path2D();
    p.moveTo(-12, -22); p.lineTo(-16 - f, -25);
    p.moveTo(-12, -20); p.lineTo(-17 - f, -20);
    p.moveTo(-12, -18); p.lineTo(-16 - f, -15);
    return p;
}

function brakeJetPath() {
    const f = 1 + Math.random() * 2;
    const p = new Path2D();
    p.moveTo(12, -22);  p.lineTo(16 + f, -27);
    p.moveTo(12, -20);  p.lineTo(17 + f, -25);
    p.moveTo(12, -18);  p.lineTo(16 + f, -23);
    p.moveTo(-12, -22); p.lineTo(-16 - f, -27);
    p.moveTo(-12, -20); p.lineTo(-17 - f, -25);
    p.moveTo(-12, -18); p.lineTo(-16 - f, -23);
    return p;
}

export const INVULN_FRAMES = 120;

const ship = {
    x: 0, y: 0,
    angle: 0,
    rotSpeed: 0.05,
    vx: 0, vy: 0,
    thrust: 0.2,
    friction: 0.98,
    lives: 3,
    invulnerableFrames: 0,

    thrusting: false,
    braking: false,
    turningLeft: false,
    turningRight: false,

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.vx = 0; this.vy = 0;
        this.angle = 0;
    },

    fullReset() {
        this.lives = 3;
        this.invulnerableFrames = 0;
        this.reset();
    },

    _canShoot: true,

    update() {
        if (this.lives <= 0) return;

        if (this.invulnerableFrames > 0) this.invulnerableFrames--;

        this.thrusting    = input.isThrusting();
        this.braking      = input.isBraking();
        this.turningLeft  = input.isTurningLeft();
        this.turningRight = input.isTurningRight();

        if (input.isShooting() && this._canShoot) {
            this._canShoot = false;
            bullets.spawn(this.x, this.y, this.angle, this.vx, this.vy);
        }
        if (!input.isShooting()) this._canShoot = true;

        if (this.turningLeft)  this.angle -= this.rotSpeed;
        if (this.turningRight) this.angle += this.rotSpeed;
        if (this.thrusting) {
            this.vx += Math.sin(this.angle) * this.thrust;
            this.vy -= Math.cos(this.angle) * this.thrust;
        }
        this.vx *= this.braking ? 0.94 : this.friction;
        this.vy *= this.braking ? 0.94 : this.friction;
        if (this.braking) {
            this.vx -= Math.sin(this.angle) * this.thrust * 0.5;
            this.vy += Math.cos(this.angle) * this.thrust * 0.5;
        }

        if (this.thrusting || this.braking || this.turningLeft || this.turningRight) {
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            sound.thrust(speed);
        }
        this.x += this.vx;
        this.y += this.vy;
        wrapPosition(this);
    },

    draw() {
        if (this.lives <= 0) return;
        if (this.invulnerableFrames > 0 && Math.floor(this.invulnerableFrames / 4) % 2 === 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.lineWidth = 2;

        ctx.strokeStyle = '#fff';
        ctx.stroke(SHIP_PATH);

        if (this.thrusting) {
            ctx.strokeStyle = '#f80';
            ctx.stroke(thrustPath());
        }
        if (this.braking) {
            ctx.strokeStyle = '#dde';
            ctx.stroke(brakeJetPath());
        } else {
            if (this.turningLeft) {
                ctx.strokeStyle = '#dde';
                ctx.stroke(leftJetPath());
            }
            if (this.turningRight) {
                ctx.strokeStyle = '#dde';
                ctx.stroke(rightJetPath());
            }
        }

        ctx.restore();
    },
};

export default ship;
