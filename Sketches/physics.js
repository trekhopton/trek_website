var physicsSketch = function(p){

function Spring(x,y) {
  // At first it doesn't exist
    this.mouseJoint = null;

  // If it exists we set its target to the mouse location
  this.update = function(x, y) {
    if (this.mouseJoint != null) {
      // Always convert to world coordinates!
      var mouseWorld = scaleToWorld(x,y);
      this.mouseJoint.SetTarget(mouseWorld);
    }
  }

  this.display = function() {
    if (this.mouseJoint != null) {

      var posA = this.mouseJoint.GetAnchorA();
      var posB = this.mouseJoint.GetAnchorB();

      // We can get the two anchor points
      var v1 = scaleToPixels(posA.x, posA.y);
      var v2 = scaleToPixels(posB.x, posB.y);
      // And just draw a line
	    p.stroke(200);
      p.line(v1.x,v1.y,v2.x,v2.y);
    }
  }

  this.bind = function(x,y,box) {
    // Define the joint
    var md = new box2d.b2MouseJointDef();
    // Body A is just a fake ground body for simplicity (there isn't anything at the mouse)
    md.bodyA = world.CreateBody(new box2d.b2BodyDef()); //world.GetGroundBody();
    // Body 2 is the box's boxy
    md.bodyB = box.body;
    // Get the mouse location in world coordinates
    var mp = scaleToWorld(x,y);
    // And that's the target
    //println(mp.x + " " + mp.y);
    md.target = mp;
    //println(md.target.x + " " + md.target.y);

    // Some stuff about how strong and bouncy the spring should be
    md.maxForce = 400.0 * box.body.m_mass;
    md.frequencyHz = 5;
    md.dampingRatio = 0.5;

    // Make the joint!
    this.mouseJoint = world.CreateJoint(md);
  }

  this.destroy = function() {
    // We can get rid of the joint when the mouse is released
    if (this.mouseJoint != null) {
      world.DestroyJoint(this.mouseJoint);
      this.mouseJoint = null;
    }
  }
}

function Rope (x,y,segCount,sw,sh) {

	this.segments = [];
	var joints = [];

	var jointCount = segCount -1;

	this.w = sw;
	this.h = sh;

	var bd = new box2d.b2BodyDef();
	bd.type = box2d.b2BodyType.b2_dynamicBody;

	var fd = new box2d.b2FixtureDef();

	fd.shape = new box2d.b2PolygonShape();
	fd.shape.SetAsBox(scaleToWorld(this.w/2), scaleToWorld(this.h/2));

	fd.density = 1;
	fd.friction = 1;
	fd.restitution = 1;

	for (var i = 0; i < segCount; i++){
    bd.position = scaleToWorld(x,y+i*this.h);
		this.segments[i] = world.CreateBody(bd);
		this.segments[i].CreateFixture(fd);
	}

	var jd = new box2d.b2RevoluteJointDef();
	jd.localAnchorA.y = scaleToWorld(-this.h/2);
	jd.localAnchorB.y = scaleToWorld(this.h/2);

	for(var i = 0; i < jointCount; i++){
		jd.bodyA = this.segments[i];
		jd.bodyB = this.segments[i+1];
		joints[i] = world.CreateJoint(jd);
	}

	this.display = function() {
		p.fill(0);
		p.noStroke();

		var leftPoints = [];
		var rightPoints = [];

		for(var i = 0; i < this.segments.length; i++){
			var pos = scaleToPixels(this.segments[i].GetPosition());
			var a = this.segments[i].GetAngleRadians();
			p.push();
			p.translate(pos.x,pos.y);
			p.rotate(a);
      p.rect(0,0,this.w,this.h);
			leftPoints.push(new p5.Vector(pos.x-this.w*0.5,pos.y+this.h*0.5));
			rightPoints.push(new p5.Vector(pos.x+this.w*0.5,pos.y+this.h*0.5));
			p.pop();
		}

    // non rect ropes

		// p.beginShape();
		// for(var i = 0; i < leftPoints.length; i++){
		// 	p.vertex(leftPoints[i].x, leftPoints[i].y);
		// }
		// for(var i = rightPoints.length; i > 0; i--){
		// 	p.vertex(rightPoints[i-1].x, rightPoints[i-1].y);
		// }
		// p.endShape();
	}
}

function Invisibox(){

  var bd = new box2d.b2BodyDef();
  bd.type = box2d.b2BodyType.b2_staticBody;
  bd.position = scaleToWorld(0,0);
  this.body = world.CreateBody(bd);
}

function Bobble(x,y,bColor){
  this.bRope = new Rope(x,y,p.round(p.random(8,14)),4,10);
  var dim = p.round(p.random(38,50));
	this.bBox = new Box(x,y+100,dim,dim,bColor);

  // this.bRope = new Rope(x,y,10,4,10);
  // this.bBox = new Box(x,y+100,32,32,bColor);

  this.display = function(){
    this.bBox.display();
    this.bRope.display();
  }

	var jd = new box2d.b2RevoluteJointDef();
  var ropeToBox;
  var ropeToWall;

  jd.localAnchorA.y = scaleToWorld(this.bRope.h/2);
  jd.localAnchorB.x = scaleToWorld(x);
  jd.localAnchorB.y = scaleToWorld(y);
	jd.bodyA = this.bRope.segments[0];
	jd.bodyB = invisibox.body;
	ropeToWall = world.CreateJoint(jd);

	jd.localAnchorA.y = scaleToWorld(-this.bRope.h/2);
  jd.localAnchorB.x = scaleToWorld(0);
	jd.localAnchorB.y = scaleToWorld(this.bBox.h/2);
	jd.bodyA = this.bRope.segments[this.bRope.segments.length-1];
	jd.bodyB = this.bBox.body;
	ropeToBox = world.CreateJoint(jd);
}

function Box(x, y, w_, h_,boxColour) {

	this.w = w_;
	this.h = h_;

	// Define a body
	var bd = new box2d.b2BodyDef();
	bd.type = box2d.b2BodyType.b2_dynamicBody;
	bd.position = scaleToWorld(x,y);

	// Define a fixture
	var fd = new box2d.b2FixtureDef();
	// Fixture holds shape
	fd.shape = new box2d.b2PolygonShape();
	fd.shape.SetAsBox(scaleToWorld(this.w/2), scaleToWorld(this.h/2));

	// Some physics
	fd.density = 0.1;
	fd.friction = 0.1;
	fd.restitution = 0.2;

	// Create the body
	this.body = world.CreateBody(bd);
	// Attach the fixture
	this.body.CreateFixture(fd);

	this.contains = function(x,y) {
		var worldPoint = scaleToWorld(x, y);
		var f = this.body.GetFixtureList();
		var inside = f.TestPoint(worldPoint);
		return inside;
	}

	this.display = function() {
		// Get the body's position
		var pos = scaleToPixels(this.body.GetPosition());
		// Get its angle of rotation
		var a = this.body.GetAngleRadians();

		// Draw it!
		p.noStroke();
		p.rectMode(p.CENTER);
		p.push();
		p.translate(pos.x,pos.y);
		p.rotate(a);
		p.fill(boxColour);
		p.rect(0, 0, this.w, this.h);
		p.pop();
	}
}

function Boundary(x_,y_,w_,h_) {

	this.x = x_;
	this.y = y_;
	this.w = w_;
	this.h = h_;

	var fd = new box2d.b2FixtureDef();
	fd.density = 1.0;
	fd.friction = 0.5;
	fd.restitution = 0.2;

	var bd = new box2d.b2BodyDef();

	bd.type = box2d.b2BodyType.b2_staticBody;
	bd.position.x = scaleToWorld(this.x);
	bd.position.y = scaleToWorld(this.y);
	fd.shape = new box2d.b2PolygonShape();
	fd.shape.SetAsBox(this.w/(scaleFactor*2), this.h/(scaleFactor*2));
	this.body = world.CreateBody(bd).CreateFixture(fd);

	this.display = function() {
	p.noStroke();
	p.rectMode(p.CENTER);
	p.rect(this.x,this.y,this.w,this.h);
	}
}

var boundaries = [];
var world;
var bobbles = [];

function createBobbles(){
  var spacing = 50;
  var color1 = p.color(0);
  var color2 = p.color(150);

  bobbles[0] = new Bobble(p.width/2-2*spacing,20,color1);
  bobbles[1] = new Bobble(p.width/2-spacing,20,color1);
  bobbles[2] = new Bobble(p.width/2,20,color1);
  bobbles[3] = new Bobble(p.width/2+spacing,20,color1);
  bobbles[4] = new Bobble(p.width/2+2*spacing,20,color1);
}

var mSpring;
var invisibox;
var box1;
var cataCanvas
//setup
p.setup = function() {
	cataCanvas = p.createCanvas(window.innerWidth,window.innerHeight);
	world = createWorld();
  p.randomSeed(214563);
  boundaries[0] = new Boundary(p.width/2,p.height,p.width,0);
  boundaries[1] = new Boundary(p.width/2,0,p.width,0);
  boundaries[2] = new Boundary(p.width,p.height/2,0,p.height);
  boundaries[3] = new Boundary(0,p.height/2,0,p.height);
  invisibox = new Invisibox();
  createBobbles();
  box1 = new Box(p.width/2,p.height/2,p.width/20,p.width/20,p.color(20,200,255));
	mSpring = new Spring();
}
//draw
p.draw = function(){
  p.clear();
  var timeStep = 1/40;
  world.Step(timeStep,25,25);
  mSpring.update(p.mouseX,p.mouseY);
  for (var i = 0; i < boundaries.length; i++) {
    boundaries[i].display();
  }
  for (var i = 0; i < bobbles.length; i++) {
    bobbles[i].display();
  }
  box1.display();
  mSpring.display();
}

p.mouseReleased = function() {
  mSpring.destroy();
}

p.mousePressed = function() {
  for (var i = 0; i < bobbles.length; i++) {
		if (bobbles[i].bBox.contains(p.mouseX, p.mouseY)) {
			mSpring.bind(p.mouseX,p.mouseY,bobbles[i].bBox);
		}
  }
  if(box1.contains(p.mouseX, p.mouseY)){
    mSpring.bind(p.mouseX,p.mouseY,box1);
  }
}
p.windowResized = function(){
  cataCanvas.position(window.innerWidth/2-p.width/2,0);
}

}
var physics_p5 = new p5(physicsSketch);
