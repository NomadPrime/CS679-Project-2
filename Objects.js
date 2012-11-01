//This file holds code for the various objects, such as crates.

//------------------------------//
//	BASIC OBJECT TEMPLATE		//
//------------------------------//
var anObject = {
	"type" : 0,	//what kind of object it is, object types listed in code segments
	"dims" : [],	//an array of dimensions of the object, depending on object type
	"effect" : 0,	//any effects currently on the object
	"data" : null,	//holds additional data used for effects or other things
	"timer" : 0,	//used for effect cooldowns
	"body" : null,	//b2Body of object in physics engine
	"fixture" : null,	//b2Fixture attached to body(used for removal)
	"mesh" : null,	//three.js mesh
	"shader" : null,	//three.js shader
	"uniforms" : null,	//three.js shader uniforms
	"indepObject" : true,	//true unless object is part of a larger entity (player, enemy)
	"remove" : false,	//used to flag object for removal from lists
	
	draw : function() {},	//replaced by draw command of each object type
	
	action : function() {	//updates object based on effects acting on it and global effects acting on everything.
		/*
		if(this.effect !== 0) {	//skips everything if no effect
			if(this.effect == railDriverEffect) {	//continuously applies force using the given vector
				this.ctrForce(this.data);
			} else if(this.effect == stasisEffect) {	//nulls velocity of object, after initial collision won't move
				if(this.timer > 0) {
				this.body.SetLinearVelocity(new b2Vec2(0,0));
				this.body.SetAngularVelocity(0);
				this.timer--;
				} else {this.effect = 0;}	//stasis effect dissipates after a certain amount of time
			}
			//place additional effects here that interact only with this body
		}*/
		//global effects will go outside first if statement
		
		var pos = this.body.GetPosition();
		if(this.type == crateType || this.type == playerType || this.type == enemyType) {
			//this.mesh.position.set(pos.x, pos.y, 90);
		this.mesh.position.x = pos.x;
		this.mesh.position.y = pos.y;
		this.mesh.rotation.z = this.body.GetAngle();
		}
		if((pos.x < lowxBound || pos.x > highxBound || pos.y < lowyBound || pos.y > highyBound) && this.indepObject == true || this.remove) {this.purge();}
	},
	
	purge : function() {
		this.remove = true;
		this.body.DestroyFixture(this.fixture);
		world.DestroyBody(this.body);
		scene.remove(this.mesh);
		purgeFlag = true;
	},
	
	ctrForce : function(vector) {	//Applies a force to the body's center, so as not to rotate it.
		this.body.ApplyImpulse(vector,this.body.GetPosition());
	}
};
//------------------------------//
//	EFFECT TYPE CODES			//
//------------------------------//
var railDriverEffect = 3854;	//Rail Driver: continuously applies force to a given object.
var stasisEffect = 2385;	//Stasis: object is frozen, will only move slightly when pushed.
//------------------------------//
//	CRATE OBJECTS				//
//------------------------------//
var crateType = 1482;	//crate type code
//dims[0] = width
//dims[1] = height

function drawCrate() {	//draws a crate. replace with WebGL code later.
	var pos=this.body.GetPosition();
	var theta=this.body.GetAngle();
	var cor;
	theContext.strokeStyle = "#000000";
	theContext.fillStyle = "#000000";
	theContext.lineWidth = 1;
	hwidth = this.dims[0] / 2;
	hheight = this.dims[1] / 2;
	theContext.beginPath();
		cor = coordTrans(hwidth,hheight,pos.x,pos.y,theta);
		theContext.moveTo((cor[0])*10,(cor[1])*10);
		cor = coordTrans(-hwidth,hheight,pos.x,pos.y,theta);
		theContext.lineTo((cor[0])*10,(cor[1])*10);
		cor = coordTrans(-hwidth,-hheight,pos.x,pos.y,theta);
		theContext.lineTo((cor[0])*10,(cor[1])*10);
		cor = coordTrans(hwidth,-hheight,pos.x,pos.y,theta);
		theContext.lineTo((cor[0])*10,(cor[1])*10);
	theContext.closePath();
	theContext.stroke();
	theContext.fill();
}
//------------------------------//
//	DiSH OBJECT					//
//------------------------------//
//TODO: This stuff

