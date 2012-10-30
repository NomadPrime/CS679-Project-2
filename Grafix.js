function startGL() {	//starts the WebGL program
      container = document.getElementById("container");
      rengl = new THREE.WebGLRenderer({antialias: true});
      rengl.setClearColorHex(0x000000,1);
      rengl.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(rengl.domElement);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, container.offsetWidth/container.offsetHeight, 1, 4000);
      camera.position.z = 100;
      scene.add(camera);
      
      var plane = new THREE.Mesh(new THREE.PlaneGeometry(3,3), new THREE.MeshBasicMaterial({color: 0x00FFFF}));
      plane.overdraw = true;
      scene.add(plane);
      
      
	var geometry = new THREE.Geometry();
var v1 = new THREE.Vector3(1,-1,50);   // Vector3 used to specify position
var v2 = new THREE.Vector3(1,1,50);
var v3 = new THREE.Vector3(-1,1,50);
var v4 = new THREE.Vector3(-1,-1,50);
geometry.vertices.push(v1);
geometry.vertices.push(v2);
geometry.vertices.push(v3);
geometry.vertices.push(v4);
geometry.faces.push(new THREE.Face4(0, 1, 2, 3));
var redMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
shape = new THREE.Mesh(geometry, redMat);
scene.add(shape);
}

function displayGL() {	
	
	shape.rotation.z += .1;
	rengl.render(scene, camera);
}
