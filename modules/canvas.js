export const canvas = document.getElementById('c');
export const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

resizeCanvas();
requestAnimationFrame(resizeCanvas);

export function onResize(callback) {
    window.addEventListener('resize', () => {
        const scaleX = canvas.clientWidth  / canvas.width;
        const scaleY = canvas.clientHeight / canvas.height;
        resizeCanvas();
        callback(scaleX, scaleY);
    });
}
