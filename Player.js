var playerType = 2857;	//signifies player parts
var playerShieldType = 4781	//used for ring around player
/*
var pvers = [	//vertices of all bodies of player
[[0.143,-.060], [-.143,-.060], [-.025,0.058], [0.025,0.058]],
[[0.060,-.143], [-.060,-.143], [-.143,-.060], [0.143,-.060]],
[[-.143,-.060], [-.500,-.210], [-.500,0.210], [-.058,0.025]],
[[-.058,0.025], [-.500,0.210], [-.210,0.500], [-.025,0.058]],
[[0.025,0.058], [-.025,0.058], [-.210,0.500], [0.210,0.500]],
[[0.058,0.025], [0.025,0.058], [0.210,0.500], [0.500,0.210]],
[[0.500,-.210], [0.143,-.060], [0.058,0.025], [0.500,0.210]],
[[0.500,-.210], [0.210,-.500], [0.151,-.360], [0.360,-.151]],
[[0.360,-.151], [0.151,-.360], [0.060,-.143], [0.143,-.060]],
[[0.210,-.500], [-.210,-.500], [-.151,-.360], [0.151,-.360]],
[[0.151,-.360], [-.151,-.360], [-.060,-.143], [0.060,-.143]],
[[-.210,-.500], [-.500,-.210], [-.360,-.151], [-.151,-.360]],
[[-.151,-.360], [-.360,-.151], [-.143,-.060], [-.060,-.143]],
];*/

var pvers = [	//vertices of all bodies of player
[new b2Vec2(0.025,0.058), new b2Vec2(-.025,0.058), new b2Vec2(-.143,-.060), new b2Vec2(0.143,-.060)],
[new b2Vec2(0.143,-.060), new b2Vec2(-.143,-.060), new b2Vec2(-.060,-.143), new b2Vec2(0.060,-.143)],
[new b2Vec2(-.058,0.025), new b2Vec2(-.500,0.210), new b2Vec2(-.500,-.210), new b2Vec2(-.143,-.060)],
[new b2Vec2(-.025,0.058), new b2Vec2(-.210,0.500), new b2Vec2(-.500,0.210), new b2Vec2(-.058,0.025)],
[new b2Vec2(0.210,0.500), new b2Vec2(-.210,0.500), new b2Vec2(-.025,0.058), new b2Vec2(0.025,0.058)],
[new b2Vec2(0.500,0.210), new b2Vec2(0.210,0.500), new b2Vec2(0.025,0.058), new b2Vec2(0.058,0.025)],
[new b2Vec2(0.500,0.210), new b2Vec2(0.058,0.025), new b2Vec2(0.143,-.060), new b2Vec2(0.500,-.210)],
[new b2Vec2(0.360,-.151), new b2Vec2(0.151,-.360), new b2Vec2(0.210,-.500), new b2Vec2(0.500,-.210)],
[new b2Vec2(0.143,-.060), new b2Vec2(0.060,-.143), new b2Vec2(0.151,-.360), new b2Vec2(0.360,-.151)],
[new b2Vec2(0.151,-.360), new b2Vec2(-.151,-.360), new b2Vec2(-.210,-.500), new b2Vec2(0.210,-.500)],
[new b2Vec2(0.060,-.143), new b2Vec2(-.060,-.143), new b2Vec2(-.151,-.360), new b2Vec2(0.151,-.360)],
[new b2Vec2(-.151,-.360), new b2Vec2(-.360,-.151), new b2Vec2(-.500,-.210), new b2Vec2(-.210,-.500)],
[new b2Vec2(-.060,-.143), new b2Vec2(-.143,-.060), new b2Vec2(-.360,-.151), new b2Vec2(-.151,-.360)],
];

