var dSketch = function(d){

var period = 0;
var increment = d.PI/100;
var phase1 = d.PI+d.PI/3;
var phase2 = d.PI/2;
var amp = 10;

//setup
d.setup = function() {
	var dCanvas = d.createCanvas(128, 128);
	d.colorMode(d.HSB);
	d.noStroke();
}
//draw
d.draw = function(){

	period += increment;
	d.clear();
	d.background(0);
	for(var i = 0; i < 20; i++){
		d.fill(200+i*10 + d.sin(period+phase1+i*20)*40,i*5, i*15);
		d.ellipse(d.width/2 + d.tan(period-100+i*8)*4 , d.height/2+ d.sin(period+phase1+i)*amp*2, 70 - i*5 + d.sin(period+phase1+i)*amp+i*3, 70 - i*5 + d.sin(period + phase2) * amp);
	}
}


}
var d_p5 = new p5(dSketch);
