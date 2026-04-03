export const canvas = document.getElementById('c');
export const ctx = canvas.getContext('2d');
canvas.width  = canvas.clientWidth;
canvas.height = canvas.clientHeight;

export function onResize(callback) {
    window.addEventListener('resize', () => {
        const scaleX = canvas.clientWidth  / canvas.width;
        const scaleY = canvas.clientHeight / canvas.height;
        canvas.width  = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        callback(scaleX, scaleY);
    });
}
