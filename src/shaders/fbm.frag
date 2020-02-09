precision mediump float;

uniform vec2 resolution;
uniform float time;

vec3 black = vec3(0.);
vec3 blue = vec3(0.,0.4,1.);

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

mat2 skew(float x, float y) {
  return mat2(
    1., tan(x),
    tan(y),1.
  );
}

mat2 rotate(float a) { return mat2(cos(a), -sin(a),sin(a), cos(a)); }

#define OCTAVES 4
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .7;
    float frequency = 1.;
    
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st * frequency);
        st *= 3.;
        amplitude *= .5;
    }
    return value;
}

float pattern(vec2 p) {
  float f = time * .1;
  f = fbm(p*4. + f* vec2(-1.,0.));
  f = fbm(p + f + time *0.02);
  f = fbm(p + f);

  return f ;
}

void main() {
  vec2 p = (gl_FragCoord.xy  - 1. * resolution) / min(resolution.x,resolution.y);
  p.x *= resolution.x / resolution.y;

  float f = pattern(p);
  gl_FragColor= vec4(f * blue,1.);
}