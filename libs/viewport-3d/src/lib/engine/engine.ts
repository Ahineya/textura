import * as twgl from "twgl.js";
import {defaultProgram} from "./programs/default-program";
import {programManager} from "./program-manager";
import {cubeObject, pyramidObject} from "./cube";
import {xAxisLineObject, yAxisLineObject, zAxisLineObject} from "./line";

function createOrthographicProjectionMatrix(width: number, height: number) {
  const aspectRatio = width / height;
  const left = -aspectRatio;
  const right = aspectRatio;
  const top = 1;
  const bottom = -1;
  const near = -1;
  const far = 1000;

  return twgl.m4.ortho(left, right, bottom, top, near, far);
}

function createPerspectiveProjectionMatrix(width: number, height: number) {
  const fieldOfView = 120 * Math.PI / 180;
  const aspect = width / height;
  const zNear = 1;
  const zFar = 10000.0;
  return twgl.m4.perspective(fieldOfView, aspect, zNear, zFar);
}

function createViewMatrix(time: number) {
  // const eye = [
  //   2,
  //   3,
  //   10,
  // ];

  // We want to slowly rotate around the origin
  const eye = [
    10 * Math.sin(time * 0.001),
    3 * Math.sin(time * 0.002),
    10 * Math.cos(time * 0.001),
  ];

  const target = [0, 0, 0];
  const up = [0, 1, 0];
  return twgl.m4.inverse(twgl.m4.lookAt(eye, target, up));
}

const objectsToDraw = [
  pyramidObject,

  // cubeObject,

  // py
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, 0, 0])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [0, 5, 0])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [0, 0, 5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, 5, 0])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [0, 5, 5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, 0, 5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, 5, 5])),
  // Same for -5
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [-5, 0, 0])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [0, -5, 0])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [0, 0, -5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [-5, -5, 0])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [0, -5, -5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [-5, 0, -5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [-5, -5, -5])),

  // Same for 5 and -5
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, -5, 0])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, 0, -5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [0, 5, -5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [-5, 5, 0])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [-5, 0, 5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [0, -5, 5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, 5, -5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [-5, -5, 5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, -5, -5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [-5, 5, -5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [-5, -5, 5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, 5, 5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, -5, 5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, 5, -5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [-5, 5, 5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [5, -5, -5])),
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [-5, -5, -5])),

  // And one cube that is far away
  cubeObject.clone().setModelMatrix(twgl.m4.translate(twgl.m4.identity(), [50, 0, 0])),

  xAxisLineObject,
  yAxisLineObject,
  zAxisLineObject,
];

class Engine {
  constructor() {
    console.log('Engine');
  }

  private gl: WebGL2RenderingContext | null = null;
  private canvas: HTMLCanvasElement | null = null;

  public start(canvas: HTMLCanvasElement) {
    console.log('start');

    // Setup

    if (!canvas) return;

    this.canvas = canvas;

    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    this.gl = gl;

    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);

    const programInfo = twgl.createProgramInfo(gl, defaultProgram);
    programManager.addProgram('default', programInfo);

    // const outlineProgramInfo = twgl.createProgramInfo(gl, [outlineVertexShaderSource, outlineFragmentShaderSource]);

    objectsToDraw.forEach(o => {
      o.construct(gl);
    })


    // const edgeBufferInfo = twgl.createBufferInfoFromArrays(gl, {
    //   position: {numComponents: 3, data: positionData},
    //   indices: {numComponents: 2, data: edgeIndices},
    // });

    this.render(0);
  }

  private render = (time: number) => {
    if (!this.gl || !this.canvas || !objectsToDraw.every(o => o.bufferInfo) || !objectsToDraw.every(o => o.getProgram())) {
      return;
    }

    const canvasWidth = this.canvas.clientWidth;
    const canvasHeight = this.canvas.clientHeight;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    const gl = this.gl;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    objectsToDraw.forEach(o => {
      const programInfo = o.getProgram()!;

      const bufferInfo = o.bufferInfo!;

      gl.useProgram(programInfo.program);
      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

      const projectionMatrix = createPerspectiveProjectionMatrix(gl.canvas.width, gl.canvas.height);
      const viewMatrix = createViewMatrix(time);

      if (o.uuid === 'pyramid' || o.uuid === 'cube') {
        // slowly rotate the pyramid

        // const rotationMatrix = twgl.m4.rotationY(time * 0.001);
        // twgl.m4.multiply(o.modelMatrix, rotationMatrix, o.modelMatrix);

        twgl.m4.rotateZ(o.modelMatrix, 0.01, o.modelMatrix);
      }

      twgl.setUniforms(programInfo, {
        u_projection: projectionMatrix,
        u_view: viewMatrix,
        u_model: o.modelMatrix,
      });

      switch (o.renderingMode) {
        case 'LINES':
          twgl.drawBufferInfo(gl, bufferInfo, gl.LINES, bufferInfo.numElements);
          break;
        case 'TRIANGLES':
          twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES, bufferInfo.numElements);
          break;
        case 'POINTS':
          twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS, bufferInfo.numElements);
          break;
        default:
          throw new Error(`Unknown rendering mode: ${o.renderingMode}`);
      }
    });

    requestAnimationFrame(this.render);
  }

}

export const engine = new Engine();
