import type { FilterFn } from './filters';
import type { ColorChannel } from './types';
import type { AddParams } from './workers/add';
import type { ApplyMarixParams } from './workers/applyMatrix';
import type { EnhanceColorChannelParams } from './workers/enhanceColorChannel';
import type { HistogramData } from './workers/getHistogram';
import type { RemoveColorChannelParams } from './workers/removeColorChannel';
import type { SetBrightnessParams } from './workers/setBrightness';
import type { SubtractParams } from './workers/subtract';
import type { TresholdParams } from './workers/treshold';

export type Filter = {
  matrix: number[][];
  div?: number;
};

export async function applyFilter(
  src: string,
  filter: FilterFn,
): Promise<string> {
  const image = await loadImage(src);

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  await filter(imageData);

  ctx.putImageData(imageData, 0, 0);

  const url = canvas.toDataURL();
  canvas.remove();

  return url;
}

export async function applyMatrix(imageData: ImageData, filter: Filter) {
  const newImageData = await runInWorker<ApplyMarixParams, ImageData>(
    './workers/applyMatrix.ts',
    { imageData, filter },
  );
  imageData.data.set(newImageData.data);
}

async function loadImage(src: string) {
  const image = new Image();
  image.src = src;
  return new Promise<HTMLImageElement>((res, rej) => {
    image.onload = () => res(image);
    image.onerror = rej;
  });
}

async function getImageData(src: string): Promise<ImageData> {
  const image = await loadImage(src);

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export async function getHistogram(src: string) {
  const imageData = await getImageData(src);
  const histogram = await runInWorker<ImageData, HistogramData>(
    './workers/getHistogram.ts',
    imageData,
  );
  return histogram;
}

async function runInWorker<I, O>(url: string, data: I) {
  return new Promise<O>((res, rej) => {
    if (!window.Worker) {
      rej('Worker is not supported in this browser');
      return;
    }

    const workerUrl = new URL(url, import.meta.url);
    const worker = new Worker(workerUrl, { type: 'module' });

    worker.onmessage = (e: MessageEvent<O>) => res(e.data);
    worker.postMessage(data);
  });
}

export async function grayscale(imageData: ImageData) {
  const newImageData = await runInWorker<ImageData, ImageData>(
    './workers/grayscale.ts',
    imageData,
  );
  imageData.data.set(newImageData.data);
}

export async function add(imageData1: ImageData, imageData2: ImageData) {
  const res = await runInWorker<AddParams, AddParams>('./workers/add.ts', {
    imageData1,
    imageData2,
  });
  imageData1.data.set(res.imageData1.data);
  imageData2.data.set(res.imageData2.data);
}

export async function subtract(imageData1: ImageData, imageData2: ImageData) {
  const res = await runInWorker<SubtractParams, SubtractParams>(
    './workers/subtract.ts',
    {
      imageData1,
      imageData2,
    },
  );
  imageData1.data.set(res.imageData1.data);
  imageData2.data.set(res.imageData2.data);
}

export function clone(imageData: ImageData): ImageData {
  return {
    width: imageData.width,
    height: imageData.height,
    colorSpace: imageData.colorSpace,
    data: new Uint8ClampedArray(imageData.data),
  };
}

export async function threshold(imageData: ImageData, threshold: number) {
  const newImageData = await runInWorker<TresholdParams, ImageData>(
    './workers/treshold.ts',
    {
      imageData,
      threshold,
    },
  );
  imageData.data.set(newImageData.data);
}

export async function removeColorChannel(
  imageData: ImageData,
  colorChannel: ColorChannel,
) {
  const newImageData = await runInWorker<RemoveColorChannelParams, ImageData>(
    './workers/removeColorChannel.ts',
    {
      imageData,
      colorChannel,
    },
  );
  imageData.data.set(newImageData.data);
}

export async function enhanceColorChannel(
  imageData: ImageData,
  colorChannel: ColorChannel,
) {
  const newImageData = await runInWorker<EnhanceColorChannelParams, ImageData>(
    './workers/enhanceColorChannel.ts',
    {
      imageData,
      colorChannel,
    },
  );
  imageData.data.set(newImageData.data);
}

export async function setBrightness(imageData: ImageData, brightness: number) {
  const newImageData = await runInWorker<SetBrightnessParams, ImageData>(
    './workers/setBrightness.ts',
    {
      imageData,
      brightness,
    },
  );
  imageData.data.set(newImageData.data);
}
