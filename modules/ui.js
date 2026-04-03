import { canvas, ctx } from './canvas.js';

const FONT_RETRO = '"Press Start 2P", monospace';

const LIFE_ICON = new Path2D();
LIFE_ICON.moveTo(0, -20); LIFE_ICON.lineTo(12, 14);
LIFE_ICON.lineTo(0, 7);   LIFE_ICON.lineTo(-12, 14);
LIFE_ICON.closePath();

export const ui = {
    score: {
        draw(score) {
            ctx.fillStyle = '#fff';
            ctx.font = `36px ${FONT_RETRO}`;
            ctx.fillText(score, 20, 52);
        },
    },

    lives: {
        draw(lives) {
            for (let i = 0; i < lives; i++) {
                ctx.save();
                ctx.translate(canvas.width - 50 - i * 50, 40);
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke(LIFE_ICON);
                ctx.restore();
            }
        },
    },

    overlay: {
        draw(complete) {
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.font = `64px ${FONT_RETRO}`;
            ctx.fillText(complete ? 'COMPLETE!' : 'GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
            ctx.font = `20px ${FONT_RETRO}`;
            ctx.fillText('PRESS R TO RESTART', canvas.width / 2, canvas.height / 2 + 30);
            ctx.textAlign = 'left';
        },
    },
};

export default ui;
