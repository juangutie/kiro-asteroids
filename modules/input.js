export const keys = new Map();
document.addEventListener('keydown', e => keys.set(e.key, true));
document.addEventListener('keyup',   e => keys.set(e.key, false));

// mouse state is set externally by mouse.js
export const mouse = { up: false, down: false, left: false, right: false };

const key = k => Boolean(keys.get(k));

export const input = {
    isThrusting:    () => key('ArrowUp')    || key('w') || mouse.up,
    isBraking:      () => key('ArrowDown')  || key('s') || mouse.down,
    isTurningLeft:  () => key('ArrowLeft')  || key('a') || mouse.left,
    isTurningRight: () => key('ArrowRight') || key('d') || mouse.right,
    isShooting:     () => key(' '),
    isRestarting:   () => key('r') || key('R'),
};
