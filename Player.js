var playerType = 2857;	//signifies player parts

var Player = {
	"thrustMod" : 50,	//maximum thrust force in any direction
	"maxHealth" : 500,	//player maximum health
	"health" : 0,	//player health
	"parts" : [],	//parts comprising player, parts[0] position used as player center
	"joints" : [],	//joints holding player character together
	
	init : function() {	//initializes the player at origin
		this.health = this.maxHealth;	//set health to maximum
		
	},
	
	action : function() {
		
	},
	
	draw : function() {	//draws the player character
		
	}
};
