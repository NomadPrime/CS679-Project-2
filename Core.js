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
    theCanvas = document.getElementById("canvas");
    theContext = theCanvas.getContext("2d");
    
    
    //TODO: Used to debug the code. Delete when done.
    function spam(otpt) {
    	dbg = document.getElementById("debugtext");
    	dbg.innerHTML = otpt;
    }
    //TODO: End of debug element.
    
    //world created with 0 gravity, and sleep is disabled
    world = new b2World(new b2Vec2(0,0),false);
    //properties of objects
    bdef = new b2BodyDef;
    bdef.allowSleep = false;
    fdef = new b2FixtureDef;
    fdef.density = ddensity;
    fdef.friction = dfriction;
    fdef.restitution = drestitution;
    fdef.shape = new b2CircleShape(1.0);
    jdef = new b2WeldJointDef;
	
	var wallDefs = new Array(
	  {x:theCanvas.width,y:0,w:theCanvas.width ,h:1}, //top
      {x:theCanvas.width,y:theCanvas.height,w:theCanvas.width ,h:1}, //bottom
      {x:0,y:theCanvas.height,w:1 ,h:theCanvas.height}, //left
      {x:theCanvas.width,y:theCanvas.height,w:1 ,h:theCanvas.height} //right
    ); 
	wallDef = new b2BodyDef;
	wallDef.linearDamping = 0.2;
	var scaleFactor = 20;
	var walls = new Array();
	var wallFixture = new b2FixtureDef;
	wallFixture.shape = new b2PolygonShape;
	wallFixture.restitution = 1;
	for (var i = 0; i < wallDefs.length; i++){
		//wallDef.position.Set(wallDefs[i].x/scaleFactor, wallDefs[i].y/scaleFactor);
		if(i == 0){
		wallDef.position.Set(wallDefs[i].x/scaleFactor + 100, wallDefs[i].y/scaleFactor + 100);
		}
		if(i == 1){
		wallDef.position.Set(wallDefs[i].x/scaleFactor + 100, wallDefs[i].y/scaleFactor - 200);
		}
		if(i == 2){
		wallDef.position.Set(wallDefs[i].x/scaleFactor + 100, wallDefs[i].y/scaleFactor );
		}
		if(i == 3){
		wallDef.position.Set(wallDefs[i].x/scaleFactor - 100, wallDefs[i].y/scaleFactor );
		}
		wallDef.type = b2Body.b2_staticBody;
		wallFixture.shape.SetAsBox(wallDefs[i].w/scaleFactor, wallDefs[i].h/scaleFactor);
		var wallBody = world.CreateBody(wallDef).CreateFixture(wallFixture);
		wallBody.m_userData = "whatever";
		wallBody.draw = function() {
		this.body = this;
		var pos=this.body.GetPosition();
	var pos=this.body.GetPosition();
	var theta=this.body.GetAngle();
	theContext.strokeStyle = "#353505";
	theContext.lineWidth = 100;
	hwidth = this.dims[0] / 2;
	hheight = this.dims[1] / 2;
	theContext.beginPath();
	theContext.moveTo((pos.x+hheight*Math.cos(theta)+hwidth*Math.cos(theta-Math.PI/2))*10,(pos.y+hheight*Math.sin(theta)+hwidth*Math.sin(theta-Math.PI/2))*10);
		theContext.lineTo((pos.x-hheight*Math.cos(theta)+hwidth*Math.cos(theta-Math.PI/2))*10,(pos.y-hheight*Math.sin(theta)+hwidth*Math.sin(theta-Math.PI/2))*10);
		theContext.lineTo((pos.x-hheight*Math.cos(theta)-hwidth*Math.cos(theta-Math.PI/2))*10,(pos.y-hheight*Math.sin(theta)-hwidth*Math.sin(theta-Math.PI/2))*10);
		theContext.lineTo((pos.x+hheight*Math.cos(theta)-hwidth*Math.cos(theta-Math.PI/2))*10,(pos.y+hheight*Math.sin(theta)-hwidth*Math.sin(theta-Math.PI/2))*10);
	theContext.closePath();
	theContext.stroke();
	theContext.fill();
	}
	}
    var listener = new b2Listener;

    listener.BeginContact = function(contact){
	    //FIXME:
	    //do something?
		bodyA = contact.GetFixtureA().GetBody();
		bodyB = contact.GetFixtureB().GetBody();
		bodyA.SetLinearVelocity(new b2Vec2(Math.random()*100,Math.random()*100))
		bodyB.SetLinearVelocity(new b2Vec2(Math.random()*100,Math.random()*100))
		//contact.GetFixtureB().GetBody().m_userData.explode();
		console.log(bodyA);
		if(bodyA.m_userData != null && typeof(bodyA.m_userData.health) != "undefined"){
			bodyA.m_userData.health -= 1000;
		}
		if(bodyB.m_userData != null && typeof(bodyB.m_userData.health) != "undefined"){
			bodyB.m_userData.health -= 100;
		}
    }

    listener.EndContact = function(contact){
	    //FIXME:
	    //do something?
	//	alert("2");

    }

    listener.PostSolve = function(contact, impulse){
	    //FIXME:
	    //do something
	   // alert("enemy collide!");

    }


    listener.PreSolve = function(contact, impulse){
	    //FIXME:
	    //do something
		//alert("4");

    }

    function cull(a, b) {//sorting function, puts stuff tagged for removal at end to be popped, as used in Swarm Survival Game
        if (a.remove) { return 1; }
        else if (b.remove) { return -1; }
        else { return 0; }
    }
    
    function listen() {//account for effects of EventListeners
    	
    }
	
    
    objectList.push(makeObject(crateType, 80, 39, 0, [1,1]));
   	objectList.push(makeObject(crateType, -1000, 30, Math.random(), [1,1]));
   	objectList.push(makeObject(crateType, 80, 40, 0, [1,1]));
   	objectList.push(makeObject(crateType, 80, 41, 0, [1,1]));
   	objectList.push(makeObject(crateType, 81, 39, 0, [1,1]));
   	objectList.push(makeObject(crateType, 81, 40, 0, [1,1]));
   	objectList.push(makeObject(crateType, 81, 41, 0, [1,1]));


	//enemyList.push(makeEnemy(82, 43, 0,[1,1]));
	enemyList.push(makeEnemy(10,10,10,[10,10]));
	enemyList.push(makeEnemy(50, 10, 10,[10,10]));
	


    stuffList.push(makeWeld(objectList[0].body,objectList[2].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[0].body,objectList[4].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[4].body,objectList[5].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[5].body,objectList[6].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[2].body,objectList[5].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[2].body,objectList[3].body,true,200+Math.random()*300));
    stuffList.push(makeWeld(objectList[3].body,objectList[6].body,true,200+Math.random()*300));
    for(i = 0; i < 40; i++) {
    }
    crateStack(160, 40, 0, -5000, 0, 0, 1, 1, 20, 20, 50, 50, 0);
    crateStack(0, 40, 0, 5000, 0, 0, 1, 1, 20, 20, 50, 50, 0);
   	//objectList[1].effect = railDriverEffect;
   	objectList[1].data = new b2Vec2(100,0);
   	//objectList[0].effect = stasisEffect;
   	//objectList[0].timer = 60;
    objectList[1].body.SetLinearVelocity(new b2Vec2(400+Math.random()*500,(Math.random()-0.5)*40));
    objectList[1].body.SetAngularVelocity((Math.random()-0.5)*60);
    
    enemyList[0].body.SetLinearVelocity(new b2Vec2(10,0));
    enemyList[1].body.SetLinearVelocity(new b2Vec2(-10,0));
   
    function update() {
    	theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
    	
		world.SetContactListener(listener);
    	world.Step(1/frameRate, 10, 10);	//advance physics engine
    	for(i = 0; i < objectList.length; i++) {
    		objectList[i].action();
    	}

	for(i = 0; i < enemyList.length; i++){
		enemyList[i].action();
}
    	for(i = 0; i < stuffList.length; i++) {
    		stuffList[i].action();
    	}
    	//world.ClearForces();
    	for(i = 0; i < objectList.length; i++) {
    		objectList[i].draw();
    	}

	for(i = 0; i < enemyList.length; i++){
		enemyList[i].draw();
    }
    	if(Math.random() >= .99) {
    		crateStack(400+100*Math.random(), 40+100*(Math.random()-0.5), 6, worldSpeed, 0, Math.random()*5, 1, 1, Math.random()*5, Math.random()*5, 30, 50, 0);
    	}
    	
    	
    	
    	reqFrame(update);	//set up another iteration
    }
    update();
}
