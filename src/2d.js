import buildRegl from 'regl'
import mouseChange from 'mouse-change'
import fragmentShaderCode from 'shaders/cover2.frag'
import logo from 'shaders/logo-white@1220x810.png'

const regl = buildRegl()
const glsl = x => x.join('\n')
var image = new Image()
image.src = logo
console.log(image)
// var imageTexture = regl.texture(image)
// console.log(imageTexture)
const draw = regl({
  frag: fragmentShaderCode,

  vert: glsl`
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
    u_resolution: ({ viewportWidth, viewportHeight }) => [viewportWidth, viewportHeight],
    u_mouse: regl.prop('mouse'),
    u_time: regl.context('time'),
    u_randomness: 1,
    u_speed: 1,
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
