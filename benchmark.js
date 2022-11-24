import b from 'benny';
import * as blurhash from 'blurhash';
import { decodeBlurHash } from './index.js';

const characters =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~';
function randomBlurHash() {
    let result = '|EHV6n';
    for (var i = 0; i < 160; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
    }
    return result;
}

b.suite(
    'fast-blurhash vs blurhash.decode 32x32',
    b.add('blurhash.decode', () => {
        const blurHash = randomBlurHash();
        return () => blurhash.decode(blurHash, 32, 32);
    }),
    b.add('fast-blurhash', () => {
        const blurHash = randomBlurHash();
        return () => decodeBlurHash(blurHash, 32, 32);
    }),
    b.cycle(),
    b.complete(),
);
b.suite(
    'fast-blurhash vs blurhash.decode 64x64',
    b.add('blurhash.decode', () => {
        const blurHash = randomBlurHash();
        return () => blurhash.decode(blurHash, 64, 64);
    }),
    b.add('fast-blurhash 32x32', () => {
        const blurHash = randomBlurHash();
        return () => decodeBlurHash(blurHash, 64, 64);
    }),
    b.cycle(),
    b.complete(),
);
b.suite(
    'fast-blurhash vs blurhash.decode 100x50',
    b.add('blurhash.decode', () => {
        const blurHash = randomBlurHash();
        return () => blurhash.decode(blurHash, 100, 50);
    }),
    b.add('fast-blurhash', () => {
        const blurHash = randomBlurHash();
        return () => decodeBlurHash(blurHash, 100, 50);
    }),
    b.cycle(),
    b.complete(),
);

b.suite(
    'fast-blurhash vs blurhash.decode 640x480',
    b.add('blurhash.decode', () => {
        const blurHash = randomBlurHash();
        return () => blurhash.decode(blurHash, 640, 480);
    }),
    b.add('fast-blurhash', () => {
        const blurHash = randomBlurHash();
        return () => decodeBlurHash(blurHash, 640, 480);
    }),
    b.cycle(),
    b.complete(),
);
