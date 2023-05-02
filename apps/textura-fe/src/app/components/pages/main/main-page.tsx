import React, {FC} from 'react';
import './main-page.scss';
import {Viewer} from "./viewer/viewer";
import {Button, Panel, TwoColumnsLayout} from "@textura/textura-ui";
import {Viewport3d} from "@textura/viewport-3d";

export const MainPage: FC = () => {
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
        <Button padded>
          New image
        </Button>
        <Button padded>
          Save texture
        </Button>
      </Panel>
      <TwoColumnsLayout
        left={(
          <Viewer/>
        )}
        right={(
          <Viewport3d/>
        )}/>
    </Panel>
  );
}
