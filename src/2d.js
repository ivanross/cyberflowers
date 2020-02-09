import buildRegl from 'regl'
import mouseChange from 'mouse-change'
import fragmentShaderCode from 'shaders/2d.vert'

const regl = buildRegl()

const draw = regl({
  frag: fragmentShaderCode,

  vert: `
    precision mediump float;
    attribute vec2 position;
    void main () {
      gl_Position = vec4(3. * position, 0, 1);
    }
  `,

  attributes: {
    position: [
      [-1, 0],
      [0, -1],
      [1, 1],
    ],
  },

  uniforms: {
    resolution: ({ viewportWidth, viewportHeight }) => [viewportWidth, viewportHeight],
    mouse: regl.prop('mouse'),
    time: regl.context('time'),
  },

  count: 3,
})

const mouse = [0, 0]

mouseChange(regl._gl.canvas, function(buttons, x, y) {
  mouse[0] = x / regl._gl.canvas.width
  mouse[1] = 1 - y / regl._gl.canvas.height
})

regl.frame(() => {
  draw({ mouse })
})
