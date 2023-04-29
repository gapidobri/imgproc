export type Pixel = {
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
