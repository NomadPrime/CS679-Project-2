//This file holds code for the various objects, such as crates.

//------------------------------//
//	BASIC OBJECT TEMPLATE		//
//------------------------------//
var anObject = {
	"type" : 0,	//what kind of object it is, object types listed in code segments
	"dims" : [],	//an array of dimensions of the object, depending on object type
	"effect" : 0,	//any effects currently on the object
	"data" : null,	//holds vectors etc. used for effects or other things
	"body" : null,	//b2Body of object in physics engine
	"fixture" : null,	//b2Fixture attached to body(used for removal)
	"remove" : false,	//used to flag object for removal from lists
	
	draw : function() {},	//replaced by draw command of each object type
	
	action : function() {	//updates object based on effects acting on it and global effects acting on everything.
		if(this.effect !== 0) {//skips everything if no effect
			if(this.effect == railDriverEffect) {	//continuously applies force using the given vector
				this.ctrForce(this.data);
			}
			//place additional effects here that interact only with this body
		}
		//global effects will go outside first if statement
	},
	
	ctrForce : function(vector) {	//Applies a force to the body's center, so as not to rotate it.
		this.body.ApplyForce(vector,this.body.GetPosition());
	}
};
//------------------------------//
//	EFFECT TYPE CODES			//
//------------------------------//
var railDriverEffect = 3854;	//Rail Driver: continuously applies force to a given object.
//------------------------------//
//	CRATE OBJECTS				//
//------------------------------//
var crateType = 1482;	//crate type code
//dims[0] = half width
//dims[1] = half height

function drawCrate() {	//draws a crate. replace with WebGL code later.
	var pos=this.body.GetPosition();
	var theta=this.body.GetAngle();
	theContext.strokeStyle = "#555555";
	theContext.lineWidth = 1;
	theContext.beginPath();
		theContext.moveTo((pos.x+this.dims[1]*Math.cos(theta)+this.dims[0]*Math.cos(theta+Math.PI/2))*10,(pos.y+this.dims[1]*Math.sin(theta)+this.dims[0]*Math.sin(theta+Math.PI/2))*10);
		theContext.lineTo((pos.x-this.dims[1]*Math.cos(theta)+this.dims[0]*Math.cos(theta+Math.PI/2))*10,(pos.y-this.dims[1]*Math.sin(theta)+this.dims[0]*Math.sin(theta+Math.PI/2))*10);
		theContext.lineTo((pos.x-this.dims[1]*Math.cos(theta)-this.dims[0]*Math.cos(theta+Math.PI/2))*10,(pos.y-this.dims[1]*Math.sin(theta)-this.dims[0]*Math.sin(theta+Math.PI/2))*10);
		theContext.lineTo((pos.x+this.dims[1]*Math.cos(theta)-this.dims[0]*Math.cos(theta+Math.PI/2))*10,(pos.y+this.dims[1]*Math.sin(theta)-this.dims[0]*Math.sin(theta+Math.PI/2))*10);
	theContext.closePath();
	theContext.stroke();
}

//------------------------------//
//	makeObject Function			//
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
	if(type == crateType) {
		obj.draw = drawCrate;
		fdef.shape = new b2PolygonShape;
		fdef.shape.SetAsBox(dims[0],dims[1]);
	}
	obj.fixture = obj.body.CreateFixture(fdef);
	return obj;
}
