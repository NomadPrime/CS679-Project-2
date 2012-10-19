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
    
    var listener = new b2Listener;

    listener.BeginContact = function(contact){
	    //FIXME:
	    //do something?
    }

    listener.EndContact = function(contact){
	    //FIXME:
	    //do something?

    }

    listener.PostSolve = function(contact, impulse){
	    //FIXME:
	    //do something
	    alert("enemy collide!");

    }


    listener.PreSolve = function(contact, impulse){
	    //FIXME:
	    //do something

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


	enemyList.push(makeEnemy(82, 43, 0,[1,1]));
	enemyList.push(makeEnemy(99, 0, 0,[1,1]));
	enemyList.push(makeEnemy(0,0,0,[1,1]));


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
    
    enemyList[0].body.SetLinearVelocity(new b2Vec2(400,50));
    enemyList[1].body.SetLinearVelocity(new b2Vec2(40,500));
   
    function update() {
    	theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
    	
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
