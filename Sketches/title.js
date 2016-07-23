var titleSketch = function(t){

var img;

t.setup = function() {
	var titleCanvas = t.createCanvas(window.innerWidth,window.innerHeight);
	img = t.loadImage("Images/trekosphere2.png");
}

t.draw = function(){
  t.clear();
  // draw title
	t.imageMode(t.CENTER);
  t.image(img,t.width/2,img.height/2);
}

t.windowResized = function(){
	t.resizeCanvas(window.innerWidth,window.innerHeight);
}

}
var title_p5 = new p5(titleSketch);
