var canvas;
var gl;

var cubeVerticesBuffer;
var cubeVerticesColorBuffer;
var cubeVerticesIndexBuffer;
var cubeRotation = 0.0;
var lastCubeUpdateTime = 0;

var cubeImage;
var cubeTexture;

var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;



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
		
		// Load up and set up the textures that we will use
		initTextures();
		
		// Set up to draw the scene periodically
		setInterval(drawScene, 15);
	}
	
}


/**
 * Initialize WebGL, returning the GL context or null if WebGL is not
 * available or could not be initialized 
 */
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

/**
 * Initialize the shaders so WebGl knows how to light our scene. 
 */
function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
	
	// Create the shader program
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize shader progarm");
	}
	
	gl.useProgram(shaderProgram);
	
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
	
	textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(textureCoordAttribute);
	
	vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(vertexNormalAttribute);
}


/**
 * Loads a shader program by scouring the current document, loking for a 
 * script with the specified ID. 
 */
function getShader(gl, id) {
	var shaderScript, theSource, currentChild, shader;
	
	shaderScript = document.getElementById(id);
	
	// If could not find element with given ID, abort
	if (!shaderScript) {
		return null;
	}
	
	// Walk through source element's children to build source string
	theSource = "";
	currentChild = shaderScript.firstChild;
	
	while (currentChild) {
		if (currentChild.nodeType == currentChild.TEXT_NODE) {
			theSource += currentChild.textContent;
		}
		
		currentChild = currentChild.nextSibling;
	}
	
	// Figure out what type of shader script we have, based on MIME type
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		// Unknown shader type 
		return null;
	}
	
	// Send the source to the shader object
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

/**
 * Initialize the buffers we'll need.  For now, just have one object.
 * It's a simple two-dimensional square 
 */
function initBuffers() {
	
	// Create buffer for the square's vertices
	cubeVerticesBuffer = gl.createBuffer();
	
	// Select the squareVerticesBuffer as one to apply vertex operations to 
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
	
	// Array of vertices for the square.  Note: z is always 0 here.
	var vertices = [
		// Front face
	  	-1.0, -1.0,  1.0,
	   	1.0, -1.0,  1.0,
	  	1.0,  1.0,  1.0,
	  	-1.0,  1.0,  1.0,
	   
	  	// Back face
	  	-1.0, -1.0, -1.0,
	  	-1.0,  1.0, -1.0,
	   	1.0,  1.0, -1.0,
	   	1.0, -1.0, -1.0,
	   
	  	// Top face
	  	-1.0,  1.0, -1.0,
	  	-1.0,  1.0,  1.0,
	   	1.0,  1.0,  1.0,
	   	1.0,  1.0, -1.0,
	   
	  	// Bottom face
	  	-1.0, -1.0, -1.0,
	   	1.0, -1.0, -1.0,
	   	1.0, -1.0,  1.0,
	  	-1.0, -1.0,  1.0,
	   
	  	// Right face
	   	1.0, -1.0, -1.0,
	   	1.0,  1.0, -1.0,
	   	1.0,  1.0,  1.0,
	   	1.0, -1.0,  1.0,
	   
	  	// Left face
	  	-1.0, -1.0, -1.0,
	  	-1.0, -1.0,  1.0,
	  	-1.0,  1.0,  1.0,
	  	-1.0,  1.0, -1.0
	];
	
	cubeVerticesNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
	
	var vertexNormals = [
		// Front
		0.0,  0.0,  1.0,
   		0.0,  0.0,  1.0,
   		0.0,  0.0,  1.0,
   		0.0,  0.0,  1.0,
   
  		// Back
   		0.0,  0.0, -1.0,
   		0.0,  0.0, -1.0,
   		0.0,  0.0, -1.0,
   		0.0,  0.0, -1.0,
   
  		// Top
   		0.0,  1.0,  0.0,
   		0.0,  1.0,  0.0,
   		0.0,  1.0,  0.0,
   		0.0,  1.0,  0.0,
   
  		// Bottom
   		0.0, -1.0,  0.0,
   		0.0, -1.0,  0.0,
   		0.0, -1.0,  0.0,
   		0.0, -1.0,  0.0,
   
  		// Right
   		1.0,  0.0,  0.0,
   		1.0,  0.0,  0.0,
   		1.0,  0.0,  0.0,
	   	1.0,  0.0,  0.0,
   
  		// Left
  		-1.0,  0.0,  0.0,
  		-1.0,  0.0,  0.0,
  		-1.0,  0.0,  0.0,
  		-1.0,  0.0,  0.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	
	// Pass in the list of vertices into WebGL to build the shape.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
	cubeVerticesTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
	
	var textureCoordinates = [
		// Front
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		// Back
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		// Top
		0.0, 0.0, 
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		// Bottom
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		// Right
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		// Left
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
	
	
	// Build the element array buffer
	cubeVerticesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
	
	// This array defines each face as two triangles, specifying each triangle's position
	var cubeVertexIndices = [
		0,  1,  2, 		0, 	2, 	3,			//front
		4,  5,  6, 		4, 	6, 	7,			//back 
		8,  9,  10, 	8, 	10, 11,			//top
		12, 13, 14, 	12, 14, 15,			//bottom
		16, 17, 18, 	16, 18, 19,			//right
		20, 21, 22, 	20, 22, 23			//left
	];
	
	// Now send the element array to GL
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
}


/**
 * Draw the scene 
 */
function drawScene() {
	// Clear the canvas before drawing on it
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
	
	// Move the drawing position to the center of the screen
	loadIdentity();
	
	//Back the drawing position up a little bit so that we can see it
	mvTranslate([-0.0, 0.0, -6.0]);
	
	// Save the current matrix, then rotate before we draw
	mvPushMatrix();	
	
		//rotate around the X and Z axes
		mvRotate(cubeRotation, [1, 0, 1]);
	
		// Draw the cube - bind array buffer and push to GL
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
		gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		
		//Set the texture coordinates attribute for the vertices
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
		gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
		
		// Bind the normals buffer to the shader attribute
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
		gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
		
		// Set the texture to map on the faces
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
		gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
		
		// Draw the cube
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
	
	mvPopMatrix();
	
	//determines how far to rotate the square based off of time since last rotation
	var currentTime = (new Date).getTime();
	if (lastCubeUpdateTime) {
		var delta = currentTime - lastCubeUpdateTime;
		cubeRotation += (30 * delta) / 1000.0;
	}
	
	lastCubeUpdateTime = currentTime;
}



function initTextures() {
	cubeTexture = gl.createTexture();
	cubeImage = new Image();
	cubeImage.onload = function() {
		handleTextureLoaded(cubeImage, cubeTexture);
	}
	cubeImage.src = "fxLogo.png";
}


function handleTextureLoaded(image, texture) {
	console.log("handleTextureLoaded, image = " + image);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
}




/**
 * Matrix utility functions 
 */

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
  
  var normalMatrix = mvMatrix.inverse();
  normalMatrix = normalMatrix.transpose();
  var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
  gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
}

var mvMatrixStack = [];

function mvPushMatrix(m) {
	if (m) {
		mvMatrixStack.push(m.dup());
		mvMatrix = m.dup();
	} 
	else {
		mvMatrixStack.push(mvMatrix.dup());
	}
}

function mvPopMatrix() {
	if (!mvMatrixStack.length) {
		throw("Can't pop from an empty matrix stack.");
	}
	
	mvMatrix = mvMatrixStack.pop();
	return mvMatrix;
}

function mvRotate(angle, v) {
	var inRadians = angle * Math.PI / 180.0;
	
	var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
}
