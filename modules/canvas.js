export const canvas = document.getElementById('c');
export const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

resizeCanvas();
requestAnimationFrame(resizeCanvas);

export function wrapPosition(obj) {
    if (obj.x < 0) obj.x = canvas.width;
    if (obj.x > canvas.width) obj.x = 0;
    if (obj.y < 0) obj.y = canvas.height;
    if (obj.y > canvas.height) obj.y = 0;
}

export function onResize(callback) {
    window.addEventListener('resize', () => {
        const scaleX = canvas.clientWidth  / canvas.width;
        const scaleY = canvas.clientHeight / canvas.height;
        resizeCanvas();
        callback(scaleX, scaleY);
    });
}
