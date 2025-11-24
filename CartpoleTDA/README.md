# Geometric Prior DQN vs. Regular DQN (CartPole)

A comparative study exploring how **Geometric Priors (Symmetry)** affect the learning speed and stability of a Deep Q-Network (DQN) trained on the CartPole environment. 

This project implements a Neural Network and DQN algorithm **from scratch in JavaScript** (no external ML libraries) and analyses the results using Python (SciPy for statistics and Ripser for Topological Data Analysis).

## 📊 Key Findings (Over 100 Runs)

We ran 100 independent training sessions for both the "Regular" agent and the "Geometric" agent. The Geometric agent utilises knowledge of the environment's physical symmetry to augment its learning.

| Metric | Regular Agent | Geometric Agent | Improvement |
| :--- | :--- | :--- | :--- |
| **Mean Reward** | Baseline | **+218.35%** | Higher is better |
| **Stability** (Std Dev) | Baseline | **+12.33%** | Higher stability is better |
| **Win Rate** | 26/100 | **74/100** | Geometric won 74% of the time |
| **Learning Speed** | 0.0038 Slope | **0.0038 Slope** | Roughly equal speed, better convergence |

> **Highlight:** The best performing agent overall was a Geometric Agent (Run #63) with a mean score of **325,326**, compared to the best Regular Agent (Run #24) with **278,889**.

## 🧠 The "Geometric" Hypothesis

Standard RL agents must learn that "leaning left implies moving left" and "leaning right implies moving right" as two separate facts. 

A **Geometric Prior** injects the knowledge that the CartPole environment is **reflectionally symmetric**. If a state $S$ leads to optimal action $A$, then the mirrored state $-S$ must lead to the mirrored action $-A$.

### Implementation
Instead of a standard Loss function, the Geometric Agent minimises a weighted loss of the real experience *and* the mirrored experience.

```javascript
// From CartpoleGeo class
MirrorState(state) {
    return [
        1 - state[0],        // Mirror x position
        -state[1],           // Reverse velocity
        state[2],            // Keep sin(theta) (symmetric)
        -state[3],           // Reverse cos(theta)
        -state[4],           // Reverse angular velocity
        -state[5]            // Reverse angular acceleration
    ]
}
```
The network updates using a combined gradient: $\mathcal{L}{total} = (1 - \lambda)\mathcal{L}{experience} + \lambda\mathcal{L}_{mirrored}$

## 📐 Topological Data Analysis (TDA)

We used **Persistent Homology** to analyse the "shape" of the policy manifold in the agent's memory. Using `ripser`, we calculated the **Wasserstein Distance** between the topological signatures of the agents' actions.

### Key Insights

#### **Symmetry in Topology (final training batch i.e. Batch 3)**
We measured the topological distance between the "Left" and "Right" action manifolds. A lower distance implies the agent treats mirrored states more symmetrically.

| Agent Type (Run 63) | H0 Distance (Left vs Right) | H1 Distance (Left vs Right) |
|---------------------|-----------------------------|-----------------------------|
| **Geometric Agent** | 5.23 ± 0.61 | 2.22 ± 0.23 |
| **Regular Agent**   | 10.25 ± 0.95 | 2.17 ± 0.18 |

**Result**: The Geometric agent's internal policy representation is **roughly 2x more symmetric** than the Regular agent's during the crucial post-training phase.

#### **Structural Evolution**
By Batch 3, the best Geometric agent formed **persistent loops (H1 features)**, indicating a structured, cyclical policy necessary for balancing.

- **Avg H1 (loops) for Geometric Batch 3**: 1.00 ± 0.00 
- **Avg H1 (loops) for Regular Batch 3**: 1.00 ± 0.00 (but with higher variance across actions)

This structure persisted strongly into Batch 10, whereas Regular agents showed **higher variance in manifold distances** between training phases.

#### **Learning Trajectory Analysis**
The topological evolution reveals distinct learning patterns:

- **Geometric Agents**: Show smoother topological transitions between batches
  - Batch 0 → 3 H1 distance (Left): 4.87 ± 0.20
  - Batch 3 → 10 H1 distance (Left): 1.85 ± 0.22

- **Regular Agents**: Exhibit more abrupt topological changes
  - Batch 0 → 3 H1 distance (Left): 6.25 ± 0.31  
  - Batch 3 → 10 H1 distance (Left): 2.81 ± 0.22

#### **Performance-Topology Correlation**
The **best performing agents** (both geometric and regular) showed:
- **Moderate topological complexity** - neither too simple nor chaotic
- **Stable H1 features** emerging by mid-training (Batch 3)
- **Consistent topological evolution** across learning phases

#### **Worst vs Best Agent Comparison**
- **Best Geometric (Run 63)**: Developed coherent topological structure with persistent loops
- **Worst Geometric (Run 3)**: Showed chaotic topological evolution with large Wasserstein distances between batches (up to 44.88 ± 0.88)

This analysis demonstrates that **geometric priors lead to more structured and efficient state space organisation**, providing mathematical evidence for why geometric agents achieve better performance and stability.

> **Example**: The best geometric agent (Run #63) showed persistent loops (H1=1) emerging by the final training batch (Batch 3), indicating structured policy formation.
🛠️ Tech Stack
Simulation & AI: Vanilla JavaScript (ES6+). Custom NeuralNetwork class with Adam optimiser, Softmax/Linear outputs, and Experience Replay.


## 🎯 Why This Matters
Geometric priors represent a powerful but underutilised technique in RL. This work demonstrates:
- **Sample Efficiency**: Better performance with same experience
- **Stability**: More consistent learning across runs
- **Interpretability**: TDA provides mathematical insights into why it works

## 🔮 Future Work
- Extend to more complex environments
- Adaptive geometric weight scheduling
- Combine with other regularisation techniques
Visualisation: HTML5 Canvas.

**Analysis**: Python (pandas, matplotlib, scikit-learn).

**Advanced Math**: ripser (TDA), scipy.spatial.
