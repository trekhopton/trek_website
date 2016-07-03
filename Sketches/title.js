var titleSketch = function(t){

var img;

t.setup = function() {
	var titleCanvas = t.createCanvas(window.innerWidth,window.innerHeight);
	img = t.loadImage("Images/trekosphere2.png");
}

t.draw = function(){
  t.clear();
  // draw title
  t.image(img,t.width/16,t.height/8-img.height/2);
}

}
var title_p5 = new p5(titleSketch);
