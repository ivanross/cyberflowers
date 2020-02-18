#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

vec3 black=vec3(0.,0.,0.);
vec3 white=vec3(1.,1.,1.);
vec3 blue=vec3(0.,0.,1.);
vec3 red=vec3(1.,0.,0.);
vec3 green=vec3(0.,1.,0.);
vec3 yellow=vec3(1.,1.,0.);
vec3 magenta=vec3(1.,0.,1.);
vec3 orange=vec3(1.,.5,0.);

vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}

float noise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,
  -.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1;
  i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod(i,289.);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))
  +i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),
  dot(x12.zw,x12.zw)),0.);
  m=m*m;
  m=m*m;
  vec3 x=2.*fract(p*C.www)-1.;
  vec3 h=abs(x)-.5;
  vec3 ox=floor(x+.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}

float limit(float x){return clamp(x,0.,1.);}
vec2 limit(vec2 x){return clamp(x,0.,1.);}
vec3 limit(vec3 x){return clamp(x,0.,1.);}
vec4 limit(vec4 x){return clamp(x,0.,1.);}

vec4 alphaContrast(vec4 color,float mult,float sub){
  float a=limit(color.a*mult-sub);
  return vec4(color.rgb,a);
}

float circle(vec2 p,vec2 c,float r){
  float dist=distance(p,c);
  return smoothstep(dist,dist+.03,r);
}

float bcircle(vec2 p,vec2 c,float r){
  float dist=distance(p,c);
  return smoothstep(dist,dist+r,r);
}

vec4 blend(vec4 bg,vec4 fg){
  vec3 bgm=bg.rgb*bg.a;
  vec3 fgm=fg.rgb*fg.a;
  float ia=1.-fg.a;
  float a=(fg.a+bg.a*ia);
  if(a==0.)return vec4(0.,0.,0.,a);
  vec4 rgba;
  rgba.rgb=(fgm+bgm*ia)/a;
  rgba.a=a;
  return rgba;
}

vec4 blendSum(vec4 base,vec4 blend){
  vec3 mult=base.rgb*base.a+blend.rgb*blend.a;
  return limit(vec4(mult,base.a+blend.a));
}

void main(){
  vec2 p=gl_FragCoord.xy/min(u_resolution.x,u_resolution.y)
  -.5*u_resolution/min(u_resolution.x,u_resolution.y);
  
  float radius=.3;
  float rnd=.2;
  float dist=.08;
  float speed=u_time*.1;
  
  p*=8.;
  vec2 f=fract(p)-.5;
  vec2 i=floor(p);
  
  vec4 circleBlue=vec4(blue,circle(f,vec2(noise(i*rnd+speed+12.),noise(i*rnd+31.+speed))*dist,radius));
  vec4 circleRed=vec4(red,circle(f,vec2(noise(i*rnd+speed+54.),noise(i*rnd+46.+speed))*dist,radius));
  vec4 circleGreen=vec4(green,circle(f,vec2(noise(i*rnd+speed+90.),noise(i*rnd+22.+speed))*dist,radius));
  
  // vec4 color = blend(vec4(0.,0,0,1), circleBlue);
  // color = blend(color,circleRed);
  vec4 color=blendSum(circleBlue,circleRed);
  color=blendSum(color,circleGreen);
  // color = alphaContrast(color,1.1,0.1);
  // color = alphaContrast(color,40.,16.);
  color=blend(vec4(white,1.),color);
  
  // if (color.r*color.g*color.b > .50) gl_FragColor = vec4(black, color.r*color.g*color.b);
  // else gl_FragColor = color;
  gl_FragColor=vec4(1.-color.rgb,color.a);
}
