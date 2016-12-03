var testSketch = function(test){

var graphics;

//setup
test.setup = function() {
	var testCanvas = test.createCanvas(window.innerWidth,window.innerHeight);
		length = 1000;
		graphics = test.createGraphics(test.width/2, test.height/2);
		graphics.translate(length, length);
		graphics.ellipse(0, 0, 100, 100);
		graphics.translate(length, length);
		graphics.ellipse(0, 0, 100, 100);
}
//draw
test.draw = function(){

	test.clear();

	test.image(graphics, 0, 0);

}


}
var test_p5 = new p5(testSketch);
