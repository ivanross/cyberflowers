#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 black   = vec3(0.,0.,0.);
vec3 blue    = vec3(0.,0.,1.);
vec3 red     = vec3(1.,0.,0.);
vec3 green   = vec3(0.,1.,0.);
vec3 yellow  = vec3(1.,1.,0.);
vec3 magenta = vec3(1.,0.,1.);
vec3 orange  = vec3(1.,.5,0.);



float plot(vec2 p, float pct) {
  float sw = 0.005; //stroke_width
  return smoothstep(pct-sw-0.001, pct-sw, p.y) 
       - smoothstep(pct+sw, pct+sw+0.001, p.y);
}

float limit(float x) {
  return clamp(x, 0.0, 1.0);
}


vec4 buildCircleHermiteBlur(vec2 center, float radius, vec3 color, float blur, vec2 xy) {
  float r = length(xy - center);
  float inner = radius - blur;
  float outer = radius + blur;
  float alpha = 1.0 - smoothstep(inner, outer, r);
  return vec4(color, alpha);
}

vec4 alphaContrast(vec4 color, float mult, float sub) {
  float a = limit(color.a * mult - sub);
  return vec4(color.rgb, a);
}

float bcircle(vec2 p, vec2 c, float r) {
  float dist = distance(p, c);
  float blur = r;
  return smoothstep(dist,dist + blur,r) * 0.5;
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

void main() {
  vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y)  
          - .5 * resolution / min(resolution.x,resolution.y);
  
  float speed = time * 0.5;

  float r = .1;
  float d = .2;

  vec2 c1 = vec2(cos(speed),sin(speed * 2.)) * d; 
  vec2 c2 = vec2(cos(speed * 2.),sin(speed * 2.)) * d; 
  vec2 c3 = vec2(cos(speed * 1.5),sin(speed * 2.5)) * d; 
  vec2 c4 = vec2(sin(speed * .5),cos(speed * 2.5)) * d; 
  vec2 c5 = vec2(sin(speed * .5),cos(speed)) * d; 

  vec4 bg = vec4(black,1.);

  vec4 color = vec4(0.0);
  color = blend(color, vec4(magenta,bcircle(p,c4,r*2.)));
  color = blend(color, vec4(orange ,bcircle(p,c2,r * 1.4)));
  color = blend(color, vec4(blue   ,bcircle(p,c1,r * 1.1)));
  color = blend(color, vec4(yellow ,bcircle(p,c5,r)));
  color = blend(color, vec4(red    ,bcircle(p,c3,r)));
  color = alphaContrast(color,40.,16.);
  gl_FragColor = blend(bg,color);
 
}
