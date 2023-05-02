import React, {FC, useLayoutEffect, useRef} from 'react';
import './image-viewer.scss';
import * as twgl from 'twgl.js';

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

type IProps = {
  image: HTMLImageElement | null;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
};

export const ImageViewer: FC<IProps> = ({image, scale = 1, offsetX = 0, offsetY = 0}) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const programInfo = useRef<twgl.ProgramInfo>();
  const bufferInfo = useRef<twgl.BufferInfo>();

  useLayoutEffect(() => {
    if (!image) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl");

    if (!gl) {
      return;
    }

    programInfo.current = twgl.createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource]);

    bufferInfo.current = twgl.createBufferInfoFromArrays(gl, {
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

    return () => {
      if (programInfo.current) {
        gl.deleteProgram(programInfo.current.program);
      }

      if (bufferInfo.current) {
        if (bufferInfo.current.attribs) {
          gl.deleteBuffer(bufferInfo.current.attribs.a_position.buffer);
          gl.deleteBuffer(bufferInfo.current.attribs.a_texCoord.buffer);
        }

        if (bufferInfo.current.indices) {
          gl.deleteBuffer(bufferInfo.current.indices);
        }
      }

      programInfo.current = undefined;
      bufferInfo.current = undefined;
    }
  }, [image]);

  useLayoutEffect(() => {
    if (!image) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl");

    if (!gl) {
      return;
    }

    if (!programInfo.current) {
      return;
    }

    const texture = createTexture(gl, image);

    gl.useProgram(programInfo.current.program);

    let animationFrameId: number;

    function render() {
      if (!gl || !programInfo.current || !bufferInfo.current || !texture || !image || !canvas) {
        return;
      }

      twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      twgl.setBuffersAndAttributes(gl, programInfo.current, bufferInfo.current);

      const imageAspect = image.width / image.height;
      const canvasAspect = canvas.width / canvas.height;

      const scaleX = scale * (canvasAspect > imageAspect ? imageAspect / canvasAspect : 1);
      const scaleY = scale * (canvasAspect > imageAspect ? 1 : canvasAspect / imageAspect);

      const matrix = new Float32Array([
        scaleX, 0, 0,
        0, scaleY, 0,
        offsetX, offsetY, 1,
      ]);

      twgl.setUniforms(programInfo.current, {
        u_matrix: matrix,
        u_texture: texture,
      });

      twgl.drawBufferInfo(gl, bufferInfo.current);

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      gl.deleteTexture(texture);
      cancelAnimationFrame(animationFrameId);
    }
  }, [image, scale, offsetX, offsetY]);

  return (
    <div className="image-viewer">
      <canvas ref={canvasRef}/>
    </div>
  );
}
