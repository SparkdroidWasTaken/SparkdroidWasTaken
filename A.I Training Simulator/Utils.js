//////////////////////////essential Util algorithms////////////////////////////
//checks to see if a value is within a certain range
function InRange(value, min, max) {
  return value >= Math.min(min, max) && value <= Math.max(min, max);
}
//checks to see if a point is inside an object
function Interact(x, y, object) {
  return InRange(x, object.x, (object.x + object.width)) && InRange(y, object.y, (object.y + object.height))
}
//for simple collision detection between non rotated rectangles or squares
function touching(item1,item2){
  if(item1.x+item1.width >= item2.x && item1.x <= item2.x+item2.width && item2.y <= item1.y+item1.height&& item1.y <= item2.y+item2.height){
    return true
  }
}
//truncate a value to 1 d.p
function Truncate(num){
  NewNum = num.toString()
  return NewNum.substring(0, 3)
}
function GenerateRandomColor(){
  return `rgba(${Math.floor(Math.random() * (255 - 0 + 1) + 0)},${Math.floor(Math.random() * (255 - 0 + 1) + 0)},${Math.floor(Math.random() * (255 - 0 + 1) + 0)},1)`
}
//fps
let FC = 0
let lastTime
function FpsCounter() {
  let currentTime = performance.now()
  let deltaTime = currentTime - (lastTime || currentTime)
  lastTime = currentTime
  let fps = Math.round(1000 / deltaTime)
  FC++
  if(JSON.parse(localStorage.getItem("SettingData")).MenuTheme == "Inverted"){
    pen.fillStyle = "black"
  }else{
    pen.fillStyle = "white"
  }
  pen.font= "40px Arial"
  pen.fillText(fps,box.width-20,(box.height-box.height)+20)
}
////////////////////Menu Management Utils//////////////////////////////////////////
//A button class
class Button {
  constructor(x, y, width, height, color, text, textsize, textcolor, MouseOver, click) {
    //actual values
    this.x = x || Math.random() * 500;
    this.y = y || Math.random() * 500;
    this.width = width || 100;
    this.height = height || 40;
    this.color = color || "red";
    this.text = text || "Button";
    this.textsize = textsize || 20;
    this.textsize = String(this.textsize) + "px"
    this.textcolor = textcolor || "black";
    //Original values
    this.Ox = this.x
    this.Oy = this.y
    this.Owidth = this.width
    this.Oheight = this.height
    this.Ocolor = this.color
    this.Otext = this.text
    this.Otextsize = this.textsize
    this.Otextcolor = this.textcolor
    //button functions
    this.MouseIsOver = false
    this.clicked = false
    this.MouseOver = MouseOver || function() { this.color = "orange"; this.text = "Click?"; };
    this.click = click || function() { console.log("clicked") };
  }
  OriginState() {
    this.x = this.Ox
    this.y = this.Oy
    this.width = this.Owidth
    this.height = this.Oheight
    this.color = this.Ocolor
    this.text = this.Otext
    this.textsize = this.Otextsize
    this.textcolor = this.Otextcolor
  }
  draw() {
    pen.fillStyle = this.color;
    pen.fillRect(this.x, this.y, this.width, this.height);
    pen.font = this.textsize + " Arial";
    pen.fillStyle = this.textcolor;
    pen.textAlign = "center";
    pen.textBaseline = "middle";
    this.text = this.text
    pen.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    if (this.MouseIsOver) {
  this.MouseOver()
    } else {
      this.OriginState()
    }
    if (this.clicked) {
      this.click()
      this.clicked = false
    }
  }
}
//Function for button Interaction
function ButtonInteraction(pos,Arrays,IsMainMenu){
  document.addEventListener("mousemove", function (e) {
    pos.x = e.clientX
    pos.y = e.clientY
  })
  document.addEventListener("click", function (e) {
    Arrays.forEach(array => {
      if (Interact(pos.x, pos.y, array)) {
        array.clicked = true
      }
    })
  })
  Arrays.forEach(array => {
    array.draw()
    if (Interact(pos.x, pos.y, array)) {
      array.MouseIsOver = true
      if(IsMainMenu){
        InteractedButtons += 1
      }
    }else{
      array.MouseIsOver = false
    }
  })
}
//Edit game stats
class GameStat{
  constructor(x,y,stat,statname,min,max,amt,button,color,hasExtremes,ExtremeAmt){
    this.x = x || 0
    this.y = y || 0
    this.stat = stat
    this.statname = statname || "Gen speed"
    this.min = min || 0
    this.max = max || 100
    this.amt = amt || 1
    this.color = color || "black"
    this.hasExtremes = hasExtremes
    this.ExtremeAmt = ExtremeAmt || 10
    if(!stat){
      console.error("a stat value is required!")
    }
    if(!this.hasExtremes){
      button.push(new Button(
        this.x+0.1,
        this.y,
        30,
        30,
        "rgba(0,0,0,0)",
        "<",
        20,
        "black",
        function () {
            
            this.textcolor = "#FFFFFF";
        },
        () => {
          if(this.stat <= this.min){

            }else{
              this.stat -= this.amt
          }
        }
        ))
        button.push(new Button(
        this.x+50,
        this.y,
        30,
        30,
        "rgba(0,0,0,0)",
        ">",
        20,
        "black",
        function () {
            
            this.textcolor = "#FFFFFF";
        },
        () => {
          if(this.stat >= this.max){

          }else{
            this.stat += this.amt
          }
        }
        ))
    }else{
      button.push(new Button(
        this.x+0.1,
        this.y,
        30,
        30,
        "rgba(0,0,0,0)",
        "<<",
        30,
        this.color,
        function () {
            
            this.textcolor = "#FFFFFF";
        },
        () => {
            if(this.stat <= this.min+this.ExtremeAmt){
                //do nothing
            }else{
              this.stat -= this.ExtremeAmt
            }
          }
        ))
      button.push(new Button(
        this.x+25,
        this.y,
        30,
        30,
        "rgba(0,0,0,0)",
        "<",
        20,
        this.color,
        function () {
            
            this.textcolor = "#FFFFFF";
        },
        () => {
            if(this.stat <= this.min){
                //do nothing
            }else{
              this.stat -= this.amt
            }
          }
        ))
        button.push(new Button(
        this.x+85,
        this.y,
        30,
        30,
        "rgba(0,0,0,0)",
        ">",
        20,
        this.color,
        function () {
            
            this.textcolor = "#FFFFFF";
        },
        () => {
          if(this.stat >= this.max){

            }else{
              this.stat += this.amt
          }
          }
        ))
        button.push(new Button(
          this.x+115,
          this.y,
          30,
          30,
          "rgba(0,0,0,0)",
          ">>",
          30,
          this.color,
          function () {
              
              this.textcolor = "#FFFFFF";
          },
          () => {
            if(this.stat >= this.max-this.ExtremeAmt){

            }else{
              this.stat += this.ExtremeAmt
            }
            }
          ))
    }

  }
  draw(){
    this.stat = this.stat
    pen.fillStyle = this.color
    pen.font= "20px Arial"
    pen.textAlign = "start"
    pen.textBaseline = "alphabetic"
    pen.fillText(this.statname,this.x,this.y)
    pen.textBaseline = "alphabetic"
    pen.font= "20px Arial"
    pen.textAlign = "center"
    if(this.hasExtremes){
      if(Math.abs(this.amt) < 1){
        pen.fillText(Truncate(this.stat),this.x+70,this.y+20)
      }else{
        pen.fillText(this.stat,this.x+70,this.y+20)
      }
    }else{
      if(Math.abs(this.amt) < 1){
      pen.fillText(Truncate(this.stat),this.x+40,this.y+20)
      }else{
        pen.fillText(this.stat,this.x+40,this.y+20)
      }
    }
    return this.stat
  }
}
//like game stats but for settings
class SettingStat{
  constructor(x,y,statname,options,optionFunc,color,pointer){
    this.x = x || 0
    this.y = y || 0
    this.statname = statname || "setting"
    this.options = options || ["on","off"]
    this.optionFunc = optionFunc || [function(){console.log("true")}, function(){console.log("false")}]
    this.color = color || "black"
    this.pointer = pointer || 0
    buttons.push(new Button(
      this.x + (this.statname.length*9),//X
      this.y+5,//Y
      30,//Width
      30,//Height
      "rgba(0,0,0,0)",//Color
      ">>",//text
      30,//text size
      this.color,//text color
      function () {
        this.textcolor = "#FFFFFF";
      },//function when mouse is over button
      () => {
        this.MoveNext()
      }//function when mouse clicks button
    ))
    buttons.push(new Button(
      this.x - (this.statname.length*10),//X
      this.y+5,//Y
      30,//Width
      30,//Height
      "rgba(0,0,0,0)",//Color
      "<<",//text
      30,//text size
      this.color,//text color
      function () {
        this.textcolor = "#FFFFFF";
      },//function when mouse is over button
      () => {
        this.MoveBack()
      }//function when mouse clicks button
    ))

  }
  draw(){
    pen.textBaseline = "alphabetic"
    pen.font= "30px Arial"
    pen.textAlign = "center"
    pen.fillStyle = this.color
    pen.fillText(this.statname,this.x,this.y)
    pen.fillText(this.options[this.pointer],this.x,this.y+30)
  }
  //move to the next item in the list
  MoveNext(){
    //go back to the first item if we're at the end
    if(this.pointer >= this.options.length-1){
      this.pointer = 0
    }else{
      this.pointer++
    }
    this.optionFunc[this.pointer]()
  }
  //move back in the list
  MoveBack(){
    //go back to the last item if we're at the start
    if(this.pointer <= 0){
      this.pointer = this.options.length-1
    }else{
      this.pointer--
    }
    this.optionFunc[this.pointer]()
  }
}
//get the color schemes
async function GetColorScheme(){
  let HasFailed = false
  let FilePath = 'ColorScheme.json';
  // Fetch the JSON data
  let response = await fetch(FilePath).catch(error=>{console.error("Failed to fetch Data. Sorry :("); HasFailed = true})
  if(HasFailed){
    return "Failure"
  }else{
    let data = await response.json()
    return data.ColorScheme
  }
}
/////////////////////GAME UTILS////////////////////////////////////////////
////////////////////AI level checker//////////////////////////
function CheckLevel(GameName,Data){
  let level = 0
  switch(GameName){
    case "FlappyBird":
      level = ((Data.grav*Data.PipeSpeed)/250)+(((1/Data.grav)*Data.diff)/0.2)+((1/Data.Spacing)/(500))
      level = Math.min(level,100)
      //level /=100
    break
    case "CubeRunner":
      level = Math.min((((Data.cubesize/Data.grav)+(Data.cubesize/Data.grav))*Data.HighestScore),100)
    break
  }
  return Math.round(level)
}
///////////////////FLAPPY BIRD///////////////////////////////////////////
//Pipe class
class Pipe{
  constructor(){
      this.x = box.width
      this.HasCollectedScore = false
      this.top_height = Math.floor(Math.random() * ((box.height/2) - (box.height/35)+1) + (box.height/35))
      this.top_y = 300
      this.spacing = spacing
      this.bottom_y = this.top_height+this.spacing
      this.width = 150
      this.bottom_height = box.height-(this.top_height+this.spacing)
      this.color = "rgb(100,255,100)"
      this.TopPipeImg = new Image()
      this.TopPipeImg.src = "Flappy Bird Pipe.png"
      this.BottomPipeImg = new Image()
      this.BottomPipeImg.src = "Flappy Bird Pipe.png"
  }
  draw(){
      pen.fillStyle = this.color
      pen.fillRect(this.x,0,this.width,this.top_height)
      pen.fillRect(this.x,this.bottom_y,this.width,this.bottom_height)
      //top part
      //bottom of pipe
      pen.drawImage(this.BottomPipeImg,82,5,249,399,this.x,-10,this.width,this.top_height+10)
      //top of pipe
      pen.drawImage(this.TopPipeImg, 74, 405, 269, 108,this.x-10,this.top_height-80,this.width+20, 80)
      //bottom part
      pen.save()
      pen.translate(this.x-10, this.bottom_y)
      pen.scale(1,-1)
      //bottom of pipe
      pen.drawImage(this.BottomPipeImg,82,5,249,399,10,-this.bottom_height-10,this.width,this.bottom_height+10)
      //top of pipe
      pen.drawImage(this.TopPipeImg, 74, 405, 269, 108,0,-80, this.width+20, 80)
      pen.restore()
  }
  update(){
      this.x -= PipeSpeed
  }
}
//bird class
class Bird{
  constructor(IsHuman){
      this.x = 300
      this.y = 100
      this.width = 20
      this.height = 20
      this.color = GenerateRandomColor()
      this.y_speed = 0
      this.UpForce = 15
      this.score = 0
      this.inputs = []
      this.brain = new NeuralNetwork(9,10,1)
      this.isDead = false
      this.Img = new Image
      this.Img.src = "Flappy Bird Icon.png"
      if(IsHuman){
        this.color = "yellow"
        this.HumanControlled = true
      }
  }
  draw(){
      pen.fillStyle = this.color
      pen.fillRect(this.x,this.y,this.width,this.height)
      pen.drawImage(this.Img,0,0,25,25,this.x,this.y-5,25,25)
  }
  think(pipes){
      let closest = pipes[0]
      let closestD = Infinity
      for(let i = 0; i < pipes.length; i++){
        let d = pipes[i].x - this.x
        if(d < closestD && d > -closest.width){
          closest = pipes[i]
          closestD = d
        }
      }
      this.inputs[0] = this.y
      this.inputs[1] = this.y_speed
      this.inputs[2] = (this.y-closest.top_height)
      this.inputs[3] = (this.y-closest.bottom_y)
      this.inputs[4] = (this.x-closest.x)
      this.inputs[5] = (this.x-closest.x+closest.width)
      this.inputs[6] = this.UpForce
      this.inputs[7] = closest.spacing
      this.inputs[8] = closest.spacing

  }
  update(){
      this.score++
      this.y_speed+= gravity
      this.y_speed *=0.9
      this.y += this.y_speed
      if(!this.HumanControlled){
        this.think(pipes)
        let outputs = NeuralNetwork.FeedForward(this.brain,this.inputs)
        if(outputs[0] > 0.5){
          this.flap()
        }
      }
    }
  flap(){
      this.y_speed -= this.UpForce
  }
}
///////////////////CUBE RUNNER///////////////////////////////////////////
class Runner{
  constructor(IsHuman){
    this.x = 50
    this.y = GroundHeight - 50
    this.size = CubeSize
    this.width = this.size
    this.height = this.size
    this.Oheight = this.height
    this.crouchHeight = this.height/2
    this.color = GenerateRandomColor()
    this.Yspeed = 0
    this.JumpForce = 30
    this.IsInAir = false
    this.eyesColor = GenerateRandomColor()
    this.IsCrouching = false
    this.isDead = false
    this.inputs = []
    this.brain = new NeuralNetwork(9,25,3)
    this.score = 0
    this.IsHumanControlled = IsHuman
  }
  draw(){
  pen.fillStyle = this.color
  pen.fillRect(this.x,this.y,this.width,this.height)
  //eyes
  pen.save()
  pen.translate(this.x,this.y)
  //if it's crouching
  if(this.IsCrouching){
    pen.fillStyle =  this.eyesColor
    pen.fillRect(this.width/2,this.width/4,this.width/8,this.width/8)
    pen.fillRect((this.width/2)+(this.width/3),this.width/4,this.width/8,this.width/8)
  }else{
    //if it's not
    pen.fillStyle =  this.eyesColor
    pen.fillRect(this.width/2,this.width/4,this.width/8,this.width/4)
    pen.fillRect((this.width/2)+(this.width/3),this.width/4,this.width/8,this.width/4)
  }
  pen.restore()
  }
  think(obstacles){
    let closest1 = obstacles[0]
    let closestD1 = Infinity
    for(let i = 0; i < obstacles.length; i++){
      let d = obstacles[i].x - this.x
      if (d < closestD1 && d > -closest1.width){
          closest1 = obstacles[i]
          closestD1 = d
      }
    }
    //set the inputs
    this.inputs[0] = this.y
    this.inputs[1] = this.Yspeed
    if(this.IsCrouching){
      this.inputs[2] = 1
    }else{
      this.inputs[2] = 0
    }
    if(this.IsInAir){
      this.inputs[3] = 1
    }else{
      this.inputs[3] = 0
    }
    this.inputs[4] = this.y - closest1.y
    this.inputs[5] = this.y - (closest1.y+closest1.height)
    this.inputs[6] = this.x - closest1.x
    this.inputs[7] = this.x - (closest1.x+closest1.width)
    this.inputs[8] = closest1.Id
  }
  update(){
    this.score++
    this.y += this.Yspeed
    this.Yspeed *=0.9
    if(this.y <= GroundHeight - this.height){
      if(this.IsCrouching){
        this.Yspeed +=Gravity/4
      }else{
        this.Yspeed +=Gravity
      }
    }else{
      this.IsInAir = false
      this.Yspeed = 0
      this.y = GroundHeight - this.height
    }
    if(!this.IsHumanControlled){
      this.think(obstacles)
      let outputs = NeuralNetwork.FeedForward(this.brain,this.inputs)
      if(outputs[0] > 0.5){
        this.Jump()
      }
      if(outputs[1] > 0.5){
        this.Crouch()
      }
      if(outputs[2] > 0.5){
        this.UnCrouch()
      }
    }
  }
  Jump(){
    if(!this.IsInAir){
      if(this.IsCrouching){
        this.Yspeed -=this.JumpForce
      }else{
        this.Yspeed -=this.JumpForce/2
      }
      this.IsInAir = true
    }
  }
  Crouch(){
    this.height = this.crouchHeight
    this.IsCrouching = true
  }
  UnCrouch(){
    this.height = this.Oheight
    this.IsCrouching = false
  }
}
//simple obstacle
class ObstacleBlock{
  constructor(){
    this.x = box.width
    this.y = GroundHeight - 20
    this.width = 40
    this.height = 20
    this.color = "#c14a09"
    this.Id = 0
  }
  draw(){
    pen.fillStyle = this.color
    pen.fillRect(this.x,this.y,this.width,this.height)
  }
  update(){
    this.x -=5
    this.width = this.width
    this.height = this.height
  }
}
//Flying Obstacle. You can go over or under this one.
class FlyingObstacle extends ObstacleBlock{
  constructor(){
    super()
    this.y = GroundHeight - 50
    //this.height = 50
    this.Id = 1
  }
}
//Long Flying Obstacle, jumping over this one is not advised
class LongFlyingObstacle extends ObstacleBlock{
  constructor(){
    super()
    this.y = GroundHeight - 200
    this.height = 160
    this.Id = 2
  }
}
//Taller Obstcale, harder to jump over
class TallerObstcale extends ObstacleBlock{
  constructor(){
    super()
    this.height = 80
    this.y = GroundHeight - 80
    this.Id = 3
  }
}
//grass
class Grass{
  constructor(x){
    this.x = x
    this.y = GroundHeight
    this.width = grasswidth
    this.height = Math.random() * (40 - (20)) + (20)
    this.color = "rgba(9,224,20,1)"
  }
  draw(){
    pen.fillStyle = this.color
    pen.fillRect(this.x,this.y,this.width,this.height)
  }
  update(){
    this.x -=5
  }
}