var Player = {
	"size" : 5,	//controls size of player
	"thrustMod" : 10000,	//maximum thrust force in any direction
	"maxHealth" : 500,	//player maximum health
	"health" : 0,	//player health
	"shield" : null,	//holds player "forcefield", also what holds player together
	"parts" : [],	//parts comprising player, parts[0] position used as player center
	"joints" : [],	//joints holding player character together
	"alive" : true,	//so the dead routine doesn't repeat
	
	init : function() {	//initializes the player at starting point
		

		this.health = this.maxHealth;	//set health to maximum
		for(i = 0; i < pvers.length; i++) {	//scales vertex coordinates to size of object
			for(j = 0; j < pvers[i].length; j++) {
				pvers[i][j].Multiply(this.size);
			}
		}
		this.shield = makeObject(playerShieldType, 20, 40, 0, this.size * 0.65);
		for(i = 0; i < pvers.length; i++) {
			this.parts.push(makeObject(playerType, 20, 40, 0, pvers[i]));
			objectList.push(this.parts[i]);
			jdef.Initialize(this.shield.body, this.parts[i].body, this.shield.body.GetWorldCenter());
			jdef.collideConnected = false;
			this.joints.push(world.CreateJoint(jdef));
		}
	},
	
	action : function() {
        if (this.health <= 0 && this.alive) {this.die();}
        if (this.alive) {
        	this.shield.body.ApplyTorque((-this.shield.body.GetAngle()*20-this.shield.body.GetAngularVelocity())*100000);	//corrects angle
        	pos = this.shield.body.GetPosition();
        	if (pos.y < 5) {	//Up correction
        		this.shield.ctrForce(new b2Vec2(this.thrustMod*(5-pos.y)*-Math.sin(theta),this.thrustMod*(5-pos.y)*Math.cos(theta)));
        	}
        	if (pos.y > 75) {	//Down correction
				this.shield.ctrForce(new b2Vec2(-this.thrustMod*(pos.y-75)*-Math.sin(theta),-this.thrustMod*(pos.y-75)*Math.cos(theta)));
    	    }
    	    if (pos.x > 135) {	//Left correction
				this.shield.ctrForce(new b2Vec2(-this.thrustMod*(pos.x-135)*Math.cos(theta),-this.thrustMod*(pos.x-135)*Math.sin(theta)));
    	    }
    	    if (pos.x < 5) {	//Right correction
				this.shield.ctrForce(new b2Vec2(this.thrustMod*(5-pos.x)*Math.cos(theta),this.thrustMod*(5-pos.x)*Math.sin(theta)));
    	    }
			theta = this.parts[0].body.GetAngle();
			if (38 in keysDown || 87 in keysDown) {	//Up
				this.shield.ctrForce(new b2Vec2(-this.thrustMod*-Math.sin(theta),-this.thrustMod*Math.cos(theta)));
			}
	        if (40 in keysDown || 83 in keysDown) {	//Down
				this.shield.ctrForce(new b2Vec2(this.thrustMod*-Math.sin(theta),this.thrustMod*Math.cos(theta)));
	        }
	        if (37 in keysDown || 65 in keysDown) {	//Left
				this.shield.ctrForce(new b2Vec2(-this.thrustMod*Math.cos(theta),-this.thrustMod*Math.sin(theta)));
	        }
	        if (39 in keysDown || 68 in keysDown) {	//Right
				this.shield.ctrForce(new b2Vec2(this.thrustMod*Math.cos(theta),this.thrustMod*Math.sin(theta)));
			}
    	    if (32 in keysDown) {
    	    	//TODO: Space bar action
    	    }
		}
	},
	
	draw : function() {	//draws the player character
		var cor;
		theContext.strokeStyle = "#000000";
		for(i = 0; i < pvers.length; i++){
			theContext.beginPath();
			cor = coordTrans(pvers[i][0].x,pvers[i][0].y,this.parts[0].body.GetPosition().x,this.parts[0].body.GetPosition().y,this.parts[0].body.GetAngle());
			theContext.moveTo(cor[0]*10,cor[1]*10);
			for(j = 1; j < pvers[i].length; j++){
				cor = coordTrans(pvers[i][j].x,pvers[i][j].y,this.parts[0].body.GetPosition().x,this.parts[0].body.GetPosition().y,this.parts[0].body.GetAngle());
				theContext.lineTo(cor[0]*10,cor[1]*10);
			}
			theContext.closePath();
			theContext.stroke();
		}
		
	},
	
	die : function() {	//activates on player death
		/*
		for(i = this.joints.length - 1; i >= 0; i--) {	//destroy joints on player model
			world.DestroyJoint(this.joints[i]);
			this.alive = false;
		}*/
		//this.shield.body.DestroyFixture(this.shield.fixture);
		world.DestroyBody(this.shield.body);
		var temp;
		this.shield = null;
		this.alive = false;
		for(i = 0; i < this.parts.length; i++){
			temp = pvers[i][0].Copy();
			temp.Add(pvers[i][1]);
			temp.Add(pvers[i][2]);
			temp.Add(pvers[i][3]);
			temp.Multiply((Math.random())*this.parts[i].body.GetMass());
			this.parts[i].ctrForce(temp);
		}
	}
};
function playerPartDraw() {
	theContext.beginPath();
	theContext.arc(this.body.GetPosition().x, this.body.GetPosition().y,10,0,Math.PI /2,true);
	theContext.closePath();
	theContext.stroke();
	theContext.fill();
}
