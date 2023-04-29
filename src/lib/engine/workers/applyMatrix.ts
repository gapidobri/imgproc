import { clone, type Filter } from '../processor';
import { ImageDataProxy, type Pixel } from '../proxy';
import { registerWorker } from '../worker';

export type ApplyMarixParams = {
  imageData: ImageData;
  filter: Filter;
};

registerWorker(({ imageData, filter }: ApplyMarixParams) => {
  const { matrix, div = 1 } = filter;

  const proxy = new ImageDataProxy(imageData);

  const newImageData = clone(imageData);
  const newProxy = new ImageDataProxy(newImageData);

  const offset = (matrix.length - 1) / 2;

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const pix = proxy.getPixel(x, y);
      const sum: Pixel = { r: 0, g: 0, b: 0, a: pix.a };

      for (let my = 0; my < matrix.length; my++) {
        for (let mx = 0; mx < matrix[0].length; mx++) {
          const mpix = proxy.getPixel(x + mx - offset, y + my - offset);
          const mult = matrix[my][mx];
          sum.r += mpix.r * mult;
          sum.g += mpix.g * mult;
          sum.b += mpix.b * mult;
        }
      }

      if (div !== 1) {
        sum.r /= div;
        sum.g /= div;
        sum.b /= div;
      }

      newProxy.setPixel(x, y, sum);
    }
  }

  return newImageData;
});

export {};
