var backSketch = function(b){

  var circle1, circle2, circle3, circle4, circle5;

  b.setup = function() {
    var backCanvas = b.createCanvas(window.innerWidth, window.innerHeight);
    b.fill(205,245, 255);
    b.noStroke();
    circle1 = new MCircle(b.random(b.height), b.random(), b.random());
    circle2 = new MCircle(b.random(b.height), b.random(), b.random());
    circle3 = new MCircle(b.random(b.height), b.random(), b.random());
    circle4 = new MCircle(b.random(b.height), b.random(), b.random());
    circle5 = new MCircle(b.random(b.height), b.random(), b.random());
  }

  b.draw = function() {
    b.clear();

    var mouseX_ = b.mouseX + b.width/2;
    var mouseY_ = b.mouseY + b.height/2;

    circle1.move(mouseX_-(b.width/2), mouseY_+(b.height*0.1), 30);
    circle2.move((mouseX_+(b.width*0.05)), mouseY_+(b.height*0.025), 60);
    circle3.move(mouseX_/5, mouseY_/2-(b.width*0.025), 40);
    circle4.move(mouseX_-(b.width/2), (b.height-mouseY_), 50);
    circle5.move(mouseX_/4,mouseY_/9-(b.height*0.035), 140);
    circle1.display();
    circle2.display();
    circle3.display();
    circle4.display();
    circle5.display();
  }

  b.windowResized = function(){
    b.resizeCanvas(window.innerWidth, window.innerHeight);
  }

  function MCircle(iw, ixp, iyp) {
    this.w = iw;
    this.xpos = ixp*b.width;
    this.ypos = iyp*b.height;

    this.move = function(posX, posY, damping) {
      var dif = this.ypos - posY;
      this.ypos -= dif/damping;
      dif = this.xpos - posX;
      this.xpos -= dif/damping;
    }

    this.display = function() {
        b.ellipse(this.xpos, this.ypos, this.w, this.w);
    }
  }
}
var back_p5 = new p5(backSketch);
