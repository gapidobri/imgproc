import { applyMatrix, grayscale, type Filter, clone, add } from './processor';

export type FilterFn = (imageData: ImageData) => void;

export function boxFilter(amount = 2): FilterFn {
  return (imageData: ImageData) => {
    const size = amount * 2 + 1;
    const matrix = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(1);
      }
      matrix.push(row);
    }

    applyMatrix(imageData, {
      div: size ** 2,
      matrix,
    });
  };
}

export const sharpening: FilterFn = (imageData: ImageData) => {
  applyMatrix(imageData, {
    matrix: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
  });
};

export const edgeDetection: FilterFn = (imageData: ImageData) => {
  grayscale(imageData);
  applyMatrix(imageData, {
    matrix: [
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0],
    ],
  });
};

export const sobel: FilterFn = (imageData: ImageData) => {
  grayscale(imageData);
  const data2 = clone(imageData);

  applyMatrix(imageData, {
    matrix: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
  });

  applyMatrix(data2, {
    matrix: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ],
  });

  add(imageData, data2);
};
