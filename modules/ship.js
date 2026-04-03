import { canvas, ctx } from './canvas.js';
import { keys } from './input.js';

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

const ship = {
    x: 0, y: 0,
    angle: 0,
    rotSpeed: 0.05,
    vx: 0, vy: 0,
    thrust: 0.2,
    friction: 0.98,

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

    update() {
        this.thrusting    = Boolean(keys.get('ArrowUp')    || keys.get('w'));
        this.braking      = Boolean(keys.get('ArrowDown')  || keys.get('s'));
        this.turningLeft  = Boolean(keys.get('ArrowLeft')  || keys.get('a'));
        this.turningRight = Boolean(keys.get('ArrowRight') || keys.get('d'));

        if (this.turningLeft)  this.angle -= this.rotSpeed;
        if (this.turningRight) this.angle += this.rotSpeed;
        if (this.thrusting) {
            this.vx += Math.sin(this.angle) * this.thrust;
            this.vy -= Math.cos(this.angle) * this.thrust;
        }
        this.vx *= this.braking ? 0.94 : this.friction;
        this.vy *= this.braking ? 0.94 : this.friction;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    },

    draw(lives, invulnerable) {
        if (lives <= 0) return;
        if (invulnerable > 0 && Math.floor(invulnerable / 4) % 2 === 0) return;
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
