//Documentation stuff here
function start() {
	//RequestAnimationFrame code from flocking demo
	var reqFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function FrameRequestCallback */callback, /* DOMElement Element */element) {
            window.setTimeout(callback, 1000 / frameRate);
        };
    //theCanvas = document.getElementById("canvas");
    //theContext = theCanvas.getContext("2d");
    startGL();
    loadShaders();
    
    //world created with 0 gravity, and sleep is disabled
    world = new b2World(new b2Vec2(0,0),false);
    //properties of objects
    bdef = new b2BodyDef;
    bdef.allowSleep = false;
    bdef.type = b2Body.b2_dynamicBody
    fdef = new b2FixtureDef;
    fdef.density = ddensity;
    fdef.friction = dfriction;
    fdef.restitution = drestitution;
    fdef.shape = new b2CircleShape(1.0);
    jdef = new b2WeldJointDef;
    

    function cull(a, b) {//sorting function, puts stuff tagged for removal at end to be popped, as used in Swarm Survival Game
        if (a.remove) { return 1; }
        else if (b.remove) { return -1; }
        else { return 0; }
    }
    
    window.addEventListener("keydown", function (e) {	//keyboard detection function as used in Swarm Survival Game
        if (!(e.keyCode in keysDown)) {
            //firstKeyHit(e.keyCode);
        }
        keysDown[e.keyCode] = true;

    }, false);
    window.addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);
    
    document.addEventListener("mousedown", function(e) {click = true; mouseDown = true;}, false);
    document.addEventListener("mousemove", function(e) {mousex = (e.clientX - container.offsetLeft - container.offsetWidth/2) / scale; mousey = -(e.clientY - container.offsetTop - container.offsetHeight/2) / scale;}, false);
    document.addEventListener("mouseup", function() {mouseDown = false;}, false);
    
    var glowLineShader = new THREE.ShaderMaterial({
    	uniforms : {
    		length : {type : 'f', value : 1},
    		active : {type : 'f', value : 0}
    	},
    	attributes : {},
    	vertexShader : vGlowLine,
    	fragmentShader : fGlowLine,
			//blend: THREE.AdditiveBlending,
			//transparent: true
    });
    var glowTgtShader = new THREE.ShaderMaterial({
    	uniforms : {
    		length : {type : 'f', value : 1},
    		active : {type : 'f', value : 0}
    	},
    	attributes : {},
    	vertexShader : vGlowLine,
    	fragmentShader : fGlowLine,
			//blend: THREE.AdditiveBlending,
			//transparent: true
    });
    var glowBubShader = new THREE.ShaderMaterial({
		uniforms: {'strength' : {'type' : 'f', 'value' : 0},'radius' : {'type' : 'f', 'value' : grabRadius}},
		attributes: {},
		vertexShader: vShieldShader,
		fragmentShader: fShieldShader,
			//blend: THREE.AdditiveBlending,
			//transparent: true
	});
    var glwbubgeo = new THREE.Geometry();
	glwbubgeo.vertices.push(new THREE.Vector3(0,0,99));
	glwbubgeo.vertices.push(new THREE.Vector3(grabRadius,0,99));
	for(i = 1; i < 50; i++){
		glwbubgeo.vertices.push(new THREE.Vector3(grabRadius*Math.cos(i*Math.PI/25),grabRadius*Math.sin(i*Math.PI/25),0,99));
		glwbubgeo.faces.push(new THREE.Face3(0,i,i+1));
	}
	glwbubgeo.faces.push(new THREE.Face3(0,50,1));
    var glwgeo = new THREE.Geometry();
    glwgeo.vertices.push(new THREE.Vector3(0.5,0,95));
    glwgeo.vertices.push(new THREE.Vector3(0.5,1,95));
    glwgeo.vertices.push(new THREE.Vector3(-0.5,1,95));
    glwgeo.vertices.push(new THREE.Vector3(-0.5,0,95));
    glwgeo.faces.push(new THREE.Face4(0,1,2,3));
    var glowLineMesh = new THREE.Mesh(glwgeo,glowLineShader);
    var glowTgtMesh = new THREE.Mesh(glwgeo,glowTgtShader);
    var glowBub = new THREE.Mesh(glwbubgeo, glowBubShader);
    scene.add(glowLineMesh);
    scene.add(glowTgtMesh);
    scene.add(glowBub);
    
    var hpgeo1 = new THREE.Geometry();
    hpgeo1.vertices.push(new THREE.Vector3(1,0,97));
    hpgeo1.vertices.push(new THREE.Vector3(1,50,97));
    hpgeo1.vertices.push(new THREE.Vector3(-1,50,97));
    hpgeo1.vertices.push(new THREE.Vector3(-1,0,97));
    hpgeo1.faces.push(new THREE.Face4(0,1,2,3));
    var hpgeo2 = new THREE.Geometry();
    hpgeo2.vertices.push(new THREE.Vector3(0.5,0,98.5));
    hpgeo2.vertices.push(new THREE.Vector3(0.5,1,98.5));
    hpgeo2.vertices.push(new THREE.Vector3(-0.5,1,98.5));
    hpgeo2.vertices.push(new THREE.Vector3(-0.5,0,98.5));
    hpgeo2.faces.push(new THREE.Face4(0,1,2,3));
	hBarBackShader = new THREE.ShaderMaterial({
		uniforms: {
			theta : {type : 'f', value : -Math.PI/2},
			size : {type : 'f', value : Player.size},
			v1 : {type : 'v2', value : new THREE.Vector2(1,0)},
			v2 : {type : 'v2', value : new THREE.Vector2(1,50)},
			v3 : {type : 'v2', value : new THREE.Vector2(-1,50)},
			v4 : {type : 'v2', value : new THREE.Vector2(-1,0)},
			},
		attributes: {},
		vertexShader: vGreyShader,
		fragmentShader: fGreyShader
	});
	var hBarShader = new THREE.ShaderMaterial({
    	uniforms : {
    		length : {type : 'f', value : 50},
    		active : {type : 'f', value : 1}
    	},
    	attributes : {},
    	vertexShader : vGlowLine,
    	fragmentShader : fGlowLine
    });
	var hBarBack = new THREE.Mesh(hpgeo1,hBarBackShader);
	var hBar = new THREE.Mesh(hpgeo2,hBarShader);
	scene.add(hBar);
	scene.add(hBarBack);
	hBarBack.position.x = -74;
	hBar.position.x = -74;
	hBarBack.position.y = 23;
	hBar.position.y = 23;
	hBarBack.rotation.z = -Math.PI/2;
	hBar.rotation.z = -Math.PI/2;
    
    function listen() {//account for effects of EventListeners
    	if(Player.alive) {
    	if(click) {
    		mousexo = mousex;
    		mouseyo = mousey;
    		aabb.lowerBound = new b2Vec2(mousexo-grabRadius,mouseyo-grabRadius);
    		aabb.upperBound = new b2Vec2(mousexo+grabRadius,mouseyo+grabRadius);
    		ready = true;
    		click = false;
    	} else if(mouseDown) {
    		glowLineShader.uniforms.active.value = 1.0;
    		glowTgtShader.uniforms.active.value = 1.0;
    		glowBubShader.uniforms.strength.value = 0.6;
    		max = launchMax/launchMult;
    		mag = Math.sqrt(Math.pow(mousex-mousexo,2)+Math.pow(mousey-mouseyo,2));
    		if(mag <= max) {
    			mousext = mousex;
    			mouseyt = mousey;
    		} else {
    			mousext = mousexo + (mousex - mousexo) * max / mag;
    			mouseyt = mouseyo + (mousey - mouseyo) * max / mag;
    		}
    		glowLineShader.uniforms.length.value = Math.sqrt(Math.pow(mousexo-Player.shield.body.GetPosition().x,2)+Math.pow(mouseyo-Player.shield.body.GetPosition().y,2));
    		glowTgtShader.uniforms.length.value = Math.sqrt(Math.pow(mousext-mousexo,2)+Math.pow(mouseyt-mouseyo,2));
    		glowLineMesh.rotation.z = Math.atan2(mouseyo-Player.shield.body.GetPosition().y,mousexo-Player.shield.body.GetPosition().x) - Math.PI/2;
    		glowTgtMesh.position.x = mousexo;
    		glowTgtMesh.position.y = mouseyo;
    		glowTgtMesh.rotation.z = Math.atan2(mouseyt-mouseyo,mousext-mousexo) - Math.PI/2;
    		glowBub.position.x = mousexo;
    		glowBub.position.y = mouseyo;
    		/*theContext.strokeStyle = "#55FFFF";
    		theContext.lineWidth = 4;
    		theContext.beginPath();
    		theContext.arc(mousexo*10,mouseyo*10,grabRadius*10,0,Math.PI*2,true);
    		theContext.stroke();
    		theContext.moveTo(mousexo*10,mouseyo*10);
    		theContext.lineTo(mousext*10,mouseyt*10);
    		theContext.stroke();
    		theContext.lineWidth = 1;*/
    	} else if(ready) {
    		world.QueryAABB(throwScan, aabb);
    		ready = false;
    		glowLineShader.uniforms.active.value = 0.0;
    		glowTgtShader.uniforms.active.value = 0.0;
    		glowBubShader.uniforms.strength.value = 0.0;
    	}
    	}
    }
    function throwScan(fixture) {
    	obj = fixture.GetBody().GetUserData();
    	if(obj.indepObject && Math.sqrt(Math.pow(obj.body.GetPosition().x-mousexo,2)+Math.pow(obj.body.GetPosition().y-mouseyo,2)) <= grabRadius + 0.5) {
    		obj.ctrForce(new b2Vec2((mousext-mousexo)*launchMult,(mouseyt-mouseyo)*launchMult));
    	}
    	return true;
    }

    
    var collider = new b2ContactListener;
    collider.BeginContact = function(contact) {}
    collider.EndContact = function(contact) {}
    collider.PostSolve = function(contact, impulse) {
    	b1 = contact.GetFixtureA().GetBody().GetUserData();
    	b2 = contact.GetFixtureB().GetBody().GetUserData();
    	if(b1.type == playerShieldType) {damage(b1,b2,impulse);}
    	if(b2.type == playerShieldType) {damage(b2,b1,impulse);}
    	if(b1.type == enemyShieldType) {damage(b1,b2,impulse);}
    	if(b2.type == enemyShieldType) {damage(b2,b1,impulse);}
    }
    collider.PreSolve = function(contact, oldManifold) {}
    this.world.SetContactListener(collider);
    
    
    //TODO: DEMO CODE
   /* objectList.push(makeObject(crateType, 80, 39, 0, [1,1]));
   	objectList.push(makeObject(crateType, -1000, 30, Math.random(), [1,1]));
   	objectList.push(makeObject(crateType, 80, 40, 0, [1,1]));
   	objectList.push(makeObject(crateType, 80, 41, 0, [1,1]));
   	objectList.push(makeObject(crateType, 81, 39, 0, [1,1]));
   	objectList.push(makeObject(crateType, 81, 40, 0, [1,1]));
   	objectList.push(makeObject(crateType, 81, 41, 0, [1,1]));
    stuffList.push(makeWeld(objectList[0].body,objectList[2].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[0].body,objectList[4].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[4].body,objectList[5].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[5].body,objectList[6].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[2].body,objectList[5].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[2].body,objectList[3].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[3].body,objectList[6].body,true,200+Math.random()*300));
    for(i = 0; i < 40; i++) {
    }
    crateStack(160, 40, 0, -5000, 0, 0, 1, 1, 2, 2, 50, 50, 0);
    crateStack(0, 40, 0, 0, 0, 0, 1, 1, 2, 2, 50, 50, 0);*/
    //objectList[1].body.SetLinearVelocity(new b2Vec2(400+Math.random()*500,(Math.random()-0.5)*40));
    //objectList[1].body.SetAngularVelocity((Math.random()-0.5)*60);
    //TODO: END OF DEMO CODE
    
    
    
         makeParticles();
    Player.init();
    
         /*var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(theContext);
			debugDraw.SetDrawScale(scale);
			debugDraw.SetFillAlpha(10);
			debugDraw.SetLineThickness(1.0);
			//debugDraw.SetFlags(b2DebugDraw.e_shapeBit/* | b2DebugDraw.e_jointBit*///);
			//world.SetDebugDraw(debugDraw);
    function update() {
    	//theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
    	if(Player.alive) {
    	glowLineMesh.position.x = Player.shield.body.GetPosition().x;
    	glowLineMesh.position.y = Player.shield.body.GetPosition().y;
    	}
    	
    	Player.action();
    	for(i = 0; i < objectList.length; i++) {
    		objectList[i].action();
    		if(purgeFlag) {
    			objectList.sort(cull);
    			objectList.pop();
    			purgeFlag = false;
    		}
    	}
    	for(i = 0; i < enemyList.length; i++) {
    		enemyList[i].action();
    		if(purgeFlag) {
    			enemyList.sort(cull);
    			enemyList.pop();
    			purgeFlag = false;
    		}
    	}
    	for(i = 0; i < stuffList.length; i++) {
    		stuffList[i].action();
    		if(purgeFlag) {
    			stuffList.sort(cull);
    			stuffList.pop();
    			purgeFlag = false;
    		}
    	}
    	if(!mouseDown) {
    		world.Step(1/frameRate, 10, 10);	//advance physics engine
    	} else {
    		world.Step(1/(frameRate * 4), 10, 10);	//BULLET TIME YAY
    	}
    	world.ClearForces();
    	//world.DrawDebugData();
    	listen();
    	for(i = 0; i < objectList.length; i++) {
    		//objectList[i].draw();
    	}
    	for(i = 0; i < enemyList.length; i++) {
    		//enemyList[i].draw();
    	}
    	//Player.draw();
    	//TODO: Click stuff
    	runEvents();
    	if(Player.health > 0) {
    		hBarShader.uniforms.active.value = 1;
    		hBarShader.uniforms.length.value = 50*Player.health/Player.maxHealth;
    	} else {hBarShader.uniforms.active.value = 0;}
    	
    	
    	/*
    	shape.rotation.z += .05;
    	shape.position.x = mousex;
    	shape.position.y = mousey;*/
    	rengl.render(scene, camera);
    	particleUpdate();
    	
    	reqFrame(update);	//set up another iteration
    }
    update();
}
