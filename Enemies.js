//This file will hold code for the enemies.
//

var enemyType = 1482;

function makeEnemy(x, y, theta, dims){
	enemy = makeObject(enemyType, x, y, theta, dims);

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
	enemyFdef.shape = new b2PolygonShape;
	enemyFdef.shape.SetAsBox(20, 20);
	enemyFdef.fixture = enemy.body.CreateFixture(enemyFdef);
	
	return enemy
}

