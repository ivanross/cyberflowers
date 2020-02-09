#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define SPEED time * .2

uniform vec2 resolution;
uniform float time;

vec3 white   = vec3(1.,1.,1.);
vec3 black   = vec3(0.,0.,0.);
vec3 blue    = vec3(0.,0.,1.);
vec3 red     = vec3(1.,0.,0.);
vec3 green   = vec3(0.,1.,0.);
vec3 yellow  = vec3(1.,1.,0.);
vec3 magenta = vec3(1.,0.,1.);
vec3 orange  = vec3(1.,.5,0.);

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main(void) {
  vec2 p = (gl_FragCoord.xy) / min(resolution.x,resolution.y);
  p *= 5.;

  vec2 ip = floor(p);
  vec2 fp = fract(p);
  
  float m_dist = 1.;
  vec2 m_point;

  for(float i=-1.;i<= 1.;i++) for(float j=-1.;j<=1.;j++) {
    vec2 neighbor = vec2(i,j); 
    vec2 point = random2(neighbor-ip);
    point = .5 + .5 *sin(time + point * PI * 2.);
    float dist = distance(point,neighbor+fp);

    if (dist <= m_dist) {
      m_dist = dist;
      m_point = point;
    }
  }

  vec3 color = mix(orange, black, m_dist);

  gl_FragColor = vec4(color, 1.);
}