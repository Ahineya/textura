import {Object3d} from "./object-3d";
import * as twgl from "twgl.js";

const cube = new Object3d('cube');
const cube2 = new Object3d('cube2');

const cubePositionData = new Float32Array([
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,

  // Back face
  -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,

  // Top face
  -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,

  // Bottom face
  -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,

  // Right face
  0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,

  // Left face
  -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
]);

const faceColors = [
  [1.0, 1.0, 1.0, 1.0], // Front face: white
  [1.0, 0.0, 0.0, 1.0], // Back face: red
  [0.0, 1.0, 0.0, 1.0], // Top face: green
  [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
  [1.0, 1.0, 0.0, 1.0], // Right face: yellow
  [1.0, 0.0, 1.0, 1.0], // Left face: purple
];

// Convert the array of colors into a table for all the vertices.

function getColorsFor(faceColors: number[][], times = 4) {
  let colors: number[] = [];

  for (let j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    // colors = colors.concat(c, c, c, c);

    for (let i = 0; i < times; i++) {
      colors = colors.concat(c);
    }
  }
  return colors;
}

const cubeColors = getColorsFor(faceColors);

const cubeColorData = new Float32Array(cubeColors);

const indices = [
  0,
  1,
  2,
  0,
  2,
  3, // front
  4,
  5,
  6,
  4,
  6,
  7, // back
  8,
  9,
  10,
  8,
  10,
  11, // top
  12,
  13,
  14,
  12,
  14,
  15, // bottom
  16,
  17,
  18,
  16,
  18,
  19, // right
  20,
  21,
  22,
  20,
  22,
  23, // left
];

const cubeIndexData = new Uint16Array(indices);

  const mat = twgl.m4.identity();
  twgl.m4.translate(mat, [0, 0, 0], mat);

cube
  .setPositionData(cubePositionData)
  .setColorData(cubeColorData)
  .setIndexData(cubeIndexData)
  .setModelMatrix(mat)
  .setRenderingMode('TRIANGLES');

cube2
  .setPositionData(cubePositionData)
  .setColorData(cubeColorData)
  .setIndexData(cubeIndexData)
  .setModelMatrix(twgl.m4.translate(mat, [10, 0, 0]))
  .setRenderingMode('TRIANGLES');

export const cubeObject = cube;

// Same but pyramid

const pyramid = new Object3d('pyramid');

const pyramidPositionData = new Float32Array([
  // Front face
  0.0, 1.0, 0.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,

  // Right face
  0.0, 1.0, 0.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0,

  // Back face
  0.0, 1.0, 0.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0,

  // Left face
  0.0, 1.0, 0.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
]);

const pyramidColorData =  ([
  // Front face
  [1.0, 0.0, 0.0, 1.0],

  // Right face
  [0.0, 1.0, 0.0, 1.0],

  // Back face
  [0.0, 0.0, 1.0, 1.0],

  // Left face
  [1.0, 1.0, 0.0, 1.0],
]);

const pyramidColors = new Float32Array(getColorsFor(pyramidColorData, 3));

const pyramidIndexData = new Uint16Array([
  0, 1, 2, // Front face
  3, 4, 5, // Right face
  6, 7, 8, // Back face
  9, 10, 11, // Left face
]);

const pyramidMat = twgl.m4.identity();
twgl.m4.translate(pyramidMat, [0, 0, 0], pyramidMat);

pyramid
  .setPositionData(pyramidPositionData)
  .setColorData(pyramidColors)
  .setIndexData(pyramidIndexData)
  .setModelMatrix(pyramidMat)
  .setRenderingMode('LINES');

export const pyramidObject = pyramid;
