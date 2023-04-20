// Viewer.tsx
import React, {useEffect, useRef} from "react";
import PolygonStore, {Point, Polygon} from "../../../../stores/polygon-store";
import {cvMatToCanvas, transformPerspective} from "../../../../utils/cv";
import {useStoreSubscribe} from "../../../../hooks/use-store-subscription.hook";
import {uiStateStore} from "../../../../stores/ui-state.store";

import ShelfPack from "@mapbox/shelf-pack";

type ViewerProps = {
  gap?: number;
};

function flattenPoints(points: Point[]): number[] {
  return points.flatMap((point) => [point.x, point.y]);
}

const euclideanDistance = (p1: Point, p2: Point) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const Viewer: React.FC<ViewerProps> = ({gap = 8}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const image = useStoreSubscribe(uiStateStore.image);
  const polygons = useStoreSubscribe(PolygonStore.polygons$);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!image) return;

    const polygons = PolygonStore.polygons$.value;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = canvasRef.current.clientWidth;
    const canvasHeight = canvasRef.current.clientHeight;
    canvasRef.current.width = canvasWidth * 2;
    canvasRef.current.height = canvasHeight * 2;
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvases = polygons.map((polygon) => {
      const width = Math.round(euclideanDistance(polygon.points[0], polygon.points[1]));
      const height = Math.round(euclideanDistance(polygon.points[0], polygon.points[3]));

      const transformedMat = transformPerspective(image, flattenPoints(polygon.points), width, height);
      const transformedCanvas = cvMatToCanvas(transformedMat);
      transformedMat.delete();

      return {
        id: polygon.id,
        canvas: transformedCanvas,
        width,
        height,
      };
    });

    // Augment canvases width and height by adding the gap

    const canvasesWithGap = canvases.map((canvas) => ({
      ...canvas,
      width: canvas.width + gap * 2,
      height: canvas.height + gap * 2,
    }));

    const canvasesById = canvasesWithGap.reduce((acc, canvas) => {
      acc[canvas.id] = canvas;
      return acc;
    }, {} as Record<string, {canvas: HTMLCanvasElement; width: number; height: number}>);

    const packer = new ShelfPack(1024, 1024);

    const packed = packer.pack(canvasesWithGap);

    if (!packed || packed.length !== canvases.length) {
      console.error("Could not pack polygons");

      return;
    }

    console.log('canvases', canvases)
    console.log('packed', packed);

    packed.forEach((bin) => {
      ctx.drawImage(canvasesById[bin.id].canvas, bin.x + gap, bin.y + gap, bin.w - gap, bin.h - gap);
    });
  }, [image, gap, polygons]);

  return (
    <canvas
      ref={canvasRef}
      width={1024}
      height={1024}
      style={{
        minWidth: 1024,
        minHeight: 1024,
        maxWidth: 1024,
        maxHeight: 1024,
      }}
    />
  );
};
