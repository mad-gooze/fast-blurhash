import { expect } from '@jest/globals';
import { decode } from 'blurhash';
import { getBlurHashAverageColor } from '.';
import { decodeBlurHash } from '.';

const hashes = [
    'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
    'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
    'g6Pj0^i_.AyE8^m+%g_3t7t7R*WBs,of*0o#DgR4.Tt,IT_3R*D%xt%MIpRjMcV@%itSI9R5x]',
    'gHF5]+Yk^6#M9wKSW@@-5b,1J5O[V=R:@[or[k6.O[TLtJ};FxngOZE3NgNHjMFxS#OtcXnzRj',
    '|HF5]+Yk^6#M9wKSW@j=#*@-5b,1J5O[V=R:s;w[@[or[k6.O[TLtJnNnO};FxngOZE3NgNHsps,jMFxS#OtcXnzRjxZxHj]OYNeR:JCs9xunhwIbeIpNaxHNGr;v}aeo0Xmt6XS$et6#*$ft6nhxHnNV@w{nOenwfNHo0',
    '|EHV6nWB2yk8$NxujFNGt6pyoJadR*=ss:I[R%of.7kCMdnjx]S2NHs:i_S#M|%1%2ENRis9a$%1Sis.slNHW:WBxZ%2NbogaekBW;ofo0NHS4j?W?WBsloLR+oJofS2s:ozj@s:jaR*Wps.j[RkT0of%2afR*fkoJjZof',
];

const sizes = [
    { width: 2, height: 2 },
    { width: 5, height: 4 },
    { width: 32, height: 32 },
    { width: 64, height: 64 },
    { width: 100, height: 50 },
    { width: 1920, height: 1080 },
];

/**
 * Calculates mean square error
 * @param {number[]} received
 * @param {number[]} expected
 * @returns number
 */
function mse(received, expected) {
    let sum = 0;

    for (let i = 0; i < received.length; i++) {
        sum += (received[i] - expected[i]) ** 2;
    }
    return sum / received.length;
}

describe('fast-blurhash', () => {
    describe('decodeBlurHash', () => {
        sizes.forEach(({ width, height }) => {
            hashes.forEach((hash, i) => {
                it(`decodes image ${width}x${height} correctly, hash #${i}`, () => {
                    const expected = decode(hash, 5, 4);
                    const received = decodeBlurHash(hash, 5, 4);

                    expect(received.length).toEqual(expected.length);
                    // fast-blurhash uses approximate math calculations for perf reasons
                    // let's check that diff between fast-blurhash is small enough
                    expect(mse(received, expected)).toBeLessThan(0.5);
                });

                it(`decodes image ${width}x${height} correctly, hash #${i} with punch`, () => {
                    const expected = decode(hash, 5, 4, 10);
                    const received = decodeBlurHash(hash, 5, 4, 10);
                    expect(mse(received, expected)).toBeLessThan(0.5);
                });
            });
        });
    });

    describe('getBlurHashAverageColor', () => {
        it(`returns correct average color`, () => {
            expect(getBlurHashAverageColor(hashes[0])).toMatchInlineSnapshot(`
                [
                  151,
                  150,
                  149,
                ]
            `);
            expect(getBlurHashAverageColor(hashes[1])).toMatchInlineSnapshot(`
                [
                  209,
                  178,
                  163,
                ]
            `);
        });
    });
});
