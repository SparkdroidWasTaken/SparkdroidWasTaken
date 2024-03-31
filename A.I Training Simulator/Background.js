var box = document.getElementById("box")
box.width = innerWidth
box.height = innerHeight
let pen = box.getContext("2d")
//frame count
var FrameCount = 0
//background
var BG = new Image(box.width,box.height)
//flappy bird game
if(localStorage.getItem("SavedDataFlappyBird") != null){
    var gravity = JSON.parse(localStorage.getItem("SavedDataFlappyBird")).grav
    var PipeSpeed = JSON.parse(localStorage.getItem("SavedDataFlappyBird")).PipeSpeed
    var PipeFreq = JSON.parse(localStorage.getItem("SavedDataFlappyBird")).diff
    var spacing = JSON.parse(localStorage.getItem("SavedDataFlappyBird")).Spacing
    BG.src = "Flappy Bird BG.png"
    //pipes
    var pipes = []
    pipes.push(new Pipe)
    //bird
    var bird = new Bird()
    bird.brain = JSON.parse(localStorage.getItem("SavedDataFlappyBird")).brain
}
function FlappyBirdGameplay(){
    //updates
    FrameCount++
    //update the bird
    bird.update()
     //update the pipes
     for(let i = 0; i < pipes.length; i++){
        pipes[i].update()
        //remove the pipe if it's off the screen
        if(pipes[i].x < -pipes[i].width){
            pipes.splice(i,1)
        }
    }
    //push a new pipe into the list
    if(FrameCount % Math.floor((500 / (PipeSpeed*PipeFreq))) == 0){
        pipes.push(new Pipe)
    }
    //drawing
    //draw the background
    pen.fillStyle = "rgba(100,100,255,1)"
    pen.fillRect(0,0,box.width,box.height)
    pen.drawImage(BG, 0, 0, box.width, box.height+5)
    //draw everything else
    //draw the bird
    bird.draw()
    //draw the pipes
    pipes.forEach(pipe=>{
        pipe.draw()
    })
}
//cube runner game
if(localStorage.getItem("SavedDataCubeRunner") != null){
    var Gravity = JSON.parse(localStorage.getItem("SavedDataCubeRunner")).grav
    var CubeSize = JSON.parse(localStorage.getItem("SavedDataCubeRunner")).cubesize
    //ground
    var GroundHeight = (box.height) - 60
    //grass columns
    var grasswidth = 10
    var cols = Math.round(box.width/grasswidth)
    //obstacles
    var AllObstacles = [ObstacleBlock, LongFlyingObstacle, FlyingObstacle, TallerObstcale]
    var obstacles = []
    obstacles.push(new FlyingObstacle)
    //grass
    var grass = []
    for(let i = 0; i < cols+5; i++){
      grass.push(new Grass(i*grasswidth))
    }
    //background
    var gradient = pen.createLinearGradient(0,0,0,box.height)
    gradient.addColorStop(0, 'blue')
    gradient.addColorStop(0.25, "rgba(100,100,255,1)")
    //runner
    var runner = new Runner()
    runner.brain = JSON.parse(localStorage.getItem("SavedDataCubeRunner")).brain
}
function CubeRunnerGameplay(){
    //updating
     FrameCount++
     //runner
     runner.update()
    //Obstacles
    obstacles.forEach(obstacle=>{
        obstacle.update()
    })
    if(FrameCount % 80 == 0){
        let NewItem = Math.floor(Math.random()* AllObstacles.length)
        obstacles.push(new AllObstacles[NewItem])
    }
    //update the grass
    grass.forEach((Grasss,i)=>{
        if(Grasss.x <= -Grasss.width){
          grass.splice(i,1)
          grass.push(new Grass(box.width))
        }
        Grasss.update()
    })
    //drawing
    //draw the background
    pen.fillStyle = gradient
    pen.fillRect(0,0,box.width,box.height)
    runner.draw()
    //Obstacles
    obstacles.forEach(obstacle=>{
        obstacle.draw()
    })
    //Floor
    pen.fillStyle = "#80471C"
    pen.fillRect(0,GroundHeight,box.width,60)
    grass.forEach(grass=>{
        grass.draw()
    })
}