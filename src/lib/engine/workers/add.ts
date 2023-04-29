import { ImageDataProxy } from '../proxy';
import { registerWorker } from '../worker';

export type AddParams = {
  imageData1: ImageData;
  imageData2: ImageData;
};

registerWorker(({ imageData1, imageData2 }: AddParams) => {
  const data1 = new ImageDataProxy(imageData1);
  const data2 = new ImageDataProxy(imageData2);

  for (let y = 0; y < imageData1.height; y++) {
    for (let x = 0; x < imageData1.width; x++) {
      const pix1 = data1.getPixel(x, y);
      const pix2 = data2.getPixel(x, y);
      data1.setPixel(x, y, {
        r: pix1.r + pix2.r,
        g: pix1.g + pix2.g,
        b: pix1.b + pix2.b,
        a: pix1.a,
      });
    }
  }

  return { imageData1, imageData2 };
});
