var box = document.getElementById("box")
box.width = innerWidth
box.height = innerHeight
pen = box.getContext("2d", { willReadFrequently: true })
pen.fillStyle = "rgb(100,100,255)"
pen.fillRect(0,0,box.width,box.height)
var value = {
    x:0,
    y:0
}
function Julia(real,img,maxIter){
   //a+bi (it's c). we choose a value based on mouse position
   let a = value.x
   let b = value.y
   //Z Az is real and Az is imaginary
   let Az = real
   let Bz = img
   let modulus = Math.sqrt(Math.pow(Az,2) + Math.pow(Bz,2))
   for(let i = 0; i < maxIter; i++){
        //square the complex number (remember we're expanding (a+bi)^2)
        let OldAz = Az 
        Az = Math.pow(Az,2) - Math.pow(Bz,2)
        Bz = 2*OldAz*Bz
        //now add c which is a+bi
        Az += a
        Bz += b
        //check if the modulus of the new number is larger than zero. If it is, exit the loop
        modulus = Math.sqrt(Math.pow(Az,2) + Math.pow(Bz,2))
        if(modulus > 2){
            return i
        }
   }
   return maxIter
}
document.addEventListener("mousemove",e=>{
    value.x = (e.clientX/box.width)*(7/a) - (3.5/a)
    value.y = (e.clientY/box.height)*(4/a) - (2/a)
})
//original value is 1.75
let a = 1.75
function loop(){
    let colors = pen.getImageData(0,0,box.width,box.height)
    let data = colors.data
    for (let y = 0; y < box.height; y++){
        for (let x = 0; x < box.width; x++){
            let i = (x+(y*box.width))*4
            R = data[i]
            G = data[i+1]
            B = data[i+2]
            let grey = (R+G+B)/3
            //Origin values
            //let NewX = (x/box.width)*(7/a) - (4.5/a)
            //let NewY = (y/box.height)*(4/a) - (2/a)
            let NewX = (x/box.width)*(7/a) - (3.5/a)
            let NewY = (y/box.height)*(4/a) - (2/a)
            let brightness = Julia(NewX,NewY,100)
            brightness /= 100
            data[i] = brightness*y
            data[i+1] = brightness*x
            data[i+2] = brightness*x
        }
    }
    pen.putImageData(colors, 0, 0)
    requestAnimationFrame(loop)
}
loop()