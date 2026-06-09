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
//LeakyRelu
function LReLU(x){
    return Math.max(0.01*x,x)
}
//derivate
function LRelUD(x){
    if(x < 0){
        return 0.01
    }else{
        return 1
    }
}
//generate a random list because it's so useful
function generateRandomList(size){
    let RandList = []
    for(let i = 0; i < size; i++){
        RandList.push(Math.random()*2-1)
    }
    return RandList
}
//layer between 2 uh nodes? idk
class Layer{
    constructor(inputs, outputs, id,beta1,beta2){
        this.inputsCount = inputs || 2
        this.outputsCount = outputs || 1
        this.biases = this.biases = new Array(this.outputsCount).fill(0)
        this.weights = Array.from({ length: this.outputsCount }, () =>Array.from({ length: this.inputsCount }, () =>Math.random() * Math.sqrt(2 / this.inputsCount)))
        this.z = []
        this.inputs = []
        this.activation = []
        this.id = id || 0
        // Adam params
        this.beta1 = beta1 || 0.9
        this.beta2 = beta2 || 0.999
        this.t = 0
        this.momentum_w = this.weights.map(row => row.map(() => 0))
        this.momentum_b = this.biases.map(() => 0)
        this.velocity_w = this.weights.map(row => row.map(() => 0))
        this.velocity_b = this.biases.map(() => 0)
    }
    FeedForward(inputs){
        //save inputs
        this.inputs = inputs
        this.z = []
        this.activation = []
        //weights and inputs
        for (let i = 0; i < this.outputsCount; i++) {
            let sum = 0
            for (let j = 0; j < this.inputsCount; j++) {
                sum += this.weights[i][j] * inputs[j]
            }
            // add bias
            sum += this.biases[i]
            this.z.push(sum)
        }
        for(let i = 0; i < this.z.length; i++){
            switch (this.id) {
                case 0:
                    this.activation.push(LReLU(this.z[i]))
                    break;
                case 1:
                    this.activation.push(this.z[i])
                    break;
                case 2:
                    this.activation.push(Sigmoid(this.z[i]))
                    break;
            }
        }
        return this.activation
    }
    BackProp(backprop,LearningRate){
        let Lr = LearningRate || 0.1
        let delta = []
        for(let i = 0; i < this.z.length; i++){
            switch (this.id) {
                case 0:
                    delta.push(backprop[i]*LRelUD(this.z[i]))
                    break;
                case 1:
                    delta.push(backprop[i]*1)
                    break;
                case 2:
                    delta.push(backprop[i]*DerivSig(this.z[i]))
                    break;
            }
        }
        // dC/dW = outer(delta, inputs)
        let DerivW = []
        for (let i = 0; i < delta.length; i++) {
            DerivW[i] = []
            for (let j = 0; j < this.inputs.length; j++) {
                DerivW[i][j] = delta[i] * this.inputs[j]
            }
        }

        // dC/dB = delta
        let DerivB = delta.slice() // copy

        // dC/dI = weights^T * delta
        let DerivI = new Array(this.inputs.length).fill(0)
        for (let j = 0; j < this.inputs.length; j++) {
            for (let i = 0; i < delta.length; i++) {
                DerivI[j] += this.weights[i][j] * delta[i]
            }
        }
        //adam part
        this.t += 1;
        const eps = 1e-8;

    // Update momentums and velocities
    for (let i = 0; i < this.weights.length; i++) {
        for (let j = 0; j < this.weights[i].length; j++) {
            this.momentum_w[i][j] = this.beta1 * this.momentum_w[i][j] + (1 - this.beta1) * DerivW[i][j];
            this.velocity_w[i][j] = this.beta2 * this.velocity_w[i][j] + (1 - this.beta2) * (DerivW[i][j] ** 2);

            // Bias-corrected updates
            const m_hat = this.momentum_w[i][j] / (1 - this.beta1 ** this.t);
            const v_hat = this.velocity_w[i][j] / (1 - this.beta2 ** this.t);

            // Update weights
            this.weights[i][j] -= Lr * m_hat / (Math.sqrt(v_hat) + eps);
        }
    }

    for (let i = 0; i < this.biases.length; i++) {
        this.momentum_b[i] = this.beta1 * this.momentum_b[i] + (1 - this.beta1) * DerivB[i];
        this.velocity_b[i] = this.beta2 * this.velocity_b[i] + (1 - this.beta2) * (DerivB[i] ** 2);

        const m_hat_b = this.momentum_b[i] / (1 - this.beta1 ** this.t);
        const v_hat_b = this.velocity_b[i] / (1 - this.beta2 ** this.t);

        this.biases[i] -= Lr * m_hat_b / (Math.sqrt(v_hat_b) + eps);
    }

    return DerivI; // for backprop to previous layer
    }
}

//Neural network (for DQN)
class NeuralNetwork{
    constructor(size){
        this.size = size || [2,3,1]
        this.layers = []
        this.isGeo = false
        for(let i = 1; i < this.size.length; i++){
            this.layers.push(new Layer(size[i-1],size[i]))
        }
        //this is for DQN so output has to be linear
        this.layers[this.layers.length-1].id = 1
    }
    FeedForward(inputs){
        let inp = inputs
        for(let i = 0; i < this.layers.length; i++){
            inp = this.layers[i].FeedForward(inp)
        }
        return inp
    }
    BackProp(inputs, targets, LearningRate = 0.1) {
        //outputs
        let outputs = this.FeedForward(inputs)

        //Compute derivative of loss wrt outputs (MSE derivative)
        let outputD = [];
        for (let i = 0; i < outputs.length; i++) {
            outputD.push(2 * (outputs[i] - targets[i]) / outputs.length)
        }
        //Backpropagate through layers (reverse order)
        for (let i = this.layers.length - 1; i >= 0; i--) {
            outputD = this.layers[i].BackProp(outputD, LearningRate)
        }

        //Return MSE loss
        let loss = 0;
        for (let i = 0; i < outputs.length; i++) {
            let diff = outputs[i] - targets[i]
            loss += diff * diff
        }
        return loss / outputs.length
    }
}