//------------------------------//
//	MAKEOBJECT FUNCTION			//
//	x&y=coordinates				//
//	theta=angle					//
//	dims=array of dimensions	//
//------------------------------//
function makeObject(type, x, y, theta, dims) {	//creates an object with the specified x/y/theta coords and dimensions
	Empty = function() {};
	Empty.prototype = anObject;
	obj = new Empty();
	obj.type = type;
	obj.dims = dims;
	bdef.position.Set(x,y);
	bdef.angle = theta;
	bdef.userData = obj;
	obj.body = world.CreateBody(bdef);
	if(type == playerType) {	//player type objects are polygons from an array of vertices
		//TODO: Make the instantiation code here using a line from pvertices
		obj.draw = playerPartDraw;
		obj.indepObject = false;
		fdef.shape = new b2PolygonShape;
		fdef.shape.SetAsArray(dims, dims.length);
		
		
		var geometry = new THREE.Geometry();
		
		geometry.vertices.push(new THREE.Vector3(dims[0].x,dims[0].y,97));
		geometry.vertices.push(new THREE.Vector3(dims[1].x,dims[1].y,97));
		geometry.vertices.push(new THREE.Vector3(dims[2].x,dims[2].y,97));
		geometry.vertices.push(new THREE.Vector3(dims[3].x,dims[3].y,97));
		geometry.faces.push(new THREE.Face4(0,1,2,3));
		obj.mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color: 0x555555}));
		scene.add(obj.mesh);
		obj.mesh.position.x = x;
		obj.mesh.position.y = y;
		
	} else if(type == enemyType) {	//TODO: Enemy type stuff goes here
		obj.indepObject = false;
		fdef.shape = new b2PolygonShape;
		fdef.shape.SetAsArray(dims, dims.length);
		
		
		var geometry = new THREE.Geometry();
		
		geometry.vertices.push(new THREE.Vector3(dims[0].x,dims[0].y,97));
		geometry.vertices.push(new THREE.Vector3(dims[1].x,dims[1].y,97));
		geometry.vertices.push(new THREE.Vector3(dims[2].x,dims[2].y,97));
		geometry.vertices.push(new THREE.Vector3(dims[3].x,dims[3].y,97));
		geometry.faces.push(new THREE.Face4(0,1,2,3));
		obj.mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color: 0xFF0000}));
		scene.add(obj.mesh);
		obj.mesh.position.x = x;
		obj.mesh.position.y = y;
		
		
	} else if(type == enemyShieldType) {
		obj.indepObject = false;
		fdef.shape = new b2CircleShape(dims);
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(0,0,99));
		geometry.vertices.push(new THREE.Vector3(dims,0,99));
		for(i = 1; i < 200; i++){
			geometry.vertices.push(new THREE.Vector3(dims*Math.cos(i*Math.PI/100),dims*Math.sin(i*Math.PI/100),0,99));
			geometry.faces.push(new THREE.Face3(0,i,i+1));
		}
		geometry.faces.push(new THREE.Face3(0,200,1));
		obj.shader = new THREE.ShaderMaterial({
			uniforms: {'strength' : {'type' : 'f', 'value' : 0.5+obj.timer/60.0},'radius' : {'type' : 'f', 'value' : dims}},
			attributes: {},
			vertexShader: vShieldShader,
			fragmentShader: fShieldShader
		});
		obj.mesh = new THREE.Mesh(geometry,obj.shader);//new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
		scene.add(obj.mesh);
		obj.mesh.position.x = x;
		obj.mesh.position.y = y;
	} else if(type == playerShieldType) {	//player character "forcefield"
		//obj.draw = something	//TODO: draw method for this
		obj.indepObject = false;
		fdef.shape = new b2CircleShape(dims);
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(0,0,99));
		geometry.vertices.push(new THREE.Vector3(dims,0,99));
		for(i = 1; i < 200; i++){
			geometry.vertices.push(new THREE.Vector3(dims*Math.cos(i*Math.PI/100),dims*Math.sin(i*Math.PI/100),0,99));
			geometry.faces.push(new THREE.Face3(0,i,i+1));
		}
		geometry.faces.push(new THREE.Face3(0,200,1));
		obj.shader = new THREE.ShaderMaterial({
			uniforms: {'strength' : {'type' : 'f', 'value' : 0.5+obj.timer/60.0},'radius' : {'type' : 'f', 'value' : dims}},
			attributes: {},
			vertexShader: vShieldShader,
			fragmentShader: fShieldShader
		});
		obj.mesh = new THREE.Mesh(geometry,obj.shader);//new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
		scene.add(obj.mesh);
		obj.mesh.position.x = x;
		obj.mesh.position.y = y;
		
		
		
		
	} else if(type == crateType) {
		obj.draw = drawCrate;
		fdef.shape = new b2PolygonShape;
		fdef.shape.SetAsBox(dims[0]/2,dims[1]/2);
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(+dims[0]/2,-dims[1]/2,90));
		geometry.vertices.push(new THREE.Vector3(+dims[0]/2,+dims[1]/2,90));
		geometry.vertices.push(new THREE.Vector3(-dims[0]/2,+dims[1]/2,90));
		geometry.vertices.push(new THREE.Vector3(-dims[0]/2,-dims[1]/2,90));
		geometry.faces.push(new THREE.Face4(0,1,2,3));
		obj.mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color: 0xFFFFFF}));
		scene.add(obj.mesh);
		obj.mesh.position.x = x;
		obj.mesh.position.y = y;
	}
	obj.fixture = obj.body.CreateFixture(fdef);
	return obj;
}

