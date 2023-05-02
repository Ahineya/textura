import * as twgl from "twgl.js";
import {programManager} from "./program-manager";

export class Object3d {
  public renderingMode: 'TRIANGLES' | 'LINES' | 'POINTS' = 'TRIANGLES';

  public programName = 'default';
  public positionData: Float32Array = new Float32Array([]);
  public colorData: Float32Array = new Float32Array([]);
  public indexData: Uint16Array = new Uint16Array([]);

  public bufferInfo: twgl.BufferInfo | null = null;

  public modelMatrix: twgl.m4.Mat4 = twgl.m4.identity();

  constructor(public uuid: string) {

  }

  public setPositionData(positionData: Float32Array) {
    this.positionData = positionData;
    return this;
  }

  public setColorData(colorData: Float32Array) {
    this.colorData = colorData;
    return this;
  }

  public setIndexData(indexData: Uint16Array) {
    this.indexData = indexData;
    return this;
  }

  public setRenderingMode(renderingMode: 'TRIANGLES' | 'LINES' | 'POINTS') {
    this.renderingMode = renderingMode;
    return this;
  }

  public setModelMatrix(modelMatrix: twgl.m4.Mat4) {
    this.modelMatrix = modelMatrix;
    return this;
  }

  public setProgramName(programName: string) {
    this.programName = programName;
    return this;
  }

  public getProgram(): twgl.ProgramInfo | null {
    return programManager.getProgram(this.programName);
  }

  public construct(gl: WebGL2RenderingContext) {
    this.getBufferInfo(gl);
  }

  public getBufferInfo(gl: WebGL2RenderingContext) {
    this.bufferInfo = twgl.createBufferInfoFromArrays(gl, {
      position: {numComponents: 3, data: this.positionData},
      color: {numComponents: 4, data: this.colorData},
      indices: {numComponents: 3, data: this.indexData},
    });
  }

  public clone() {
    const clone = new Object3d(this.uuid);
    clone.positionData = new Float32Array([...this.positionData]);
    clone.colorData = new Float32Array([...this.colorData]);
    clone.indexData = new Uint16Array([...this.indexData]);
    clone.renderingMode = this.renderingMode;
    clone.programName = this.programName;
    clone.modelMatrix = twgl.m4.copy(this.modelMatrix);
    return clone;
  }
}
