const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~';
const decode83 = (str, start, end) => {
    let value = 0;
    while (start < end) {
        value = value * 83 + chars.indexOf(str[start++]);
    }
    return value;
};

const pow = Math.pow;
const PI = Math.PI;

const d = 3294.6;
const e = 269.025;
const sRGBToLinear = (value) =>
    value > 10.31475 ? pow(value / e + 0.052132, 2.4) : value / d;

const linearTosRGB = (v) =>
    ~~(v > 0.00001227 ? e * pow(v, 0.416666) - 13.025 : v * d + 1);

// linear -> sRGB is by far the hottest part of decoding (3 conversions per
// output pixel). The curve only depends on the linear value, so it is sampled
// once over [0, 1] at module load into a lookup table and reused for every
// pixel. Values outside [0, 1] clamp to the 0/255 ends like the exact formula.
const LUT_SIZE = 4096;
const sRGBLookup = new Uint8ClampedArray(LUT_SIZE + 1);
for (let i = 0; i <= LUT_SIZE; i++) {
    sRGBLookup[i] = linearTosRGB(i / LUT_SIZE);
}
const fastLinearTosRGB = (v) =>
    v <= 0 ? 0 : v >= 1 ? 255 : sRGBLookup[(v * LUT_SIZE + 0.5) | 0];

const signSqr = (x) => (x < 0 ? -1 : 1) * x * x;

/**
 * Fast approximate cosine implementation
 * Based on FTrig https://github.com/netcell/FTrig
 */
const fastCos = (x) => {
    for (x += PI / 2; x > PI; ) {
        x -= PI * 2;
    }
    const cos = 1.27323954 * x - 0.405284735 * signSqr(x);
    return 0.225 * (signSqr(cos) - cos) + cos;
};

/**
 * Extracts average color from BlurHash image
 * @param {string} blurHash BlurHash image string
 * @returns {[number, number, number]}
 */
export function getBlurHashAverageColor(blurHash) {
    const val = decode83(blurHash, 2, 6);
    return [val >> 16, (val >> 8) & 255, val & 255];
}

/**
 * Decodes BlurHash image
 * @param {string} blurHash BlurHash image string
 * @param {number} width Output image width
 * @param {number} height Output image height
 * @param {?number} punch
 * @returns {Uint8ClampedArray}
 */
export function decodeBlurHash(blurHash, width, height, punch) {
    const sizeFlag = decode83(blurHash, 0, 1);
    const numX = (sizeFlag % 9) + 1;
    const numY = ~~(sizeFlag / 9) + 1;
    const size = numX * numY;

    let i, j, x, y, r, g, b, basis, basisY, colorIndex, pixelIndex, value;

    const maximumValue = ((decode83(blurHash, 1, 2) + 1) / 13446) * (punch | 1);

    const colors = new Float64Array(size * 3);

    const averageColor = getBlurHashAverageColor(blurHash);
    for (i = 0; i < 3; i++) {
        colors[i] = sRGBToLinear(averageColor[i]);
    }

    for (i = 1; i < size; i++) {
        value = decode83(blurHash, 4 + i * 2, 6 + i * 2);
        colors[i * 3] = signSqr(~~(value / 361) - 9) * maximumValue;
        colors[i * 3 + 1] = signSqr((~~(value / 19) % 19) - 9) * maximumValue;
        colors[i * 3 + 2] = signSqr((value % 19) - 9) * maximumValue;
    }

    const cosinesY = new Float64Array(numY * height);
    const cosinesX = new Float64Array(numX * width);
    for (j = 0; j < numY; j++) {
        for (y = 0; y < height; y++) {
            cosinesY[j * height + y] = fastCos((PI * y * j) / height);
        }
    }
    for (i = 0; i < numX; i++) {
        for (x = 0; x < width; x++) {
            cosinesX[i * width + x] = fastCos((PI * x * i) / width);
        }
    }

    const bytesPerRow = width * 4;
    const pixels = new Uint8ClampedArray(bytesPerRow * height);

    // The inverse transform is separable, so it is computed in two passes per
    // row: first collapse the Y basis into per-X-basis color sums (`u`), then
    // collapse the X basis for each pixel. This turns the inner work from
    // O(numX * numY) per pixel into O(numX) per pixel.
    const u = new Float64Array(numX * 3);
    for (y = 0; y < height; y++) {
        for (i = 0; i < numX; i++) {
            r = g = b = 0;
            for (j = 0; j < numY; j++) {
                basisY = cosinesY[j * height + y];
                colorIndex = (i + j * numX) * 3;
                r += colors[colorIndex] * basisY;
                g += colors[colorIndex + 1] * basisY;
                b += colors[colorIndex + 2] * basisY;
            }
            u[i * 3] = r;
            u[i * 3 + 1] = g;
            u[i * 3 + 2] = b;
        }
        for (x = 0; x < width; x++) {
            r = g = b = 0;
            for (i = 0; i < numX; i++) {
                basis = cosinesX[i * width + x];
                colorIndex = i * 3;
                r += u[colorIndex] * basis;
                g += u[colorIndex + 1] * basis;
                b += u[colorIndex + 2] * basis;
            }

            pixelIndex = 4 * x + y * bytesPerRow;
            pixels[pixelIndex] = fastLinearTosRGB(r);
            pixels[pixelIndex + 1] = fastLinearTosRGB(g);
            pixels[pixelIndex + 2] = fastLinearTosRGB(b);
            pixels[pixelIndex + 3] = 255; // alpha
        }
    }
    return pixels;
}
