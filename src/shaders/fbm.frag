#define PI 3.14159265359

precision mediump float;

uniform vec2 resolution;
uniform float time;

vec3 black = vec3(0.);
vec3 white = vec3(1.);
vec3 green = vec3(.2,1.,0.);
vec3 blue = vec3(0.2,0.2,1.);

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float noise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

mat2 skew(float x, float y) {
  return mat2(
    1., tan(x),
    tan(y),1.
  );
}

mat2 rotate(float a) { return mat2(cos(a), -sin(a),sin(a), cos(a)); }

#define OCTAVES 3
// float fbm (in vec2 st) {
//     // Initial values
//     float value = 0.0;
//     float amplitude = .5;
//     float frequency = .61;
    
//     // Loop of octaves
//     for (int i = 0; i < OCTAVES; i++) {
//         value += amplitude * noise(st * frequency);
//         st *= 3.;
//         amplitude *= .5;
//     }
//     return value;
// }

const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);
float fbm( in vec2 p ){
    float f = 0.0;
    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); p = m2*p*2.01;
    f += 0.0625*noise( p );

    return f/0.9375;
}

float pattern(vec2 p) {
  float f = time * .1;
  f = fbm(p*1.3 + f* vec2(-.10,0.) - time * 0.1);
  f = fbm(-p + f -0.2*( time * vec2(0.2, -.3)));
  f = fbm(p*1.4 + f);

  f += 0.5;
  f /= 2.5;

  return f ;
}

void main() {
  vec2 p = (gl_FragCoord.xy  - 1. * resolution) / min(resolution.x,resolution.y);
  float f = (pattern(p * 3.));
  vec3 color =  mix(blue,black, f);
  if (f > 1.) color = white;
  gl_FragColor= vec4(color,1.);
}