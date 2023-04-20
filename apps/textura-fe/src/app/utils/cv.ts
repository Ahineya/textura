// utils.ts
import * as cv from '@techstark/opencv-js';

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = src;
    image.onload = () => resolve(image);
  });
}

export function transformPerspective(
  image: HTMLImageElement,
  points: number[],
  outputWidth: number,
  outputHeight: number
): cv.Mat {
  const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, points);
  const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0, 0,
    outputWidth, 0,
    outputWidth, outputHeight,
    0, outputHeight
  ]);

  const perspectiveMatrix = cv.findHomography(srcPoints, dstPoints);
  const src = cv.imread(image);
  const dst = new cv.Mat();
  const dsize = new cv.Size(outputWidth, outputHeight);

  cv.warpPerspective(src, dst, perspectiveMatrix, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

  src.delete();
  srcPoints.delete();
  dstPoints.delete();
  perspectiveMatrix.delete();

  return dst;
}

export function cvMatToCanvas(mat: cv.Mat): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = mat.cols;
  canvas.height = mat.rows;
  cv.imshow(canvas, mat);
  return canvas;
}
