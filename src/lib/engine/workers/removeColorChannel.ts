import type { ColorChannel } from '../types';
import { registerWorker } from '../worker';

export type RemoveColorChannelParams = {
  imageData: ImageData;
  colorChannel: ColorChannel;
};

registerWorker(({ imageData, colorChannel }: RemoveColorChannelParams) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i + colorChannel] = 0;
  }
  return imageData;
});

export {};
