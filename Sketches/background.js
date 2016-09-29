var backSketch = function(b){

  b.setup = function() {
    var backCanvas = b.createCanvas(window.innerWidth, window.innerHeight);
    b.translate(b.width/2, b.height/1.1);
    b.strokeWeight(1);
    b.frameRate(0.5);
  }

  b.draw = function() {
    b.background(200);
      tree(100);
  }

  function tree(trunkLength){

    var baseAngle = b.randomGaussian(b.PI, b.PI/16);
    // trunk
    b.push();
    b.rotate(baseAngle);
    b.line(0,0,0,trunkLength);
    b.translate(0,trunkLength);
    branch(trunkLength, 0, 1);
    b.pop();
    // recursive branches
    function branch(baseLength,segNo, gen){
      // weighting of how often splits should happen
      var splits = [1,1,1,2,2,2,2,3,3,4];
      var split = splits[b.round(b.random(0,9))];
      // base case
      if(segNo >= 10 || split == 0 || gen >= 5){
        return;
      }
      // branch continued
      var length = baseLength*b.random(0.95, 0.99);
      b.push();
        b.rotate(b.randomGaussian(0,b.PI/12));
        b.line(0,0,0,length);
        b.translate(0,length);
        segNo++;
        branch(length*b.random(0.7, 0.9), segNo, gen);
      b.pop();
      // branche/s split off
      for(var i = 0; i < split-1; i++){
        length = baseLength*b.random(0.8, 0.9);
        b.push();
          b.rotate(b.random(-b.PI/3, b.PI/3));
          b.line(0,0,0,length);
          b.translate(0,length);
          gen++;
          branch(length*b.random(0.5, 0.9), 0, gen);
        b.pop();
      }
    }
  }

  b.windowResized = function(){
    b.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
var back_p5 = new p5(backSketch);
