import { canvas, ctx, wrapPosition } from './canvas.js';
import sound from './sound.js';

const SIZES        = { large: 90,  medium: 45, small: 20  };
const POINTS       = { large: 20,  medium: 50, small: 100 };
const NEXT         = { large: 'medium', medium: 'small'   };
const SPEEDS       = { large: 1,   medium: 2,  small: 4   };
const VERT_COUNT   = 10;
const VERT_MIN_R   = 0.75;
const VERT_JITTER  = 0.45;
const SHIP_RADIUS  = 20; // approx collision radius added to asteroid size

const INITIAL_ASTEROIDS = 5;

const asteroids = {
    list: [],

    spawn(size, x, y) {
        const angle = Math.random() * Math.PI * 2;
        const speed = SPEEDS[size];
        const verts = [];
        for (let i = 0; i < VERT_COUNT; i++) {
            const a = (i / VERT_COUNT) * Math.PI * 2;
            const r = SIZES[size] * (VERT_MIN_R + Math.random() * VERT_JITTER);
            verts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
        }
        this.list.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size, verts });
    },

    spawnInitial() {
        for (let i = 0; i < INITIAL_ASTEROIDS; i++) this.spawnAtEdge('large');
    },

    spawnAtEdge(size) {
        const edge = Math.floor(Math.random() * 4);
        let x, y;
        if (edge === 0)      { x = Math.random() * canvas.width;  y = 0; }
        else if (edge === 1) { x = canvas.width;                  y = Math.random() * canvas.height; }
        else if (edge === 2) { x = Math.random() * canvas.width;  y = canvas.height; }
        else                 { x = 0;                             y = Math.random() * canvas.height; }
        this.spawn(size, x, y);
    },

    drift() {
        for (const a of this.list) {
            a.x += a.vx; a.y += a.vy;
            wrapPosition(a);
        }
    },

    checkCollisions(bullets, ship, onScore, onHit) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const a = this.list[i];

            for (let j = bullets.length - 1; j >= 0; j--) {
                const b = bullets[j];
                if (Math.hypot(b.x - a.x, b.y - a.y) < SIZES[a.size]) {
                    sound.collision();
                    onScore(POINTS[a.size]);
                    bullets.splice(j, 1);
                    if (NEXT[a.size]) {
                        this.spawn(NEXT[a.size], a.x, a.y);
                        this.spawn(NEXT[a.size], a.x, a.y);
                    }
                    this.list.splice(i, 1);
                    break;
                }
            }

            if (i < this.list.length) {
                if (Math.hypot(ship.x - a.x, ship.y - a.y) < SIZES[a.size] + SHIP_RADIUS) {
                    onHit();
                }
            }
        }
    },

    draw() {
        for (const a of this.list) {
            const path = new Path2D();
            path.moveTo(a.verts[0].x, a.verts[0].y);
            for (let v = 1; v < a.verts.length; v++) path.lineTo(a.verts[v].x, a.verts[v].y);
            path.closePath();
            ctx.save();
            ctx.translate(a.x, a.y);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke(path);
            ctx.restore();
        }
    },
};

export default asteroids;
