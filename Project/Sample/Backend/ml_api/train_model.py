# Create a new file: Backend/ml_api/train_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report
import joblib
import os
import seaborn as sns
import matplotlib.pyplot as plt
import csv
from urllib.parse import quote

from sklearn.linear_model import LinearRegression
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
    # Drop missing values
    df = df.dropna()
    
    # Group rare careers (optional)
    # Count occurrences of each career
    career_counts = df['career'].value_counts()
    
    # Careers with fewer than 3 occurrences are marked as "Other"
    rare_careers = career_counts[career_counts < 3].index
    df.loc[df['career'].isin(rare_careers), 'career'] = 'Other'
    
    X = df.drop('career', axis=1)
    y = df['career']
    return X, y

def train_model(X, y):
    # First encode all labels to ensure all classes are known to the encoder
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Use stratified sampling to ensure each class appears in both train and test sets
    X_train, X_test, y_train_encoded, y_test_encoded = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    # Convert back to original labels for clarity in reporting
    y_train = label_encoder.inverse_transform(y_train_encoded)
    y_test = label_encoder.inverse_transform(y_test_encoded)
    
    # Train a random forest classifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train_encoded)
    
    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Calculate evaluation metrics
    accuracy = accuracy_score(y_test_encoded, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test_encoded, y_pred, average='weighted')

    print("\n--- Model Evaluation Metrics ---")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1-score: {f1:.4f}")

    # Print detailed classification report
    print("\n--- Detailed Classification Report ---")
    # Use only the classes that are actually present in the test set
    unique_classes = np.unique(np.concatenate((y_test_encoded, y_pred)))
    class_names_present = label_encoder.inverse_transform(unique_classes)
    
    # Generate report with only the classes present in test data
    print(classification_report(y_test_encoded, y_pred, 
                               labels=unique_classes,
                               target_names=class_names_present))

    return model, label_encoder

if __name__ == "__main__":
    print("Loading dataset...")
    dataset = load_dataset(DATA_PATH)
    
    if dataset is not None:
        print("Preprocessing data...")
        X, y = preprocess_data(dataset)
        
        print("Training model...")
        model, label_encoder = train_model(X, y)
        
        # Save the trained model and label encoder
        model_dir = os.path.join(BASE_DIR, "models")
        os.makedirs(model_dir, exist_ok=True)

        joblib.dump(model, os.path.join(model_dir, "career_model.pkl"))
        joblib.dump(label_encoder, os.path.join(model_dir, "label_encoder.pkl"))
        print(f"\nModel saved to {model_dir}/career_model.pkl")
        print(f"Label encoder saved to {model_dir}/label_encoder.pkl")

        # Print feature importance
        feature_names = ["extraversion", "agreeableness", "openness", "neuroticism", 
                         "conscientiousness", "math", "verbal", "logic"]
        importances = model.feature_importances_
        indices = np.argsort(importances)[::-1]

        print("\n--- Feature Importance ---")
        for i in range(len(feature_names)):
            print(f"{feature_names[indices[i]]}: {importances[indices[i]]:.4f}")

    with open(DATA_PATH, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        for i, row in enumerate(reader):
            print(f"Row {i}: {row}")
            if i > 5:  # Limit output to first few rows
                break
