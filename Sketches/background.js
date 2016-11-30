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

  var myWind = new wind();

  b.setup = function() {
    var backCanvas = b.createCanvas(window.innerWidth, window.innerHeight);
    b.frameRate(24);
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
    console.log(b.frameRate());
    b.background(bgColor);

    // wind
    myWind.update();

    for(var i = 0; i < trees.length; i++){
      // display each tree with the current wind
      trees[i].display(myWind.wind);
    }
  }

  function tree(posx, posy, trunkLength, trunkGirth, color){

    var baseAngle = b.random(b.PI, b.PI-b.PI/16);
    var branchCont1 = new branch(trunkLength, trunkGirth, 0);

    // init the graphic for this tree
    var graphicWidth = 400;
    var graphic = b.createGraphics(graphicWidth, 1000);

    //move over a little on the graphic
    graphic.translate(graphicWidth-trunkGirth, 0);
    //set color
    graphic.stroke(color);
    // trunk
    graphic.push();
      graphic.rotate(-baseAngle);
      graphic.strokeWeight(trunkGirth);
      graphic.line(0,0,0,-trunkLength);
      graphic.translate(0,-trunkLength);
      branchCont1.render();
    graphic.pop();

    graphic.translate(-trunkGirth, 0);

    // recursive branches
    function branch(baseLength, baseGirth, segNo){

      // weighting of how often splits should happen
      var splits = [1,1,1,2,2,2,2,3,3,4];
      var split = splits[b.round(b.random(0,9))];

      // base case
      // if the number of segments in a branch is more than the max
      // or if there are 0 splits made
      var maxBranchSeg = 5;
      if(segNo >= maxBranchSeg || split == 0){
        this.render = function(){}
        return;
      }
      segNo++;

      //branch continued
      var length = baseLength*b.random(0.95, 0.99);
      var girth = baseGirth*0.7;
      var angle = b.random(-b.PI/16);
      var branchCont = new branch(length*b.random(0.7, 0.9), girth, segNo);
      // branch/es split off
      var branches = [];
      var angles = [];
      var lengths = [];
      for(var i = 0; i < split-1; i++){
        lengths[i] = baseLength*b.random(0.4, 0.5);
        angles[i] = b.random(0, -b.PI/3);
        branches.push(new branch(lengths[i]*b.random(0.5, 0.9), girth, segNo));
      }

      // branch display / view
      this.render = function(){
        // branch continued
        graphic.push();
          graphic.rotate(-angle);
          graphic.strokeWeight(girth);
          graphic.line(0,0,0,-length);
          graphic.translate(0,-length);
          branchCont.render();
        graphic.pop();
        // branch/es split off
        for(var i = 0; i < split-1; i++){
          graphic.push();
            graphic.rotate(-angles[i]);
            graphic.strokeWeight(girth);
            graphic.line(0,0,0,-lengths[i]);
            graphic.translate(0,-lengths[i]);
            branches[i].render();
          graphic.pop();
        }
      }
    }
    //branch end

    this.display = function(currentWind){
      b.push();
      b.translate(posx, posy);
      b.rotate(b.PI+currentWind);
      b.translate(-graphicWidth+trunkGirth, 0);
      b.image(graphic, 0, 0);
      b.pop();
    }
  }

  function wind(){

    var period = 0;
    var amp = 0.02;
    this.wind;

    this.update = function(){
      period += b.PI/20;
      this.wind = b.sin(period)*amp;
    }


  }


  b.windowResized = function(){
    b.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
var back_p5 = new p5(backSketch);
