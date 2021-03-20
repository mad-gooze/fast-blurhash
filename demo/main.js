import { decodeBlurHash } from '../index.js';

const blurhashElement = document.getElementById('blurhash');
const canvas = document.getElementById('canvas');
function render() {
    const blurhash = blurhashElement.value;
    if (blurhash) {
        const pixels = decodeBlurHash(blurhash, 32, 32);
        if (pixels) {
            const ctx = canvas.getContext('2d');
            const imageData = new ImageData(pixels, 32, 32);
            ctx.putImageData(imageData, 0, 0);
        }
    }
}

blurhashElement.addEventListener('keyup', render);
render();