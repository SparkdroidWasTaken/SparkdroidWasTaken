//functions for this NN
function lerp(a,b,t){
    return a+(b-a)*t
}
//Sigmoid function
function Sigmoid(num){
    FinalNum = 1/(1+Math.exp(-(num)))
    return FinalNum
}
//Derivate of sigmoid
function DerivSig(num){
let fx = Sigmoid(num)
    return fx * (1 - fx)
}
//square the numbers
function SquareNum(Num){
    return Num*Num
}
//derivate of SquareNum
function DerivSquareNum(Num){
    return 2*Num
}
//custom tanh
function Tanh(num){
    return 0.5+(0.5*Math.tanh(num))
}
//derivate
function DerivTanh(num){
    return 0.5*Math.pow((1/Math.cosh(num)),2)
}
//Matrix class
class Matrix{
    constructor(rows,cols){
        this.rows = rows
        this.cols = cols
        this.matrix = []
        for(let i = 0; i < this.rows; i++){
            this.matrix[i] = []
            for(let j = 0; j < this.cols; j++){
            this.matrix[i][j] = 0
            }
        }
    }
    //randomizes the values of the matrix
    randomize(){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
            this.matrix[i][j] =Math.random()*2-1
            }
        }
    }
    //multiply by a single value
    scaler(num){
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                this.matrix[i][j] *= num
            }
        }
    }
    //transpose a matrix
    static transpose(m0){
        let m1 = new Matrix(m0.cols,m0.rows)
        for(let i = 0; i < m0.rows; i++){
            for(let j = 0; j < m0.cols; j++){
                m1.matrix[j][i] = m0.matrix[i][j]
            }
        }
        return m1
    }

    static add(m0,value){
        //adding matrices
        if(m0.rows == value.rows && m0.cols == value.cols){
            for(let i = 0; i < m0.rows; i++){
                for(let j = 0; j < m0.cols; j++){
                    m0.matrix[i][j] += value.matrix[i][j]
                }
            }
        }else{
            throw new Error("The matrix dimensions must be the same in order to add them")
        }
        return m0
    }
    static subtract(m0,m1){
        //subtracting matrices
        if(m0.rows == m1.rows && m0.cols == m1.cols){
            for(let i = 0; i < m0.rows; i++){
                for(let j = 0; j < m0.cols; j++){
                    m0.matrix[i][j] -= m1.matrix[i][j]
                }
            }
        }else{
            throw new Error("The matrix dimensions must be the same in order to subtract them")
            }
        return m0
    }
    //Multiply matrcies
    static multiply(m0,m1){
            //rows n cols must be equal
            if(m0.cols == m1.rows){
                //rows * columns and add result
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
        return m0
    }
    //Hadamard multiplication
    static Hadamard(m0,m1){
        for(let i = 0; i < m0.rows; i++){
            for(let j = 0; j < m0.cols; j++){
                m0.matrix[i][j] *= m1.matrix[i][j]
            }
        }
        return m0
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
//the Neural Network
class NeuralNetwork{
    constructor(I,H,O,lr){
        //get the neuron counts
        this.inputsCount = I
        this.HiddenCount = H
        this.OutputsCount = O
        //learning rate
        this.lr = lr || 0.1
        //initalise the matrices
        this.weights_IH = new Matrix(this.HiddenCount,this.inputsCount)
        this.bias_H = new Matrix(this.HiddenCount,1)
        this.weights_HO = new Matrix(this.OutputsCount,this.HiddenCount)
        this.bias_O = new Matrix(this.OutputsCount,1)
        this.weights_IH.randomize()
        this.bias_H.randomize()
        this.weights_HO.randomize()
        this.bias_O.randomize()
        //use to store hidden values before the addition of the sigmoid
        this.z1;
        this.z2;
        this.Hidden;
    }
    //forward propagation
     static FeedForward(brain,inputs){
        //turn the array of inputs into a matrix
        let Inputs = TurnArrayToMatrix(inputs)
        let Pre_Hidden = Matrix.multiply(brain.weights_IH,Inputs)
        brain.z1 = Matrix.add(Pre_Hidden,brain.bias_H)
        brain.Hidden = Matrix.AddFunc(brain.z1,Sigmoid)
        let Pre_outputs = Matrix.multiply(brain.weights_HO,brain.Hidden)
        brain.z2 = Matrix.add(Pre_outputs,brain.bias_O)
        let outputs = Matrix.AddFunc(brain.z2,Sigmoid)
        return TurnMatrixToArray(outputs)
        
    }
    //randomly change the weights and bias
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
    //backpropagation
    static train(network,inputs,answers){
        //run the network through the feedforward with the inputs
        let outputs = TurnArrayToMatrix(NeuralNetwork.FeedForward(network,inputs))
        //turn the inputs into a matrix
        let Inputs = TurnArrayToMatrix(inputs)
        //turn the answers into a matrix
        let ActualValue = TurnArrayToMatrix(answers)
        //calculate the errors
        let cost = Matrix.subtract(outputs,ActualValue)
        let DerivsquaredCost = Matrix.AddFunc(cost,DerivSquareNum)
        //calculate this because we're gonna use it a lot
        let DerivOutput = Matrix.AddFunc(network.z2,DerivSig)
        let OPWise = Matrix.Hadamard(DerivsquaredCost,DerivOutput)
        //tranposed hidden
        let H_T = Matrix.transpose(network.Hidden)
        //find partial derivate with respect to hidden and output weights
        let W_HO_gradient = Matrix.multiply(OPWise,H_T)
        //find partial derivate with respect to hidden and output bias
        let bias_O_gradient = OPWise
        //calculate the partial deriavte with respect to hidden
        //transpose weights
        let W_HO_T = Matrix.transpose(network.weights_HO)
        let DeriveHidden1 = Matrix.multiply(W_HO_T,OPWise)
        let PreDeriveHidden = Matrix.AddFunc(network.z1,DerivSig)
        let DeriveHidden2 = Matrix.Hadamard(DeriveHidden1,PreDeriveHidden)
        //find partial derivate of input and hidden weights
        let I_T = Matrix.transpose(Inputs)
        let W_IH_gradient = Matrix.multiply(DeriveHidden2,I_T)
        //find partial derivate of input and hidden bias
        let bias_H_gradient = DeriveHidden2
        //apply gradient descent to everything
        //apply scaler learning rate
        W_HO_gradient.scaler(network.lr)
        bias_O_gradient.scaler(network.lr)
        W_IH_gradient.scaler(network.lr)
        bias_H_gradient.scaler(network.lr)
        //subract (gradient descent)
        network.weights_IH = Matrix.subtract(network.weights_IH,W_IH_gradient)
        network.bias_H = Matrix.subtract(network.bias_H,bias_H_gradient)
        network.weights_HO = Matrix.subtract(network.weights_HO,W_HO_gradient)
        network.bias_O = Matrix.subtract(network.bias_O,bias_O_gradient)
    }
}