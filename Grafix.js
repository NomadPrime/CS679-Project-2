function startGL() {	//starts the WebGL program
      container = document.getElementById("container");
      rengl = new THREE.WebGLRenderer({antialias: true, premultipliedAlpha: false});
      rengl.setClearColorHex(0x000000,1);
      rengl.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(rengl.domElement);
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-container.offsetWidth / (2 * scale), container.offsetWidth / (2 * scale), container.offsetHeight / (2 * scale), -container.offsetHeight / (2 * scale), 1, 4000);
      camera.position.z = 100;
      scene.add(camera);
      
      /* TEST SHAPE
	var geometry = new THREE.Geometry();
	var v1 = new THREE.Vector3(0.5,-0.5,90);   // Vector3 used to specify position
	var v2 = new THREE.Vector3(0.5,0.5,90);
	var v3 = new THREE.Vector3(-0.5,0.5,90);
	var v4 = new THREE.Vector3(-0.5,-0.5,90);
	geometry.vertices.push(v1);
	geometry.vertices.push(v2);
	geometry.vertices.push(v3);
	geometry.vertices.push(v4);
	geometry.faces.push(new THREE.Face4(0, 1, 2, 3));
	var redMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
	shape = new THREE.Mesh(geometry, redMat);
	scene.add(shape);
	*/
	
	
}

function loadShaders() {
	vShieldShader = document.getElementById("vShieldShader").innerHTML;
	fShieldShader = document.getElementById("fShieldShader").innerHTML;
	vCrateShader = document.getElementById("vCrateShader").innerHTML;
	fCrateShader = document.getElementById("fCrateShader").innerHTML;
	vGlassShader = document.getElementById("vGlassShader").innerHTML;
	fGlassShader = document.getElementById("fGlassShader").innerHTML;
	vGreyShader = document.getElementById("vGreyShader").innerHTML;
	fGreyShader = document.getElementById("fGreyShader").innerHTML;
	vRedShader = document.getElementById("vRedShader").innerHTML;
	fRedShader = document.getElementById("fRedShader").innerHTML;
	vGlowLine = document.getElementById("vGlowLine").innerHTML;
	fGlowLine = document.getElementById("fGlowLine").innerHTML;
}
