import React, {useCallback, useEffect, useRef, useState} from 'react';
import './editor.scss';
import {PolygonLayer} from "./polygon-layer/polygon-layer";
import {uiStateStore} from "../../../../stores/ui-state.store";
import {useStoreSubscribe} from "../../../../hooks/use-store-subscription.hook";
import {useKeybinding} from "../../../../hooks/use-keybinding.hook";

type IProps = {};

export const Editor: React.FC<IProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const image = useStoreSubscribe(uiStateStore.image);

  const scale = useStoreSubscribe(uiStateStore.zoom);
  const offset = useStoreSubscribe(uiStateStore.pan);

  const appMode = useStoreSubscribe(uiStateStore.mode);

  const drawImage = useCallback(() => {
    if (!canvasRef.current || !image) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const canvasWidth = canvasRef.current.clientWidth;
    const canvasHeight = canvasRef.current.clientHeight;
    canvasRef.current.width = canvasWidth * 2;
    canvasRef.current.height = canvasHeight * 2;
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = '#F5F5F5';

    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.drawImage(
      image,
      offset.x,
      offset.y,
      image.width * scale,
      image.height * scale
    );
  }, [image, scale, offset]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target!.result as string;
      img.onload = () => {
        uiStateStore.setImage(img);
        setImageLoaded(true);
      };
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target!.result as string;
      img.onload = () => {
        uiStateStore.setImage(img);
        setImageLoaded(true);
      };
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

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

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {

    if (appMode !== 'move') return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startOffset = {...offset};

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
  }, [offset, appMode]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, {passive: false});

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useKeybinding('v', () => {
    // uiStateStore.setMode('move');
  });

  useKeybinding('r', () => {
    uiStateStore.setMode('draw');
  });

  return (
    <div className={'editor'}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        style={{display: 'none'}}
        id="imageSelectorInput"
      />
      {!imageLoaded && (
        <label htmlFor="imageSelectorInput" className={'drop-zone'} onDrop={handleDrop} onDragOver={handleDragOver}>
          Drop an image or click to select
        </label>
      )}
      <canvas
        ref={canvasRef}
        className={'canvas'}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        style={{
          zIndex: imageLoaded ? 0 : -1,
        }}
      />
      {
        imageLoaded &&
        <PolygonLayer width={canvasRef.current?.clientWidth || 0} height={canvasRef.current?.clientHeight || 0}/>
      }

    </div>
  );
};
