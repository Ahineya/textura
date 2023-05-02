import {Object3d} from "./object-3d";
import * as twgl from "twgl.js";

const xAxisLine = new Object3d('x-line');
const yAxisLine = new Object3d('y-line');
const zAxisLine = new Object3d('z-line');

const xAxisPositionData = new Float32Array([
  -1000, 0, 0,
  1000, 0, 0,
]);

const yAxisPositionData = new Float32Array([
  0, -1000, 0,
  0, 1000, 0,
]);

const zAxisPositionData = new Float32Array([
  0, 0, -1000,
  0, 0, 1000,
]);

const xAxisLineColor = new Float32Array([
  1, 0, 0, 1,
  1, 0, 0, 1,
]);

const yAxisLineColor = new Float32Array([
  0, 1, 0, 1,
  0, 1, 0, 1,
]);

const zAxisLineColor = new Float32Array([
  0, 0, 1, 1,
  0, 0, 1, 1,
]);

const indices = [
  0,
  1,
];

const lineIndices = new Uint16Array(indices);

  const mat = twgl.m4.identity();
  // twgl.m4.translate(mat, [0, 0, -1], mat);

xAxisLine
  .setPositionData(xAxisPositionData)
  .setColorData(xAxisLineColor)
  .setIndexData(lineIndices)
  .setModelMatrix(mat)
  .setRenderingMode('LINES');

yAxisLine
  .setPositionData(yAxisPositionData)
  .setColorData(yAxisLineColor)
  .setIndexData(lineIndices)
  .setModelMatrix(mat)
  .setRenderingMode('LINES');

zAxisLine
  .setPositionData(zAxisPositionData)
  .setColorData(zAxisLineColor)
  .setIndexData(lineIndices)
  .setModelMatrix(mat)
  .setRenderingMode('LINES');


export const xAxisLineObject = xAxisLine;
export const yAxisLineObject = yAxisLine;
export const zAxisLineObject = zAxisLine;
