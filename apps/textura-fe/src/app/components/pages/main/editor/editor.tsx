import React, {useCallback, useEffect, useRef, useState} from 'react';
import './editor.scss';
import {uiStateStore} from "../../../../stores/ui-state.store";
import {useStoreSubscribe} from "../../../../hooks/use-store-subscription.hook";
import {useKeybinding} from "../../../../hooks/use-keybinding.hook";
import {EditorController, ImageViewer, PolygonLayer} from "@textura/texture-ripper";

type IProps = {};


export const Editor: React.FC<IProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const image = useStoreSubscribe(uiStateStore.image);

  const scale = useStoreSubscribe(uiStateStore.zoom);
  const offset = useStoreSubscribe(uiStateStore.pan);

  const appMode = useStoreSubscribe(uiStateStore.mode);

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

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
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

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
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

      <ImageViewer image={image} scale={scale} offsetX={offset.x} offsetY={offset.y}/>

      {!imageLoaded && (
        <label htmlFor="imageSelectorInput" className={'drop-zone'} onDrop={handleDrop} onDragOver={handleDragOver}>
          Drop an image or click to select
        </label>
      )}
      {/*<canvas*/}
      {/*  ref={canvasRef}*/}
      {/*  className={'canvas'}*/}
      {/*  onWheel={handleWheel}*/}
      {/*  onMouseDown={handleMouseDown}*/}
      {/*  style={{*/}
      {/*    zIndex: imageLoaded ? 0 : -1,*/}
      {/*  }}*/}
      {/*/>*/}
      {
        imageLoaded && <PolygonLayer/>
        // <PolygonLayer width={canvasRef.current?.clientWidth || 0} height={canvasRef.current?.clientHeight || 0}/>
      }

      {
        imageLoaded &&
        <EditorController/>
      }
    </div>
  );
};
