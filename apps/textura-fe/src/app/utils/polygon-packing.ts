import {Polygon} from "../stores/polygon-store";

export type Bin = {
  x: number;
  y: number;
  width: number;
  height: number;
  canvas?: HTMLCanvasElement;
};

export const packPolygons = (polygons: {id: string, width: number, height: number, canvas: HTMLCanvasElement}[], n: number): (Bin & { id: string, canvas: HTMLCanvasElement })[] | null => {
  const rectangles = polygons.map((polygon) => {
    return {id: polygon.id, x: 0, y: 0, width: polygon.width, height: polygon.height, canvas: polygon.canvas};
  });

  const sortedRectangles = rectangles.sort((a, b) => b.height - a.height || b.width - a.width);
  const bin: Bin = {x: 0, y: 0, width: n, height: n};

  const packedRectangles = pack(sortedRectangles, bin);
  if (packedRectangles.length < polygons.length) {
    return null;
  }

  return packedRectangles;
};

const pack = (
  rectangles: (Bin & { id: string, canvas: HTMLCanvasElement })[],
  bin: Bin
): (Bin & { id: string, canvas: HTMLCanvasElement })[] => {
  if (rectangles.length === 0) {
    return [];
  }

  const [rect, ...rest] = rectangles;
  const fittedBin = findFittedBin(rect, bin);

  if (fittedBin) {
    const [leftoverH, leftoverV] = splitBin(fittedBin, rect);
    const packedInH = pack(rest, leftoverH);
    const packedInV = pack(rest, leftoverV);

    // Choose the packing that has fewer remaining rectangles
    let packedInChildren: (Bin & { id: string, canvas: HTMLCanvasElement })[] = [];
    if (packedInH.length > packedInV.length) {
      packedInChildren = packedInH;
    } else {
      packedInChildren = packedInV;
    }

    if (packedInChildren) {
      return [{ ...rect, x: bin.x, y: bin.y }, ...packedInChildren];
    }
  }

  return [];
};


const findFittedBin = (rect: Bin, bin: Bin): Bin | null => {
  if (rect.width <= bin.width && rect.height <= bin.height) {
    return bin;
  }
  return null;
};

const splitBin = (bin: Bin, rect: Bin): [Bin, Bin] => {
  const leftoverH: Bin = {
    x: bin.x + rect.width,
    y: bin.y,
    width: bin.width - rect.width,
    height: rect.height,
  };

  const leftoverV: Bin = {
    x: bin.x,
    y: bin.y + rect.height,
    width: rect.width,
    height: bin.height - rect.height,
  };

  return [leftoverH, leftoverV];
};

