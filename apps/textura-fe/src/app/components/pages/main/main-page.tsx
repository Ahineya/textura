import React, {FC, useCallback} from 'react';
import './main-page.scss';
import {Viewer} from "./viewer/viewer";
import {Button, Panel, TwoColumnsLayout} from "@textura/textura-ui";
import {Editor} from "./editor/editor";
import {uiStateStore} from "../../../stores/ui-state.store";

export const MainPage: FC = () => {
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target!.result as string;
      img.onload = () => {
        uiStateStore.setImage(img);
        uiStateStore.setZoom(_ => 1);
        uiStateStore.setPan(_ => ({x: 0, y: 0}));
      };
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <Panel direction="column">
      <Panel
        direction="row"
        noFlex
        alignItems="center"
        style={{
          height: '48px',
          padding: '0 8px',
          borderBottom: 'var(--border)',
        }}>
        <label
          className="button button-padded"
          style={{display: 'flex', alignItems: 'center'}}
          htmlFor={"imageSelectorInputMain"}>
          New image
        </label>
        <Button padded>
          Save texture
        </Button>
      </Panel>
      <TwoColumnsLayout
        left={(
          <Viewer/>
        )}
        right={(
          <Editor/>
        )}/>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        style={{display: 'none'}}
        id="imageSelectorInputMain"
      />
    </Panel>
  );
}
