# fast-blurhash

[![npm](https://img.shields.io/npm/v/fast-blurhash)](https://www.npmjs.com/package/fast-blurhash)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/fast-blurhash)](https://bundlephobia.com/result?p=fast-blurhash)

> Fast & tiny [Wolt BlurHash](https://github.com/woltapp/blurhash) decoder implementation

-   🤏 **Tiny**: ≈1kb minified
-   🚀 **Fast**: up to ~90x faster than [original `blurhash.decode`](https://github.com/woltapp/blurhash/tree/master/TypeScript#decodeblurhash-string-width-number-height-number-punch-number--uint8clampedarray) (see [benchmark](./benchmark.js))

[Demo](https://mad-gooze.github.io/fast-blurhash/)

## Benchmark

Decoding ops/s, higher is better ([`benchmark.js`](./benchmark.js)):

| Decode size | `blurhash.decode` | `fast-blurhash` | Speedup |
| ----------- | ----------------: | --------------: | ------: |
| 32×32       |       402 ops/s   |   17 105 ops/s  |   ~43x  |
| 64×64       |        97 ops/s   |    5 307 ops/s  |   ~55x  |
| 100×50      |        81 ops/s   |    4 494 ops/s  |   ~55x  |
| 640×480     |         1 ops/s   |       89 ops/s  |   ~89x  |

## Install

```sh
npm install --save fast-blurhash
```

## API

### decodeBlurHash

`fast-blurhash` provides a drop-in replacement for [original `blurhash.decode`](https://github.com/woltapp/blurhash/tree/master/TypeScript#decodeblurhash-string-width-number-height-number-punch-number--uint8clampedarray)

```typescript
decodeBlurHash(blurhash: string, width: number, height: number, punch?: number) => Uint8ClampedArray`
```

`decodeBlurHash` uses approximate calculation for speed reasons. Results may slightly differ from original `blurhash.decode` but the diff is not noticeable (see [tests](./index.test.js)).

⚠️ `decodeBlurHash` does not validate input.

#### Example

```js
import { decodeBlurHash } from 'fast-blurhash';

// decode blurHash image
const pixels = decodeBlurHash('LEHV6nWB2yk8pyo0adR*.7kCMdnj', 32, 32);

// draw it on canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(width, height);
imageData.data.set(pixels);
ctx.putImageData(imageData, 0, 0);
document.body.append(canvas);
```

### getBlurHashAverageColor

```typescript
getBlurHashAverageColor(blurhash: string) => [number, number, number]`
```

`getBlurHashAverageColor` returns an average color of a passed blurhash image in [red, green, blue].

#### Example

```js
import { getBlurHashAverageColor } from 'fast-blurhash';

// get image average color and use it as css background color
const rgbAverageColor = getBlurHashAverageColor('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
document.body.style.backgroundColor = `rgb(${rgbAverageColor.join(',')})';
```
