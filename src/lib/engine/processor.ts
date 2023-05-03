import type { Selection } from '../components/types';
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
  selection: Selection,
): Promise<string> {
  const image = await loadImage(src);

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  let imageData: ImageData;
  if (selection.selected) {
    imageData = ctx.getImageData(
      selection.x,
      selection.y,
      selection.width,
      selection.height,
    );
  } else {
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  await filter(imageData);

  if (selection.selected) {
    ctx.putImageData(imageData, selection.x, selection.y);
  } else {
    ctx.putImageData(imageData, 0, 0);
  }

  const url = canvas.toDataURL();
  canvas.remove();

  return url;
}

export async function applyMatrix(imageData: ImageData, filter: Filter) {
  const newImageData = await runInWorker<ApplyMarixParams, ImageData>(
    new URL('./workers/applyMatrix.ts', import.meta.url),
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
    new URL('./workers/getHistogram.ts', import.meta.url),
    imageData,
  );
  return histogram;
}

async function runInWorker<I, O>(url: URL, data: I) {
  return new Promise<O>((res, rej) => {
    if (!window.Worker) {
      rej('Worker is not supported in this browser');
      return;
    }

    const worker = new Worker(url, { type: 'module' });

    worker.onmessage = (e: MessageEvent<O>) => res(e.data);
    worker.postMessage(data);
  });
}

export async function grayscale(imageData: ImageData) {
  const newImageData = await runInWorker<ImageData, ImageData>(
    new URL('./workers/grayscale.ts', import.meta.url),
    imageData,
  );
  imageData.data.set(newImageData.data);
}

export async function add(imageData1: ImageData, imageData2: ImageData) {
  const res = await runInWorker<AddParams, AddParams>(
    new URL('./workers/add.ts', import.meta.url),
    {
      imageData1,
      imageData2,
    },
  );
  imageData1.data.set(res.imageData1.data);
  imageData2.data.set(res.imageData2.data);
}

export async function subtract(imageData1: ImageData, imageData2: ImageData) {
  const res = await runInWorker<SubtractParams, SubtractParams>(
    new URL('./workers/subtract.ts', import.meta.url),
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
    new URL('./workers/treshold.ts', import.meta.url),
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
    new URL('./workers/removeColorChannel.ts', import.meta.url),
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
    new URL('./workers/enhanceColorChannel.ts', import.meta.url),
    {
      imageData,
      colorChannel,
    },
  );
  imageData.data.set(newImageData.data);
}

export async function setBrightness(imageData: ImageData, brightness: number) {
  const newImageData = await runInWorker<SetBrightnessParams, ImageData>(
    new URL('./workers/setBrightness.ts', import.meta.url),
    {
      imageData,
      brightness,
    },
  );
  imageData.data.set(newImageData.data);
}
