import json
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import ripser
from persim import plot_diagrams, bottleneck, wasserstein
from scipy.spatial.distance import pdist, squareform
import warnings
warnings.filterwarnings('ignore')
#open files
with open(f"cartpole_geometric_run_1.json", "r") as f:
    data = json.load(f)

#names
#exp_batch_0', 'exp_batch_1', 'exp_batch_2',
#'end_exploit_session_final', 'exp_batch_3', 'exp_batch_4',
#'exp_batch_5', 'exp_batch_6', 'exp_batch_7', 'exp_batch_8',
#'exp_batch_9', 'total_reward_per_episode', 'reward_per_frame'

def GetData(DataFile):
    FinalData = []
    DataFile_states = []

    # 0
    for i in range(len(DataFile[0]["exp_batch_0"])):
        DataFile_states.append({
            "state": DataFile[0]["exp_batch_0"][i]["state"],
            "action": DataFile[0]["exp_batch_0"][i]["action"]
        })
    FinalData.append({"exp_num_0": DataFile_states})
    DataFile_states = []

    # 1
    for i in range(len(DataFile[1]["exp_batch_1"])):
        DataFile_states.append({
            "state": DataFile[1]["exp_batch_1"][i]["state"],
            "action": DataFile[1]["exp_batch_1"][i]["action"]
        })
    FinalData.append({"exp_num_1": DataFile_states})
    DataFile_states = []

    # 2
    for i in range(len(DataFile[2]["exp_batch_2"])):
        DataFile_states.append({
            "state": DataFile[2]["exp_batch_2"][i]["state"],
            "action": DataFile[2]["exp_batch_2"][i]["action"]
        })
    FinalData.append({"exp_num_2": DataFile_states})
    DataFile_states = []

    # final exploit
    for i in range(len(DataFile[3]["end_exploit_session_final"])):
        DataFile_states.append({
            "state": DataFile[3]["end_exploit_session_final"][i]["state"],
            "action": DataFile[3]["end_exploit_session_final"][i]["action"]
        })
    FinalData.append({"exp_num_3": DataFile_states})
    DataFile_states = []

    # 3–9
    for j in range(3, 10):
        for i in range(len(DataFile[j+1][f"exp_batch_{j}"])):
            DataFile_states.append({
                "state": DataFile[j+1][f"exp_batch_{j}"][i]["state"],
                "action": DataFile[j+1][f"exp_batch_{j}"][i]["action"]
            })
        FinalData.append({f"exp_num_{j+1}": DataFile_states})
        DataFile_states = []

    return FinalData

#collect all data batches
#number 3 is the final exploit batch
data_exp_batches = GetData(data)
#lets split exp batches in terms of actions and states
data_actions = []
data_states = []
for i in range(11):
    GA = [s["action"] for s in data_exp_batches[i][f"exp_num_{i}"]]
    GS = [s["state"] for s in data_exp_batches[i][f"exp_num_{i}"]]
    data_actions.append(np.array(GA))
    data_states.append(np.array(GS, dtype=object))


def cartpole_metric(s1, s2):
    """
    Custom distance metric for CartPole state space.
    s1 and s2 are 6-dimensional state vectors.
    """
    
    # We first recover the angle from (cos(theta), sin(theta))
    a1 = np.arctan2(s1[3], s1[2]) # arctan2(y, x)
    a2 = np.arctan2(s2[3], s2[2])

    # Calculate shortest angular distance (d_Angular)
    a_dist = np.abs(np.arctan2(np.sin(a1 - a2), np.cos(a1 - a2)))
    
    # Using the standard numpy L2 distance on the components:
    s1_euclid_components = np.array([s1[0], s1[1], s1[4], s1[5]])
    s2_euclid_components = np.array([s2[0], s2[1], s2[4], s2[5]])
    euclid_sq_dist = np.sum((s1_euclid_components - s2_euclid_components)**2)
    
    return np.sqrt(euclid_sq_dist + a_dist**2)

# --- TDA Run Function with Sampling ---

