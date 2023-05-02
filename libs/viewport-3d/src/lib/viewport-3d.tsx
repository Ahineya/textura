import {Panel} from "@textura/textura-ui";
import {useEffect, useLayoutEffect, useRef} from "react";
import "./viewport-3d.scss";
import {engine} from "./engine/engine";

/* eslint-disable-next-line */
export interface Viewport3dProps {
}

const outlineVertexShaderSource = `#version 300 es
  in vec4 position;

  uniform mat4 u_projection;
  uniform mat4 u_view;
  uniform mat4 u_model;

  void main() {
    gl_Position = u_projection * u_view * u_model * position;
  }
`;

const outlineFragmentShaderSource = `#version 300 es
  precision mediump float;
  out vec4 outColor;

  void main() {
    // outColor = vec4(0.0, 0.0, 0.0, 1.0); // Outline color: yellow
    // Outline color: orange
    outColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
`;

export const Viewport3d = (props: Viewport3dProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    engine.start(canvasRef.current!);
  }, []);

  useEffect(() => {
    // use mutation observer to detect canvas size changes
    // const observer = new MutationObserver(() => {
    //   draw();
    // });
    //
    // if (canvasRef.current) {
    //   observer.observe(canvasRef.current, {
    //     attributes: true,
    //     attributeFilter: ["width", "height"],
    //   });
    // }
    //
    // return () => {
    //   observer.disconnect();
    // };
  }, []);
  return (
    <Panel style={{
      position: 'relative',
      width: '100%',
      height: '100%',
    }}>
      <canvas
        className="viewport-3d"
        ref={canvasRef}
      />
    </Panel>
  );
}