//------------------------------//
//	DAMAGE CODE					//
//------------------------------//
function damage(b1, b2, impulse) {
	if(b1.type == playerShieldType) {	//collisions with player shield
		var imp = impulse.normalImpulses;
			Player.shield.timer = 30;
		var hit = Math.sqrt(imp[0]*imp[0]+imp[1]*imp[1])/1000-pDamageThreshold;
		if(hit > 0) {
			Player.health -= hit;
		}
	}
	else if(b1.type == enemyShieldType) {	//collisions with enemy shield
		var imp = impulse.normalImpulses;
		b1.data.shield.timer = 30;
		var hit = Math.sqrt(imp[0]*imp[0]+imp[1]*imp[1])/1000-eDamageThreshold;
		if(hit > 0) {
			b1.data.health -= hit;
		}
	}
}


//------------------------------//
//	COORDINATE TRANSFORMATION	//
//	Pass it an x,y pair,		//
//	translation xy cors and an	//
//	angle of rotation in rads	//
//------------------------------//
function coordTrans(x, y, xtrans, ytrans, theta) {
	reply = [0,0];
	reply[0] = xtrans + Math.cos(theta) * x - Math.sin(theta) * y;
	reply[1] = ytrans + Math.sin(theta) * x + Math.cos(theta) * y;
	return reply;
}

//	special color class used for doing math with colors
var aColor = {
	"R" : 0,
	"G" : 0,
	"B" : 0,
	"chart" : '0123456789ABCDEF',	//used for translating numbers and hex values
	
	flush : function() {	//makes sure all values are within bounds
		if(this.R > 255) this.R = 255;
		if(this.G > 255) this.G = 255;
		if(this.B > 255) this.B = 255;
		if(this.R < 0) this.R = 0;
		if(this.G < 0) this.G = 0;
		if(this.B < 0) this.B = 0;
	},
	
	add : function(Rplus,Gplus,Bplus) {	//returns a new color object with this object's values plus the given values
		Rplus = Math.floor(Rplus);
		Gplus = Math.floor(Gplus);
		Bplus = Math.floor(Bplus);
		return mColor(this.R+Rplus,this.G+Gplus,this.B+Bplus);
	},
	
	p : function() {	//returns string of color in hex code
		var a = this.b2h(Math.floor(this.R / 16));
		var b = this.b2h(this.R % 16);
		var c = this.b2h(Math.floor(this.G / 16));
		var d = this.b2h(this.G % 16);
		var e = this.b2h(Math.floor(this.B / 16));
		var f = this.b2h(this.B % 16);
		return '#'+a+b+c+d+e+f;
	},
	
	b2h : function(n) {	//converts number from 1 to 16 into a hex letter
		var nybHexString = "0123456789ABCDEF";
		return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
	}
};
function mColor(R,G,B) {	//returns a new color object
	Empty = function() {};
	Empty.prototype = aColor;
	col = new Empty();
	col.R = Math.floor(R);
	col.G = Math.floor(G);
	col.B = Math.floor(B);
	col.flush();
	return col;
}
