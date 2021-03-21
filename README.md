# fast-blurhash

[![npm](https://img.shields.io/npm/v/fast-blurhash)](https://www.npmjs.com/package/fast-blurhash)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/fast-blurhash)](https://bundlephobia.com/result?p=fast-blurhash)

> Fast & tiny [Wolt BlurHash](https://github.com/woltapp/blurhash) decoder implementation

-   🤏 **Tiny**: ≈1kb minified
-   🚀 **Fast**: up to 50% faster then [original `blurhash.decode`](https://github.com/woltapp/blurhash/tree/master/TypeScript#decodeblurhash-string-width-number-height-number-punch-number--uint8clampedarray) (see [benchmark](./benchmark.js))

[Demo](https://mad-gooze.github.io/fast-blurhash/)

## Install

```sh
npm install --save fast-blurhash
```

## API

`fast-blurhash` provides a drop-in replacement for [original `blurhash.decode`](https://github.com/woltapp/blurhash/tree/master/TypeScript#decodeblurhash-string-width-number-height-number-punch-number--uint8clampedarray)

```typescript
decodeBlurHash(blurhash: string, width: number, height: number, punch?: number) => Uint8ClampedArray`
```

`decodeBlurHash` uses approximate calculation for speed reasons. Results may slightly differ from original `blurhash.decode` but the diff is not noticeable (see [tests](./index.test.js)).

⚠️ `decodeBlurHash` does not validate input.

#### Example

```js
import { decodeBlurHash } from 'fast-blurhash';

const pixels = decodeBlurHash('LEHV6nWB2yk8pyo0adR*.7kCMdnj', 32, 32);

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(width, height);
imageData.data.set(pixels);
ctx.putImageData(imageData, 0, 0);
document.body.append(canvas);
```
