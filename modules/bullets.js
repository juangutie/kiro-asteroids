import { ctx } from './canvas.js';
import sound from './sound.js';

const BULLET_SPEED = 10;
const BULLET_LIFE  = 60;

const bullets = {
    list: [],

    spawn(x, y, angle, vx, vy) {
        sound.shoot();
        this.list.push({
            x: x + Math.sin(angle) * 40,
            y: y - Math.cos(angle) * 40,
            vx: Math.sin(angle) * BULLET_SPEED + vx,
            vy: -Math.cos(angle) * BULLET_SPEED + vy,
            life: BULLET_LIFE,
        });
    },

    update() {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const b = this.list[i];
            b.x += b.vx; b.y += b.vy; b.life--;
            if (b.life <= 0) { this.list.splice(i, 1); continue; }
            ctx.beginPath();
            ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }
    },
};

export default bullets;
