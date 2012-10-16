//This file will hold the code for complex multipart objects such as crate stacks.

//------------------------------//
//	BREAKABLE WELDS				//
//------------------------------//
var bWeld = {
	"weld" : null,	//weld joint object is applied to
	"breakForce" : 9001,	//amount of force required to break weld
	"remove" : false,	//tag for use with removal
	
	action : function() {
		if(this.weld.GetReactionForce(1/60).Length() > this.breakForce)
		{
			world.DestroyJoint(this.weld);
		}
	},
	purge : function() {	//removes object from the object list
		
	}
};

function makeWeld(bA, bB, collide, maxForce) {
	Empty = function() {};
	Empty.prototype = bWeld;
	wld = new Empty();
	wld.breakForce = maxForce;
	jdef.Initialize(bA, bB, bA.GetWorldCenter());
	jdef.collideConnected = collide;
	wld.weld = world.CreateJoint(jdef);
	return wld;
}
