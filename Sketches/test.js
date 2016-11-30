var testSketch = function(test){

//setup
test.setup = function() {

	var testCanvas = test.createCanvas(window.innerWidth,window.innerHeight);

}
//draw
var period = 0;
test.draw = function(){

	test.clear();

	var posY = test.sin(period)*100;
	period += test.PI/20;
	test.ellipse(0,posY,200,200);

}


}
var test_p5 = new p5(testSketch);
