import json
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy.stats import linregress


#stats for overall
GeoWin = 0
RegWin = 0
TotalStd = 0
TotalMean = 0
TotalSlopeRegular = 0
TotalSlopeGeo = 0
SlopeGeoWins = 0
HighestScoreR = -np.inf
HighestIndexR = 0
HighestScoreG = -np.inf
HighestIndexG = 0
num = 100
for i in range(num):
# Load JSON files
    with open(f"cartpole_regular_run_{i+1}.json", "r") as f:
        data1 = json.load(f)
    with open(f"cartpole_geometric_run_{i+1}.json", "r") as f:
        data2 = json.load(f)

    # Load rewards for analysis
    data1_rewards = data1[11]['total_reward_per_episode'][:1000]
    data2_rewards = data2[11]['total_reward_per_episode'][:1000]

    episodes = [d['episode'] for d in data1_rewards]
    rewards_1 = [d['reward'] for d in data1_rewards]
    rewards_2 = [d['reward'] for d in data2_rewards]

    # Training (first 231 episodes)
    training_1 = rewards_1[:231]
    training_2 = rewards_2[:231]
    # Running (after 231)
    running_1 = rewards_1[231:]
    running_2 = rewards_2[231:]
    #run id
    print(f"\n=== RUN {i+1} ===")
    # === TRAINING PHASE METRICS ===
    #print("\n=== TRAINING PHASE METRICS ===")

    # Mean reward
    mean_training_1 = np.mean(training_1)
    mean_training_2 = np.mean(training_2)

    # Std deviation (stability)
    std_training_1 = np.std(training_1)
    std_training_2 = np.std(training_2)

    # Coefficient of variation (relative variability)
    cv_training_1 = std_training_1 / (mean_training_1 + 1e-8)
    cv_training_2 = std_training_2 / (mean_training_2 + 1e-8)

    # Improvement percentage (start → end)
    improvement_1 = ((training_1[-1] - training_1[0]) / abs(training_1[0] + 1e-8)) * 100
    improvement_2 = ((training_2[-1] - training_2[0]) / abs(training_2[0] + 1e-8)) * 100

    # === ADD NORMALIZATION FUNCTION HERE ===
    def normalize_rewards(rewards):
        min_val = min(rewards)
        max_val = max(rewards)
        if max_val - min_val < 1e-8:
            return [0.5] * len(rewards)  # Return neutral values if no variation
        return [(r - min_val) / (max_val - min_val) for r in rewards]

    # Normalize training rewards before calculating slopes
    norm_training_1 = normalize_rewards(training_1)
    norm_training_2 = normalize_rewards(training_2)

    # Slope of smoothed reward curve (learning speed) - USING NORMALIZED REWARDS
    smooth_training_1 = pd.Series(norm_training_1).rolling(10, center=True).mean().dropna()
    smooth_training_2 = pd.Series(norm_training_2).rolling(10, center=True).mean().dropna()
    slope_1, _, _, _, _ = linregress(range(len(smooth_training_1)), smooth_training_1)
    slope_2, _, _, _, _ = linregress(range(len(smooth_training_2)), smooth_training_2)

    TotalSlopeRegular += slope_1
    TotalSlopeGeo += slope_2
    # === END OF ADDED CODE ===

    if slope_2 > slope_1:
        SlopeGeoWins += 1
        # Episode where it first reached a target reward
    target_reward = 195
    def first_reach_episode(rewards, target):
        for i, r in enumerate(rewards):
            if r >= target:
                return i + 1
        return None

    first_reach_1 = first_reach_episode(training_1, target_reward)
    first_reach_2 = first_reach_episode(training_2, target_reward)

    # --- Print results with commentary ---
    # print("mean count:")
    # print(f"Regular Run Mean Reward: {mean_training_1:.2f}")
    # print(f"Geometric Run Mean Reward: {mean_training_2:.2f}")
    mean_increase_train = ((mean_training_2 - mean_training_1) / (mean_training_1 + 1e-8)) * 100

    # if mean_increase_train >= 100:
    #     print(f"On average, our geometric implementation achieved {mean_increase_train:.2f}% higher mean reward during training. That's insane speed!")
    # elif mean_increase_train >= 50:
    #     print(f"On average, our geometric implementation achieved {mean_increase_train:.2f}% higher mean reward during training. Very strong learning curve.")
    # elif mean_increase_train >= 0:
    #     print(f"On average, our geometric implementation achieved {mean_increase_train:.2f}% higher mean reward during training. Solid improvement.")
    # else:
    #     print(f"On average, our geometric implementation achieved {abs(mean_increase_train):.2f}% lower mean reward during training. Needs tuning.")

    # print("\nstability count:")
    # print(f"Regular Run Std Dev: {std_training_1:.2f}")
    # print(f"Geometric Run Std Dev: {std_training_2:.2f}")
    stable_increase_train = ((std_training_1 - std_training_2) / std_training_1) * 100

    # if stable_increase_train >= 100:
    #     print(f"The geometric implementation was {stable_increase_train:.2f}% more stable during training. Ridiculously smooth learning!")
    # elif stable_increase_train >= 50:
    #     print(f"The geometric implementation was {stable_increase_train:.2f}% more stable during training. Very stable.")
    # elif stable_increase_train >= 0:
    #     print(f"The geometric implementation was {stable_increase_train:.2f}% more stable during training. Noticeably steadier.")
    # else:
    #     print(f"The geometric implementation was {abs(stable_increase_train):.2f}% less stable during training. Bit noisy this time.")

    # print("\nlearning speed:")
    # print(f"Regular Run Learning Slope: {slope_1:.3f}")
    # print(f"Geometric Run Learning Slope: {slope_2:.3f}")

    # if slope_2 > slope_1 * 2:
    #     print("The geometric agent learned *way* faster (massive slope difference).")
    # elif slope_2 > slope_1:
    #     print("The geometric agent learned faster (steeper improvement curve).")
    # elif slope_2 == slope_1:
    #     print("Both had almost identical learning speeds.")
    # else:
    #     print("The regular agent actually learned faster (rare, but happens).")

    # print("\nfirst reach count:")
    # print(f"Episode reached ≥ {target_reward} Reward - Regular: {first_reach_1}, Geometric: {first_reach_2}")
    # if first_reach_1 and first_reach_2:
    #     if first_reach_2 < first_reach_1:
    #         print(f"Geometric agent hit the {target_reward} threshold earlier — faster convergence!")
    #     elif first_reach_2 > first_reach_1:
    #         print(f"Regular agent reached the {target_reward} threshold first — surprising!")
    #     else:
    #         print("They both reached the target at the same time.")
    # elif not first_reach_2:
    #     print("Geometric agent never hit the target during training 😢.")
    # elif not first_reach_1:
    #     print("Regular agent never hit the target during training 😢.")

    # === POST TRAINING PHASE METRICS ===
    # print("\n=== POST TRAINING PHASE METRICS ===")

    std_running_1 = np.std(running_1)
    std_running_2 = np.std(running_2)
    stable_increase = ((std_running_1 - std_running_2) / std_running_1) * 100
    #add these for global
    TotalStd += stable_increase
    # print("standard deviation count:")
    # print(f"Regular Run Std Dev: {std_running_1:.2f}")
    # print(f"Geometric Run Std Dev: {std_running_2:.2f}")

    # if stable_increase >= 100:
    #     print(f"On average, our geometric implementation was {stable_increase:.2f}% more stable than its regular counterpart. Holy shit")
    # elif stable_increase >= 50:
    #     print(f"On average, our geometric implementation was {stable_increase:.2f}% more stable than its regular counterpart. Really good")
    # elif stable_increase >= 0:
    #     print(f"On average, our geometric implementation was {stable_increase:.2f}% more stable than its regular counterpart. A good improvement")
    # else:
    #     print(f"On average, our geometric implementation was {abs(stable_increase):.2f}% less stable than its regular counterpart. That's really sad")

    mean_running_1 = np.mean(running_1)
    mean_running_2 = np.mean(running_2)
    mean_increase = ((mean_running_2 - mean_running_1) / mean_running_1) * 100
    if mean_increase > 0:
        GeoWin += 1
    else:
        RegWin += 1
    TotalMean += ((mean_running_2 - mean_running_1) / (mean_running_1 + 1e-8)) * 100
    if HighestScoreG < mean_running_2:
        HighestScoreG = mean_running_2
        HighestIndexG = i
    if HighestScoreR < mean_running_1:
        HighestScoreR = mean_running_1
        HighestIndexR = i
    
    
    # print("mean count:")
    # print(f"Regular Run Mean Reward: {mean_running_1:.2f}")
    # print(f"Geometric Run Mean Reward: {mean_running_2:.2f}")

    # if mean_increase >= 100:
    #     print(f"On average, our geometric implementation achieved {mean_increase:.2f}% higher mean reward than the regular one. Incredible improvement!")
    # elif mean_increase >= 50:
    #     print(f"On average, our geometric implementation achieved {mean_increase:.2f}% higher mean reward than the regular one. Very strong result.")
    # elif mean_increase >= 0:
    #     print(f"On average, our geometric implementation achieved {mean_increase:.2f}% higher mean reward than the regular one. Nice improvement.")
    # else:
    #     print(f"On average, our geometric implementation achieved {abs(mean_increase):.2f}% lower mean reward than the regular one. Needs more tuning.")

