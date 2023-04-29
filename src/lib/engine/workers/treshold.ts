import { registerWorker } from '../worker';

export type TresholdParams = {
  imageData: ImageData;
  threshold: number;
};

registerWorker(({ imageData, threshold }: TresholdParams) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    let val = 0.299 * data[i] + 0.587 * data[i] + 0.114 * data[i];
    val = val > threshold ? 255 : 0;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
  return imageData;
});

export {};
