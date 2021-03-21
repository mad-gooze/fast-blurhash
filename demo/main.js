import { decodeBlurHash } from '../index.js';

const blurHashInput = document.getElementById('blurhash');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function render() {
    const blurHash = blurHashInput.value;
    if (!blurHash) {
        return;
    }
    const pixels = decodeBlurHash(blurHash, 32, 32);
    const imageData = new ImageData(pixels, 32, 32);
    ctx.putImageData(imageData, 0, 0);
}

blurHashInput.addEventListener('input', render);
render();
