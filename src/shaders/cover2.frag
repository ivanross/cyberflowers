#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359

uniform float u_time;
uniform float u_randomness;
uniform float u_distance;
uniform float u_radius;
uniform sampler2D u_texture_0;

uniform float u_radius_offset;
uniform vec2 u_mouse;
uniform float u_speed;
uniform vec2 u_resolution;

uniform vec2 u_trails[10];

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
float map(float value,float min1,float max1,float min2,float max2){
  return min2+(value-min1)*(max2-min2)/(max1-min1);
}

float ease(float t){return t*t;}
// float ease(float t){return-t*(t-2.);}

vec4 alphaContrast(vec4 color,float mult,float sub){
  float a=limit(color.a*mult-sub);
  return vec4(color.rgb,a);
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

float bcircle(vec2 p,vec2 c,float r){
  float dist=distance(p,c);
  return smoothstep(dist,dist+r,r);
}

float circle(vec2 p,vec2 c,float r){
  float dist=distance(p,c);
  return smoothstep(dist,dist+.002,r);
}

mat2 rotate(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}

float _shape(vec2 p,float rad,float amp,float randomness){
  vec2 c=vec2(0.);
  float a=atan(p.x,p.y);
  float max_r=rad+amp/2.;
  float min_r=rad-amp/2.;
  
  float r=map(noise(vec2(1.,0.)*rotate(a)*randomness+u_time*u_speed),-1.,1.,min_r,max_r);
  
  return circle(p,c,r);
}

float shape(vec2 p,float rad,float amp,float randomness){
  return _shape(p,rad,amp,randomness)-
  _shape(p,rad-.002,amp,randomness);
}

vec4 logo(vec2 p){
  vec2 logo_res=vec2(1220,810);
  float scale=.2;
  
  p/=logo_res;
  p*=min(logo_res.x,logo_res.y);
  p/=scale;
  p+=.5;
  
  if(p.x>0.&&p.x<1.&&p.y>0.&&p.y<1.){
    return texture2D(u_texture_0,p)*.8;
  }else{
    return vec4(0.);
  }
}

void main(){
  vec2 p=gl_FragCoord.xy/min(u_resolution.x,u_resolution.y)
  -.5*u_resolution/min(u_resolution.x,u_resolution.y);
  
  #define N 20.
  vec4 color=vec4(0.);
  for(float i=0.;i<N;i++){
    float offset=.5*u_radius_offset;
    
    float radius=map(i,0.,N,0.,offset)+u_radius*.4;
    float dist=.4*u_distance;//map(ease(i / N), 0., 1., .1, .1);
    float randomness=map(i,0.,N,1.2,4.)*u_randomness;
    float opacity=map(ease(i/N),1.,0.,1.,.02);
    
    vec4 body=vec4(vec3((i/N)*.5),1.-_shape(p,radius,dist,randomness));
    vec4 outline=vec4(white*opacity,shape(p,radius,dist,randomness));
    color=blend(color,body);
    color=blend(color,outline);
  }
  
  color=blend(color,logo(p));
  color=blend(vec4(black,1.),color);
  
  gl_FragColor=color;
}