#print overall stats
print("\n=====GLOBAL COMPARISON=====")
TotalMean = (TotalMean/(num))
TotalStd = (TotalStd/(num))
avg_slope_regular = TotalSlopeRegular / num
avg_slope_geo = TotalSlopeGeo / num
slope_improvement_pct = ((avg_slope_geo - avg_slope_regular) / (abs(avg_slope_regular) + 1e-8)) * 100
print(f"Overall, The geometric agent was {TotalMean:.2f}% better than the regular one throughout all {num} runs.")
print(f"Overall, The geometric agent was {TotalStd:.2f}% more stable than the regular one throughout all {num} runs.")
print(f"Average Regular Agent Learning Slope: {avg_slope_regular:.4f}")
print(f"Average Geometric Agent Learning Slope: {avg_slope_geo:.4f}")
print(f"Geometric agent learned {slope_improvement_pct:.2f}% faster on average")
print(f"Geometric agent had faster learning in {SlopeGeoWins}/{num} runs ({SlopeGeoWins/num*100:.1f}%)")
print(f"The geometric agent won {GeoWin} times out of the {num} runs. The regular won {RegWin} times.")
print(f"best Regular one was in {HighestIndexR}")
print(f"best Geometric one was in {HighestIndexG}")




# --- Plotting post-training phase ---
""" plt.figure(figsize=(12,6))
plt.plot(episodes[231:], pd.Series(running_1).rolling(100, center=True).mean(), label='Regular Run', color='blue')
plt.plot(episodes[231:], pd.Series(running_2).rolling(100, center=True).mean(), label='Geometric Run', color='red')
plt.xlabel('Episode')
plt.ylabel('Total Reward')
plt.title('CartPole Total Reward per Episode after training')
plt.legend()
plt.grid(True)
plt.show() """
