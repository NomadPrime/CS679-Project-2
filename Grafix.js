function startGL() {	//starts the WebGL program
      container = document.getElementById("container");
      rengl = new THREE.WebGLRenderer({antialias: true, premultipliedAlpha: true});
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

function makeParticles() {
	pCount = 500;
	var pMaterial = new THREE.ParticleBasicMaterial({
		color : 0xFFFFFF,
		size : 2,
		map : THREE.ImageUtils.loadTexture("single_star.png")
	});
	particles = new THREE.Geometry();
	for(i = 0; i < pCount; i++) {
		particles.vertices.push(new THREE.Vector3((Math.random()-0.5)*150,(Math.random()-0.5)*50,5));
		pVel.push(0.01+Math.random()*0.008);
	}
	particleSystem = new THREE.ParticleSystem(particles, pMaterial);
	scene.add(particleSystem);
}

function particleUpdate() {
	for(i = 0; i < pCount; i++)
	{
		var particle = particleSystem.geometry.vertices[i];
		if(particle.x < -75) {
			particle.x = -particle.x;
			particle.y = (Math.random()-0.5)*50;
		}
		particle.x = particle.x - pVel[i];
		//particle.velocity.x = -pVel[i];
		//particle.position.addSelf(particle.velocity);
		particleSystem.geometry.dirtyVertices = true;
		particleSystem.geometry.verticesNeedUpdate = true;
	}
}

function pointGain() {
	var ptgeom = new THREE.Geometry();
	ptgeom.vertices.push(new THREE.Vector3(0,0,99));
	ptgeom.vertices.push(new THREE.Vector3(1,0,99));
	ptgeom.vertices.push(new THREE.Vector3(1,1,99));
	ptgeom.vertices.push(new THREE.Vector3(0,1,99));
	ptgeom.faces.push(new THREE.Face4(0,1,2,3));
	var ptshader = new THREE.ShaderMaterial({
		uniforms: {
			theta : {type : 'f', value : 0},
			size : {type : 'f', value : 1},
			v1 : {type : 'v2', value : new THREE.Vector2(0,0)},
			v2 : {type : 'v2', value : new THREE.Vector2(1,0)},
			v3 : {type : 'v2', value : new THREE.Vector2(1,1)},
			v4 : {type : 'v2', value : new THREE.Vector2(0,1)},
			},
		attributes: {},
		vertexShader: vRedShader,
		fragmentShader: fRedShader
	});
	var ptMesh = new THREE.Mesh(ptgeom,ptshader);
	ptMesh.position.x = -74 + score;
	ptMesh.position.y = -24;
	scene.add(ptMesh);
	score++;
}
