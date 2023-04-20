// PolygonLayer.tsx
import React, {useCallback, useEffect, useRef, useState} from 'react';
import PolygonStore, {Point, Polygon} from "../../../../../stores/polygon-store";
import {uiStateStore} from "../../../../../stores/ui-state.store";
import {useStoreSubscribe} from "../../../../../hooks/use-store-subscription.hook";

type IProps = {
  width: number;
  height: number;
};

const HANDLE_SIZE = 6;

export const PolygonLayer: React.FC<IProps> = ({width, height}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [movingCorner, setMovingCorner] = useState<{ polygon: Polygon; cornerIndex: number } | null>(null);

  const appMode = useStoreSubscribe(uiStateStore.mode);
  const pan = useStoreSubscribe(uiStateStore.pan);
  const zoom = useStoreSubscribe(uiStateStore.zoom);

  const image = useStoreSubscribe(uiStateStore.image);

  const drawHandle = useCallback((ctx: CanvasRenderingContext2D, point: Point) => {
    ctx.strokeStyle = '#299cf7';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;
    ctx.fillRect(point.x - HANDLE_SIZE / 2, point.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
    ctx.strokeRect(point.x - HANDLE_SIZE / 2, point.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
  }, []);

  const drawPolygons = useCallback((polygons: Polygon[]) => {

    if (!image) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvasRef.current.clientWidth;
    const canvasHeight = canvasRef.current.clientHeight;
    canvasRef.current.width = canvasWidth * 2;
    canvasRef.current.height = canvasHeight * 2;
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, width, height);

    polygons.forEach(({points}) => {

      const scaledPoints = points.map((point) => ({
        x: pan.x + point.x * zoom, //* (image.width * zoom) / image.width + (canvasWidth - image.width * zoom) / 2,
        y: pan.y + point.y * zoom, //(image.height * zoom) / image.height + (canvasHeight - image.height * zoom) / 2,
      }));

      ctx.strokeStyle = '#299cf7';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
      scaledPoints.slice(1).forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.stroke();

      // Draw corner handles
      scaledPoints.forEach((point) => drawHandle(ctx, point));
    });

    ctx.restore();
  }, [width, height, drawHandle, pan, zoom, image]);

  const findNearestCorner = useCallback((x: number, y: number) => {
    const polygons = PolygonStore.polygons$.value;
    let minDist = Infinity;
    let minCornerIndex = -1;
    let minPolygon: Polygon | null = null;

    polygons.forEach((polygon) => {
      polygon.points.forEach((point, index) => {
        const dist = Math.hypot(point.x - x, point.y - y);
        if (dist < minDist) {
          minDist = dist;
          minCornerIndex = index;
          minPolygon = polygon;
        }
      });
    });

    if (minDist <= HANDLE_SIZE && minPolygon) {
      return {polygon: minPolygon, cornerIndex: minCornerIndex};
    }

    return null;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {

    if (e.shiftKey) {
      const startX = e.clientX;
      const startY = e.clientY;
      const startOffset = {...pan};

      const onMouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        uiStateStore.setPan((previousPan) => ({x: startOffset.x + dx, y: startOffset.y + dy}));
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      return;
    }

    if (appMode !== "draw") return;

    if (drawing) return;
    setDrawing(true);

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const nearestCorner = findNearestCorner(x, y);
    if (nearestCorner) {
      setMovingCorner(nearestCorner);
    } else {
      setStartPos({x, y});
    }

  }, [drawing, findNearestCorner, appMode, pan, zoom]);

  useEffect(() => {
    const subscription = PolygonStore.polygons$.subscribe(drawPolygons);
    return () => subscription.unsubscribe();
  }, [drawPolygons]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (appMode !== "draw") return;

      if (!drawing && !movingCorner) return;

      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;

      if (drawing && startPos) {
        const ctx = canvasRef.current!.getContext("2d")!;

        drawPolygons(PolygonStore.polygons$.value);

        // Apply zoom and pan directly to the points
        const startX = startPos.x * zoom + pan.x;
        const startY = startPos.y * zoom + pan.y;
        const endX = x * zoom + pan.x;
        const endY = y * zoom + pan.y;

        ctx.beginPath();
        ctx.strokeStyle = '#299cf7';
        ctx.lineWidth = 2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineTo(startX, endY);
        ctx.closePath();
        ctx.stroke();
      }

      if (movingCorner) {
        const updatedPolygon = {
          ...movingCorner.polygon,
          points: movingCorner.polygon.points.map((point, index) =>
            index === movingCorner.cornerIndex ? {x, y} : point
          ),
        };
        PolygonStore.updatePolygon(updatedPolygon as Polygon);
      }
    },
    [drawing, startPos, width, height, drawPolygons, movingCorner, appMode, pan, zoom]
  );

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (appMode !== 'draw') return;

    if (drawing && startPos) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;

      const topLeft = {x: Math.min(startPos.x, x), y: Math.min(startPos.y, y)};
      const bottomRight = {x: Math.max(startPos.x, x), y: Math.max(startPos.y, y)};

      // Check if the polygon is too small

      if (Math.abs(bottomRight.x - topLeft.x) < 10 || Math.abs(bottomRight.y - topLeft.y) < 10) {
        setStartPos(null);
        setDrawing(false);
        PolygonStore.redrawPolygons();
        return;
      }

      const polygon: Polygon = {
        id: Date.now().toString(),
        points: [
          topLeft,
          {x: bottomRight.x, y: topLeft.y},
          bottomRight,
          {x: topLeft.x, y: bottomRight.y},
        ],
      };


      PolygonStore.addPolygon(polygon);
      setStartPos(null);
    }

    if (movingCorner) {
      setMovingCorner(null);
    }

    setDrawing(false);
  }, [drawing, startPos, movingCorner, appMode, pan, zoom]);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const prevZoom = uiStateStore.getZoom();
      const scaleFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const newZoom = Math.max(0.1, prevZoom * scaleFactor);

      // Calculate the mouse position in the canvas coordinate system
      const mousePosX = (mouseX - uiStateStore.getPan().x) / prevZoom;
      const mousePosY = (mouseY - uiStateStore.getPan().y) / prevZoom;

      // Update zoom level
      uiStateStore.setZoom(prevZoom => newZoom);

      // Adjust pan according to zoom
      uiStateStore.setPan(() => {
        return {
          x: mouseX - mousePosX * newZoom,
          y: mouseY - mousePosY * newZoom
        };
      });
    },
    [appMode]
  );

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        pointerEvents: appMode === 'draw' ? 'auto' : 'none',
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
};
