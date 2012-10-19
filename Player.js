var playerType = 2857;	//signifies player parts
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
[new b2Vec2(0.143,-.060), new b2Vec2(-.143,-.060), new b2Vec2(-.025,0.058), new b2Vec2(0.025,0.058)],
[new b2Vec2(0.060,-.143), new b2Vec2(-.060,-.143), new b2Vec2(-.143,-.060), new b2Vec2(0.143,-.060)],
[new b2Vec2(-.143,-.060), new b2Vec2(-.500,-.210), new b2Vec2(-.500,0.210), new b2Vec2(-.058,0.025)],
[new b2Vec2(-.058,0.025), new b2Vec2(-.500,0.210), new b2Vec2(-.210,0.500), new b2Vec2(-.025,0.058)],
[new b2Vec2(0.025,0.058), new b2Vec2(-.025,0.058), new b2Vec2(-.210,0.500), new b2Vec2(0.210,0.500)],
[new b2Vec2(0.058,0.025), new b2Vec2(0.025,0.058), new b2Vec2(0.210,0.500), new b2Vec2(0.500,0.210)],
[new b2Vec2(0.500,-.210), new b2Vec2(0.143,-.060), new b2Vec2(0.058,0.025), new b2Vec2(0.500,0.210)],
[new b2Vec2(0.500,-.210), new b2Vec2(0.210,-.500), new b2Vec2(0.151,-.360), new b2Vec2(0.360,-.151)],
[new b2Vec2(0.360,-.151), new b2Vec2(0.151,-.360), new b2Vec2(0.060,-.143), new b2Vec2(0.143,-.060)],
[new b2Vec2(0.210,-.500), new b2Vec2(-.210,-.500), new b2Vec2(-.151,-.360), new b2Vec2(0.151,-.360)],
[new b2Vec2(0.151,-.360), new b2Vec2(-.151,-.360), new b2Vec2(-.060,-.143), new b2Vec2(0.060,-.143)],
[new b2Vec2(-.210,-.500), new b2Vec2(-.500,-.210), new b2Vec2(-.360,-.151), new b2Vec2(-.151,-.360)],
[new b2Vec2(-.151,-.360), new b2Vec2(-.360,-.151), new b2Vec2(-.143,-.060), new b2Vec2(-.060,-.143)],
];

var Player = {
	"size" : 4,	//controls size of player
	"thrustMod" : 10000,	//maximum thrust force in any direction
	"maxHealth" : 500,	//player maximum health
	"health" : 0,	//player health
	"parts" : [],	//parts comprising player, parts[0] position used as player center
	"joints" : [],	//joints holding player character together
	
	init : function() {	//initializes the player at starting point
		

		this.health = this.maxHealth;	//set health to maximum
		/*for(i = 0; i < pvertices.length; i++) {	//scales vertex coordinates to size of object
			for(j = 0; j < pvertices[i].length; j++) {
				pvertices[i][j].Multiply(this.size);
			}
		}*/
		this.parts.push(makeObject(crateType, 20, 40, 0, [5,5]));
		objectList.push(this.parts[0]);
		//for(i = 1; i < pvers.length; i++) {
			//this.parts.push(makeObject(playerType, 20, 40, 0, pvertices[i]));
			//objectList.push(this.parts[i]);
			////TODO: JOINT INSTANTIATION CODE
		//}
	},
	
	action : function() {
		this.parts[0].body.ApplyTorque((-this.parts[0].body.GetAngle()*20-this.parts[0].body.GetAngularVelocity())*100000);	//corrects angle
		pos = this.parts[0].body.GetPosition();
		if (pos.y < 5) {	//Up correction
			this.parts[0].ctrForce(new b2Vec2(this.thrustMod*(5-pos.y)*-Math.sin(theta),this.thrustMod*(5-pos.y)*Math.cos(theta)));
        }
        if (pos.y > 75) {	//Down correction
			this.parts[0].ctrForce(new b2Vec2(-this.thrustMod*(pos.y-75)*-Math.sin(theta),-this.thrustMod*(pos.y-75)*Math.cos(theta)));
        }
        if (pos.x > 135) {	//Left correction
			this.parts[0].ctrForce(new b2Vec2(-this.thrustMod*(pos.x-135)*Math.cos(theta),-this.thrustMod*(pos.x-135)*Math.sin(theta)));
        }
        if (pos.x < 5) {	//Right correction
			this.parts[0].ctrForce(new b2Vec2(this.thrustMod*(5-pos.x)*Math.cos(theta),this.thrustMod*(5-pos.x)*Math.sin(theta)));
        }
		theta = this.parts[0].body.GetAngle();
		if (38 in keysDown || 87 in keysDown) {	//Up
			this.parts[0].ctrForce(new b2Vec2(-this.thrustMod*-Math.sin(theta),-this.thrustMod*Math.cos(theta)));
        }
        if (40 in keysDown || 83 in keysDown) {	//Down
			this.parts[0].ctrForce(new b2Vec2(this.thrustMod*-Math.sin(theta),this.thrustMod*Math.cos(theta)));
        }
        if (37 in keysDown || 65 in keysDown) {	//Left
			this.parts[0].ctrForce(new b2Vec2(-this.thrustMod*Math.cos(theta),-this.thrustMod*Math.sin(theta)));
        }
        if (39 in keysDown || 68 in keysDown) {	//Right
			this.parts[0].ctrForce(new b2Vec2(this.thrustMod*Math.cos(theta),this.thrustMod*Math.sin(theta)));
        }
        if (32 in keysDown) {
        	//TODO: Space bar action
        }
	},
	
	draw : function() {	//draws the player character
		var cor;
		theContext.strokeStyle = "#000000";
		for(i = 0; i < pvers.length; i++){
			theContext.beginPath();
			cor = coordTrans(pvers[i][0].x*5,pvers[i][0].y*5,this.parts[0].body.GetPosition().x,this.parts[0].body.GetPosition().y,this.parts[0].body.GetAngle());
			theContext.moveTo(cor[0]*10,cor[1]*10);
			for(j = 1; j < pvers[i].length; j++){
				cor = coordTrans(pvers[i][j].x*5,pvers[i][j].y*5,this.parts[0].body.GetPosition().x,this.parts[0].body.GetPosition().y,this.parts[0].body.GetAngle());
				theContext.lineTo(cor[0]*10,cor[1]*10);
			}
			theContext.closePath();
			theContext.stroke();
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
