/**
 * @author gleicher

Simple OpenGL experiment. Creates something moving and changes as it
moves via the shader.

To get the point across that magic happens in shaders,, the geometry
(a square) is fixed. A variable is passed to that shader, which takes
care of moving the square around. It also makes it so it doesn't look
so square.

Note: this uses LoadShaders - but I am enough of a Javascript newbie
that I don't know how to load one script from another - the HTML has
to load that other script first.

For info on "request animationFrame"
see:
http://paulirish.com/2011/requestanimationframe-for-smart-animating/

 */

// global variables
// maybe an ugly way to do this, but...
var gl;				// this keeps the "context"
var trianglePosBuffer;		// this will be a vertex array for the triangles

var shaderProgram;		// one object keeps both shaders

var mycanvas;			// remember the canvas

var inittime;			// the time things start (so we can keep track of time running

// the two triangles that make a square
var square = [
	      -1.0,  -1.0,  .2, 0,
	      1.0,  -1.0,   .2, 0,
	      -1.0,  1.0,   .2, 0,

	      1.0,  -1.0,   .2, 0,
	      -1.0,  1.0,   .2, 0,
	      1.0,  1.0,    .2, 0
	      ];

//
// the main routine - called to get stuff started 
//
// this sets up all the OpenGL stuff, and then starts a javascript
// "animation loop" where animation frames are requested for the
// future. 
function start()
{
  console.log("running start");

  // get the canvas and initialize it
  var canvas = document.getElementById("mycanvas");
  mycancas = canvas;
  initGL(canvas);

  // explain how we'll clear the screen (the actual clearing is in the
  // drawScene below)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.enable(gl.BLEND);

  // make two triangles in a buffer (so we have a square)
  trianglePosBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(square), gl.STATIC_DRAW);
  trianglePosBuffer.itemSize = 4;
  trianglePosBuffer.numItems = 6;

  // make the shaders
  // load the shaders from files
  var fragmentShader = loadShaders(gl, "Shaders/second-frag.glsl")[0];
  var vertexShader   = loadShaders(gl, "Shaders/second-vert.glsl")[0];
  // build the shaderProgram object
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  // make sure all is well
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }
  // use this shader for everything!
  gl.useProgram(shaderProgram);	
    
  // we need to pass the shader everything - this includes the vertex
  // position data (square info), as well as two "uniform" variables
  // that will move things around
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "squareInfo");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  shaderProgram.timeUniform = gl.getUniformLocation(shaderProgram,"time");
  shaderProgram.xpUniform = gl.getUniformLocation(shaderProgram,"xp");
    
  // shim layer with setTimeout fallback
  // this is magic and I got it from the website above
  window.requestAnimFrame = (function() {
			       return  window.requestAnimationFrame ||
				 window.webkitRequestAnimationFrame ||
				 window.mozRequestAnimationFrame ||
				 window.oRequestAnimationFrame ||
				 window.msRequestAnimationFrame ||
				 function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element){
				 window.setTimeout(callback, 1000 / 60);
			       };
			     })();

  // initialize - set the starting time, and draw the initial picture
  inittime = new Date().getTime() * 0.002;
  drawScene();
	
  // this is the "loop" for the animation - a function that draws, and
  // then schedules itself to be called again
  function animLoop() {
    drawScene();
    requestAnimFrame(animLoop,mycanvas);
  }
  // start the loop...
  animLoop();
}

// this actually draws the scene
// note: everything was already setup in start()
function drawScene()
{
  // clear the screen 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // find out what time it is, to pass into the shaders
  var t = new Date().getTime() * 0.002 - inittime;
  var st = Math.sin(t);

  // pass the data to the shader variables
  gl.uniform1f(shaderProgram.timeUniform,t);
  gl.uniform1f(shaderProgram.xpUniform,st);
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trianglePosBuffer.itemSize, gl.FLOAT, false, 0, 0);
  // draw the triangles using that stuff
  gl.drawArrays(gl.TRIANGLES, 0, trianglePosBuffer.numItems);
}

// set up the canvas
function initGL(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
  } catch(e) {
		
  }
  if (!gl) {
    alert("Could not initialize GL!")
      }
}

