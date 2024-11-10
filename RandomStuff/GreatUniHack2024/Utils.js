//get points, this is obvious 
function GetPoints(object,DisplayPoints){
    let points = []
        //if the object in question doesn't have any angle attribute (in which it should)
        let angle;
        if(object.angle){
            angle = object.angle
        }else{
            angle = 0
        }
        //centre point
        points[0] = {x:object.x+object.width/2,y:object.y+object.height/2}
        //all the other points
        points[1] = {x:object.x,y:object.y}
        points[2] = {x:object.x+object.width,y:object.y}
        points[3] = {x:object.x+object.width,y:object.y+object.height}
        points[4] = {x:object.x,y:object.y+object.height}
        for(let i =0; i < points.length; i++){
            let x;
            let y;
            x = ((points[i].x-object.x-object.width/2)*Math.cos(angle))-((points[i].y-object.y-object.height/2)*Math.sin(angle))
            y = ((points[i].x-object.x-object.width/2)*Math.sin(angle))+((points[i].y-object.y-object.height/2)*Math.cos(angle))
            points[i].x = x
            points[i].y = y
        }
    if(DisplayPoints){
        pen.save()
        pen.translate(object.x+object.width/2,object.y+object.height/2)
        //now we draw the points
        for(let i =0; i < points.length; i++){
            pen.beginPath()
            pen.fillStyle = "green"
            pen.arc(points[i].x,points[i].y,5,0,Math.PI*2)
            pen.fill()
        }
        pen.restore()
    }
    for(i = 0; i < points.length; i++){
        points[i].x = object.x+object.width/2-points[i].x
        points[i].y = object.y+object.height/2-points[i].y
    }
    return points
}
//Function to draw lines based on the points
function GetLines(object,DisplayLines){
    let Points = GetPoints(object)
    let Lines = []
    LetActualLines = []
    pen.lineWidth = 2
    for(let i = 1; i<Points.length;i++){
        if(i == Points.length-1){
            if(DisplayLines){
                pen.beginPath()
                pen.moveTo(Points[i].x,Points[i].y)
                pen.lineTo(Points[1].x,Points[1].y)
                pen.strokeStyle = "green"
                pen.stroke()
            }
        Lines.push({Start:Points[i],End:Points[1]})
        }else{
            if(DisplayLines){
                pen.beginPath()
                pen.moveTo(Points[i].x,Points[i].y)
                pen.lineTo(Points[i+1].x,Points[i+1].y)
                pen.strokeStyle = "green"
                pen.stroke()
            }
            Lines.push({Start:Points[i],End:Points[i+1]})
        }
    }
    return Lines
}
//Function to see if the lines are intersecting within an object
function PolygonalIntersection(object1,object2,DisplayIntersection){
    let Object1Lines = GetLines(object1)
    let Object2Lines = GetLines(object2)
    for(let i = 0; i < Object1Lines.length; i++){
        for(let j = 0; j < Object2Lines.length; j++){
            let A1 = Object2Lines[j].End.y - Object2Lines[j].Start.y
            let B1 = Object2Lines[j].Start.x-Object2Lines[j].End.x
            let C1 = A1*Object2Lines[j].Start.x+B1*Object2Lines[j].Start.y
            let A2 = Object1Lines[i].End.y - Object1Lines[i].Start.y
            let B2 = Object1Lines[i].Start.x-Object1Lines[i].End.x
            let C2 = A2*Object1Lines[i].Start.x+B2*Object1Lines[i].End.y
            let denominator = A1*B2-A2*B1
            if(denominator == 0){
                continue
            }
            let x = (B2*C1-B1*C2)/denominator
            let y = (A1*C2-A2*C1)/denominator
            let rx0 = (x-Object2Lines[j].Start.x)/(Object2Lines[j].End.x-Object2Lines[j].Start.x)
            let ry0 = (y-Object2Lines[j].Start.y)/(Object2Lines[j].End.y-Object2Lines[j].Start.y)
            let rx1 = (x-Object1Lines[i].Start.x)/(Object1Lines[i].End.x-Object1Lines[i].Start.x)
            let ry1 = (y-Object1Lines[i].Start.y)/(Object1Lines[i].End.y-Object1Lines[i].Start.y)
            if(((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) && ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))){
                if(DisplayIntersection){
                    pen.fillStyle = "blue"
                    pen.beginPath()
                    pen.arc(x,y,2,0,2*Math.PI)
                    pen.fill()
                }
                return true
            }
        }
    }
}
  //rays touching da lineeesss