def run_tda_internal(states_data, actions_data, max_homology_dimension=1, action=1, sample_size=1000):
    if action != 3: mask = (actions_data == action); states = states_data[mask]
    else: states = states_data
        
    point_cloud_full = np.array(states.tolist(), dtype=np.float64)
    N_total = point_cloud_full.shape[0]
    
    if N_total > sample_size:
        sample_indices = np.random.choice(N_total, size=sample_size, replace=False)
        point_cloud = point_cloud_full[sample_indices]
    else:
        point_cloud = point_cloud_full

    distance_vector = pdist(point_cloud, metric=cartpole_metric)
    D = squareform(distance_vector)
    diagrams = ripser.ripser(D, distance_matrix=True, maxdim=max_homology_dimension)['dgms']

    # Return the diagrams AND the distance matrix D
    return diagrams, D
# --- Multi-Run Analysis Functions ---

def run_tda_multiple_times_with_counts(R, states_data, actions_data, batch_id, action, max_homology_dimension=1, sample_size=1000, threshold_percentage=0.2):
    all_diagrams = []
    all_H0_counts = []; all_H1_counts = []; #all_H2_counts = []
    all_diameters = [] # New list to store individual sample diameters
    
    print(f"Collecting {R} TDA runs for Batch {batch_id}, Action {action}...")
    
    for r in range(R):
        # 1. Run TDA and get diagrams
        diagrams, D = run_tda_internal(states_data, actions_data, max_homology_dimension, action, sample_size)
        all_diagrams.append(diagrams)
        
        # 2. Determine the threshold for THIS sample (D) only
        current_diameter = np.max(D)
        all_diameters.append(current_diameter) # Store diameter for final average calculation
        
        # The threshold for THIS run is 20% of THIS run's diameter:
        current_threshold_value = threshold_percentage * current_diameter 
        
        for dim, dgm in enumerate(diagrams):
            # Calculate counts using the threshold for the current sample
            lifespans = dgm[:, 1] - dgm[:, 0]
            count = np.sum(lifespans >= current_threshold_value)
            
            if dim == 0:
                all_H0_counts.append(count)
            elif dim == 1:
                all_H1_counts.append(count)


        # Print detailed output only for the first run
        if r == 0:
            text = {0: "left", 1: "neutral", 2: "right"}.get(action, "(all states)")
            N_total = states_data.shape[0] if action == 3 else np.sum(actions_data == action)
            print(f"--- TDA Run (Sample 1/{R}): Batch {batch_id}, Action {action} ({text}) ---")
            print(f"Sampling {sample_size} points from {N_total} total states.")
            print(f"Diameter: {current_diameter:.4f}. Threshold: {current_threshold_value:.4f}")
            print(f"H0 significant features: {all_H0_counts[-1]}")
            print(f"H1 significant features: {all_H1_counts[-1]}")

            
    
    avg_diameter = np.mean(all_diameters)
    avg_threshold = threshold_percentage * avg_diameter # The mean of the thresholds used
    
    mean_H0 = np.mean(all_H0_counts); std_H0 = np.std(all_H0_counts)
    mean_H1 = np.mean(all_H1_counts); std_H1 = np.std(all_H1_counts)
    
    print(f"Avg Diameter: {avg_diameter:.4f}. Avg Threshold (20%): {avg_threshold:.4f}")
    print(f"Final Average Betti Numbers over {R} runs:")
    print(f" Avg H0 (components): {mean_H0:.2f} ± {std_H0:.2f}")
    print(f" Avg H1 (loops):   {mean_H1:.2f} ± {std_H1:.2f}")

    return all_diagrams
def compare_multiple_diagrams(diagrams_A, diagrams_B, homology_dim, matching=False):
    """ Calculates the R*R pairwise Wasserstein distances and returns the mean/std dev."""
    distances = []
    for dgm_A in diagrams_A:
        for dgm_B in diagrams_B:
            dist = wasserstein(dgm_A[homology_dim], dgm_B[homology_dim], matching=matching)
            distances.append(dist)
    
    mean_dist = np.mean(distances)
    std_dist = np.std(distances)
    return mean_dist, std_dist

# --- Execution of R-runs for Statistical Robustness ---

R = 10 # Number of sampling runs for statistical stability
print(f"\n--- Running TDA {R} times for each configuration to calculate mean Wasserstein distances ---")
# --- Execution of R-runs for Statistical Robustness ---

R = 10 # Number of sampling runs for statistical stability
print(f"\n{'='*70}\n--- Running TDA {R} times for each configuration to calculate mean Wasserstein distances ---\n{'='*70}")

