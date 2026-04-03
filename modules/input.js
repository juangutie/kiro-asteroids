export const keys = new Map();
document.addEventListener('keydown', e => keys.set(e.key, true));
document.addEventListener('keyup',   e => keys.set(e.key, false));
