import {
  grayscale,
  clone,
  add,
  applyMatrix,
  removeColorChannel,
  threshold,
  enhanceColorChannel,
  setBrightness,
} from './processor';
import type { ColorChannel } from './types';

export type FilterFn = (imageData: ImageData) => Promise<void> | void;

export const boxBlurFilter: FilterFn = async (imageData: ImageData) => {
  await applyMatrix(imageData, {
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    div: 9,
  });
};

export const gaussianBlurFilter: FilterFn = async (imageData: ImageData) => {
  await applyMatrix(imageData, {
    matrix: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1],
    ],
    div: 16,
  });
};

export const laplaceFilter: FilterFn = async (imageData: ImageData) => {
  await grayscale(imageData);
  await applyMatrix(imageData, {
    matrix: [
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0],
    ],
  });
};

export const sobelFilter: FilterFn = async (imageData: ImageData) => {
  await grayscale(imageData);
  const data2 = clone(imageData);

  await Promise.all([
    applyMatrix(imageData, {
      matrix: [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
      ],
    }),

    applyMatrix(data2, {
      matrix: [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1],
      ],
    }),
  ]);

  await add(imageData, data2);
};

export const sharpeningFilter: FilterFn = async (imageData: ImageData) => {
  await applyMatrix(imageData, {
    matrix: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
  });
};

export const thresholdFilter =
  (thresholdValue: number): FilterFn =>
  (imageData: ImageData) =>
    threshold(imageData, thresholdValue);

export const removeColorChannelFilter =
  (colorChannel: ColorChannel): FilterFn =>
  (imageData: ImageData) =>
    removeColorChannel(imageData, colorChannel);

export const enhanceColorChannelFilter =
  (colorChannel: ColorChannel): FilterFn =>
  (imageData: ImageData) =>
    enhanceColorChannel(imageData, colorChannel);

export const setBrightnessFilter =
  (brightness: number): FilterFn =>
  (imageData: ImageData) =>
    setBrightness(imageData, brightness);

export const customMatrixFilter =
  (matrix: number[][]): FilterFn =>
  (imageData: ImageData) =>
    applyMatrix(imageData, { matrix });
