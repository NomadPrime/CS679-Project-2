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
	"maxHealth" : 500,	//maximum health
	"health" : 0,	//health
	"shield" : null,	//holds "forcefield", also what holds enemy together
	"parts" : null,	//parts comprising enemy, parts[0] position used as enemy center
	"joints" : null,	//joints holding enemy together
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
		this.shield = makeObject(enemyShieldType, x, y, 0, this.size * 0.65);
		this.shield.data = this;
		for(i = 0; i < evers.length; i++) {
			this.parts.push(makeObject(enemyType, x, y, 0, evers[i]));
			objectList.push(this.parts[i]);
			jdef.Initialize(this.shield.body, this.parts[i].body, this.shield.body.GetWorldCenter());
			jdef.collideConnected = false;
			this.joints.push(world.CreateJoint(jdef));
		}
		this.shield.body.SetLinearVelocity(new b2Vec2(50*Math.cos(Math.random()*2*Math.PI),50*Math.sin(Math.random()*2*Math.PI)));
	},
	
	action : function() {
        if (this.health <= 0 && !this.remove) {this.die();}
        if (!this.remove) {
        	this.shield.body.ApplyTorque((-this.shield.body.GetAngle()*20-this.shield.body.GetAngularVelocity())*100000);	//corrects angle
        	var pos = this.shield.body.GetPosition();
			var theta = this.shield.body.GetAngle();
			var ybounds = container.offsetHeight / (2 * scale);
			var xbounds = container.offsetWidth / (2 * scale);
			var ybuffer = ybounds - 2;
			var xbuffer = xbounds - 2;
			this.shield.mesh.position.x = this.shield.body.GetPosition().x;
			this.shield.mesh.position.y = this.shield.body.GetPosition().y;
			this.shield.shader.uniforms.strength.value = this.shield.timer / 30.0;
			var dx = Player.shield.body.GetPosition().x - this.shield.body.GetPosition().x;
			var dy = Player.shield.body.GetPosition().y - this.shield.body.GetPosition().y;
			var mag = Math.sqrt(dx*dx+dy*dy);
			this.shield.ctrForce(new b2Vec2(dx*1000/mag,dy*1000/mag));
			if(this.shield.timer > 0) {
				this.shield.timer--;
			}
        	if (pos.y < -ybuffer) {	//Up correction
        		this.shield.ctrForce(new b2Vec2(this.thrustMod*(-ybuffer-pos.y)*-Math.sin(theta),this.thrustMod*(-ybuffer-pos.y)*Math.cos(theta)));
        		if(pos.y < -ybounds) {this.shield.body.SetLinearVelocity(new b2Vec2(this.shield.body.GetLinearVelocity().x,5));}
        	}
        	if (pos.y > ybuffer) {	//Down correction
				this.shield.ctrForce(new b2Vec2(-this.thrustMod*(pos.y-ybuffer)*-Math.sin(theta),-this.thrustMod*(pos.y-ybuffer)*Math.cos(theta)));
        		if(pos.y > ybounds) {this.shield.body.SetLinearVelocity(new b2Vec2(this.shield.body.GetLinearVelocity().x,-5));}
    	    }
    	    if (pos.x > xbuffer) {	//Left correction
				this.shield.ctrForce(new b2Vec2(-this.thrustMod*(pos.x-xbuffer)*Math.cos(theta),-this.thrustMod*(pos.x-xbuffer)*Math.sin(theta)));
        		if(pos.x > xbounds) {this.shield.body.SetLinearVelocity(new b2Vec2(-5,this.shield.body.GetLinearVelocity().y));}
    	    }
    	    if (pos.x < -xbuffer) {	//Right correction
				this.shield.ctrForce(new b2Vec2(this.thrustMod*(-xbuffer-pos.x)*Math.cos(theta),this.thrustMod*(-xbuffer-pos.x)*Math.sin(theta)));
        		if(pos.x < -xbounds) {this.shield.body.SetLinearVelocity(new b2Vec2(5,this.shield.body.GetLinearVelocity().y));}
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
		scene.remove(this.shield.mesh);
		var temp;
		this.shield = null;
		this.remove = true;
		for(i = 0; i < this.parts.length; i++){
			this.parts[i].indepObject = true;
			temp = evers[i][0].Copy();
			temp.Add(evers[i][1]);
			temp.Add(evers[i][2]);
			temp.Add(evers[i][3]);
			temp.Multiply((Math.random())*this.parts[i].body.GetMass());
			this.parts[i].ctrForce(temp);
		}
		this.parts = [];
		purgeFlag = true;
		
		//this.init(Math.random()*50, Math.random()*150);
	}
};
function spawn() {
	Empty = function() {};
	Empty.prototype = anEnemy;
	en = new Empty();
	//en.init((Math.random()-0.5)*150, (Math.random()-0.5)*50);
	en.health = en.maxHealth;	//set health to maximum
	var x = (Math.random()-0.5)*150;
	var y = (Math.random()-0.5)*50;
		if(!sizeup) {
		for(i = 0; i < evers.length; i++) {	//scales vertex coordinates to size of object
			for(j = 0; j < evers[i].length; j++) {
				evers[i][j].Multiply(en.size);
			}
		}
		sizeup = true;
		}
		en.shield = makeObject(enemyShieldType, x, y, 0, en.size * 0.65);
		en.shield.data = en;
		en.parts = [];
		en.joints = [];
		for(i = 0; i < evers.length; i++) {
			en.parts.push(makeObject(enemyType, x, y, 0, evers[i]));
			objectList.push(en.parts[i]);
			jdef.Initialize(en.shield.body, en.parts[i].body, en.shield.body.GetWorldCenter());
			jdef.collideConnected = false;
			en.joints.push(world.CreateJoint(jdef));
		}
		en.shield.body.SetLinearVelocity(new b2Vec2(5*Math.cos(Math.random()*2*Math.PI),5*Math.sin(Math.random()*2*Math.PI)));
	//enemyList.push(en);
	return en;
}
