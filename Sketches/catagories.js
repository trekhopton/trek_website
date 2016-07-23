var cataSketch = function(c){


//button class
function rectButton(x,y,w,h,loc,pic,title){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.loc = loc;
  this.pic = c.loadImage(pic);
  this.title = title;
  this.isPressed = false;
  this.hit = false;

  //update button
  this.update = function(){
    this.hit = c.collidePointRect(c.mouseX,c.mouseY,this.x,this.y,this.w,this.h);

    if(this.hit){
      this.w = w + 12;
      this.h = h + 6;
      this.x = x - 6;
      this.y = y - 3;
    } else{
      this.w = w;
      this.h = h;
      this.x = x;
      this.y = y;
    }
  }
  this.isClicked = function(){
      window.location.href = this.loc;
  }
  //collision detection
  this.isHit = function(){
    return this.hit;
  }
  //display button
  this.display = function(){
    c.fill(50,200,250);
    c.stroke(0);
    c.strokeWeight(2);
    c.rectMode();
    c.rect(this.x,this.y,this.w,this.h);
    c.textSize(this.h/2);
    var max1 = c.textWidth("Photography");
    c.textSize(this.h/4);
    var max2 = c.textWidth("Photography");
    if(this.w > max1+this.h){
      c.textSize(this.h/2);
      c.image(this.pic,this.x, this.y,this.h, this.h);
      c.noStroke();
      c.fill(0);
      c.textAlign(c.LEFT, c.CENTER);
      c.text(this.title,this.x+this.h,this.y+this.h/2);
    } else if(this.w <= max1+this.h && this.w >= this.h+max2){
      c.textSize(this.h/4);
      c.image(this.pic,this.x, this.y,this.h, this.h);
      c.noStroke();
      c.fill(0);
      c.textSize(this.h/4);
      c.textAlign(c.LEFT, c.CENTER);
      c.text(this.title,this.x+this.h,this.y+this.h/2);
    } else{
      c.image(this.pic,this.x+this.w/2-this.h/2, this.y,this.h, this.h);
    }
  }
}
function createButtons(){
  //create buttons
  var buffer = c.height/32;
  var headHeight = 260;
  var buttonHeight = ((c.height-headHeight)/5)-buffer;
  var buttonWidth = c.width/2-c.width/8;
  buttons[0] = new rectButton(c.width/16,headHeight,buttonWidth,buttonHeight,"gallery1.html","Images/Artwork_Icon.png","Artwork");
  buttons[1] = new rectButton(c.width/16,headHeight+buttonHeight+buffer,buttonWidth,buttonHeight,"gallery2.html","Images/Media_Icon.png","Apps");
  buttons[2] = new rectButton(c.width/16,headHeight+2*(buttonHeight+buffer),buttonWidth,buttonHeight,"gallery3.html","Images/Music_Icon.png","Music");
  buttons[3] = new rectButton(c.width/16,headHeight+3*(buttonHeight+buffer),buttonWidth,buttonHeight,"gallery4.html","Images/Photo_Icon.png","Photography");
  buttons[4] = new rectButton(c.width/16,headHeight+4*(buttonHeight+buffer),buttonWidth,buttonHeight,"gallery5.html","Images/Video_Icon.png","Video");
}
//declare buttons
var buttons = [];
//setup
c.setup = function() {
	var cataCanvas = c.createCanvas(window.innerWidth, window.innerHeight);
  createButtons();
}
//draw
c.draw = function(){
  c.clear();
  for(var i = 0; i < buttons.length; i++){
    buttons[i].update();
    buttons[i].display();
  }
}
//when mouse is clicked
c.mousePressed = function(){
  for(var i = 0; i < buttons.length; i++){
    if(buttons[i].hit){
      buttons[i].isPressed = true;
    }
  }
}
c.mouseReleased = function(){
  for(var i = 0; i < buttons.length; i++){
    if(buttons[i].hit && buttons[i].isPressed){
      buttons[i].isClicked();
    }
    buttons[i].isPressed = false;
  }
}

c.windowResized = function(){
  c.resizeCanvas(window.innerWidth, window.innerHeight);
  createButtons();
}


}
var cata_p5 = new p5(cataSketch);
