import type { FilterFn } from './filters';

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
  filter(imageData);
  ctx.putImageData(imageData, 0, 0);

  const url = canvas.toDataURL();
  canvas.remove();

  return url;
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
}

export function grayscale(imageData: ImageData) {
  const data = new ImageDataProxy(imageData);
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const pix = data.getPixel(x, y);
      const avg = pix.r * 0.299 + pix.g * 0.587 + pix.b * 0.114;
      data.setPixel(x, y, { r: avg, g: avg, b: avg, a: pix.a });
    }
  }
}

export function add(imageData1: ImageData, imageData2: ImageData) {
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
}

export function subtract(imageData1: ImageData, imageData2: ImageData) {
  const data1 = new ImageDataProxy(imageData1);
  const data2 = new ImageDataProxy(imageData2);

  for (let y = 0; y < imageData1.height; y++) {
    for (let x = 0; x < imageData1.width; x++) {
      const pix1 = data1.getPixel(x, y);
      const pix2 = data2.getPixel(x, y);
      data1.setPixel(x, y, {
        r: pix1.r - pix2.r,
        g: pix1.g - pix2.g,
        b: pix1.b - pix2.b,
        a: pix1.a,
      });
    }
  }
}

export function clone(imageData: ImageData): ImageData {
  return {
    width: imageData.width,
    height: imageData.height,
    colorSpace: imageData.colorSpace,
    data: new Uint8ClampedArray(imageData.data),
  };
}

export function applyMatrix(imageData: ImageData, filter: Filter) {
  const { matrix, div = 1 } = filter;

  const data = new ImageDataProxy(imageData);

  const offset = -(matrix.length - 1) / 2;

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const pix = data.getPixel(x, y);
      let sum: Pixel = { r: 0, g: 0, b: 0, a: pix.a };

      for (let my = 0; my < matrix.length; my++) {
        for (let mx = 0; mx < matrix[my].length; mx++) {
          const mpix = data.getPixel(x + mx - offset, y + my - offset);
          const val = matrix[my][mx];
          sum.r += mpix.r * val;
          sum.g += mpix.g * val;
          sum.b += mpix.b * val;
        }
      }

      sum.r /= div;
      sum.g /= div;
      sum.b /= div;

      data.setPixel(x, y, sum);
    }
  }
}

type Pixel = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export class ImageDataProxy {
  constructor(private readonly imageData: ImageData) {}

  public getPixel(x: number, y: number): Pixel {
    const { data, width, height } = this.imageData;

    if (x > width - 1) x = width - 1;
    else if (x < 0) x = 0;

    if (y > height - 1) y = height - 1;
    else if (y < 0) y = 0;

    const i = (y * width + x) * 4;
    return {
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
      a: data[i + 3],
    };
  }

  public setPixel(x: number, y: number, pixel: Pixel) {
    const { data, width, height } = this.imageData;

    if (x > width - 1 || y > height - 1) return;

    if (pixel.r > 255) pixel.r = 255;
    else if (pixel.r < 0) pixel.r = 0;

    if (pixel.g > 255) pixel.g = 255;
    else if (pixel.g < 0) pixel.g = 0;

    if (pixel.b > 255) pixel.b = 255;
    else if (pixel.b < 0) pixel.b = 0;

    const i = (y * width + x) * 4;
    data[i] = pixel.r;
    data[i + 1] = pixel.g;
    data[i + 2] = pixel.b;
    data[i + 3] = pixel.a;
  }
}
