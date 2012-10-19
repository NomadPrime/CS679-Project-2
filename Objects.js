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
	"remove" : false,	//used to flag object for removal from lists
	
	draw : function() {},	//replaced by draw command of each object type
	
	action : function() {	//updates object based on effects acting on it and global effects acting on everything.
		if(this.effect !== 0) {//skips everything if no effect
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
		}
		//global effects will go outside first if statement
		
		//TODO: Put deletion stuff here (goes out of bounds, kills the fixture, the body, and culls the object from the list)
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
	theContext.strokeStyle = "#555555";
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
	bdef.type = b2Body.b2_dynamicBody;
	bdef.position.Set(x,y);
	bdef.angle = theta;
	bdef.userData = obj;
	obj.body = world.CreateBody(bdef);
	if(type == playerType) {	//player type objects have their own fixture instantiation code
		return obj;
	//} else if(type == enemyType) {	//TODO: Enemy type stuff goes here
		
	} else if(type == crateType) {
		obj.draw = drawCrate;
		fdef.shape = new b2PolygonShape;
		fdef.shape.SetAsBox(dims[0]/2,dims[1]/2);
	}
	obj.fixture = obj.body.CreateFixture(fdef);
	return obj;
}

//------------------------------//
//	COORDINATE TRANSFORMATION	//
//	Pass it an x,y pair,		//
//	translation xy cors and an	//
//	angle of rotation in rads	//
//------------------------------//
function coordTrans(x,y, xtrans, ytrans, theta) {
	reply = [0,0];
	reply[0] = xtrans + Math.cos(theta) * x - Math.sin(theta) * y;
	reply[1] = ytrans + Math.sin(theta) * x + Math.cos(theta) * y;
	return reply;
}
