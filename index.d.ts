/**
 * Decodes BlurHash image
 * @param blurHash BlurHash image string
 * @param width Output image width
 * @param height Output image height
 * @param punch Contrast adjustment
 */
export declare function decodeBlurHash(
    blurHash: string,
    width: number,
    height: number,
    punch?: number,
): Uint8ClampedArray;
