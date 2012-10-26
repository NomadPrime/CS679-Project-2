var enemyType = 2945;	//signifies parts
var enemyShieldType = 3825	//used for ring
var evers = [	//vertices of all bodies of enemy
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
var sizeup = false;

var anEnemy = {
	"size" : 3.5,	//controls size
	"thrustMod" : 10000,	//maximum thrust force in any direction
	"maxHealth" : 50,	//maximum health
	"health" : 0,	//health
	"shield" : null,	//holds "forcefield", also what holds enemy together
	"parts" : [],	//parts comprising enemy, parts[0] position used as enemy center
	"joints" : [],	//joints holding enemy together
	"remove" : false,
	
	init : function(x,y) {	//initializes the enemy at starting point
		
		this.health = this.maxHealth;	//set health to maximum
		if(!sizeup) {
		for(i = 0; i < evers.length; i++) {	//scales vertex coordinates to size of object
			for(j = 0; j < evers[i].length; j++) {
				evers[i][j].Multiply(this.size);
			}
		}
		sizeup = true;
		}
		x = Math.random() * 20;
		y = Math.random() * 20;
		this.shield = makeObject(enemyShieldType, x, y, 0, this.size * 0.65);
		this.shield.data = this;
		for(i = 0; i < evers.length; i++) {
			this.parts.push(makeObject(enemyType, x, y, 0, evers[i]));
			objectList.push(this.parts[i]);
			jdef.Initialize(this.shield.body, this.parts[i].body, this.shield.body.GetWorldCenter());
			jdef.collideConnected = false;
			this.joints.push(world.CreateJoint(jdef));
		}
		this.shield.body.SetLinearVelocity(new b2Vec2((Math.random()-0.5)*50,(Math.random()-0.5)*50));
	},
	
	action : function() {
        if (this.health <= 0 && !this.remove) {this.die();}
        if (!this.remove) {
			theta = this.parts[0].body.GetAngle();
        	this.shield.body.ApplyTorque((-this.shield.body.GetAngle()*20-this.shield.body.GetAngularVelocity())*100000);	//corrects angle
        	pos = this.shield.body.GetPosition();
        	if (pos.y < 5) {	//Up correction
        		this.shield.ctrForce(new b2Vec2(this.thrustMod*(5-pos.y)*-Math.sin(theta),this.thrustMod*(5-pos.y)*Math.cos(theta)));
        		//if(pos.y < 0) {this.shield.body.SetLinearVelocity(new b2Vec2(this.shield.body.GetLinearVelocity().x,5));}
        	}
        	if (pos.y > 45) {	//Down correction
				this.shield.ctrForce(new b2Vec2(-this.thrustMod*(pos.y-45)*-Math.sin(theta),-this.thrustMod*(pos.y-45)*Math.cos(theta)));
        		//if(pos.y > 50) {this.shield.body.SetLinearVelocity(new b2Vec2(this.shield.body.GetLinearVelocity().x,-5));}
    	    }
    	    if (pos.x > 145) {	//Left correction
				this.shield.ctrForce(new b2Vec2(-this.thrustMod*(pos.x-145)*Math.cos(theta),-this.thrustMod*(pos.x-145)*Math.sin(theta)));
        		//if(pos.x > 150) {this.shield.body.SetLinearVelocity(new b2Vec2(-5,this.shield.body.GetLinearVelocity().y));}
    	    }
    	    if (pos.x < 5) {	//Right correction
				this.shield.ctrForce(new b2Vec2(this.thrustMod*(5-pos.x)*Math.cos(theta),this.thrustMod*(5-pos.x)*Math.sin(theta)));
        		//if(pos.x < 0) {this.shield.body.SetLinearVelocity(new b2Vec2(5,this.shield.body.GetLinearVelocity().y));}
    	    }
		}
	},
	
	draw : function() {	//draws the enemy
		if(!this.remove){
		var cor;
		theContext.strokeStyle = "#FF0000";
		theContext.fillStyle = "#FF0000";
		for(i = 0; i < evers.length; i++){
			theContext.beginPath();
			cor = coordTrans(evers[i][0].x,evers[i][0].y,this.parts[0].body.GetPosition().x,this.parts[0].body.GetPosition().y,this.parts[0].body.GetAngle());
			theContext.moveTo(cor[0]*scale,cor[1]*scale);
			for(j = 1; j < evers[i].length; j++){
				cor = coordTrans(evers[i][j].x,evers[i][j].y,this.parts[0].body.GetPosition().x,this.parts[0].body.GetPosition().y,this.parts[0].body.GetAngle());
				theContext.lineTo(cor[0]*10,cor[1]*10);
			}
			theContext.closePath();
			theContext.stroke();
			theContext.fill();
		}
		}
	},
	
	die : function() {
		this.shield.body.DestroyFixture(this.shield.fixture);
		world.DestroyBody(this.shield.body);
		var temp;
		this.shield = null;
		//this.remove = true;
		for(i = 0; i < this.parts.length; i++){
			temp = evers[i][0].Copy();
			temp.Add(evers[i][1]);
			temp.Add(evers[i][2]);
			temp.Add(evers[i][3]);
			temp.Multiply((Math.random())*this.parts[i].body.GetMass());
			this.parts[i].ctrForce(temp);
		}
		this.parts = [];
		this.init(Math.random()*50, Math.random()*150);
	}
};
function spawn() {
	Empty = function() {};
	Empty.prototype = anEnemy;
	en = new Empty();
	en.init(Math.random()*150, Math.random()*50);
	enemyList.push(en);
}
