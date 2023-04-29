import { registerWorker } from '../worker';

export type SetBrightnessParams = {
  imageData: ImageData;
  brightness: number;
};

registerWorker(({ imageData, brightness }: SetBrightnessParams) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i++) {
    if ((i + 1) % 4 === 0) continue;
    data[i] *= brightness;
  }
  return imageData;
});

export {};
