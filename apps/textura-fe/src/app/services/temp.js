function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = src;
    image.onload = () => resolve(image);
  });
}

function transformPerspective(image, points, outputWidth, outputHeight) {
  let srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, points.flat());
  let dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0, 0,
    outputWidth, 0,
    outputWidth, outputHeight,
    0, outputHeight
  ]);

  let perspectiveMatrix = cv.findHomography(srcPoints, dstPoints);
  let src = cv.imread(image);
  let dst = new cv.Mat();
  let dsize = new cv.Size(outputWidth, outputHeight);

  cv.warpPerspective(src, dst, perspectiveMatrix, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

  src.delete();
  srcPoints.delete();
  dstPoints.delete();
  perspectiveMatrix.delete();

  return dst;
}

function cvMatToCanvas(mat) {
  const canvas = document.createElement('canvas');
  canvas.width = mat.cols;
  canvas.height = mat.rows;
  cv.imshow(canvas, mat);
  return canvas;
}

async function initialize() {
  if (typeof cv === 'undefined') {
    setTimeout(initialize, 50);
    return;
  }

  cv.onRuntimeInitialized = async () => {
    const image = await loadImage('/image.jpeg');
    const points = [
      889, 572, // topLeft
      1040, 563, // topRight
      1040, 1122, // bottomRight
      885, 1125  // bottomLeft
    ];

    const euclideanDistance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    const widthTop = euclideanDistance(points[0], points[1], points[2], points[3]);
    const widthBottom = euclideanDistance(points[6], points[7], points[4], points[5]);
    const heightLeft = euclideanDistance(points[0], points[1], points[6], points[7]);
    const heightRight = euclideanDistance(points[2], points[3], points[4], points[5]);

    const outputWidth = Math.round(Math.max(widthTop, widthBottom));
    const outputHeight = Math.round(Math.max(heightLeft, heightRight));

    const transformedMat = transformPerspective(image, points, outputWidth, outputHeight);
    const transformedCanvas = cvMatToCanvas(transformedMat);
    transformedMat.delete();

    // Use the transformedCanvas as desired, e.g., append it to the DOM
    document.body.appendChild(transformedCanvas);
  };
}
