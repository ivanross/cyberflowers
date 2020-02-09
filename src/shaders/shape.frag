#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define SPEED time * .2

uniform vec2 resolution;
uniform float time;

float min(vec2 p) { return min(p.x,p.y); }

mat2 rotate(float a) {
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}

float shape(vec2 p, float _r) {
  vec2 c = vec2(0.);
  vec2 dist = p - c;
  float d = length(dist);
  float a = atan(dist.x,dist.y);
  float sr = 0.2 * (sin(a * 4. + SPEED) * 0.5 + 0.5);
  float r = _r * (sin(a * 64.) * sr + 1. - sr);
  return smoothstep(d,d+0.001,r);
}

float shapeBorder(vec2 p, float radius, float stroke) {
  return shape(p,radius)-shape(p,radius-stroke);
}

void main(void) {
  vec2 p = (gl_FragCoord.xy - .5 * resolution) / min(resolution);

  p *= rotate(SPEED * .25 + PI / 8.); 

  gl_FragColor = vec4(vec3(shapeBorder(p,.5,.02)), 1.);
}