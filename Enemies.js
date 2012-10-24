//This file will hold code for the enemies.
//

var enemyType = 1482;
var enemyInitHealth = 1000;
//FIXME
//now enemy only collide with enemies for debug pupose
//needs to change that later
var enemyCollisionMast = 1;

function arrayofnewpolygons(vvv,segment) {
	var ind = new Array();
	var res = new Array();
	for(i=0;i<vvv.length;i++){
				if(vvv[i].flag == 'NEW'){
					ind.push(i);
				}
	}
	console.log(ind);
	for(i=0; i<ind.length; i++){
		if(i<ind.length-1) {
			var temp = new Array();
			temp = vvv.slice(ind[i], ind[i+1] + 1);
			temp.push({x:segment.p1.x, y:segment.p1.y});
			res.push(temp);
		}
		else{
					var temp = new Array();
					var a = ind[ind.length-1];
					var b = ind[0];
					for(j=a;j<vvv.length;j++)
						temp.push(vvv[j]);
					for(j=0;j<=b;j++)
						temp.push(vvv[j]);
					temp.push({x:segment.p1.x, y:segment.p1.y});
					res.push(temp);
					console.log('yes last');
			}
		}
		return res;
}	


function makeEnemy(x, y, theta, dims){
	Empty = function() {};
	Empty.prototype = anObject;
	enemy = new Empty();
	enemy.type = enemyType;
	enemy.dims = dims;
	bdef.type = b2Body.b2_dynamicBody;
	bdef.position.Set(x,y);
	bdef.angle = theta;
	bdef.userData = enemy;
	fdef.shape = new b2PolygonShape;
	fdef.shape.SetAsBox(dims[0]/2,dims[1]/2);
	enemy.body = world.CreateBody(bdef);
	enemy.fixture = enemy.body.CreateFixture(fdef);

	enemy.health = enemyInitHealth;

	enemy.draw = function (){
		//draw enemy
		//FIXME:
		//for now I just copy and pasted craft's draw code
		//need to have its own drawing
		var pos=this.body.GetPosition();
	var pos=this.body.GetPosition();
	var theta=this.body.GetAngle();
	theContext.strokeStyle = "#155555";
	theContext.lineWidth = 10;
	hwidth = this.dims[0] / 2;
	hheight = this.dims[1] / 2;
	theContext.beginPath();
	theContext.moveTo((pos.x+hheight*Math.cos(theta)+hwidth*Math.cos(theta-Math.PI/2))*10,(pos.y+hheight*Math.sin(theta)+hwidth*Math.sin(theta-Math.PI/2))*10);
		theContext.lineTo((pos.x-hheight*Math.cos(theta)+hwidth*Math.cos(theta-Math.PI/2))*10,(pos.y-hheight*Math.sin(theta)+hwidth*Math.sin(theta-Math.PI/2))*10);
		theContext.lineTo((pos.x-hheight*Math.cos(theta)-hwidth*Math.cos(theta-Math.PI/2))*10,(pos.y-hheight*Math.sin(theta)-hwidth*Math.sin(theta-Math.PI/2))*10);
		theContext.lineTo((pos.x+hheight*Math.cos(theta)-hwidth*Math.cos(theta-Math.PI/2))*10,(pos.y+hheight*Math.sin(theta)-hwidth*Math.sin(theta-Math.PI/2))*10);
	theContext.closePath();
	theContext.stroke();
	theContext.fill();
};

	//enemy fixture
	enemyFdef = new b2FixtureDef;
	enemyFdef.density = 1000;
	enemyFdef.friction = 0.5;
	enemyFdef.resitution = 0.2;
	enemyFdef.filter.categoryBits = enemyCollisionBits;
	enemyFdef.filter.maskBits = enemyCollisionMast;
	enemyFdef.shape = new b2PolygonShape;
	enemyFdef.shape.SetAsBox(2, 2);
	enemyFdef.fixture = enemy.body.CreateFixture(enemyFdef);
	

	enemy.action = function(){
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
		
		//check for collision
		console.log(this.health);
		if(this.health <= 0){
			alert("explode!");
			this.explode();
		}
	};
	
	enemy.explode = function(){
		var verticesofenemy = new Array();
		var segment = new b2Segment;
		
		var x = this.body.GetPosition().x;
		var y = this.body.GetPosition().y;
		segment.p1 = new b2Vec2(x, y);
		var body = this.body;
		
		var f2 = new b2FixtureDef();
		for (f2 = body.GetFixtureList(); f2; f2 = f2.GetNext()){
			//FIXME:
			//assign or push?????
			 verticesofenemy = f2.GetShape().GetVertices();
		}
	
		var temp = new Array();
		for(i=0; i< verticesofenemy.length;i++){
			temp.push(body.GetWorldPoint(verticesofenemy[i]));
		}
		verticesofenemy = temp;
		
		var chunks = 15;
		
		var DEGTORAD = (Math.PI/180);
		var stepangle = (360/chunks)*DEGTORAD;
		var angle = 0;
		var rayLength = 25;
		
		var closestFraction = 1;
		
		for(i=0;i<chunks;i++){
			segment.p2 = new b2Vec2(segment.p1.x + rayLength * Math.cos(angle), segment.p1.y + rayLength * Math.sin(angle));
			
			var input = new b2RayCastInput;
			var output = new b2RayCastOutput;
			input.p1 = segment.p2;
			input.p2 = segment.p1;
			input.maxFraction = 1;
			
			var f = new b2FixtureDef();
		    for(f = body.GetFixtureList(); f; f = f.GetNext()) {
			if(!f.RayCast(output, input))
				continue;
			else if(output.fraction < closestFraction)   {
				closestFraction = output.fraction;
			}
		    }
			var intersectionPoint = new b2Vec2();
			var dist = Math.sqrt((segment.p1.x - segment.p2.x)*(segment.p1.x - segment.p2.x) 
				+ (segment.p1.y - segment.p2.y)*(segment.p1.y - segment.p2.y));
			var normalize = new b2Vec2();
			normalize.x = (segment.p2.x - segment.p1.x)/dist;
			normalize.y = (segment.p2.y - segment.p1.y)/dist;
			intersectionPoint.x = segment.p1.x + normalize.x * (1 - closestFraction)*dist;
			intersectionPoint.y = segment.p2.y + normalize.y * (1 - closestFraction)*dist;
			
			verticesofenemy.push({x:intersectionPoint.x, y:intersectionPoint.y, flag:'NEW'});
			angle += stepangle;
			closestFraction = 1;
		}
		
		//SORT
		verticesofenemy = sortme(verticesofenemy, segment);
		
		console.log('=========AFTER SORT=========');
		console.log(verticesofenemy);
		
		//Array of Polygons to be created
		verticesofenemy = arrayofnewpolygons(verticesofenemy, segment);
		console.log(verticesofenemy);
		
		//Convert to Vector
		var tmp = new Array();
		var result = new Array();
		for(i=0; i<verticesofenemy.length;i++){
			tmp = verticesofenemy[i];
			console.log(tmp);
			var tmp2 = new Array();
			for(j=0; j<tmp.length; j++){
				var v = new b2Vec2(tmp[j].x, tmp[j].y);
				tmp2.push(v);
			}
			result.push(tmp2);
		}
		
		console.log(result);
		world.DestroyBody(body);
		var idx = enemyList.indexOf(this);
		if(idx != -1){
			enemyList.splice(idx, 1);
		}
		for(i=0;i<result.length;i++){
			var bd = new b2BodyDef;
			bd.type = b2Body.b2_dynamicBody;
			bd.position.Set(x,y);
			
			var fx = new b2FixtureDef;
			fx.density = 12;
			fx.restitution = .3;
			fx.shape = new b2PolygonShape;
			fx.shape.SetAsArray(result[i]);
			//FIXME
			bd.userData = 'FIXME LATER';
			
			console.log(i);
			
			var newbody = world.CreateBody(bd);
			newbody.CreateFixture(fx);
			
			newobj = makeObject(enemyType, , 0, 0, [1,1]);
			newbody.userData = newobj;
			newobj.body = newbody;
			newbody.ApplyImpulse(new b2Vec2(0,-20), segment.p1);
		}
	};
	
	return enemy
}

//SORT by angle w.r.t segment.p1 postion
function sortme(array, segment)	{
		array.sort(function(a,b)	{
		var aTanA = Math.atan2((a.y - segment.p1.y),(a.x - segment.p1.x));
		var aTanB = Math.atan2((b.y - segment.p1.y),(b.x - segment.p1.x));
		if (aTanA < aTanB) return -1;
		else if (aTanB < aTanA) return 1;
			return 0;
		});
		return array;
}



