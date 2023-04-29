import { ImageDataProxy } from '../proxy';
import { registerWorker } from '../worker';

export type HistogramData = {
  red: number[];
  green: number[];
  blue: number[];
};

registerWorker((imageData: ImageData): HistogramData => {
  const data = new ImageDataProxy(imageData);

  const red = new Array(256).fill(0);
  const green = new Array(256).fill(0);
  const blue = new Array(256).fill(0);

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const pix = data.getPixel(x, y);
      red[pix.r]++;
      green[pix.g]++;
      blue[pix.b]++;
    }
  }

  return { red, green, blue };
});

export {};
