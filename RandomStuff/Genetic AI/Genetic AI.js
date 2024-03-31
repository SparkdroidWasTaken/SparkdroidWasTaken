var box = document.getElementById("box")
box.width = innerWidth
box.height = innerHeight
pen = box.getContext("2d")
var life = 1000
var count = 0
var generation = 1
class Target{
    constructor(){
        this.x = box.width/2
        this.y = 100
        this.size = 40
        this.color = "cyan"
        //this.centre = (this.x+this.size/2)+(this.y+this.size/2)
    }
    draw(){
        pen.fillStyle = this.color
        pen.fillRect(this.x,this.y,this.size,this.size)
    }
}
var target = new Target
class Obstacle{
    constructor(){
        this.x = Math.random() * box.width
        this.y = Math.random() * box.height
        this.height = 20
        this.width = 20
        this.color = "green"
    }
    draw(){
        pen.fillStyle = this.color
        pen.fillRect(this.x,this.y,this.width,this.height)
    }
}
var obstacles = []
//var obstacle = new Obstacle
for(let i = 0; i < 0; i++){
    obstacles[i] = new Obstacle
}
class DNA{
    constructor(gene){
        this.genes = {
            x:[],
            y:[]
        }
        if(gene){
            this.genes = {
                x:gene.x,
                y:gene.y
            }
        }else{
        for(let i = 0; i < life; i++){
            this.genes.x[i] = Math.random() < 0.5 ? Math.random() * -10 : Math.random() * 10
            this.genes.y[i] = Math.random() < 0.5 ? Math.random() * -10 : Math.random() * 10
        }
    }
    }
    mix(Partner){
        var newDna = new DNA()
        var midX = Math.floor(Math.random() * this.genes.x.length)
        var midY = Math.floor(Math.random() * this.genes.y.length)
        for(let i = 0; i <this.genes.x.length; i++){
            if(i < midX){
                newDna.genes.x[i] = this.genes.x[i]
            }else{
                newDna.genes.x[i] = Partner.genes.x[i]
            }
        }
        for(let i = 0; i <this.genes.y.length; i++){
            if(i < midY){
                newDna.genes.y[i] = this.genes.y[i]
            }else{
                newDna.genes.y[i] = Partner.genes.y[i]
            }
        }
        return newDna
    }
    mutate(){
        var num = Math.random()
        for(let i = 0; i < this.genes.x.length; i++){
            if(Math.random() < 0.01){
                this.genes.x[i] = Math.random() < 0.5 ? Math.random() * -10 : Math.random() * 10
            }
        }
        for(let i = 0; i < this.genes.y.length; i++){
            if(Math.random() < 0.01){
                this.genes.y[i] = Math.random() < 0.5 ? Math.random() * -10 : Math.random() * 10
            }
        }
    }
}
class rookect{
    constructor(DNa){
        this.name = Math.floor(Math.random() * 200)
        this.x = box.width/2//Math.random() * box.width
        this.y = box.height - 45
        this.IsDead = false
        this.size = 20
        this.color = "rgba(255,255,255,0.25)"
        this.count = count
        this.completed = false;
        this.bonusTime = 1
        //this.centre = (this.x+this.size/2)+(this.y+this.size/2)
        if(DNa){
            this.dna = DNa
        }
        if(DNa === undefined){
            this.dna = new DNA()
        }
        this.speed = {
            x:0,
            y:0
        }
        this.fitness = 0
    }
    draw(){
        pen.fillStyle = this.color
        pen.fillRect(this.x,this.y,this.size,this.size)
    }
    exist(){
        this.count = count
        this.draw()
        this.touch()
        this.x += this.speed.x 
        this.y += this.speed.y
        this.speed = {
            x:this.dna.genes.x[this.count],
            y:this.dna.genes.y[this.count]
        }
    }
    touch(){
        if(this.y + this.size > box.height || this.y < 0 || this.x < 0 || this.x + this.size > box.width){
          this.dead()
        }
        if(this.y + this.size >= target.y && this.x + this.size >= target.x && target.x + target.size >= this.x && target.y + target.size >= this.y){
            this.completed = true;
            this.bonusTime = life - this.count
            this.speed = {
                x:0,
                y:0
            }
        }
    }
    checkFitness(){
        var X_dist = (target.x+target.size/2)-(this.x+this.size/2)
        var Y_dist = (target.y+target.size/2)-(this.y+this.size/2)
        var dist = Math.hypot((X_dist),(Y_dist))
        this.fitness = 1/ dist;
        this.fitness *= this.bonusTime
        if(this.completed){
            this.fitness *=10
        }
        if(this.IsDead){
            this.fitness /=100
        }
        }
    dead(){
        this.speed = {
                x:0,
                y:0
            }
            this.IsDead = true
    }
}
class Population{
    constructor(){
        this.allDead = false
        this.CompleteCount = 0
        this.deathCount = 0
        this.population = []
        this.parentPool = []
        this.PopulationSize = 100;
         this.bonus = 100
        for(let i = 0; i < this.PopulationSize; i++){
            this.population[i] = new rookect
        }
        this.parentPool = []
    }
    run(){
        for(let i = 0; i < this.PopulationSize; i++){
            this.population[i].exist()
        }
        this.deathCount = 0
        for(let i = 0; i < this.PopulationSize; i++){
            if(this.population[i].IsDead){
                this.deathCount++
                if(this.deathCount == this.PopulationSize){
                    this.allDead = true
                }
            }
        }
        this.CompleteCount = 0
        for(let i = 0; i < this.PopulationSize; i++){
            if(this.population[i].completed){
                this.CompleteCount++
                this.population[i].fitness += this.bonus;
                this.bonus -= 50;
                if(this.bonus == 0){
                  this.bonus = 0;
                }
                if(this.CompleteCount == this.PopulationSize){
                    alert("ALL OF THEM PASSED YAYYY")
                }
            }
        }
    }
    check(){
      this.bonus = 1000
        console.log(this.CompleteCount+" Cubes passed this generation")
        console.log(this.deathCount+" Cubes died this generation")
        var maxfit = 0
        var BestCube;
        var newPopulation =[]
        for(let i = 0; i < this.PopulationSize; i++){
            this.population[i].checkFitness()
            if(this.population[i].fitness > maxfit){
                maxfit = this.population[i].fitness
            }
            this.population[i].fitness = this.population[i].fitness/maxfit
        }
        this.parentPool = []
        for(let i = 0; i < this.PopulationSize; i++){
            var n = Math.round(this.population[i].fitness * 100)
            for(let j = 0; j < n; j++){
                this.parentPool.push(this.population[i])
            }
        }
        for(let i = 0; i < this.PopulationSize; i++){
            var ParentAIndex = Math.floor(Math.random() * this.parentPool.length)
            var ParentBIndex = Math.floor(Math.random() * this.parentPool.length)
            var ParentB = this.parentPool[ParentBIndex].dna
            var ParentA = this.parentPool[ParentAIndex].dna
            var Child = ParentA.mix(ParentB)
            Child.mutate()
           newPopulation[i] = new rookect(Child)
        }
        this.population = newPopulation
    }
}
var popul = new Population
function loop(){
pen.fillStyle = "black"
pen.fillRect(0,0,box.width,box.height)
popul.run()
for(let i = 0; i < obstacles.length; i++){
    obstacles[i].draw()
}
target.draw()
count++
if(count == life){
    popul.check()
    //popul = new Population
    count = 0
    generation++
}
if(popul.allDead){
    popul = new Population
    count = 0
    generation = 1
}
for(let i = 0; i < popul.PopulationSize; i++){
    for(let j = 0; j < obstacles.length; j++){
        if(popul.population[i].y + popul.population[i].size >= obstacles[j].y && popul.population[i].x + popul.population[i].size >= obstacles[j].x && obstacles[j].x + obstacles[j].width >= popul.population[i].x && obstacles[j].y + obstacles[j].height>= popul.population[i].y){
            popul.population[i].dead()
        }
    }
}
pen.fillStyle = "white"
pen.font= "20px Arial"
pen.fillText(count,10,30)
pen.fillText("Generation:"+generation,10,50)
requestAnimationFrame(loop)
}
loop()