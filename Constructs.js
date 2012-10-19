//This file will hold the code for complex multipart objects such as crate stacks.

//------------------------------//
//	BREAKABLE WELDS				//
//------------------------------//
var bWeld = {
	"weld" : null,	//weld joint object is applied to
	"breakForce" : 9001,	//amount of force required to break weld
	"grace" : 30,	//grace period where welds are indestructible (then really destructible for a little bit)
	"remove" : false,	//tag for use with removal
	
	action : function() {
		if(this.grace > 10) {fracture = this.breakForce * 10; this.grace--;}
		else if(this.grace > 0) {fracture = this.breakForce / 2; this.grace--;}
		else {fracture = this.breakForce;}
		if(this.weld.GetReactionForce(1/frameRate).Length() > fracture)
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
	jdef.userData = wld;
	wld.weld = world.CreateJoint(jdef);
	return wld;
}

//------------------------------//
//	CRATE STACKS				//
//------------------------------//
function crateStack(x,y,rot,vx,vy,vt,cwidth,cheight,swidth,sheight,strength,variation,decay) {	//creates a stack of crates with the given specifications.
	swidth = Math.ceil(swidth);
	sheight = Math.ceil(sheight);
	var xStep = new b2Vec2(cwidth*Math.cos(rot-Math.PI/2),cwidth*Math.sin(rot-Math.PI/2));	//vector between crates in x direction
	var yStep = new b2Vec2(cheight*Math.cos(rot),cheight*Math.sin(rot));	//vector between crates in y direction
	var dim = [cwidth,cheight];	//holds crate dimensions, passed to makeObject
	var startPos = xStep.Copy();	//will hold starting position for cratestack (lower-left corner)
	var temp = yStep.Copy();
	startPos.Multiply(-(swidth-1)/2);
	temp.Multiply(-(sheight-1)/2);
	startPos.Add(temp);
	startPos.Add(new b2Vec2(x,y));	//now holds accurate starting coordinates
	var crates = [];	//2D array of crates
	var pos;	//holds position of current crate
	var i,j;
	for(i = 0; i < swidth; i++) {	//iteration through columns
		pos = startPos.Copy();
		temp = xStep.Copy();
		temp.Multiply(i);	//advance up i rows
		pos.Add(temp);
		crates.push([]);	//adds new column of crates
		for(j = 0; j < sheight; j++) {	//iteration up column
			crates[i].push(makeObject(crateType, pos.x, pos.y, rot, dim));
			objectList.push(crates[i][j]);
			if(i !== 0) {stuffList.push(makeWeld(crates[i][j].body,crates[i-1][j].body,true,strength + Math.random() * variation));}	//makes weld object to its left
			if(j !== 0) {stuffList.push(makeWeld(crates[i][j].body,crates[i][j-1].body,true,strength + Math.random() * variation));}	//makes weld to object below it
			crates[i][j].body.SetLinearVelocity(new b2Vec2(vx + 10*(Math.random()-0.5),vy + 10*(Math.random()-0.5)));	//sets velocity with  randomization to promote scatter of decayed parts
			crates[i][j].body.SetAngularVelocity(vt*(Math.random()+0.5));	//sets angular velocity
			pos.Add(yStep);
		}
	}
	//TODO: Implement decay once removal is done
}
