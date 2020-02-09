#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 white   = vec3(1.,1.,1.);
vec3 black   = vec3(0.,0.,0.);
vec3 blue    = vec3(0.,0.,1.);
vec3 red     = vec3(1.,0.,0.);
vec3 green   = vec3(0.,1.,0.);
vec3 yellow  = vec3(1.,1.,0.);
vec3 magenta = vec3(1.,0.,1.);
vec3 lightb  = vec3(0.,0.84,1.);
vec3 orange  = vec3(1.,.5,0.);



float plot(vec2 p, float pct) {
  float sw = 0.005; //stroke_width
  return smoothstep(pct-sw-0.001, pct-sw, p.y) 
       - smoothstep(pct+sw, pct+sw+0.001, p.y);
}

float limit(float x) {
  return clamp(x, 0.0, 1.0);
}


vec4 alphaContrast(vec4 color, float mult, float sub) {
  float a = limit(color.a * mult - sub);
  return vec4(color.rgb, a);
}

// blur circle
float circle(vec2 p, vec2 c, float r) {
  float dist = distance(p, c);
  float blur = 0.0005;
  return smoothstep(dist,dist + blur,r);
}

float bcircle(vec2 p, vec2 c, float r) {
  float dist = distance(p, c);
  float blur = r;
  return smoothstep(dist,dist + blur,r);
}

vec4 blend(vec4 bg, vec4 fg){
  vec3 bgm = bg.rgb * bg.a;
  vec3 fgm = fg.rgb * fg.a;
  float ia = 1.0 - fg.a;
  float a = (fg.a + bg.a * ia);
  if (a == 0.0) return vec4(0.0, 0.0, 0.0, a);
  vec4 rgba;
  rgba.rgb = (fgm + bgm * ia) / a;
  rgba.a = a;
  return rgba;
}

mat2 rotate(float a) {
  return mat2(
    cos(a), -sin(a), 
    sin(a), cos(a)
  );
}

mat2 scale(float a) {
  return mat2(
    a,0,
    0,a
  );
}



void main() {
  vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y)  
          - .5 * resolution / min(resolution.x,resolution.y);
  
  p *= 30.;
  vec2 pos = fract(p);
  vec2 index = floor(p);

  vec2 even = mod(index, 2.) * 2. - 1.;
  pos.x += (even.y * time);
  pos.x = fract(pos.x);
  // pos += even * time;
  // pos = fract(pos);

  vec3 color = white * 0.2;
  color = mix(color, lightb,circle(pos,vec2(0.5),.3));
  gl_FragColor = vec4(color ,1.);
 
}
