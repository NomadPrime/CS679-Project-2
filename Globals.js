//------------------------------//
//	Box2D Shortcuts				//
//------------------------------//
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2AABB = Box2D.Collision.b2AABB;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint;
var b2WeldJointDef =  Box2D.Dynamics.Joints.b2WeldJointDef;

//------------------------------//
//	Global Variables			//
//------------------------------//
var frameRate = 50;	//the FPS of the game
var theCanvas;	//canvas on webpage
var theContext;	//canvas 2D context
var world;	//physics engine world
var mousex = 0;	//x-coordinate of mouse
var mousey = 0;	//y-coordinate of mouse
var bdef;// = new b2BodyDef;
var fdef;// = new b2FixtureDef;
var jdef;// = new b2WeldJointDef;
var ddensity = 1000;	//default density
var dfriction = 0.5;	//default friction
var drestitution = 0.01;	//default restitution
var worldSpeed = -10;	//speed of "static" objects in the world

var objectList = [];	//list of free objects
var enemyList = [];		//list of enemies
var stuffList = [];		//list of misc stuff
