#ifdef GL_ES
precision highp float;
#endif
varying vec2 ipos;
varying float sintime;

uniform float time;

void main(void) {
  float r = sqrt(ipos.x*ipos.x + ipos.y*ipos.y);
  if (r>1.0) discard;
  	
  float rc = smoothstep(sintime-.1,sintime+.1,r);
  float c = normalize(ipos).x;
	
  gl_FragColor = vec4(0.0, 1.0, 1.0, (1.0-sqrt(1.0-r*r)/2.0)*0.4*(sintime));
}