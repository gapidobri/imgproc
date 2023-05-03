import { registerWorker } from '../worker';

export type HistogramData = {
  labels: string[];
  data: {
    red: number[];
    green: number[];
    blue: number[];
  };
};

registerWorker((imageData: ImageData): HistogramData => {
  const { data } = imageData;

  const bucketCount = 6;
  const bucketSize = 255 / bucketCount;

  const histogram: HistogramData = {
    labels: [],
    data: {
      red: [],
      green: [],
      blue: [],
    },
  };

  for (let k = 0; k < bucketCount; k++) {
    const startVal = k === 0 ? bucketSize * k : bucketSize * k + 1;
    const endVal = startVal + bucketSize - 1;

    const valCount = { red: 0, green: 0, blue: 0 };

    for (let i = 0; i < data.length; i += 4) {
      if (data[i] >= startVal && data[i] <= endVal) valCount.red++;
      if (data[i + 1] >= startVal && data[i + 1] <= endVal) valCount.green++;
      if (data[i + 2] >= startVal && data[i + 2] <= endVal) valCount.blue++;
    }

    histogram.labels.push(`${startVal}-${endVal}`);
    histogram.data.red.push(valCount.red);
    histogram.data.green.push(valCount.green);
    histogram.data.blue.push(valCount.blue);
  }

  return histogram;
});

export {};
