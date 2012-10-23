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
var b2ContactListener = Box2D.Dynamics.b2ContactListener;

//------------------------------//
//	Global Variables			//
//------------------------------//
var frameRate = 60;	//the FPS of the game
var mousex = 0;	//x-coordinate of mouse
var mousey = 0;	//y-coordinate of mouse
var ddensity = 1000;	//default density
var dfriction = 0.5;	//default friction
var drestitution = 0.01;	//default restitution
var worldSpeed = -10;	//speed of "static" objects in the world
var purgeFlag = false;	//flags for a purge routine
//TODO: IMPLEMENT THIS SHIT
var scale = 10;	//scale between drawing and physics engine
var sideBuffer = 50;	//buffer on top/bottom before delete border
var backBuffer = 50;	//buffer in back before delete border
var frontBuffer = 400;	//buffer in front before delete border
//TODO: END OF IMPLEMENT NEEDED STUFF
var damageThreshold = 50;	//number of N of force needed to do damage (damage calculated in N after this point)
var theCanvas;	//canvas on webpage
var theContext;	//canvas 2D context
var world;	//physics engine world
var bdef;// = new b2BodyDef;
var fdef;// = new b2FixtureDef;
var jdef;// = new b2WeldJointDef;
var lowxBound = -20;	//low x-axis boundary
var highxBound = 500;	//high x-axis boundary
var lowyBound = -20;	//low y-axis boundary
var highyBound = 160;	//high y-axis boundary

var objectList = [];	//list of free objects
var enemyList = [];		//list of enemies
var stuffList = [];		//list of misc stuff
var keysDown = {};	//holds all keys currently pressed