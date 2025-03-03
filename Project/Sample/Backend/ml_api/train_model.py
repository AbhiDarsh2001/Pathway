# Create a new file: Backend/ml_api/train_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import pickle
import os
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, accuracy_score, classification_report
import csv
from urllib.parse import quote

# Get the directory where train_model.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'career_training_data.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'career_predictor_model.pkl')

def load_dataset(file_path):
    try:
        # Adjust the delimiter if necessary
        df = pd.read_csv(file_path, delimiter=',', on_bad_lines='skip', encoding='utf-8')
        print("Dataset loaded successfully.")
        return df
    except pd.errors.ParserError as e:
        print(f"Error during loading dataset: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def preprocess_data(df):
    # Drop missing values and separate features/target
    df = df.dropna()
    X = df.drop('career', axis=1)  # Ensure 'career' is the correct target column name
    y = df['career']
    return X, y

def train_model(X, y):
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Standardize the features
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    
    # Define and train the Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy}")
    print("Classification Report:\n", classification_report(y_test, y_pred))

    return model

if __name__ == "__main__":
    print("Loading dataset...")
    dataset = load_dataset(DATA_PATH)
    
    if dataset is not None:
        print("Preprocessing data...")
        X, y = preprocess_data(dataset)
        
        print("Training model...")
        model = train_model(X, y)        
        # Save the trained model
        with open(MODEL_PATH, 'wb') as file:
            pickle.dump(model, file)
        print(f"Model saved to {MODEL_PATH}")

    with open('career_training_data.csv', 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        for i, row in enumerate(reader):
            print(f"Row {i}: {row}")
            if i > 5:  # Limit output to first few rows
                break
