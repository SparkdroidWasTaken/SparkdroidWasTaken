
    var box = document.getElementById("box")
    pen = box.getContext("2d", { willReadFrequently: true })
    var qTableCanvas = document.getElementById("qTableCanvas");
    var qTablePen = qTableCanvas.getContext("2d");
    pen.fillStyle = "rgb(100,100,255)"
    pen.fillRect(0,0,box.width,box.height)
    let text = document.getElementById("score")
    //Global size
    let GridSize = 10
    let GlobalSize = box.width/10
    //goal
    class Goal{
        constructor(){
            this.id = 2
            this.size = GlobalSize
            this.x = this.size*Math.floor((Math.random() * box.width)/this.size)
            this.y = this.size*Math.floor((Math.random() * box.height)/this.size)
            this.color = "rgb(100,255,100)"
            this.score = Math.ceil(Math.random()*750)
            this.display = this.score
            this.gridPos = {
                x:Math.floor(this.x/GlobalSize),
                y:Math.floor(this.y/GlobalSize)
            }
            this.textSize = 20
        }
        draw(){
            pen.fillStyle = this.color
            pen.fillRect(this.x,this.y,this.size,this.size)
            pen.font= `${this.textSize}px Arial`;
            pen.fillStyle = "white"
            pen.fillText(this.display,this.x,(this.y+this.size)-this.size/4)
        }
    }
    let goals = []
    goals.push(new Goal)
    //goals.push(new Goal)
    //Anti goal
    class AntiGoal extends Goal{
        constructor(){
            super()
            this.id = 3
            this.color = "rgb(255,100,100)"
            this.score = -Math.ceil(Math.random()*500)
            this.display = this.score
            this.textSize = 20
        }
    }
    for(let i = 0; i < 9; i++){
        goals.push(new AntiGoal)
    }
    //goals.push(new AntiGoal)
    //The player
    class Player extends Goal{
        constructor(){
            super()
            this.id = 1
            this.x = 0
            this.y = 0
            this.gridPos = {
                x:0,
                y:0
            }
            this.color = "rgb(50,50,255)"
            this.display = "o_o"
            this.textSize = 30
            this.score = 0
        }
        Respawn(){
            this.display = "o_o"
            this.x = 0
            this.y = 0
            this.gridPos = {
                x:0,
                y:0
            }
        }
    }
    let player = new Player
    //generate map
    let map = []
    for(let i = 0; i < 10; i++){
        map[i] = []
        for(let j = 0; j < 10; j++){
            map[i][j] = 0
        }
    }
    function drawQTableCanvas() {
        qTablePen.clearRect(0, 0, qTableCanvas.width, qTableCanvas.height);
        
        for (let i = 0; i < 10; i++) { // Loop through rows
            for (let j = 0; j < 10; j++) { // Loop through columns
                // Calculate state index for the QTable based on the grid layout
                let state = (i * 10) + j;
                
                // Calculate the average of all Q values for this state
                let avgQValue = (QTable[0][state] + QTable[1][state] + QTable[2][state] + QTable[3][state]) / 4;
                
                // Normalize average Q value to brightness (adjust divisor for scaling)
                let brightness = Math.floor(255 * (avgQValue + 500) / 2000);
                
                // Ensure brightness is within 0-255 range
                brightness = Math.max(0, Math.min(255, brightness));
                
                // Set fill color based on brightness
                qTablePen.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
                
                // Draw the rectangle on the QTable canvas in the correct position
                qTablePen.fillRect(j * GlobalSize, i * GlobalSize, GlobalSize, GlobalSize);
                
                // Draw grid overlay
                //qTablePen.strokeStyle = 'black';
                //qTablePen.strokeRect(j * GlobalSize, i * GlobalSize, GlobalSize, GlobalSize);
                
                // Set font properties for average Q value display
                qTablePen.font = '12px Arial';
                qTablePen.fillStyle = 'cyan';
                
                // Display the average Q value in the center of the cell
                qTablePen.fillText(`${avgQValue.toFixed(2)}`, j * GlobalSize + 5, i * GlobalSize + 30);
            }
        }
    }




   function Loop(){
        //clear the map because we're gonna update it
        for(let i = 0; i < map.length; i++){
            for(let j = 0; j < map[i].length; j++){
                map[i][j] = 0
            }
        }
        //background
        pen.fillStyle = "rgb(100,100,255)"
        pen.fillRect(0,0,box.width,box.height)
        //make grid
        pen.strokeStyle = "black"
        for(let i = 1; i < 10; i++){
            pen.beginPath()
            pen.moveTo(0,i*(GlobalSize))
            pen.lineTo(box.width,i*(GlobalSize))
            pen.moveTo(i*(GlobalSize),0)
            pen.lineTo(i*(GlobalSize),box.width)
            pen.stroke()
        }
        //stop overlapping goals
        for (goal1 of goals){
            for(goal2 of goals){
                if((goal1 != goal2 && goal1.x == goal2.x && goal1.y == goal1.y) || (goal1.x == 0 && goal1.y == 0)){
                    goal1.x = goal1.size*Math.floor((Math.random() * box.width)/goal1.size)
                    goal1.y = goal1.size*Math.floor((Math.random() * box.height)/goal1.size)
                    goal1.gridPos = {
                        x:Math.floor(goal1.x/GlobalSize),
                        y:Math.floor(goal1.y/GlobalSize)
                    }
                    console.log("SWAPP")
                    eps = 0.9
                    //Loop()
                }
            }
        }
        //draw goals
        goals.forEach((goal,i)=>{
            map[goal.gridPos.y][goal.gridPos.x] = goal.id
            goal.draw()
        })
        //draw player
        player.draw()
        //add player on map
        map[player.gridPos.y][player.gridPos.x] = player.id
        //update score
        score.innerText = player.score
        //give player score
        for(let i = 0; i < goals.length; i++){
            if(player.x == goals[i].x && player.y == goals[i].y){
                player.score += goals[i].score
                if(goals[i].score > 0){
                    //make him happi
                    player.display = "^-^"
                }else{
                    //stone cold nonchalant expression
                    player.display = "o_o"
                }
                //player.Respawn()
                //Loop()
            }
        }
        //console.table(map)
        drawQTableCanvas()
        QLearningMove()
    }
    let GameLoop = setInterval(Loop,25)
