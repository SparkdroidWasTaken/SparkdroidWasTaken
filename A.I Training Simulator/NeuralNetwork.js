//functions for this NN
function lerp(a,b,t){
    return a+(b-a)*t
}
//SIGMOID function
function Sigmoid(num){
    FinalNum = 1/(1+Math.pow(Math.E,-(num)))
    return FinalNum
}
//square the numbers
function SquareNum(Num){
    return Num*Num
}
//Matrix class
class Matrix{
    constructor(rows,cols){
        this.rows = rows || 2
        this.cols = cols || 2
        if(!Number.isInteger(this.rows) || !Number.isInteger(this.cols)){
            throw new Error("Please enter an integer when defining a matrix")
        }else{
            this.matrix = []
            for(let i = 0; i < this.rows; i++){
                this.matrix[i] = []
                for(let j = 0; j < this.cols; j++){
                this.matrix[i][j] = 0
                }
            }
        }
    }
    //randomizes the values of the matrix
    randomize(){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
            this.matrix[i][j] =  Math.random()*2-1
            }
        }
    }
    static add(m0,m1){
        //adding matrices
        if(m0.rows == m1.rows && m0.cols == m1.cols){
            for(let i = 0; i < m0.rows; i++){
                for(let j = 0; j < m0.cols; j++){
                     m0.matrix[i][j] += m1.matrix[i][j]
                }
            }
        }else{
            throw new Error("Matrix dimensions must be the same in order to add them")
        }
    }
    //Matrix multiplication
    static multiply(m0,m1){
        //rows n cols must be equal
        if(m0.cols == m1.rows){
            var rows = m0.rows
            var cols = m1.cols
            var newMatrix = new Matrix(m0.rows,m1.cols)
            for(let i = 0; i < rows; i++){
                 for(let j = 0; j < cols; j++){
                    var sum = 0
                    for(let k = 0; k < m0.cols; k++){
                        sum += m0.matrix[i][k] * m1.matrix[k][j]
                    }
                    newMatrix.matrix[i][j] = sum
                }
            }
            return newMatrix
        }else{
            throw new Error("the 1st Matrix rows must be equal to the 2nd Matrix columns")
        }
    }
    //this is so I can see the matrix so much easier
    print(){
        console.table(this.matrix)
    }
    //add functions onto the matrix
    static AddFunc(m0,Func){
    for(let i = 0; i < m0.rows; i++){
        for(let j = 0; j < m0.cols; j++){
            m0.matrix[i][j] = Func(m0.matrix[i][j])
            }
        }
    }
}
function TurnArrayToMatrix(array){
    let matrix = new Matrix(array.length,1)
    for(let i = 0; i < matrix.rows; i++){
        for(let j = 0; j < matrix.cols; j++){
        matrix.matrix[i][j] = array[i]
        }
    }
    return matrix
}
function TurnMatrixToArray(Matrix){
    let array = []
    for(let i = 0; i < Matrix.rows; i++){
        for(let j = 0; j < Matrix.cols; j++){
        array.push(Matrix.matrix[i][j])
        }
    }
    return array
}
//the Neural Network (the brain)
class NeuralNetwork{
    constructor(I,H,O){
        //get the neuron counts
        this.inputsCount = I
        this.HiddenCount = H
        this.OutputsCount = O
        //initalise the matrices
        this.weights_IH = new Matrix(this.HiddenCount,this.inputsCount)
        this.bias_H = new Matrix(this.HiddenCount,1)
        this.weights_HO = new Matrix(this.OutputsCount,this.HiddenCount)
        this.bias_O = new Matrix(this.OutputsCount,1)
        this.weights_IH.randomize()
        this.bias_H.randomize()
        this.weights_HO.randomize()
        this.bias_O.randomize()
    }
     static FeedForward(brain,inputs){
        //turn the array of inputs into a matrix
        let Inputs = TurnArrayToMatrix(inputs)
        let Hidden = Matrix.multiply(brain.weights_IH,Inputs)
        Matrix.add(Hidden,brain.bias_H)
        Matrix.AddFunc(Hidden,Sigmoid)
        let outputs = Matrix.multiply(brain.weights_HO,Hidden)
        Matrix.add(outputs,brain.bias_O)
        Matrix.AddFunc(outputs,Sigmoid)
        return TurnMatrixToArray(outputs)
        
    }
    static mutate(network,amount){
        for(let i = 0; i < network.weights_IH.rows; i++){
            for(let j = 0; j < network.weights_IH.cols; j++){
                network.weights_IH.matrix[i][j] = lerp(network.weights_IH.matrix[i][j],Math.random()*2-1,amount)
            }
        }
        for(let i = 0; i < network.bias_H.rows; i++){
            for(let j = 0; j < network.bias_H.cols; j++){
                network.bias_H.matrix[i][j] = lerp(network.bias_H.matrix[i][j],Math.random()*2-1,amount)
            }
        }
        for(let i = 0; i < network.weights_HO.rows; i++){
            for(let j = 0; j < network.weights_HO.cols; j++){
                network.weights_HO.matrix[i][j] = lerp(network.weights_HO.matrix[i][j],Math.random()*2-1,amount)
            }
        }
        for(let i = 0; i < network.bias_O.rows; i++){
            for(let j = 0; j < network.bias_O.cols; j++){
                network.bias_O.matrix[i][j] = lerp(network.bias_O.matrix[i][j],Math.random()*2-1,amount)
            }
        }
    }
}