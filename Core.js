//Documentation stuff here
function start() {
	//RequestAnimationFrame code from flocking demo
	var reqFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function FrameRequestCallback */callback, /* DOMElement Element */element) {
            window.setTimeout(callback, 1000 / 60);
        };
    theCanvas = document.getElementById("canvas");
    theContext = theCanvas.getContext("2d");
    
    
    //TODO: Used to debug the code. Delete when done.
    function debug(otpt) {
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
    

    function cull(a, b) {//sorting function, puts stuff tagged for removal at end to be popped, as used in Swarm Survival Game
        if (a.remove) { return 1; }
        else if (b.remove) { return -1; }
        else { return 0; }
    }
    
    function listen() {//account for effects of EventListeners
    	
    }
    makeObject(crateType, 800, 400, Math.random()*10, [10,10]);
    makeObject(crateType, 300, 400, Math.random()*10, [10,10]);
    objectList[1].body.SetLinearVelocity(new b2Vec2(100,0));
    objectList[1].body.SetAngularVelocity(20);
    
    function update() {
    	theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
    	
    	world.Step(1/60, 10, 10);	//advance physics engine
    	
    	for(i = 0; i < objectList.length; i++)
    	{
    		//objectList[i].draw();
    		theContext.write("BLAH");
    	}
    	
    	
    	
    	reqFrame(update);	//set up another iteration
    }
    update();
}
