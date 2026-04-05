import { keys } from './input.js';

const TILT_THRESHOLD = 12;

function startOrientation(getShipAngle) {
    let betaBase = null;
    window.addEventListener('deviceorientation', e => {
        const beta  = e.beta  ?? 0;
        const gamma = e.gamma ?? 0;
        if (betaBase === null) betaBase = beta;
        const tiltY = beta - betaBase;
        const tiltX = gamma;
        const a = -getShipAngle();
        const relX =  tiltX * Math.cos(a) - tiltY * Math.sin(a);
        const relY =  tiltX * Math.sin(a) + tiltY * Math.cos(a);
        keys.set('ArrowUp',    relY < -TILT_THRESHOLD);
        keys.set('ArrowDown',  relY >  TILT_THRESHOLD);
        keys.set('ArrowLeft',  relX < -TILT_THRESHOLD);
        keys.set('ArrowRight', relX >  TILT_THRESHOLD);
    });
}

function startTouch(onTap) {
    window.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    window.addEventListener('touchstart', e => {
        e.preventDefault();
        keys.set(' ', true);
        onTap?.();
    }, { passive: false });
    window.addEventListener('touchend', () => keys.set(' ', false));
}

export function initMobile(getShipAngle, onTap) {
    try { screen.orientation?.lock('portrait').catch(() => {}); } catch(e) {}
    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        window.addEventListener('touchend', async function onFirstTouch(e) {
            e.preventDefault();
            window.removeEventListener('touchend', onFirstTouch);
            const perm = await DeviceOrientationEvent.requestPermission();
            if (perm === 'granted') startOrientation(getShipAngle);
            startTouch(onTap);
        }, { once: true, passive: false });
    } else {
        startOrientation(getShipAngle);
        startTouch(onTap);
    }
}
