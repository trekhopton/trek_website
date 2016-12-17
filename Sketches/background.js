var backSketch = function(b){

  //
  //notes
  //
  //make trees images instead of canvases

  var trees = [];
  var treeCount;
  // background color
  var bgColor;
  var bgHue;
  var bgSat;
  var bgBright;
  // water graphic and color
  var waterGraphic;
  var wHue;
  var wSat;
  var wBright;

  var myWind = new wind();

  b.setup = function() {
    b.pixelDensity(1);
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
    //water color at base
    wHue = 200;
    wSat = 70;
    wBright = 50;
    wColor = b.color(wHue, wSat, wBright);

    //pre-rendering water gradient
    waterGraphic = b.createGraphics(b.width, b.height);
    waterGraphic.colorMode(waterGraphic.HSB);
    for(var i = 0; i < waterGraphic.height; i++) {
      var step = waterGraphic.map(i, 0, waterGraphic.height, 0, 1);
      var iColor = waterGraphic.color(waterGraphic.lerp(bgHue, wHue, step), waterGraphic.lerp(bgSat, wSat, step), waterGraphic.lerp(bgBright, bgBright, step), 0.4);
      waterGraphic.stroke(iColor);
      waterGraphic.line(0, i, waterGraphic.width, i);
    }

    //initialising trees
    treeCount = 80;
    for(var i = 0; i < treeCount; i++){
      var minDist = b.height*0.4;
      var maxDist = b.height*1.3;
      // use this for uniform x pos
      //var iTreeposX = b.random(-b.width/10, b.width);
      var iTreeposX = b.random(-b.width/10, b.width) * b.map(i, 0, treeCount, 1, 0.3);
      var iTreeposY = b.map(i, 0, treeCount, minDist, maxDist);
      var lengthMin = 20;
      var lengthMax = 200;
      var iTreeLength = b.random(lengthMin, lengthMax);
      var iTreeGirth = b.map(iTreeLength, lengthMin, lengthMax, 1, 8);
      var iTreeColor = b.color(150, b.map(iTreeposY, minDist, maxDist, 0, 70), b.map(iTreeposY, minDist, maxDist, bgBright, 0));
      trees[i] = new tree(iTreeposX, iTreeposY, iTreeLength, iTreeGirth, iTreeColor);
    }

  }

  b.draw = function() {
    // console.log(b.frameRate());
    b.clear();
    b.background(bgColor);

    for(var i = 0; i < trees.length; i++){
      trees[i].displayReflection();
    }

    b.image(waterGraphic, 0, 0);

    for(var i = 0; i < trees.length; i++){
      trees[i].display();
    }

  }

  function tree(posX, posY, trunkLength, trunkGirth, color){

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

      // branch graphics render
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

    //mouse interaction variables
    var mouseRadius = 200;
    var posXOffset = 100;
    var posYOffset = -200;
    var maxMovement = b.PI/200;
    var mouseMove = 0;
    var mouseMoveX = 0;
    var mouseMoveY = 0;


    //tree display
    this.display = function(){
      // wind
      myWind.update(posX);
      //mouse interaction
      if(b.mouseX > posX + posXOffset - mouseRadius && b.mouseX < posX + posXOffset + mouseRadius){
        if(b.mouseY > posY + posYOffset - mouseRadius && b.mouseY < posY + posYOffset + mouseRadius){
          mouseMoveX = 2*maxMovement - b.abs(b.map(-2*(posX + posXOffset - b.mouseX), -mouseRadius, mouseRadius, -maxMovement, maxMovement));
          mouseMoveY = 2*maxMovement - b.abs(b.map(-2*(posY + posYOffset - b.mouseY), -mouseRadius, mouseRadius, -maxMovement, maxMovement));
          mouseMove = b.map(mouseMoveX * mouseMoveY, 0, maxMovement * maxMovement, 0, maxMovement);
        }
      } else {
        mouseMove = 0;
      }
      //reeds
      b.push();
      b.translate(posX, posY);
      b.rotate(-myWind.wind + mouseMove);
      b.translate(trunkGirth, -graphicHeight + trunkGirth);
      b.image(graphic, 0, 0);
      b.pop();
    }
    //tree reflection display
    this.displayReflection = function(){
      // wind
      myWind.update(posX);
      //reflection
      b.push();
      b.translate(posX, posY);
      b.rotate(b.PI + myWind.wind - mouseMove);
      b.translate(-trunkGirth, -graphicHeight + trunkGirth);
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

    this.update = function(posX){
      phase = posX/800;
      period += b.PI/30000; // should make this loop
      this.wind = b.sin(period-phase)*amp;
    }
  }

  b.windowResized = function(){
    b.resizeCanvas(window.innerWidth, window.innerHeight);
  }
}
var back_p5 = new p5(backSketch);