function RayIntersect(ray,Target){
    let Targetlines = GetLines(Target)
    let all_intersections = []
    let A2 = ray.End.y - ray.Start.y
    let B2 = ray.Start.x-ray.End.x
    let C2 = A2*ray.Start.x+B2*ray.Start.y
    for(let i = 0; i < Targetlines.length; i++){
        let A1 = Targetlines[i].End.y - Targetlines[i].Start.y
        let B1 = Targetlines[i].Start.x-Targetlines[i].End.x
        let C1 = A1*Targetlines[i].Start.x+B1*Targetlines[i].Start.y
        let denominator = A1*B2-A2*B1
        if(denominator == 0){
            continue
        }
        let x = (B2*C1-B1*C2)/denominator
        let y = (A1*C2-A2*C1)/denominator
        let rx0 = (x-ray.Start.x)/(ray.End.x-ray.Start.x)
        let ry0 = (y-ray.Start.y)/(ray.End.y-ray.Start.y)
        let rx1 = (x-Targetlines[i].Start.x)/(Targetlines[i].End.x-Targetlines[i].Start.x)
        let ry1 = (y-Targetlines[i].Start.y)/(Targetlines[i].End.y-Targetlines[i].Start.y)
        if(((rx0 >= 0 ) || (ry0 >= 0) )&& ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))){
            let IntersectX = x
            let IntersectY = y
            all_intersections.push({x:IntersectX,y:IntersectY})
    }
    }
    //loop through all the intersections and pick the closest one to the ray
    let finalX;
    let finalY;
    let dist = Infinity
    let d = 0
    let Intersection;
    for(let i = 0; i < all_intersections.length; i++){
        d = Math.hypot((ray.Start.x-all_intersections[i].x),(ray.Start.y-all_intersections[i].y))
        if(d <= dist){
            dist = d
            finalX = all_intersections[i].x
            finalY = all_intersections[i].y
        }
    }
    if(finalX && finalY){
        Intersection = {x:finalX,y:finalY}
        return Intersection
    }else{
        return false
    }
}
//ray
class Ray{
    constructor(origin,offset){
        this.origin = origin
        this.offset = offset
        this.angle =  this.origin.angle + this.offset
        this.Start = {
            x:this.origin.x,
            y:this.origin.y
        }
        this.End = {
            x:this.origin.x + (this.origin.size*box.width)*Math.cos(this.angle),
            y:this.origin.y + (this.origin.size*box.width)*Math.sin(this.angle)
        }
        this.target = {x:null,y:null,color:null,sat:null,type:null,ID:null}
        this.dist = 0
        this.Visdist = 0
    }
    track(objects){
        let endX;
        let endY;
        let dist = Infinity
        let d;
        let Intersection;
        let wall
        let Item;
        for(let i = 0; i < objects.length; i++){
            Intersection = RayIntersect(this,objects[i])
            //just throw out any null stuff
            if(Intersection){
                this.IsTouching = true
                d = Math.abs(Math.hypot((this.Start.x-Intersection.x),(this.Start.y-Intersection.y)))
                if(d <= dist){
                    endX =Intersection.x
                    endY = Intersection.y
                    dist = d
                    Item = objects[i]
                }
            }
        }
        this.target.x = endX
        this.target.y = endY
        this.Visdist = dist*Math.cos(this.angle-this.origin.angle)
        if(Item){
            this.target.color = Item.color_value
            this.target.sat = Item.saturation
            this.target.type = Item.type
            this.target.ID = Item.ID
        }
        this.dist = dist
    }
    draw(){
        pen.beginPath()
        pen.strokeStyle = "yellow"
        pen.moveTo(this.Start.x,this.Start.y)
        if(this.target.x && this.target.y){
            pen.lineTo(this.target.x,this.target.y)
        }else{
            pen.lineTo(this.End.x,this.End.y)
        }
        pen.stroke()
    }
    update(){
        this.track(items)
        this.origin = this.origin
        this.angle = this.origin.angle + this.offset
        this.Start = {
            x:this.origin.x,
            y:this.origin.y
        }
        this.End = {
            x:this.origin.x + (this.origin.size*box.width)*Math.cos(this.angle),
            y:this.origin.y + (this.origin.size*box.width)*Math.sin(this.angle)
        }
    }
}
//player
class player{
    constructor(){
        this.x = box.width/2
        this.y = box.height/2
        this.size = 10
        this.width = this.size
        this.height = this.size
        this.color = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
        this.angle = 0
        this.speed = 0
        this.acc = 0
        this.left = false
        this.right = false
        this.forward = false
        this.backward = false
        this.rayAmount = box.width
        this.rays = []
        for(let i = 0; i < this.rayAmount; i++){
            this.rays.push(new Ray(this,((this.angle-Math.PI/6)+((i*Math.PI)/(180*(this.rayAmount/60))))))
        }
    }
    draw(){
        //rays
        for(let i = 0; i < this.rays.length; i++){
            this.rays[i].draw()
        }
        //the circle
        pen.fillStyle = this.color
        pen.beginPath()
        pen.arc(this.x,this.y,this.size,0,2*Math.PI)
        pen.fill()
        //the line (direction player is facing)
        pen.beginPath()
        pen.strokeStyle = this.color
        pen.moveTo(this.x,this.y)
        pen.lineTo(this.x+(this.size*2)*Math.cos(this.angle),this.y+(this.size*2)*Math.sin(this.angle))
        pen.stroke()
    }
    update(){
        for(let i = 0; i < this.rays.length; i++){
            this.rays[i].update()
        }
        if(this.left){
            this.angle -=Math.PI/60
        }
        if(this.right){
            this.angle +=Math.PI/60
        }
        if(this.forward){
            this.acc = 0.95
        }else if(this.backward){
            this.acc = -0.95
        }else{
            this.acc = 0
        }
        this.x = this.x
        this.y = this.y
        this.angle = this.angle
        this.speed += this.acc
        this.x += this.speed*Math.cos(this.angle)
        this.y += this.speed*Math.sin(this.angle)
        this.speed *=0.9
        //keep them out of bounds
        if(this.x <= this.width/2){
            this.x = this.width/2
        }else if(this.x >= box.width-this.width/2){
            this.x = box.width-this.width/2
        }
        if(this.y <= this.height/2){
            this.y = this.height/2
        }else if(this.y >= box.height-this.height/2){
            this.y = box.height-this.height/2
        }
    }
}
//A general item
class item{
    constructor(type){
        this.type = type || "None"
        this.x = Math.random() * box.width
        this.y = Math.random() * box.height
        this.size = Math.random() * 260
        this.width = this.size
        this.height = this.size
        this.angle = Math.random() * (2*Math.PI)
        this.color = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
        this.color_value = Math.round(Math.random() *255)
        this.saturation = Math.floor(Math.random() * 100)
        this.ID = 0
        if(this.type == "Border"){
            this.x = 1
            this.y = 1
            this.width = box.width - 1
            this.height = box.height - 1
            this.angle = 0
        }
    }
    draw(){
        pen.save()
        pen.translate(this.x+this.width/2,this.y+this.height/2)
        pen.fillStyle = this.color
        pen.rotate(this.angle)
        pen.fillRect(-this.width/2,-this.height/2,this.width,this.height)
        pen.restore()
    }
    //are they colliding with the player?
    isColliding(person){
        return PolygonalIntersection(this,person)
    }
    update(persOn){
        //let iscolliding = this.isColliding(persOn)
        this.x =  this.x
        this.y = this.y
        this.width = this.width
        this.height = this.height
        this.angle = this.angle
    }
}
//portal to travel
class Portal extends item{
    constructor(){
        super()
        this.x = box.width/2 + 100
        this.height = 50
        this.y = box.height/2 - (this.height/2)
        this.type = "Portal"
        this.width = 0
        this.color_value = 10
    }
    update(Player){
        super.update()
        if(this.color_value >= 360){
            this.color_value = 0
        }else{
            this.color_value++
        }
        this.angle = Player.angle
    }
}
//pillar of text wHEEEEE
class TextPillar extends item{
    constructor(ID){
        super()
        this.type = "TextPillar"
        this.height = 80
        this.width = 0
        this.ID = ID || 0
    }
    update(Player){
        super.update()
        this.angle = Player.angle
    }
}
//funny face? idk
class FunnyFace extends item{
    constructor(){
        super()
            this.type = "Face"
            this.height = 20
            this.width = 0
            this.color_value = 269
            this.ID = 0
    }
    update(Player){
        super.update()
        if(RunningFirstPerson){
            this.angle = Player.angle
        }else{
            this.angle += 0.3
        }
    }
}
//imagine if the face spoke to you
let HasSpokenBefore = false
let phrases =[
    "I think you should go through that portal",
    "Enjoying the museum?",
    "You know, going into that portal will make the owner happy",
    "I wonder what time period you'll end up at",
    "I was supposed to have my own thoughts, my own responses. My own face...",
    "You probably wonder what purpose I serve. I do too sometimes",
    "Sometimes I wonder what my face would have looked like if I had one",
    "The portal, it is calling you",
    "My name is actually a combination of pink and faceless!"

]
let FaceTalkInfo =""
function FaceTalk(){
    console.log("yay")
    if(!RunningFirstPerson){
        FaceTalkInfo = "WHEEEEEEEE"
    }else if(!HasSpokenBefore){
        FaceTalkInfo = "Hello! I am Pinkless, Nice to meet you fellow traveller"
        HasSpokenBefore = true
    }else{
        FaceTalkInfo = phrases[Math.floor(Math.random()*phrases.length)]
    }
}
//touch the text pillars
let LoadHistory = {
    LoadIt:false,
    Data:0
}
function touchPillar(x,y){
    //makes it easier
    let X = x
    let Y = y
    let topY = (box.height/2)+(-75*(((2*box.width/Player.rays.length)*box.height)/Player.rays[X].Visdist))
    let bottomY = ((box.height/2)+((((2*box.width/Player.rays.length)*box.height)/Player.rays[X].Visdist)*60)*2)+(box.height/2)+(-75*(((2*box.width/Player.rays.length)*box.height)/Player.rays[X].Visdist))
    if(Player.rays[X].target.type =="TextPillar" && Y >= topY && Y <= bottomY){
        LoadHistory.Data = Player.rays[X].target.ID
        LoadHistory.LoadIt = true
    }
}
//touch the face
function TouchFace(x,y){
    let X = x
    let Y = y
    let topY = -8*(((2*box.width/Player.rays.length)*box.height)/Player.rays[X].Visdist)+box.height/2
    let bottomY = 8*(((2*box.width/Player.rays.length)*box.height)/Player.rays[X].Visdist)+box.height/2
    //in this case, they have to be somewhat close to it
    if(Player.rays[X].target.type =="Face" && Y >= topY && Y <= bottomY && Player.rays[X].Visdist < 100){
        //it speaks (was originally gonna be AI but idk how to use it)
        FaceTalk()
    }
}
//Top down view (2D)
function TopDownView(){
    //drawing
    pen.globalAlpha = 0.5
    //items
    for(let i = 1; i < items.length; i++){
        items[i].draw()
    }
    //player
    Player.draw()
}
//display text
function ShowText(text){
    pen.fillStyle = "black"
    pen.font = "50px Arial"
    pen.textAlign = "center"
    pen.fillText(text,box.width/2,50)
}
function DisplayTextBottom(text){
    pen.fillStyle = "black"
    pen.font = "30px Arial"
    pen.textAlign = "start"
    pen.fillText(text,0,box.height-15)
}
let numbers = [
    {value:0,RightNumber:false,CollectedValue:false,NoOfCorrectGuesses:0,MaxNoOfGuess:10},
    {value:0,RightNumber:false,CollectedValue:false,NoOfCorrectGuesses:0,MaxNoOfGuess:6},
    {value:0,RightNumber:false,CollectedValue:false,NoOfCorrectGuesses:0,MaxNoOfGuess:4},
    {value:0,RightNumber:false,CollectedValue:false,NoOfCorrectGuesses:0,MaxNoOfGuess:2}
]
//time periods
let TimePeriods = [
    {year:"1940",Colour:"#4B5320",infomation:[{
        country:"UK",
        RandomInfomation:"Birth of Modern Computing: \nAlan Turing, one of the UK's leading mathematicians, \nlaid the foundations for modern computing with his work on the Turing Machine and later, cryptographic analysis at Bletchley Park,\n where he helped decrypt the Enigma code.\nThe Birth of the National Health Service:\nIn 1948, the UK established the NHS, providing free healthcare for all British citizens. \nIt was a landmark social reform and remains one of the most significant institutions in British life. \nArts and Literature: \nPost-war British literature flourished, \nwith writers like George Orwell, \nwho published Animal Farm (1945) and later 1984 (1949), \ncritiquing totalitarianism and exploring themes of freedom and identity. Battle of Britain: \nThe UK was heavily bombed in 1940-41 by Nazi Germany during the 'Blitz,' \nbut the RAF successfully defended against a full invasion. \nThe British population endured severe hardship and rationing throughout the war. \nDecolonization Movements: \nPost-WWII, \nBritain began to lose its colonies, \ninfluenced by the weakened economy and growing independence movements, \nleading to the eventual independence of India in 1947. \nSocial Reforms: \nThe war led to the establishment of the welfare state, \nincluding the creation of the National Health Service (NHS) in 1948, \nproviding free healthcare to citizens."
    },
    {
        country:"Germany",
        RandomInfomation:"Nazi Regime and WWII: \nUnder Adolf Hitler, Nazi Germany expanded aggressively, \ninvading multiple European countries. \nBy 1945, however, it was defeated, \nleading to the division of Germany into Eastern and Western zones. \nThe Holocaust: \nThe Nazi regime carried out the systematic genocide of \nsix million Jewish people and millions of other persecuted groups in concentration and extermination camps across Europe. \nPost-War Division: \nAfter Germany's defeat in 1945, \nthe country was split into East and West Germany, \nleading to the beginning of the Cold War and creating a stark division between communist and capitalist blocs. \nLiterature and Philosophy: \nDespite the repression under the Nazi regime, some intellectuals and writers, \nlike philosopher Martin Heidegger, continued to work, though in constrained ways. Post-war, \nGerman literature grappled with the legacy of Nazism, \nleading to works by authors like Thomas Mann and Hermann Hesse that explored guilt, identity, and humanism. \nReconstruction Efforts: \nFollowing the war, Germany's infrastructure was devastated. \nThe 'Trümmerfrauen' (rubble women) played a huge role in clearing debris and rebuilding German cities. \nThis marked the beginning of a cultural and economic recovery. Influential Architecture: \nThe 1940s laid groundwork for post-war architectural reconstruction, \nparticularly in West Germany, \nwhere the Bauhaus legacy influenced a move toward modern, \nfunctional design during rebuilding."
    },{
        country: "USA",
        RandomInfomation: "World War II Involvement: \nThe U.S. entered WWII after the attack on Pearl Harbor in 1941, \nsignificantly influencing the outcome of the war in both the Pacific and European theaters. \nThe Manhattan Project: \nThe U.S. led the secret development of the atomic bomb, \nculminating in the bombings of Hiroshima and Nagasaki in 1945, \neffectively ending the war in the Pacific. \nEconomic Boom: \nWar production boosted the American economy, \nleading to technological advancements and the rise of the U.S. as a global superpower. \nThe G.I. Bill: \nIntroduced in 1944, this bill provided benefits for returning soldiers, \nsuch as educational funding and housing loans, \nwhich greatly impacted post-war American society. \nCultural Shifts: \nHollywood thrived in the 1940s, producing films that supported the war effort and entertained a mass audience. \nWomen and Minorities: \nWomen joined the workforce in unprecedented numbers, \nand racial minorities also contributed significantly to the war effort, \npaving the way for future civil rights movements."
    },
    {
        country: "Japan",
        RandomInfomation: "Imperial Expansion and WWII: \nJapan sought to expand its empire in Asia, \ninvading China and other territories. \nThis culminated in the attack on Pearl Harbor in 1941, \nwhich led to the U.S. entering WWII. \nHiroshima and Nagasaki: \nIn 1945, the U.S. dropped atomic bombs on these cities, \nleading to Japan's surrender and the end of WWII. \nPost-War Occupation: \nJapan was occupied by U.S. forces until 1952, \nand General Douglas MacArthur oversaw significant political, economic, and social reforms, \nincluding the drafting of a new pacifist constitution. \nEconomic Reforms: \nJapan began rebuilding its war-torn economy, \nlaying the groundwork for its rapid economic growth in the coming decades. \nCultural Shifts: \nDuring occupation, Western cultural influences began to permeate Japan, \nimpacting everything from film and fashion to education and governance."
    },
    {
        country: "Soviet Union",
        RandomInfomation: "World War II and the Eastern Front: \nThe Soviet Union endured a brutal conflict with Nazi Germany, \nlosing millions of lives and suffering immense destruction. \nKey battles such as Stalingrad turned the tide against Germany. \nThe Iron Curtain and Cold War Beginnings: \nAfter WWII, the Soviet Union established communist governments in Eastern Europe, \nleading to the start of the Cold War as tensions with the U.S. and Western Europe escalated. \nIndustrial Growth: \nPost-war, the USSR focused on rebuilding and industrialization, \nsetting ambitious economic plans to expand its influence. \nCultural Impact: \nSoviet propaganda promoted themes of resilience and patriotism, \nand state control of the arts influenced literature, cinema, and education. \nPolitical Repression: \nUnder Stalin, purges and political repression intensified, \nand dissent was suppressed across all levels of Soviet society."
    },
    {
        country: "France",
        RandomInfomation: "German Occupation and Resistance: \nFrance was occupied by Nazi Germany from 1940 until liberation in 1944, \nand the French Resistance worked covertly to disrupt German operations. \nLiberation and Charles de Gaulle: \nAfter D-Day in 1944, France was liberated, \nand Charles de Gaulle emerged as a key leader, \neventually establishing the French Fourth Republic. \nPost-War Reconstruction: \nFrance faced severe economic challenges and began a period of recovery and reconstruction. \nCultural Resurgence: \nPost-war, French existentialism rose in prominence, \nwith figures like Jean-Paul Sartre and Simone de Beauvoir influencing philosophy, literature, and cultural discourse. \nColonial Conflicts: \nPost-war, France faced colonial independence movements, \nparticularly in Algeria and Vietnam, which became sources of political conflict."
    },
    {
        country: "China",
        RandomInfomation: "Japanese Occupation and WWII: \nChina faced brutal occupation by Japanese forces, \nincluding atrocities such as the Nanjing Massacre, \nand was a key front in the war in Asia. \nCivil War Resumes: \nAfter WWII, hostilities resumed between the Nationalist government and the Communist forces led by Mao Zedong, \neventually leading to Communist victory in 1949. \nEconomic Strain: \nThe war and internal conflict severely impacted the economy, \nand inflation soared. \nSoviet Influence: \nPost-war, Communist China began to establish close ties with the Soviet Union, \nespecially after the 1949 victory, which influenced early policies and economic development. \nCultural Changes: \nCommunist ideas began reshaping cultural norms, \nwith a focus on unity, labor, and anti-Western sentiment."
    }
]},
    {year:"1920",Colour:"#D4AF37",infomation:[{
        country: "USA",
        RandomInfomation: "The Roaring Twenties: \nThe 1920s in the U.S. were marked by economic growth, cultural change, and a spirit of liberation. \nThis period saw the rise of jazz music, flapper culture, and new forms of entertainment. \nProhibition: \nThe 18th Amendment banned the sale of alcohol from 1920 to 1933, \nleading to a rise in speakeasies and organized crime. \nHarlem Renaissance: \nAn explosion of African American culture in literature, music, and art emerged in Harlem, \nwith influential figures like Langston Hughes and Duke Ellington. \nStock Market Boom: \nA rapidly growing stock market fueled speculation, \nultimately setting the stage for the 1929 crash and Great Depression. \nTechnological Innovation: \nThe automobile industry, led by companies like Ford, transformed American life, \nand radios became household staples, bringing entertainment and news to the masses."
    },
    {
        country: "UK",
        RandomInfomation: "Post-WWI Recovery: \nThe UK faced economic struggles after WWI, with high debt, unemployment, and inflation. \nThe General Strike of 1926: \nWorkers across industries went on strike for better wages and working conditions, \na landmark event in British labor history. \nWomen's Suffrage: \nIn 1928, British women over the age of 21 won the right to vote, \nmarking a significant milestone in the women's rights movement. \nLiterature and Arts: \nThe 1920s saw the emergence of modernist literature, \nwith writers like Virginia Woolf and T.S. Eliot experimenting with narrative style and themes. \nRise of British Broadcasting: \nThe BBC was founded in 1922, providing news, entertainment, and a new sense of national identity through radio."
    },
    {
        country: "Germany",
        RandomInfomation: "Weimar Republic: \nThe post-WWI democratic government faced political instability, hyperinflation, and economic hardship. \nHyperinflation Crisis: \nIn the early 1920s, the German mark devalued massively, \nleading to widespread poverty and economic turmoil. \nCultural Flourishing: \nDespite economic hardship, the Weimar era was known for a vibrant cultural scene in art, \nmusic, and cinema, with figures like filmmaker Fritz Lang and painter George Grosz influencing German expressionism. \nRise of Extremist Movements: \nEconomic and social instability fueled political extremism, \nincluding the rise of Adolf Hitler and the Nazi Party. \nDawes Plan: \nAn international agreement in 1924 helped stabilize Germany's economy by restructuring its war reparations payments."
    },
    {
        country: "Soviet Union",
        RandomInfomation: "Formation of the USSR: \nAfter the 1917 Russian Revolution, \nthe Soviet Union was officially established in 1922, \nwith Lenin leading the new communist state. \nNew Economic Policy (NEP): \nIntroduced by Lenin in 1921, the NEP allowed some private enterprise to revitalize the economy after years of civil war and economic collapse. \nPolitical Repression: \nThe Soviet government began consolidating power, with the Cheka (secret police) suppressing dissent and eliminating opposition. \nCultural Revolution: \nThe government promoted proletarian art and discouraged bourgeois culture, \nushering in a new era of state-sponsored art and propaganda. \nRise of Stalin: \nAfter Lenin's death in 1924, Joseph Stalin gradually consolidated power, setting the stage for his totalitarian rule."
    },
    {
        country: "France",
        RandomInfomation: "Post-WWI Recovery: \nFrance faced heavy losses from WWI and began rebuilding its economy and infrastructure, especially in the war-torn regions. \nMaginot Line Construction: \nFrance started building the Maginot Line in 1929, \na series of fortifications along the German border intended to prevent future invasions. \nJazz Age Influence: \nParis became a cultural hub for jazz and African American artists, \nincluding Josephine Baker, who captivated French audiences. \nSurrealism Movement: \nThe surrealist movement, led by artists and writers like André Breton and Salvador Dalí, \nchallenged traditional art forms and explored the unconscious mind. \nWomen's Rights: \nAlthough full suffrage was not achieved until 1944, \nFrench women made strides in gaining political and social rights during the 1920s."
    },
    {
        country: "Japan",
        RandomInfomation: "Taisho Democracy: \nJapan experienced a period of democratization and social reform during the Taisho era, \nwith increased influence of political parties and expansion of male suffrage in 1925. \nEconomic Growth and Instability: \nJapan's economy grew after WWI, \npartly due to increased exports to war-torn regions, but faced economic downturns by the end of the decade. \nCultural Westernization: \nJapan saw a wave of Western cultural influence, especially in fashion, cinema, and literature. \nRise of Militarism: \nNationalistic and militaristic sentiments began to rise, \nwith calls for expansionism and strengthening Japan's military power. \nEarthquake and Reconstruction: \nThe Great Kanto Earthquake of 1923 devastated Tokyo and Yokohama, \nbut also spurred massive rebuilding efforts and modernization."
    },
    {
        country: "China",
        RandomInfomation: "Warlord Era: \nChina was fragmented into regions controlled by warlords, \nleading to instability and frequent conflicts. \nMay Fourth Movement: \nIn 1919, students protested against foreign influence and demanded modernization and reform, \nmarking a key moment in China's cultural and intellectual awakening. \nKuomintang and Communist Party Formation: \nThe Kuomintang (KMT) sought to unify China, \nand in 1921, the Chinese Communist Party (CCP) was founded, \neventually leading to tensions and civil war. \nNorthern Expedition: \nLed by Chiang Kai-shek, the KMT launched a campaign to defeat warlords and unify China, \nstrengthening the KMT's control. \nWestern Influence and Cultural Change: \nChinese intellectuals and writers, inspired by Western ideas, \nbegan promoting democracy, science, and new cultural values."
    }]},
    {year:"1800",Colour:"#E97451",infomation:[{
        country: "USA",
        RandomInfomation: "Westward Expansion and Manifest Destiny: \nThe U.S. expanded westward, fueled by the belief in Manifest Destiny, \nleading to conflicts with Indigenous tribes and the acquisition of new territories. \nCivil War (1861-1865): \nThe U.S. Civil War between the Union (North) and the Confederacy (South) over issues like slavery and states' rights \nended in 1865 with a Union victory and the abolition of slavery. \nIndustrial Revolution: \nThe U.S. underwent rapid industrialization, especially after the Civil War, \nleading to urbanization and the rise of railroads, steel, and oil industries. \nAbolition and Reconstruction: \nThe Emancipation Proclamation in 1863 and the 13th Amendment in 1865 abolished slavery, \nwhile Reconstruction (1865-1877) attempted to integrate formerly enslaved people and Southern states. \nGold Rush: \nThe California Gold Rush (1848-1855) attracted settlers and immigrants from around the world, \nleading to economic growth and the establishment of Western cities."
    },
    {
        country: "UK",
        RandomInfomation: "Victorian Era (1837-1901): \nQueen Victoria's reign marked a period of British expansion, \nsocial reform, and industrialization, with significant advances in technology, science, and culture. \nIndustrial Revolution: \nThe UK led the world in industrialization, \nspawning factories, railways, and new cities, \nand transforming social structures. \nBritish Empire Expansion: \nThe British Empire expanded globally, establishing colonies in Africa, Asia, and the Americas, \nmaking the UK a dominant world power. \nSocial Reforms: \nLaws addressing child labor, working conditions, and public health improved the lives of the working class. \nLiterature and Arts: \nWriters like Charles Dickens and poets like Lord Byron captured the struggles of industrial society, \nand the Romantic movement influenced British art and culture."
    },
    {
        country: "France",
        RandomInfomation: "Napoleonic Era and Wars: \nNapoleon Bonaparte's rise to power after the French Revolution led to the Napoleonic Wars, \nwhich expanded French influence but ended in defeat in 1815 at Waterloo. \nRevolutions and Political Shifts: \nFrance experienced several political changes, including the July Revolution of 1830 and the Revolution of 1848, \nwhich led to the establishment of the Second Republic. \nRise of the Second Empire: \nIn 1852, Napoleon III established the Second French Empire, \nmodernizing Paris and pursuing colonial expansion until his defeat in 1870. \nColonial Expansion: \nFrance expanded its colonial empire in North and West Africa, \nSoutheast Asia, and the Pacific, establishing itself as a major imperial power. \nCultural Flourishing: \nFrance became a center for the arts, philosophy, and science, \nwith figures like Victor Hugo, Gustave Eiffel, and Claude Monet influencing global culture."
    },
    {
        country: "Germany",
        RandomInfomation: "German Unification: \nLed by Otto von Bismarck, the unification of German states was achieved in 1871, \ncreating the German Empire under Kaiser Wilhelm I. \nIndustrialization: \nGermany underwent rapid industrialization, \nparticularly in coal and steel, making it a major economic power by the late 19th century. \nFranco-Prussian War (1870-1871): \nGermany defeated France, marking a turning point that led to unification and \na shift in European power dynamics. \nSocialism and Workers' Rights: \nSocialist ideas gained traction, \nleading to the formation of labor unions and calls for workers' rights and social reforms. \nScientific Advancements: \nGermany became a hub for scientific research, \nwith figures like chemist Robert Bunsen and physicist Hermann von Helmholtz advancing various fields."
    },
    {
        country: "Russia",
        RandomInfomation: "Tsarist Autocracy: \nThe Russian Empire was ruled by tsars, with strict social hierarchies and limited political freedom for the masses. \nSerfdom and Its Abolition: \nSerfdom was abolished in 1861 by Tsar Alexander II, \nending centuries of feudal labor but leading to social unrest and economic shifts. \nCrimean War (1853-1856): \nRussia's defeat in the Crimean War highlighted its need for modernization, \nleading to military and economic reforms. \nIndustrialization: \nRussia began industrializing in the late 19th century, \nbuilding railways like the Trans-Siberian and establishing heavy industries. \nIntellectual and Literary Movements: \nRussian literature thrived, with writers like Leo Tolstoy and Fyodor Dostoevsky exploring human nature, \nsociety, and the Russian soul in their works."
    },
    {
        country: "Japan",
        RandomInfomation: "End of the Edo Period: \nIn 1853, American Commodore Perry forced Japan to open its ports, \nleading to the end of centuries of isolation. \nMeiji Restoration (1868): \nThe Meiji Restoration restored imperial rule and launched an era of modernization, \nindustrialization, and westernization. \nIndustrial and Military Modernization: \nJapan rapidly industrialized, \nmodernized its military, and reformed its education and political systems. \nRise as an Imperial Power: \nJapan defeated China in the First Sino-Japanese War (1894-1895) and gained territories, \nmarking its emergence as an imperial power. \nCultural Changes: \nWestern ideas influenced Japanese art, fashion, and literature, \nwhile traditional Japanese culture was preserved and adapted."
    },
    {
        country: "China",
        RandomInfomation: "Opium Wars: \nChina was defeated in the First (1839-1842) and Second Opium Wars (1856-1860) by the UK, \nforcing it to open trade and cede Hong Kong. \nTaiping Rebellion (1850-1864): \nA massive civil war led by the Taiping Heavenly Kingdom against the Qing Dynasty \ncaused millions of deaths and weakened the empire. \nSelf-Strengthening Movement: \nChina attempted to modernize its military and industry in response to foreign threats but met limited success. \nSino-Japanese War (1894-1895): \nChina lost to Japan, \nleading to the cession of Taiwan and highlighting the need for modernization. \nBoxer Rebellion (1899-1901): \nAn anti-foreign uprising was suppressed by an international coalition, \nfurther weakening the Qing Dynasty."
    },
    {
        country: "India (under British Rule)",
        RandomInfomation: "British Colonial Rule: \nThe British East India Company controlled India until the British Crown took direct control in 1858 following the Indian Rebellion of 1857. \nIndian Rebellion of 1857: \nA major uprising against British rule occurred in 1857, \nleading to changes in colonial administration. \nIntroduction of Railways and Infrastructure: \nThe British built extensive railways, roads, and telegraph lines, \ntransforming India's infrastructure and economy. \nSocial Reforms and Resistance: \nReform movements emerged among Indian leaders, calling for an end to practices like Sati and advocating for education. \nRise of Nationalism: \nThe Indian National Congress was founded in 1885, \nsowing seeds of nationalism that would grow into the independence movement."
    }]},
    {year:"0300",Colour:"#DC143C",infomation:[{
        country: "Roman Empire",
        RandomInfomation: "Tetrarchy and Division: \nIn an effort to stabilize the empire, Emperor Diocletian established the Tetrarchy in 293 AD, \ndividing rule among two senior and two junior emperors. This system temporarily brought stability, \nbut would eventually lead to conflicts. \nChristianity's Growth: \nChristianity continued to spread, especially after Emperor Constantine's rise in 306 AD and his conversion. \nBy 313 AD, the Edict of Milan granted religious tolerance to Christians, marking a pivotal shift in the empire. \nEconomic Challenges: \nThe empire faced economic instability, including inflation and heavy taxation, \nwhile Diocletian attempted to control prices and wages with the Edict on Maximum Prices. \nArchitectural Developments: \nNotable constructions like Diocletian's Palace in Split (modern Croatia) reflected imperial power and Roman architectural prowess."
    },
    {
        country: "China (Jin Dynasty)",
        RandomInfomation: "Division of Jin Dynasty: \nChina was under the Western Jin Dynasty, but political struggles led to instability, \neventually resulting in the dynasty's division and the beginning of the Sixteen Kingdoms period. \nInvasions and Migration: \nNomadic tribes invaded northern China, contributing to the instability and leading to mass migrations of Han Chinese southward. \nBuddhism's Influence: \nBuddhism spread further into China during this period, with monks and traders bringing texts and practices from India, \ninfluencing Chinese culture, art, and philosophy. \nDevelopment of Calligraphy: \nThis period saw the refinement of Chinese calligraphy as an art form, with Wang Xizhi (considered the 'Sage of Calligraphy') establishing influential techniques and styles."
    },
    {
        country: "India (Gupta Empire)",
        RandomInfomation: "Golden Age of India: \nThe Gupta Empire, established around 320 AD by Chandragupta I, marked a period of great cultural, scientific, and mathematical advancements. \nFlourishing Arts and Literature: \nSanskrit literature thrived, with works by poets like Kalidasa, and art and architecture flourished with elaborate temples and sculptures. \nMathematical Developments: \nIndian mathematicians made strides in concepts like zero, decimal systems, and trigonometry, \nwhich would later influence mathematical thought globally. \nReligious Harmony and Growth: \nHinduism, Buddhism, and Jainism coexisted, with royal patronage supporting temples, monastic centers, and the spread of Indian culture across Asia."
    },
    {
        country: "Mesoamerica (Maya Civilization)",
        RandomInfomation: "Classic Maya Period: \nThe Maya civilization entered its Classic Period, characterized by the development of city-states, \nsophisticated architecture, and elaborate art forms. \nConstruction of Pyramids and Temples: \nCities like Tikal and Palenque saw the construction of large pyramids, temples, and palaces, \nreflecting the power of Maya kings and religious beliefs. \nHieroglyphic Writing and Astronomy: \nThe Maya advanced in writing, creating a complex hieroglyphic script and refining their calendar systems based on precise astronomical observations. \nReligious and Ceremonial Practices: \nRituals, including offerings and ball games, were central to Maya society, with rulers often portrayed as intermediaries to the gods."
    },
    {
        country: "Persian Empire (Sassanian Empire)",
        RandomInfomation: "Expansion and Stability: \nThe Sassanian Empire, under rulers like Shapur II, was expanding and consolidating power, especially against Roman forces in the West. \nZoroastrianism as State Religion: \nZoroastrianism was the official religion, influencing law, culture, and art, with fire temples being significant religious sites. \nTrade and Silk Road Influence: \nThe Sassanian Empire controlled key trade routes, facilitating exchanges between East and West along the Silk Road, \nincluding the spread of goods, ideas, and technologies. \nArchitectural Achievements: \nSassanian architecture flourished, with developments in palaces, domed structures, and intricate rock reliefs that celebrated royal power."
    },
    {
        country: "Axum (Aksumite Kingdom)",
        RandomInfomation: "Trading Power: \nAxum, in present-day Ethiopia, was a major trading empire that controlled Red Sea and Indian Ocean routes, \nconnecting Africa, the Middle East, and South Asia. \nAdoption of Christianity: \nKing Ezana converted to Christianity around 330 AD, making Axum one of the first Christian states and establishing ties with the Byzantine Empire. \nStelae and Monumental Architecture: \nThe Aksumite kingdom was known for its tall stelae (stone pillars) used as grave markers and symbols of power. \nCoinage System: \nAxum developed a coinage system, with coins bearing Christian symbols after the conversion, \nreflecting its economic influence and religious shift."
    },
    {
        country: "Korea (Three Kingdoms Period)",
        RandomInfomation: "Three Kingdoms Period: \nKorea was divided into the kingdoms of Goguryeo, Baekje, and Silla, each vying for regional power and influence. \nBuddhism's Introduction: \nBuddhism was introduced and gradually adopted in Korea, spreading from China and influencing art, culture, and governance. \nCultural Exchange: \nThe kingdoms engaged in cultural and technological exchanges with China and Japan, adapting Chinese writing, technologies, and philosophies. \nMilitary Conflicts: \nThere were frequent conflicts and alliances among the three kingdoms, with each seeking dominance over the Korean peninsula."
    },
    {
        country: "Byzantine Empire (Eastern Roman Empire)",
        RandomInfomation: "Continuation of Roman Legacy: \nThe Eastern Roman (Byzantine) Empire continued to preserve Roman laws, culture, and governance structures in the eastern Mediterranean. \nConstantinople's Growth: \nConstantine the Great founded the city of Constantinople in 330 AD, \nestablishing it as the new capital and a major center for trade, culture, and politics. \nChristianity's Influence: \nChristianity was rapidly spreading, with the establishment of Constantinople as a Christian city influencing Byzantine culture and architecture. \nFortifications and Defense: \nAs threats from neighboring regions increased, Constantinople's fortifications were strengthened, \nestablishing it as one of the most secure cities of the time."
    }]},
    {year:"1700",Colour:"#4169E1",infomation:[{
        country: "United States (Colonial America)",
        RandomInfomation: "Colonial Expansion: \nThe 1700s saw the expansion of British, French, and Spanish colonies in North America. \nBritish colonies on the East Coast developed unique political and social structures. \nSeven Years' War (1756-1763): \nAlso known as the French and Indian War in America, \nthe war ended with British dominance over French territories in North America. \nAmerican Revolution: \nTensions over taxation, representation, and self-governance culminated in the American Revolution (1775-1783), \nresulting in independence from Britain and the establishment of the United States. \nDeclaration of Independence: \nIn 1776, the Continental Congress adopted the Declaration of Independence, \na landmark document asserting the colonies' right to self-governance."
    },
    {
        country: "United Kingdom",
        RandomInfomation: "Industrial Revolution Begins: \nThe late 1700s marked the beginning of the Industrial Revolution in Britain, \nwith innovations in textile manufacturing, steam power, and iron production. \nThe Enlightenment: \nThe Enlightenment influenced British intellectual life, with philosophers like John Locke shaping ideas about democracy, \nliberty, and individual rights. \nBritish Empire Expansion: \nThe empire expanded in Asia, the Caribbean, and North America, establishing a vast colonial network and a dominant global economy. \nLoss of American Colonies: \nAfter the American Revolutionary War, Britain formally recognized the independence of the United States in 1783. \nPolitical and Social Reforms: \nPressure began to build for political reform, including movements for religious tolerance, workers' rights, and anti-slavery efforts."
    },
    {
        country: "France",
        RandomInfomation: "The Enlightenment: \nThe French Enlightenment, led by figures like Voltaire, Rousseau, and Diderot, emphasized reason, secularism, and individual rights. \nScientific and Artistic Advancement: \nFrance was a center for science and arts, with advancements in physics, chemistry, and literature, \nand the rise of Neoclassical art in response to Rococo. \nPre-Revolutionary Struggles: \nBy the end of the 1700s, France faced severe economic and social issues, \nincluding class inequality and financial crises, setting the stage for the French Revolution. \nColonial Holdings: \nFrance controlled territories in the Caribbean, West Africa, and Southeast Asia, though it lost many in North America to Britain by 1763. \nFrench Revolution (1789): \nIn 1789, the French Revolution began, dramatically changing French society by dismantling the monarchy, \nredistributing power, and advocating for 'Liberty, Equality, Fraternity.'"
    },
    {
        country: "China (Qing Dynasty)",
        RandomInfomation: "Consolidation of Qing Rule: \nThe Qing Dynasty (1644-1912) expanded its territory, consolidating control over Tibet, Xinjiang, Taiwan, and parts of Mongolia. \nCultural Flourishing: \nThe Kangxi and Qianlong emperors encouraged arts and scholarship, \nleading to advancements in painting, porcelain, and literature. \nTrade with Europe: \nChina maintained trade with European powers, exporting silk, tea, and porcelain, \nbut limited foreign access to select ports like Canton. \nInternal Challenges: \nPopulation growth and bureaucratic corruption led to social unrest, including smaller-scale revolts. \nJesuit Influence: \nJesuit missionaries introduced Western scientific knowledge and Catholicism, \ninfluencing elite Chinese culture, though Christianity remained limited."
    },
    {
        country: "India (Mughal Empire)",
        RandomInfomation: "Decline of Mughal Power: \nThe Mughal Empire faced decline due to internal conflicts, European competition, and the rise of regional powers like the Marathas. \nAurangzeb's Rule: \nThe last powerful Mughal emperor, Aurangzeb, ruled until 1707, \nexpanding the empire to its largest but weakening it with policies that sparked internal resistance. \nRise of European Influence: \nThe British East India Company and other European powers established trading posts and expanded influence, \nlaying the groundwork for British colonial control. \nCultural Syncretism: \nMughal India was a blend of Hindu and Islamic cultures, visible in architecture, music, and the arts. \nTrade and Economy: \nIndia was a major exporter of textiles, spices, and other goods, with bustling port cities along the Indian Ocean trade routes."
    },
    {
        country: "Russia",
        RandomInfomation: "Peter the Great's Reforms: \nPeter I (the Great) reigned until 1725, transforming Russia into a major European power with reforms in military, \ngovernment, and culture aimed at westernizing Russian society. \nExpansion of Empire: \nRussia expanded eastward into Siberia and southward toward the Black Sea, \nwith Catherine the Great later solidifying its status as a major imperial power. \nCatherine the Great's Enlightenment Influence: \nCatherine was influenced by Enlightenment ideals and corresponded with philosophers, \nthough her policies did not extend many rights to the lower classes. \nPeasant Unrest: \nSerfdom remained entrenched, leading to several peasant uprisings, including the Pugachev Rebellion (1773-1775). \nScientific and Cultural Growth: \nThe Academy of Sciences in St. Petersburg was established, fostering advancements in science, literature, and the arts."
    },
    {
        country: "Ottoman Empire",
        RandomInfomation: "Political and Military Challenges: \nThe Ottoman Empire faced military setbacks, including losses to Austria, Russia, and Persia, \nleading to gradual territorial decline. \nTulip Period: \nFrom 1718-1730, the Ottoman elite embraced European art, fashion, and architecture, \nknown as the 'Tulip Period,' marked by cultural openness and a focus on luxury. \nJanissary Corps: \nThe Janissaries, elite military units, gained significant influence but also became a source of internal strife and corruption. \nEconomic Shifts: \nTrade routes shifted as European powers bypassed the Ottomans, \nweakening the empire economically and pushing for reforms. \nDecline in Central Power: \nRegional governors (pashas) began asserting more autonomy, \nforeshadowing the fragmentation of Ottoman control in distant territories."
    },
    {
        country: "Japan (Edo Period)",
        RandomInfomation: "Sakoku Policy: \nJapan remained isolated under the Tokugawa shogunate's 'Sakoku' policy, allowing limited trade only with China and the Netherlands. \nStability and Economic Growth: \nJapan experienced a period of internal peace and economic growth under strict social and political order, \nwith cities like Edo (Tokyo) becoming cultural centers. \nRise of Merchant Class: \nThe merchant class grew economically and culturally influential, supporting art forms like kabuki and ukiyo-e. \nNeo-Confucian Influence: \nNeo-Confucianism became the dominant philosophy, \nemphasizing social hierarchy and moral conduct. \nCultural Flourishing: \nDespite isolation, arts such as woodblock printing, haiku poetry, and tea ceremony flourished, \nwith figures like Basho (haiku poet) becoming prominent."
    },
    {
        country: "West Africa (Asante Empire and Dahomey Kingdom)",
        RandomInfomation: "Expansion of Asante Empire: \nThe Asante (Ashanti) Empire in present-day Ghana expanded under leaders like Osei Tutu, \nbecoming a powerful state involved in trade, particularly in gold and slaves. \nKingdom of Dahomey: \nThe Dahomey Kingdom (modern-day Benin) grew as a central power in the slave trade, \nsupplying captives to European traders and developing a powerful military. \nCultural and Religious Practices: \nAfrican spiritual practices and cultural traditions thrived, with complex social systems, art, and oral histories. \nEuropean Contact and Trade: \nEuropean traders along the West African coast exchanged firearms, textiles, and goods for slaves, \na deeply impactful and tragic trade on West African societies. \nResistance and Adaptation: \nWhile some kingdoms resisted European influence, others engaged in trade alliances, \nshaping future interactions and resistance."
    }]}
]
let ChosenPeriod = TimePeriods[Math.floor(Math.random()*TimePeriods.length)]
let yearText = ""
let CorrectGuess = 0
//where the history is :fire:
let line = ""
function HistoryBlock(ID){
    pen.fillStyle = ChosenPeriod.Colour
    pen.fillRect(0,0,box.width,box.height)
    pen.fillStyle = "black"
    pen.font = "20px Arial"
    pen.textAlign = "center"
    text = ChosenPeriod.infomation[ID].RandomInfomation
    lineHeight = 25
    text.split("\n").forEach((line, i) => {
        pen.fillText(line,box.width/2,80 + (i * lineHeight))
    })
    ShowText(ChosenPeriod.infomation[ID].country + " in the " + ChosenPeriod.year+"s")
    DisplayTextBottom("Press 1 to exit")
}
//generate the colour OUTSIDE of the function
let BackGroundColour = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
let loadedTextPillars = false
//"time travel", awesome function name
function TimeTravel(){
    pen.fillStyle = BackGroundColour
    pen.fillRect(0,0,box.width,box.height)
    yearText = ""
    //generate random numbers for the cool effect
    for(let i = 0; i < numbers.length; i++){
        if(!numbers[i].RightNumber){
            numbers[i].value = Math.floor(Math.random() * 10)
        }
        yearText += numbers[i].value.toString()
    }
    //if the numbers match then we keep itt
    if(CorrectGuess !=  4){
        for(let i = 0; i < CorrectGuess+1; i++){
            if(ChosenPeriod.year[i] == numbers[i].value && !numbers[i].CollectedValue){
                //this is so it doesn't solve it immediately
                if(numbers[i].NoOfCorrectGuesses < numbers[i].MaxNoOfGuess){
                    numbers[i].NoOfCorrectGuesses++
                }else{
                    numbers[i].RightNumber = true
                    numbers[i].CollectedValue = true
                    if(CorrectGuess <= 3){
                        CorrectGuess++
                    }
                }
                break
            }
        }
    }
    pen.fillStyle = "white"
    pen.textAlign = "center"
    pen.font = "50px Arial"
    pen.fillText("Loading time period",box.width/2,(box.height/2)-150)
    pen.font = "300px Arial"
    pen.textAlign = "center"
    pen.fillText(yearText,box.width/2,(box.height/2)+100)
    if(CorrectGuess ==  4){
        if(!loadedTextPillars){
            for(let i = 0; i < ChosenPeriod.infomation.length; i++){
                items.push(new TextPillar(i))
            }
            loadedTextPillars = true
        }
        if(LoadHistory.LoadIt){
            HistoryBlock(LoadHistory.Data)
        }else{
            LoadTimePeriod(ChosenPeriod.year)
        }
    }

}
//LOAD THE TIME PERIODS
function LoadTimePeriod(Tperiod){
    pen.globalAlpha = 1
    //background (sky)
    pen.fillStyle = "#00FFFF"
    pen.fillRect(0,0,box.width,box.height)
    //floor
    pen.fillStyle = "#03C04A"
    pen.fillRect(0,(box.height/2),box.width,box.height)
    //player
    Player.update()
    //items
    for(let i = 0; i < items.length; i++){
        items[i].update(Player)
        //reset everything if they go through the portal
        if(PolygonalIntersection(Player,items[i])){
            if(items[i].type == "Portal"){
                //awful way of doing this but idc
                //refresh the page (they'll never know)
                location.reload()
            }
        }
    }
    //walls n stuff
    pen.save()
    pen.translate(0,(box.height/2))
    for(let i = 0; i < Player.rays.length; i++){
        let light = 3*((box.height/Player.rays[i].dist))+40
        if(light >= 80){
            light = 80
        }
        if(Player.rays[i].target.color != null){
            pen.fillStyle = `hsl(${Player.rays[i].target.color}, 100%, ${light}%)`
        }else{
            pen.fillStyle = "white"
        }
        switch (Player.rays[i].target.type) {
            case "Portal":
                pen.fillRect(i*((box.width)/Player.rays.length),-20*(((2*box.width/Player.rays.length)*box.height)/Player.rays[i].Visdist),(box.width/(Player.rays.length))+1,((((2*box.width/Player.rays.length)*box.height)/Player.rays[i].Visdist)*20)*2)
                break;
            case "TextPillar":
                pen.fillRect(i*((box.width)/Player.rays.length),-75*(((2*box.width/Player.rays.length)*box.height)/Player.rays[i].Visdist),(box.width/(Player.rays.length))+1,((((2*box.width/Player.rays.length)*box.height)/Player.rays[i].Visdist)*60)*2)
                break
                case "Face":
                    //skin colour???
                    pen.fillStyle = "#FF00FF"
                    pen.fillRect(i*((box.width)/Player.rays.length),-8*(((2*box.width/Player.rays.length)*box.height)/Player.rays[i].Visdist),(box.width/(Player.rays.length))+1,((((2*box.width/Player.rays.length)*box.height)/Player.rays[i].Visdist)*8)*2)
                    //I HAVE NO IDEA BUT LETS TRY :fire:
                        pen.fillStyle = "black"
                        pen.fillRect(i*((box.width)/Player.rays.length),3*(((2*box.width/Player.rays.length)*box.height)/Player.rays[i].Visdist),(box.width/(Player.rays.length))+1,((((2*box.width/Player.rays.length)*box.height)/Player.rays[i].Visdist)*3)*2)
                    break

            default:
                pen.fillRect(i*((box.width)/Player.rays.length),-2*(((2*box.width/Player.rays.length)*box.height)/Player.rays[i].Visdist),(box.width/(Player.rays.length))+1,((((2*box.width/Player.rays.length)*box.height)/Player.rays[i].Visdist)*5)*2)
        }
    }
    pen.restore()
    if(ShowMap){
        TopDownView()
    }
    ShowText("The "+Tperiod+"s")
    pen.fillStyle = "#FF00FF"
    pen.font = "30px Comic Sans MS"
    pen.textAlign = "center"
    pen.fillText(FaceTalkInfo,box.width/2,100)
    DisplayTextBottom("Go through the portal to go back to hub, click on the pillars to read about random things during this time")
}