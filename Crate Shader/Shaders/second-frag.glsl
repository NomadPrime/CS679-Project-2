#ifdef GL_ES
precision highp float;
#endif
varying vec2 ipos;
varying float sintime;
varying float outerslope;
varying float innerslope;
varying float coreedge;
varying float theta;
varying float phi;

uniform float time;

void main(void) {
	float PI = 3.14159265358979323846264;
	float r = sqrt(ipos.x*ipos.x + ipos.y*ipos.y);
	//if (r>1.0) discard;
  	
	float outer = smoothstep(outerslope+.01,outerslope-.01,abs(ipos.x)) * smoothstep(outerslope+.01,outerslope-.01,abs(ipos.y));
	float inner = smoothstep(innerslope+.01,innerslope-.01,abs(ipos.x)) * smoothstep(innerslope+.01,innerslope-.01,abs(ipos.y));
	float core = smoothstep(coreedge+.01,coreedge-.01,abs(ipos.x)) * smoothstep(coreedge +.01, coreedge-.01,abs(ipos.y));
	
	float tritop = smoothstep(-0.01,0.01,ipos.x+ipos.y) * smoothstep(0.01,-0.01,ipos.x-ipos.y);
	float trilef = smoothstep(0.01,-0.01,ipos.x+ipos.y) * smoothstep(0.01,-0.01,ipos.x-ipos.y);
	float trirgt = smoothstep(-0.01,0.01,ipos.x+ipos.y) * smoothstep(-0.01,0.01,ipos.x-ipos.y);
	float tribtm = smoothstep(0.01,-0.01,ipos.x+ipos.y) * smoothstep(-0.01,0.01,ipos.x-ipos.y);
	
	float topil = sin(phi)*sin(theta)+cos(phi)*cos(theta);
	float lefil = sin(phi)*sin(theta+PI/2.0)+cos(phi)*cos(theta+PI/2.0);
	float rgtil = sin(phi)*sin(theta-PI/2.0)+cos(phi)*cos(theta-PI/2.0);
	float btmil = sin(phi)*sin(theta+PI)+cos(phi)*cos(theta+PI);
	
	float lights = (1.0-outer-inner+core)*(topil*tritop+lefil*trilef+rgtil*trirgt+btmil*tribtm);	//illumination/shadow on slopes
	float shade = (-1.0+outer-inner+core);	//shadow on slopes
	
	gl_FragColor = vec4(
	0.6+lights*0.5+shade*0.2,
	0.6+lights*0.5+shade*0.2,
	0.6+lights*0.5+shade*0.2,
	1.0);

}