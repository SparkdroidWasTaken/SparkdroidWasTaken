    //basics
    const box = document.getElementById("box")
    box.width = 1024
    box.height = 486
    pen = box.getContext("2d")
    pen.fillStyle = "rgba(0,0,0,1)"
    pen.fillRect(0,0,box.width,box.height)
    let cycles = 100
    //strips for grid
    let stripsV = Math.round(box.width/20)
    let stripsH = Math.round(box.height/20)
    //death count
    let DeathCount = 0
    //HAMILTONNN
    class snake{
        constructor(){
            this.x = Math.floor((Math.random() * box.width)/20)*20
            this.y = Math.floor((Math.random() * box.height)/20)*20
            this.width = 19
            this.height = 19
            //this.color = "#03C04A"
            this.color = "cyan"
            this.speed = {
                x:20,
                y:0
            }
            this.segments = [
                {x:this.x, y: this.y, Sx: this.speed.x, Sy: this.speed.y,Tx:this.speed.x,Ty:this.speed.y,head:true,color:"#03C04A"},
                 {x:this.x-20, y:this.y, Sx: this.speed.x, Sy: this.speed.y,Tx:0,Ty:0,head:false,color:"white"},
                {x:this.x-40, y:this.y, Sx: this.speed.x, Sy: this.speed.y,Tx:0,Ty:0,head:false,color:"cyan"},
            ]
        }
        draw(){
            for(let i = 0; i < this.segments.length; i++){
                pen.fillStyle = this.segments[i].color
                pen.fillRect(this.segments[i].x,this.segments[i].y,this.width,this.height)
            }
        }
        movement(item){
            //find the horizontal distance from the head to item
            let xdist = (item.x) - this.segments[0].x
            //vertical
            let ydist = (item.y) - this.segments[0].y
            //look for the one further away
            if((Math.abs(ydist) >= Math.abs(xdist))){
                //check to see if we can move up or down
                if((Math.abs(this.segments[0].Sy) != 0)){
                    if(xdist < 0){
                        this.turn("left")
                    }else if(xdist > 0){
                        this.turn("right")
                    }
                }else{
                    if(ydist < 0){
                        this.turn("up")
                    }else if(ydist > 0){
                        this.turn("down")
                    }
                }
            }else{
                //can we move left or right
                if(Math.abs(this.segments[0].Sx) != 0){
                    if(ydist < 0){
                        this.turn("up")
                    }else if(ydist > 0){
                        this.turn("down")
                    }
                }else{
                    if(xdist < 0){
                        this.turn("left")
                    }else if(xdist > 0){
                        this.turn("right")
                    }
                }
            }
        }
        update(){
            this.movement(Targets[0])
            this.segments[0].Sx = this.speed.x
            this.segments[0].Sy = this.speed.y
            //movements bc yes
            for(let i = 0; i < this.segments.length; i++){
                this.segments[i].x += this.segments[i].Sx
                this.segments[i].y += this.segments[i].Sy
                this.segments[i].Tx = this.segments[i].Sx
                this.segments[i].Ty = this.segments[i].Sy
                if(i != 0){
                    this.segments[i].Sx = this.segments[i-1].Tx
                    this.segments[i].Sy = this.segments[i-1].Ty
                }
            }
        }
        turn(direction){
            switch (direction) {
                case "up":
                if(this.speed.y == 20){
                        //nothing happens
                    }else{
                        this.speed.y = -20
                        this.speed.x = 0
                    }
                    break;
                case "down":
                if(this.speed.y == -20){
                        //nothing happens
                    }else{
                        this.speed.y = 20
                        this.speed.x = 0
                    }
                    break;
                case "left":
                    if(this.speed.x == 20){
                        //nothing happens
                    }else{
                        this.speed.x = -20
                        this.speed.y = 0
                    }
                    break;
                case "right":
                if(this.speed.x == -20){
                        //nothing happens
                    }else{
                        this.speed.x = 20
                        this.speed.y = 0
                    }
                    break;
            }
        }
    }
    let Snake = new snake()
    //m a p
    let map = []
    for(let i = 0; i < stripsH; i++){
        map.push([])
        for(let j  = 0; j < stripsV; j++){
            map[i][j] = 0
        }
    }
     //food
     class Food{
        constructor(){
            this.x = Math.floor((Math.random() * (box.width-20))/20)*20
            this.y = Math.floor((Math.random() * (box.height-20))/20)*20
            this.width = 20
            this.height = 20
            this.color = "red"
            this.IsEaten = false
        }
        draw(){
            pen.fillStyle = this.color
            pen.fillRect(this.x,this.y,this.width,this.height)
        }
        update(){
            //prevent food from being inside the snake body
            for(let i = 0; i < Snake.segments.length; i++){
                if(this.x == Snake.segments[i].x && this.y == Snake.segments[i].y && !Snake.segments[i].head){
                    this.x = Math.floor((Math.random() * (box.width-20))/20)*20
                    this.y = Math.floor((Math.random() * (box.height-20))/20)*20
                }
            }
        }
    }
    let foods = []
    for(let i = 0; i < 1; i++){
        foods.push(new Food)
    }
    //targets??? idk stfu
    class Target{
        constructor(x,y,color,direction){
            this.x = Math.floor((x)/20)*20
            this.y = Math.floor((y)/20)*20
            this.width = 19
            this.height = 19
            this.gridpos = {
                x:this.x/20,
                y:this.y/20
            }
            this.hasBeenChecked = false
            this.Neighbourcount = GetNeighbours(this)
            this.color = color || "blue"
            this.direction = direction || null
            this.priority = 0
            this.start = false
        }
    }
    let Targets = []
    Targets.push(new Target(0,(stripsH-1)*20))
    Targets[0].start = true
    //get the free neigbours near a target
    function GetNeighbours(target,CheckNeighbours){
        //see if we're checking the neigbours
        let CheckNext = false
        if(CheckNeighbours){
            CheckNext = true
        }
        //using grid positions because easy
        let CurrentNode = {
            x:target.gridpos.x,
            y:target.gridpos.y
        }
        //use all possible combinations
        let iterations = [
            {
                x:target.gridpos.x-1,
                y:target.gridpos.y,
                pos:"left"
            },
            {
                x:target.gridpos.x,
                y:target.gridpos.y-1,
                pos:"up"
            },
            {
                x:target.gridpos.x+1,
                y:target.gridpos.y,
                pos:"right"
            },
            {
                x:target.gridpos.x,
                y:target.gridpos.y+1,
                pos:"down"
            }
        ]
        //get rid of any iterations that might be out of bounds or contain a target
        let TempIt1 = []
          for(let i = 0; i < iterations.length; i++){
             let x = iterations[i].x
            let y = iterations[i].y
            if(!(iterations[i].x < 0 || iterations[i].x > stripsV-1 || iterations[i].y < 0 || iterations[i].y > stripsH-1)){
                //make sure it's empty
                if(map[y][x] == 0){
                        TempIt1.push(iterations[i])
                }
            }
        } 
        iterations = []
        iterations = TempIt1
        //now we return the length off the iteration list if that's all we're doing
        if(!CheckNext){
            return iterations.length
        }else{
            //get neigbours
            let neigbours = []
            for(let i = 0; i < iterations.length; i++){
                let x = iterations[i].x
                let y = iterations[i].y
                neigbours.push(new Target(x*20,y*20,"red",iterations[i].pos))
            }
            return neigbours
        }
    }
    //make a hamiltonian cycle
    function GenerateCycle(StartingPoint){
        //find out the number of columns and rows there are
        let maxArrayAmount = stripsH*stripsV
        let Rows = stripsH
        let Cols = stripsV
        //we have a value which will determine what direction order to use. I'm a genius I know
        let id = 0
        //if rows are odd then add 1 to id
        if(Rows % 2 != 0){
            id += 1
        }
        //if columns are odd then add 2 to id
        if(Cols % 2 !=0){
            id +=2
        }
        //Okay now we check what the final id value is
        let order = []
        switch (id) {
            case 0:
                //if the id is 0 that means both rows and columns are even so we can use anything
                order = ["up", "right", "down", "left"]
                break;
            case 1:
                //if the id is 1 that means row is odd so u,r,d,l (up right down left)
                order = ["up", "right", "down", "left"]
                break;
            case 2:
                //if the id is 2, Columns are odd sooo r,u,l,d
                order = ["up", "right", "down", "left"]
                break;
        
            default:
                //anything else means either both are odd so cycle is impossible or something went wrong
                return console.error("Hamiltonian cycle not possible :(");
                break;
        }
        //always choose a new node with the lowest amount of neigbours and throw it into an array
        let items = GetNeighbours(StartingPoint,true)
        //find the items with shortest neighbour count. This isn't a good way of doing it but whatever
        let smallestNeighbourCount = Infinity
        for(let i = 0; i < items.length; i++){
            if(items[i].Neighbourcount < smallestNeighbourCount){
                smallestNeighbourCount = items[i].Neighbourcount
            }
        }
        //now we remove all the ones with neigbour counts higher than the smaller neighbour count
        let tempItems = []
        for(let i = 0; i < items.length; i++){
            if(items[i].Neighbourcount == smallestNeighbourCount){
                tempItems.push(items[i])
            }
        }
        items = []
        items = tempItems
        //now we check which path gets priority
        for(let i = 0; i < items.length; i++){
            switch (items[i].direction) {
                case order[0]:
                    items[i].priority = 0
                    break;
                case order[1]:
                    items[i].priority = 1
                    break;
                case order[2]:
                    items[i].priority = 2
                    break;
                case order[3]:
                    items[i].priority = 3
                    break;
            }
        }
        //FINALLY WE CHOOSE THE SMALLEST ONE
        let lowestPriority = Infinity
        let priorityNode = 0
        for(let i = 0; i < items.length; i++){
            if(items[i].priority < lowestPriority){
                lowestPriority = items[i].priority
                priorityNode = i
            }
        }
        //MAKE THE NEW TARGET WOOOOOOOOOOOO
        Targets.push(items[priorityNode])
    }
    //restart function
    function Restart(){
        //update death count
        DeathCount += 1
        document.getElementById('deathCount').innerText = DeathCount
        //restart snake
        Snake.x = Math.floor((Math.random() * box.width)/20)*20
        Snake.y = Math.floor((Math.random() * box.height)/20)*20
        Snake.speed = {x:20,y:0}
        Snake.segments = [
            {x:Snake.x, y: Snake.y, Sx: Snake.speed.x, Sy: Snake.speed.y,Tx:Snake.speed.x,Ty:Snake.speed.y,head:true,color:"#03C04A"},
            {x:Snake.x-20, y:Snake.y, Sx: Snake.speed.x, Sy: Snake.speed.y,Tx:0,Ty:0,head:false,color:"white"},
            {x:Snake.x-40, y:Snake.y, Sx: Snake.speed.x, Sy: Snake.speed.y,Tx:0,Ty:0,head:false,color:"cyan"}]
        //reset the food
        foods = []
        for(let i = 0; i < 1; i++){
            foods.push(new Food)
        }
        //reset targets
        Targets = []
        for(let i = 0; i < stripsH; i++){
            for(let j = 0; j < stripsV; j++){
                map[i][j] = 0
            }
        }
        Targets.push(new Target(0,(stripsH-1)*20))
    }
    //game loop
    function loop(){
        //drawing
        pen.fillStyle = "white"
        pen.fillRect(0,0,box.width,box.height)
        //grid because idk wtf i'm doing
        for(let i = 0; i < stripsV; i++){
            for(let j = 0; j < stripsH; j++){
                pen.fillStyle = "black"
                pen.fillRect(i*20+(0.1),j*20+(0.1),20,20)
            }
        }
        for(let i = 0; i < Targets.length; i++){
            //the start one gets a different value
                map[Targets[i].gridpos.y][Targets[i].gridpos.x] = 1
        }
        //reset everything because snake made it through the cycle :D
        let count = 0
        for(let i = 0; i < stripsH; i++){
            for(let j = 0; j < stripsV; j++){
                if(map[i][j] == 1){
                    count++
                }
            }
        }
        if(count == stripsH*stripsV){
            Targets = []
            for(let i = 0; i < stripsH; i++){
                for(let j = 0; j < stripsV; j++){
                    map[i][j] = 0
                }
            }
            Targets.push(new Target(0,(stripsH-1)*20))
        }
        //food
        foods.forEach(food=>{
            food.draw()
        })
         //snake
        Snake.draw()
        //updating
        
        //check if we win
        if(Snake.segments.length == stripsH*stripsV){
            //window.alert("WE WON")
        }
        //snake
       Snake.update()
       //calculate land covered
       document.getElementById("LandCovered").innerText =  Math.round((Snake.segments.length/(stripsH*stripsV))*100)
        //food
        foods.forEach(food=>{
            food.update()
        })
        //food and dying stuff
        //snake dies if it leaves boundary
        if(Snake.segments[0].x < 0 || Snake.segments[0].x > box.width || Snake.segments[0].y < 0 || Snake.segments[0].y > box.height){
            Restart()
        }
        //body no touching
        for (Segment1 of Snake.segments){
            for(Segment2 of Snake.segments){
                if(Segment1 != Segment2 && Segment1.x == Segment2.x && Segment1.y == Segment2.y && Segment1.head && !Segment2.head){
                    Restart()
                }
            }
        }
        //food
        foods.forEach(food=>{
            //collision detection is so easy because grid
            for(let i = 0; i < Snake.segments.length; i++){
                if(Snake.segments[i].x == food.x && Snake.segments[i].y == food.y && Snake.segments[i].head){
                    food.IsEaten = true
                }
            }
        })
        foods.forEach((food,i)=>{
            if(food.IsEaten){
                foods.splice(i,1)
                foods.push(new Food)
                Snake.segments.push({x:Snake.segments[Snake.segments.length-1].x-Snake.speed.x, y:Snake.segments[Snake.segments.length-1].y-Snake.speed.y, Sx: Snake.speed.x, Sy: Snake.speed.y,Tx:0,Ty:0,head:false,color:"cyan"})
            }
        })
        Targets.forEach((target,i)=>{
            //collision detection is so easy because grid
            for(let i = 0; i < Snake.segments.length; i++){
                if(Snake.segments[i].x == target.x && Snake.segments[i].y == target.y && Snake.segments[i].head){
                    GenerateCycle(Targets[Targets.length-1])
                    Targets.splice(i,1)
                }
            }
        })
        cycles = cycles
    }
    GameLoop = setInterval(loop, 50)