# Pre-compute all diagrams for batches 0, 3, 10
expLeft_diagrams0 = run_tda_multiple_times_with_counts(R, data_states[0], data_actions[0], 0, 0)
expNeutral_diagrams0 = run_tda_multiple_times_with_counts(R, data_states[0], data_actions[0], 0, 1)
expRight_diagrams0 = run_tda_multiple_times_with_counts(R, data_states[0], data_actions[0], 0, 2)

expLeft_diagrams3 = run_tda_multiple_times_with_counts(R, data_states[3], data_actions[3], 3, 0)
expNeutral_diagrams3 = run_tda_multiple_times_with_counts(R, data_states[3], data_actions[3], 3, 1)
expRight_diagrams3 = run_tda_multiple_times_with_counts(R, data_states[3], data_actions[3], 3, 2)

expLeft_diagrams10 = run_tda_multiple_times_with_counts(R, data_states[10], data_actions[10], 10, 0)
expNeutral_diagrams10 = run_tda_multiple_times_with_counts(R, data_states[10], data_actions[10], 10, 1)
expRight_diagrams10 = run_tda_multiple_times_with_counts(R, data_states[10], data_actions[10], 10, 2)

# --- 1. Compare Opposite Actions Within Batches (Left vs Right) ---
print("\n" + "="*80)
print(f"--- 1. R-run Comparison: Left vs Right Actions (Mean ± Std Dev, R={R}) ---")
print("="*80)

for batch, left_dgms, right_dgms in [(0, expLeft_diagrams0, expRight_diagrams0),
                                     (3, expLeft_diagrams3, expRight_diagrams3),
                                     (10, expLeft_diagrams10, expRight_diagrams10)]:
    mean_h0, std_h0 = compare_multiple_diagrams(left_dgms, right_dgms, 0)
    mean_h1, std_h1 = compare_multiple_diagrams(left_dgms, right_dgms, 1)
    print(f"Batch {batch}: H0 distance (left vs right): {mean_h0:.4f} ± {std_h0:.4f}")
    print(f"Batch {batch}: H1 distance (left vs right): {mean_h1:.4f} ± {std_h1:.4f}")

# --- 2. Compare Learning Progress (Batch 0 vs 3, and Batch 3 vs 10) ---
print("\n" + "="*90)
print(f"--- 2. R-run Comparison: Learning Progress (Batch 0 \u2192 3 and 3 \u2192 10, Mean \u00b1 Std Dev, R={R}) ---")
print("="*90)

# Batch 0 vs Batch 3
print("\n--- Batch 0 vs Batch 3 (Core Training) ---")
for action_name, dim, dgms_A, dgms_B in [
    ("Left", 0, expLeft_diagrams0, expLeft_diagrams3), ("Left", 1, expLeft_diagrams0, expLeft_diagrams3),
    ("Neutral", 0, expNeutral_diagrams0, expNeutral_diagrams3), ("Neutral", 1, expNeutral_diagrams0, expNeutral_diagrams3),
    ("Right", 0, expRight_diagrams0, expRight_diagrams3), ("Right", 1, expRight_diagrams0, expRight_diagrams3)]:
    mean, std = compare_multiple_diagrams(dgms_A, dgms_B, dim)
    print(f"H{dim} distance ({action_name}):    {mean:.4f} ± {std:.4f}")

# Batch 3 vs Batch 10
print("\n--- Batch 3 vs Batch 10 (Post-Training Evolution) ---")
for action_name, dim, dgms_A, dgms_B in [
    ("Left", 0, expLeft_diagrams3, expLeft_diagrams10), ("Left", 1, expLeft_diagrams3, expLeft_diagrams10),
    ("Neutral", 0, expNeutral_diagrams3, expNeutral_diagrams10), ("Neutral", 1, expNeutral_diagrams3, expNeutral_diagrams10),
    ("Right", 0, expRight_diagrams3, expRight_diagrams10), ("Right", 1, expRight_diagrams3, expRight_diagrams10)]:
    mean, std = compare_multiple_diagrams(dgms_A, dgms_B, dim)
    print(f"H{dim} distance ({action_name}):    {mean:.4f} ± {std:.4f}")
