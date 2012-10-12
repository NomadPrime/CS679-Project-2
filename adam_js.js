var canvas;
var gl;
var squareVerticesBuffer;
var squareVerticesColorBuffer;
var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;
var squareRotation = 0.0;

function start() {
	canvas = document.getElementById("glCanvas");
	
	initWebGL(canvas);		//intilizes the GL context
	
	//Only continue if WebGL is available and working
	
	if (gl) {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);						//set clear color to black
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);								//enable depth testing
		gl.depthFunc(gl.LEQUAL);								//near things obscure far things
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);		//clear the color as well as the depth buffer
		
		// Initialize the shaders - lighting established, and so forth
		initShaders();
		
		// Call the method that builds all objects we will be drawing
		initBuffers();
		
		// Set up to draw the scene periodically
		setInterval(drawScene, 15);
	}
	
}


function initWebGL(canvas) {
	// Initialize the global variable gl to null
	gl = null;
	
	try {
		// try to grab the standard context.  If it fails, fallback to experimental
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	} catch (e) {
		
	}
	
	// If we don't have a GL context, give up now
	if (!gl) {
		alert("Unable to initialize WebGL.  Your browser may not support it.");
	}
}


function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
	
	// Create the shader program
	
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	// If creating the shader program worked, alert
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize shader progarm");
	}
	
	gl.useProgram(shaderProgram);
	
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
	
	vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(vertexColorAttribute);
}


function getShader(gl, id) {
	var shaderScript, theSource, currentChild, shader;
	
	shaderScript = document.getElementById(id);
	
	if (!shaderScript) {
		return null;
	}
	
	theSource = "";
	currentChild = shaderScript.firstChild;
	
	while (currentChild) {
		if (currentChild.nodeType == currentChild.TEXT_NODE) {
			theSource += currentChild.textContent;
		}
		
		currentChild = currentChild.nextSibling;
	}
	
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		// Unknown shader type 
		return null;
	}
	
	gl.shaderSource(shader, theSource);
	
	// Compile the shader program
	gl.compileShader(shader);
	
	// See if it's compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("An error ocurred compiling the shaders: " + gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}


var horizAspect = 480.0/640.0;

function initBuffers() {
	squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
	
	var vertices = [
		1.0, 1.0, 0.0,
		-1.0, 1.0, 0.0,
		1.0, -1.0, 0.0,
		-1.0, -1.0, 0.0
	];
	
	// Pass in the list of vertices into WebGL to build the shape.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	var colors = [
		1.0, 1.0, 1.0, 1.0,		//white
		1.0, 0.0, 0.0, 1.0,		//red
		0.0, 1.0, 0.0, 1.0,		//green
		0.0, 0.0, 1.0, 1.0		//blue
	];
	
	squareVerticesColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
}


/**
 * Draw the scene 
 */
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
	
	// Move the drawing position to the center of the screen
	loadIdentity();
	
	//Back the drawing position up a little bit so that we can see it
	mvTranslate([-0.0, 0.0, -6.0]);
	
	// Draw the square - bind array buffer and push to GL
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
	// Set the colors attribute for the vertices
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
	gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
	
	// Draw the square
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function loadIdentity() {
	mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
	mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}
 
function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
 
  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}
