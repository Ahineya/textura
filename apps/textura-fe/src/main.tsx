// import { StrictMode } from "react";
// import * as ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
//
// import App from "./app/app";
//
// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );
// root.render(
//   <StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </StrictMode>
// );

import * as twgl from "twgl.js";
import imgUrl from './assets/gothic_man.jpg'

const vertexShaderSource = `
attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat3 u_matrix;

varying vec2 v_texCoord;

void main() {
  gl_Position = vec4((u_matrix * vec3(a_position.xy, 1)).xy, 0, 1);
  v_texCoord = a_texCoord;
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform sampler2D u_texture;

varying vec2 v_texCoord;

void main() {
  gl_FragColor = texture2D(u_texture, v_texCoord);
}
`;

function createTexture(gl: WebGLRenderingContext, image: HTMLImageElement): WebGLTexture {
  const texture = twgl.createTexture(gl, {
    src: image,
    min: gl.NEAREST,
    mag: gl.NEAREST
  });
  return texture;
}

function main() {
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const gl = canvas.getContext("webgl")!;

  const programInfo = twgl.createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource]);
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, {
    a_position: {
      numComponents: 2,
      data: [
        -1, -1,
        1, -1,
        -1, 1,
        1, 1
      ],
    },
    a_texCoord: {
      numComponents: 2,
      data: [0, 1, 1, 1, 0, 0, 1, 0],
    },
    indices: [0, 1, 2, 2, 1, 3],
  });

  const image = new Image();
  image.src = imgUrl;
  image.onload = () => {
    const texture = createTexture(gl, image);

    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;

    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();

      const prevScale = scale;
      scale *= 1 - event.deltaY * 0.01;
      scale = Math.max(1, scale);

      const cursorX = event.clientX / canvas.width * 2 - 1;
      const cursorY = -event.clientY / canvas.height * 2 + 1;

      const prevOffsetX = offsetX;
      const prevOffsetY = offsetY;

      offsetX = cursorX + (prevOffsetX - cursorX) * (scale / prevScale);
      offsetY = cursorY + (prevOffsetY - cursorY) * (scale / prevScale);
    });

    canvas.addEventListener("mousemove", (event) => {
      if (event.buttons === 1) {
        const imageAspect = image.width / image.height;
        const canvasAspect = canvas.width / canvas.height;

        const realScale = scale * (canvasAspect < imageAspect ? canvasAspect / imageAspect : 1);

        offsetX += event.movementX / canvas.width * 2 * realScale / scale;
        offsetY -= event.movementY / canvas.height * 2 * realScale / scale;
      }
    });

    function render() {
      twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(programInfo.program);

      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

      const imageAspect = image.width / image.height;
      const canvasAspect = canvas.width / canvas.height;
      let scaleX = scale;
      let scaleY = scale;

      if (canvasAspect > imageAspect) {
        scaleX *= imageAspect / canvasAspect;
      } else {
        scaleY *= canvasAspect / imageAspect;
      }

      const matrix = new Float32Array([
        scaleX, 0, 0,
        0, scaleY, 0,
        offsetX, offsetY, 1,
      ]);

      twgl.setUniforms(programInfo, {
        u_matrix: matrix,
        u_texture: texture,
      });

      twgl.drawBufferInfo(gl, bufferInfo);

      requestAnimationFrame(render);
    }

    render();
  };
}

main();
