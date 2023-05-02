import React, {useCallback, useEffect, useState} from 'react';
import './editor.scss';
import {uiStateStore} from "../../../../stores/ui-state.store";
import {useStoreSubscribe} from "../../../../hooks/use-store-subscription.hook";
import {useKeybinding} from "../../../../hooks/use-keybinding.hook";
import {EditorController, ImageViewer, PolygonLayer} from "@textura/texture-ripper";
import {Button, FloatingPanel, Panel} from "@textura/textura-ui";

type IProps = {};


export const Editor: React.FC<IProps> = () => {
  const image = useStoreSubscribe(uiStateStore.image);
  const imageMeta = useStoreSubscribe(uiStateStore.imageMeta);

  const scale = useStoreSubscribe(uiStateStore.zoom);
  const offset = useStoreSubscribe(uiStateStore.pan);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target!.result as string;
      img.onload = () => {
        uiStateStore.setImage(img);
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
      };
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  }, []);

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

      {!image && (
        <label htmlFor="imageSelectorInput" className={'drop-zone'} onDrop={handleDrop} onDragOver={handleDragOver}>
          Drop an image or click to select
        </label>
      )}

      {
        image && <PolygonLayer/>
        // <PolygonLayer width={canvasRef.current?.clientWidth || 0} height={canvasRef.current?.clientHeight || 0}/>
      }

      {
        image &&
        <EditorController
          scale={scale}
          offsetX={offset.x}
          offsetY={offset.y}
          onScaleOffsetChange={(scale, offsetX, offsetY) => {
            uiStateStore.setZoom(_ => scale);
            uiStateStore.setPan(_ => ({x: offsetX, y: offsetY}));
          }}
        />
      }

      <FloatingPanel
        className="zoom-panel"
        style={{}}>
        <Button
          style={{
            width: 32,
            height: '100%',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            stroke: 'white'
          }}
          onClick={() => {
            uiStateStore.setZoom(_ => 1);
            uiStateStore.setPan(_ => ({x: 0, y: 0}));
          }}
          title={'Reset zoom and pan'}
        >
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.578 6.48696C4.55072 4.80817 6.1004 3.5401 7.93848 2.91885C9.77657 2.29761 11.7778 2.36554 13.5695 3.10999C15.3613 3.85444 16.8214 5.22467 17.678 6.96555C18.5347 8.70644 18.7294 10.6993 18.2261 12.5731C17.7227 14.4469 16.5556 16.0739 14.9419 17.1512C13.3282 18.2285 11.378 18.6826 9.45441 18.4291C7.53082 18.1755 5.76494 17.2315 4.48557 15.7728C3.20621 14.3141 2.50055 12.4402 2.5 10.5"
              strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5 6.5H3.5V2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
        <Panel justifyContent="center" style={{paddingRight: 8}}>
          {Math.round(scale * 100)}%
        </Panel>
      </FloatingPanel>

      {
        imageMeta && (
          <FloatingPanel
            className="image-info-panel"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            padding="full"
          >
            <Panel direction={"column"} justifyContent="end" style={{textAlign: 'end'}} gap={4}>
              <div>{imageMeta.resolution} {imageMeta.imageFormat}</div>
              <div>{imageMeta.colorSpace} color</div>
              <div>{imageMeta.bitDepth} bit</div>
            </Panel>
          </FloatingPanel>
        )
      }
    </div>
  );
};
