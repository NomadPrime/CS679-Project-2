attribute vec4 squareInfo;
  
varying vec2 ipos;
varying float sintime;
varying float outerslope;	//outer edge of main flat area
varying float innerslope;	//inner edge of main flat area
varying float coreedge;	//outer edge of center flat area
varying float theta;	//angle of rotation(0 is up)
varying float phi;	//light angle

uniform float time;
uniform float xp;
  
void main(void) {
	float PI = 3.14159265358979323846264;
	ipos = squareInfo.xy;
	sintime = (sin(time)+1.0)/2.0;
	outerslope = 0.8;
	innerslope = 0.6;
	coreedge = 0.5;
	theta = time/2.0;
	phi = -PI/4.0;
	vec2 newpos = ipos;
	newpos.x = ipos.x*cos(theta) - ipos.y*sin(theta);
	newpos.y = ipos.x*sin(theta) + ipos.y*cos(theta);

	gl_Position = vec4(newpos*squareInfo.z + vec2(0,0), 0.0, 1.0);
}