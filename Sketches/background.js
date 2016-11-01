var backSketch = function(b){

  //
  //notes
  //
  //angle perlin noise for gentle breeze
  //reflection of trees in water
  //mouse moves trees
  //maybe shapes instead of lines

  var trees = [];

  var bgColor;

  b.setup = function() {
    var backCanvas = b.createCanvas(window.innerWidth, window.innerHeight);
    b.frameRate(10);
    b.randomSeed(5359);
    var bgTone = 200;
    bgColor = b.color(bgTone);
    var treeCount = 180;
    for(var i = 0; i < treeCount; i++){
      var minDist = b.height*0.9;
      var maxDist = b.height*1.4;
      var iTreePosX = b.random(-b.width/10, b.width);
      var iTreePosY = b.map(i, 0, treeCount, minDist, maxDist)-iTreePosX/3;
      var lengthMin = 80;
      var lengthMax = 200;
      var iTreeLength = b.random(lengthMin, lengthMax);
      var iTreeGirth = b.map(iTreeLength, lengthMin, lengthMax, 1, 8);
      var iTreeColor = b.color(b.map(iTreePosY, minDist-iTreePosX/3, maxDist, bgTone, 0));
      trees[i] = new tree(iTreePosX,iTreePosY, iTreeLength, iTreeGirth, iTreeColor);
    }

  }

  b.draw = function() {
    b.background(bgColor);
    for(var i = 0; i < trees.length; i++){
      trees[i].display();
    }
  }

  function tree(posx, posy, trunkLength, trunkGirth, color){

    //var baseAngle = b.randomGaussian(b.PI, b.PI/16);
    var baseAngle = b.random(b.PI, b.PI+b.PI/16);
    var branchCont1 = new branch(trunkLength, trunkGirth, 0);

    this.display = function(){
      //go to position
      b.translate(posx, posy);
      b.stroke(color);

      // trunk
      b.push();
        b.rotate(baseAngle);
        b.strokeWeight(trunkGirth);
        b.line(0,0,0,trunkLength);
        b.translate(0,trunkLength);
        branchCont1.display();
      b.pop();

      b.translate(-posx, -posy);
    }
  }


  // recursive branches
  function branch(baseLength, baseGirth, segNo){

    //model

    // weighting of how often splits should happen
    var splits = [1,1,1,2,2,2,2,3,3,4];
    var split = splits[b.round(b.random(0,9))];

    // base case
    // if the number of segments in a branch is more than the max
    // or if there are 0 splits made
    var maxBranchSeg = 5;
    if(segNo >= maxBranchSeg || split == 0){
      this.display = function(){}
      return;
    }
    segNo++;

    //branch continued
    var length = baseLength*b.random(0.95, 0.99);
    var girth = baseGirth*0.7;
    var angle = b.random(b.PI/16);
    var branchCont = new branch(length*b.random(0.7, 0.9), girth, segNo);
    // branch/es split off
    var branches = [];
    var angles = [];
    var lengths = [];
    for(var i = 0; i < split-1; i++){
      lengths[i] = baseLength*b.random(0.4, 0.5);
      angles[i] = b.random(0, b.PI/3);
      branches.push(new branch(lengths[i]*b.random(0.5, 0.9), girth, segNo));
    }

    //display / view
    this.display = function(){

      // branch continued
      b.push();
        b.rotate(angle);
        b.strokeWeight(girth);
        b.line(0,0,0,length);
        b.translate(0,length);
        branchCont.display();
      b.pop();
      // branch/es split off
      for(var i = 0; i < split-1; i++){
        b.push();
          b.rotate(angles[i]);
          b.strokeWeight(girth);
          b.line(0,0,0,lengths[i]);
          b.translate(0,lengths[i]);
          branches[i].display();
        b.pop();
      }
    }
  }

  function tone(inc){
    var tone;
    switch(inc){
      case 0:
        tone = b.color(b.round(b.random(0, 50)));
        break;
      case 1:
        tone = b.color(b.round(b.random(60, 150)));
        break;
      case 2:
        tone = b.color(b.round(b.random(160, 200)));
        break;
      case 3:
        tone = b.color(b.round(b.random(205, 255)));
        break;
      default:
        tone = b.color(255,100,100);
        break;
    }
    return tone;
  }

  b.windowResized = function(){
    b.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
var back_p5 = new p5(backSketch);
