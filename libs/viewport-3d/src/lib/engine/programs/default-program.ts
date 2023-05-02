

const vertexShaderSource = `#version 300 es
      in vec4 position;
      in vec4 color;
      out vec4 v_color;

      uniform mat4 u_projection;
      uniform mat4 u_view;
      uniform mat4 u_model;

      void main() {
        gl_Position = u_projection * u_view * u_model * position;
        v_color = color;
      }
    `;

const fragmentShaderSource = `#version 300 es
      precision mediump float;
      in vec4 v_color;
      out vec4 outColor;

      void main() {
        outColor = v_color;
      }
    `;

export const defaultProgram = [vertexShaderSource, fragmentShaderSource];
