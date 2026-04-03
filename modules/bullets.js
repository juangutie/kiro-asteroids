import { ctx } from './canvas.js';
import ship from './ship.js';

const BULLET_SPEED = 10;
const BULLET_LIFE  = 60;

const bullets = {
    list: [],
    _canShoot: true,

    tryShoot(spaceDown) {
        if (spaceDown && this._canShoot) {
            this._canShoot = false;
            this.list.push({
                x: ship.x + Math.sin(ship.angle) * 40,
                y: ship.y - Math.cos(ship.angle) * 40,
                vx: Math.sin(ship.angle) * BULLET_SPEED + ship.vx,
                vy: -Math.cos(ship.angle) * BULLET_SPEED + ship.vy,
                life: BULLET_LIFE,
            });
        }
        if (!spaceDown) this._canShoot = true;
    },

    updateAndDraw() {
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
