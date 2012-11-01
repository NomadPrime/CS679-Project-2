attribute vec4 squareInfo;
  
varying vec2 ipos;
varying float sintime;

uniform float time;
uniform float xp;
  
void main(void) {
  ipos = squareInfo.xy;
  sintime = sin(time);
  gl_Position = vec4(ipos*squareInfo.z + vec2(0,0), 0.0, 1.0);
}