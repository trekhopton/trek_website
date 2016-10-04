var backSketch = function(b){

  var tone0;
  var tone1;
  var tone2;
  var tone3;

  var trees = [];

  var treesPerRow = 20;

  b.setup = function() {
    var backCanvas = b.createCanvas(window.innerWidth, window.innerHeight);
    b.strokeWeight(1);
    b.frameRate(1);
    b.randomSeed(0528);

    tone0 = b.color(b.round(b.random(0, 50)));
    tone1 = b.color(b.round(b.random(60, 150)));
    tone2 = b.color(b.round(b.random(160, 200)));
    tone3 = b.color(b.round(b.random(205, 255)));

    for(var i = 0; i < treesPerRow; i++){
      trees[i] = new tree(i*b.width/treesPerRow,b.height*0.9,100,tone1);
    }

  }

  b.draw = function() {
    b.background(200);
    for(var i = 0; i < trees.length; i++){
      trees[i].display();
    }
  }

  function tree(posx, posy, trunkLength, color){

    var baseAngle = b.randomGaussian(b.PI, b.PI/16);
    var branchCont1 = new branch(trunkLength, 0);

    this.display = function(){
      //go to position
      b.translate(posx, posy);
      b.stroke(color);

      // trunk
      b.push();
        b.rotate(baseAngle);
        b.line(0,0,0,trunkLength);
        b.translate(0,trunkLength);
        branchCont1.display();
      b.pop();

      b.translate(-posx, -posy);
    }
  }


  // recursive branches
  function branch(baseLength,segNo){

    // weighting of how often splits should happen
    var splits = [1,1,1,2,2,2,2,3,3,4];
    var split = splits[b.round(b.random(0,9))];

    // base case
    if(segNo >= 4 || split == 0){
      this.display = function(){}
      return;
    }
    segNo++;

    //branch continued
    var length = baseLength*b.random(0.95, 0.99);
    var angle = b.randomGaussian(0,b.PI/12);
    var branchCont = new branch(length*b.random(0.7, 0.9), segNo);
    // branch/es split off
    var branches = [];
    var angles = [];
    var lengths = [];
    for(var i = 0; i < split-1; i++){
      lengths[i] = baseLength*b.random(0.8, 0.9);
      angles[i] = b.random(-b.PI/3, b.PI/3);
      branches.push(new branch(lengths[i]*b.random(0.5, 0.9), segNo));
    }
    this.display = function(){

      // branch continued
      b.push();
        b.rotate(angle);
        b.line(0,0,0,length);
        b.translate(0,length);
        branchCont.display();
      b.pop();
      // branch/es split off
      for(var i = 0; i < split-1; i++){
        b.push();
          b.rotate(angles[i]);
          b.line(0,0,0,lengths[i]);
          b.translate(0,lengths[i]);
          branches[i].display();
        b.pop();
      }
    }
  }

  b.windowResized = function(){
    b.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
var back_p5 = new p5(backSketch);
