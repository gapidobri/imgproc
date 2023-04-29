import type { ColorChannel } from '../types';
import { registerWorker } from '../worker';

export type EnhanceColorChannelParams = {
  imageData: ImageData;
  colorChannel: ColorChannel;
};

registerWorker(({ imageData, colorChannel }: EnhanceColorChannelParams) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i + colorChannel] = 255;
  }
  return imageData;
});

export {};
