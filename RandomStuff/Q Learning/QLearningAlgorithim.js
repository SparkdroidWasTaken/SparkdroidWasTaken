//Q table
    let QTable = []
    //rows are options: left right up down and columns are cell spaces
    for(let i = 0; i < 4; i++){
        QTable[i] = []
        for(let j = 0; j < 100; j++){
            QTable[i][j] = 0
        }
    }
    //epsilon value :D
    let eps = 0.9
    let minEps = 0.01
    let epsDecay = 0.999
    //alpha
    let alpha = 0.7
    //discount rate
    let discountRate = 0.9
    function QLearningMove(){
        let state = (10*player.gridPos.y)+player.gridPos.x
        let futureState = state
        let action = 0
        let Reward = -1
        let PossibleRewards = []
        let BestQValue = -999//QTable[0][state]
        let exploitAction = null
        //now we check if we will explore or exploit
        let RandNum = Math.random()
        //check if we explore or exploit
        if(RandNum < eps){
            //explore
            //choose a random value in the range [0,3]
            action = Math.floor(Math.random()*4)
        }else{
            //exploit
            //find the highest Q value and take the action
            for(let i = 0; i < 4; i++){
                if(QTable[i][state] > BestQValue){
                    BestQValue = QTable[i][state]
                    exploitAction = i
                }
            }
            action = exploitAction
        }
        //check if there's a reward wherever we're going
        //find the position of goals and their score
        for(let i = 0; i < goals.length; i++){
            let s = (10*goals[i].gridPos.y)+goals[i].gridPos.x
            PossibleRewards.push({
                state:s,
                score: goals[i].score
            })
        }
        //get the out of bounds "reward". There's probably a better way of doing this
        if((state < 10 && action == 1) || ((state == 0 || state % 10 == 0) && action == 0) || (state > 89 && action == 3) || (state % 10 == 9 && action == 2)){
            Reward -= 100
        }
        //find if the future action will land them in a reward
        switch (action) {
            case 0:
                futureState -= 1
                break;
            case 1:
                futureState -= 10
                break;
            case 2:
                futureState += 1
                break;
            case 3:
                futureState += 10
                break;
        }
        for(let i = 0; i < PossibleRewards.length; i++){
            if(PossibleRewards[i].state == futureState){
                Reward += PossibleRewards[i].score
            }
        }
        //find the best Q value for where we are
        if(!exploitAction){
            for(let i = 0; i < 4; i++){
                if(QTable[i][state] > BestQValue){
                    BestQValue = QTable[i][state]
                }
            }
        }
        //update the Q value
        QTable[action][state] = QTable[action][state] + alpha*(Reward + discountRate*BestQValue - QTable[action][state])
        //slowly decrease the epsilon value
        if(eps >= minEps){
            eps *= epsDecay
        }
        //NOW WE MOVE
        switch (action) {
            case 0:
                //going out of bounds makes you lose score haha
                if(player.gridPos.x == 0){
                    player.score -=10
                    player.Respawn()
                }else{
                    player.x -= GlobalSize
                    player.gridPos.x -=1
                }
                break;
            case 1:
                if(player.gridPos.y == 0){
                        player.score -=10
                        player.Respawn()
                    }else{
                        player.y -= GlobalSize
                        player.gridPos.y -=1
                    }
                break;
            case 2:
                if(player.gridPos.x == 9){
                        player.score -=10
                        player.Respawn()
                    }else{
                        player.x += GlobalSize
                        player.gridPos.x +=1
                    }
                break;
            case 3:
                if(player.gridPos.y == 9){
                    player.score -=10
                    player.Respawn()
                }else{
                    player.y += GlobalSize
                    player.gridPos.y +=1
                }
                break;
        }
    }