import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import datasets as skld
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score


class LinearRegressionModel:
    def __init__(self):
        self.grad =  np.random.rand()
        self.intercept =  np.random.rand()
        self.velGrad = 0
        self.velInter = 0
        self.rho = 0.8

    #calculate cost
    def cost(self,dataX,dataY):
        cost = 0
        for i in range(len(dataY)):
            cost = cost + ((self.grad*dataX[i]+self.intercept)-dataY[i])**2
        cost = (cost/len(dataY))
        return cost
    def DerivCostGrad(self,dataX,dataY):
        cost = 0
        for i in range(len(dataY)):
            cost = cost + ((self.grad*dataX[i]+self.intercept)-dataY[i])*dataX[i]
        cost = (cost/len(dataY))
        return cost
    def DerivCostInter(self,dataX,dataY):
        cost = 0
        for i in range(len(dataY)):
            cost = cost + ((self.grad*dataX[i]+self.intercept)-dataY[i])
        cost = (cost/len(dataY))
        return cost
    def GradientDescent(self,dataX,dataY,epochs,learningRate):
        lr = learningRate
        self.velGrad = 0
        self.velInter = 0
        for i in range(epochs):
            #self.PrintCost(dataX,dataY)
            GradCost = (self.DerivCostGrad(dataX,dataY))
            InterceptCost = (self.DerivCostInter(dataX,dataY))
            self.velGrad = self.rho* self.velGrad - lr*GradCost
            self.grad = self.grad +  self.velGrad
            self.velInter = self.rho* self.velInter - lr*InterceptCost
            self.intercept = self.intercept +  self.velInter
    def PrintCost(self,dataX,dataY):
        print("The cost is:",self.cost(dataX,dataY))
        pass
    def PrintData(self):
        print("The gradient is:",self.grad)
        print("The y intercept is:",self.intercept)
        pass
    def VisualiseData(self,dataX,dataY):
        x = np.linspace(min(dataX),max(dataX))
        plt.title("Visualisation of data")
        plt.scatter(dataX,dataY)
        plt.plot(x,self.grad*x+self.intercept,c="red")
        plt.show()


# Load California housing dataset
california = skld.fetch_california_housing()

# Convert to DataFrame
df = pd.DataFrame(california.data, columns=california.feature_names)
df['target'] = california.target  # Median house value

# Extract 'MedInc' (Median Income) as X and house price as Y
X = df['MedInc'].values
Y = df['target'].values  # House prices in $100,000s



# Reshape X for sklearn
X_sklearn = df[['MedInc']].values

# Train sklearn model
sk_model = LinearRegression()
sk_model.fit(X_sklearn, Y)

# Train custom model
model = LinearRegressionModel()
model.GradientDescent(X_sklearn, Y, epochs=500, learningRate=0.1)

# Predictions
custom_pred = model.grad * X_sklearn + model.intercept
sk_pred = sk_model.predict(X_sklearn)

# Print model comparison
print("\n--- Custom Model Parameters ---")
print(f"Gradient: {model.grad}")
print(f"Intercept: {model.intercept}")

print("\n--- Scikit-Learn Model Parameters ---")
print(f"Gradient: {sk_model.coef_[0]}")
print(f"Intercept: {sk_model.intercept_}")

# Performance Metrics
custom_mse = mean_squared_error(Y, custom_pred)
sk_mse = mean_squared_error(Y, sk_pred)
custom_r2 = r2_score(Y, custom_pred)
sk_r2 = r2_score(Y, sk_pred)

print("\n--- Model Performance ---")
print(f"Custom Model - MSE: {custom_mse}, R²: {custom_r2}")
print(f"Scikit-Learn Model - MSE: {sk_mse}, R²: {sk_r2}")

# Visualization
plt.figure(figsize=(8, 5))
plt.scatter(X, Y, label="Actual Data", alpha=0.6)
plt.plot(X, custom_pred, color="red", label="Custom Model")
plt.plot(X, sk_pred, color="green", linestyle="dashed", label="Scikit-Learn Model")
plt.xlabel("Median Income")
plt.ylabel("House Price ($100,000s)")
plt.title("Custom vs Scikit-Learn Linear Regression (California Housing)")
plt.legend()
plt.show()