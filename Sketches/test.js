var testSketch = function(test){

//setup
test.setup = function() {

	var testCanvas = test.createCanvas(window.innerWidth,window.innerHeight);
	world = createWorld();



}
//draw
test.draw = function(){
  var timeStep = 1.0/30;
  world.Step(timeStep,10,10);

  test.clear();
}


}
var test_p5 = new p5(testSketch);
