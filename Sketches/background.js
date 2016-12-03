var backSketch = function(b){

  //
  //notes
  //
  //mouse moves trees
  //maybe shapes instead of lines
  //ripples?

  var trees = [];
  var treeCount;
  var bgColor;

  var bgHue;
  var bgSat;
  var bgBright;

  var wHue;
  var wSat;
  var wBright;

  var myWind = new wind();

  b.setup = function() {
    var backCanvas = b.createCanvas(window.innerWidth, window.innerHeight);
    b.frameRate(60);
    b.randomSeed(92487);
    //b.blendMode(b.MULTIPLY );
    b.colorMode(b.HSB);
    //background color
    bgHue = 0;
    bgSat = 0;
    bgBright = 100;
    bgColor = b.color(bgHue, bgSat, bgBright);
    //water color
    wHue = 200;
    wSat = 70;
    wBright = 50;
    wColor = b.color(wHue, wSat, wBright);
    //initialising trees
    treeCount = 100;
    for(var i = 0; i < treeCount; i++){
      var minDist = b.height*0.4;
      var maxDist = b.height*1.3;
      // use this for uniform x pos
      //var iTreePosX = b.random(-b.width/10, b.width);
      var iTreePosX = b.random(-b.width/10, b.width) * b.map(i, 0, treeCount, 1, 0.3);
      var iTreePosY = b.map(i, 0, treeCount, minDist, maxDist);
      var lengthMin = 20;
      var lengthMax = 200;
      var iTreeLength = b.random(lengthMin, lengthMax);
      var iTreeGirth = b.map(iTreeLength, lengthMin, lengthMax, 1, 8);
      var iTreeColor = b.color(150, b.map(iTreePosY, minDist, maxDist, 0, 70), b.map(iTreePosY, minDist, maxDist, bgBright, 0));
      trees[i] = new tree(iTreePosX, iTreePosY, iTreeLength, iTreeGirth, iTreeColor);
    }

  }

  b.draw = function() {
    // console.log(b.frameRate());
    b.clear();
    b.background(bgColor);

    for(var i = 0; i < trees.length; i++){
      trees[i].displayReflection();
    }
    //water gradient
    for(var i = 0; i < b.height; i++) {
      var step = b.map(i, 0, b.height, 0, 1);
      var iColor = b.color(b.lerp(bgHue, wHue, step), b.lerp(bgSat, wSat, step), b.lerp(bgBright, bgBright, step), 0.4);
      b.stroke(iColor);
      b.line(0, i, b.width, i);
    }

    for(var i = 0; i < trees.length; i++){
      trees[i].display();
    }

  }

  function tree(posx, posy, trunkLength, trunkGirth, color){

    var baseAngle = b.random(b.PI, b.PI+b.PI/16);
    var branchCont1 = new branch(trunkLength, trunkGirth, 0);

    // init the graphic for this tree
    var graphicWidth = 400;
    var graphicHeight = 1000;
    var graphic = b.createGraphics(graphicWidth, graphicHeight);

    //move over a little on the graphic
    graphic.translate(trunkGirth, graphicHeight-trunkGirth);
    //set color
    graphic.stroke(color);
    // trunk
    graphic.push();
      graphic.rotate(baseAngle);
      graphic.strokeWeight(trunkGirth);
      graphic.line(0,0,0,trunkLength);
      graphic.translate(0,trunkLength);
      branchCont1.render();
    graphic.pop();

    graphic.translate(trunkGirth, 0);

    // recursive branches
    function branch(baseLength, baseGirth, segNo){
      // weighting of how often splits should happen
      var splits = [1,1,1,2,2,2,2,3,3,4];
      var split = splits[b.round(b.random(0,9))];

      // base case
      // if the number of segments in a branch is more than the max
      // or if there are 0 splits made
      var maxBranchSeg = 7;
      if(segNo >= maxBranchSeg || split == 0){
        this.render = function(){}
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

      // branch display / view
      this.render = function(){
        // branch continued
        graphic.push();
          graphic.rotate(angle);
          graphic.strokeWeight(girth);
          graphic.line(0,0,0,length);
          graphic.translate(0,length);
          branchCont.render();
        graphic.pop();
        // branch/es split off
        for(var i = 0; i < split-1; i++){
          graphic.push();
            graphic.rotate(angles[i]);
            graphic.strokeWeight(girth);
            graphic.line(0,0,0,lengths[i]);
            graphic.translate(0,lengths[i]);
            branches[i].render();
          graphic.pop();
        }
      }
    }
    //branch end

    this.display = function(){
      // wind
      myWind.update(posx);
      //reeds
      b.push();
      b.translate(posx, posy);
      b.rotate(-myWind.wind);
      b.translate(trunkGirth, -graphicHeight+trunkGirth);
      b.image(graphic, 0, 0);
      b.pop();
    }

    this.displayReflection = function(){
      // wind
      myWind.update(posx);
      //reflection
      b.push();
      b.translate(posx, posy);
      b.rotate(b.PI+myWind.wind);
      b.translate(-trunkGirth, -graphicHeight+trunkGirth);
      b.scale(-1, 1);
      b.image(graphic, 0, 0);
      b.pop();
    }
  }

  function wind(){

    var period = 0;
    var phase = 0;
    var amp = 0.04;
    this.wind;

    this.update = function(posx){
      phase = posx/800;
      period += b.PI/30000; // should make this loop
      this.wind = b.sin(period-phase)*amp;
    }
  }

  b.windowResized = function(){
    b.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
var back_p5 = new p5(backSketch);
