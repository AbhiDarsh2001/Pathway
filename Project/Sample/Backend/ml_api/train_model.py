# Create a new file: Backend/ml_api/train_model.py

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import pickle
import os
import seaborn as sns
import matplotlib.pyplot as plt

# Get the directory where train_model.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'career_training_data.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'career_predictor_model.pkl')

def train_model():
    try:
        # Load the training data
        print("Loading training data...")
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Training data not found at {DATA_PATH}")
            
        df = pd.read_csv(DATA_PATH)
        print(f"Loaded {len(df)} training samples")
        
        # Print data summary
        print("\nData Summary:")
        print(df['career'].value_counts())
        
        # Define features and target
        feature_columns = [
            'extraversion', 'agreeableness', 'openness', 
            'neuroticism', 'conscientiousness',
            'math', 'verbal', 'logic'
        ]
        
        X = df[feature_columns]
        y = df['career']
        
        # Split data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Create and train the model
        print("\nTraining model...")
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        model.fit(X_train, y_train)
        
        # Evaluate the model
        print("\nModel Evaluation:")
        y_pred = model.predict(X_test)
        print(classification_report(y_test, y_pred))
        
        # Create confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        plt.figure(figsize=(10,8))
        sns.heatmap(cm, annot=True, fmt='d', 
                   xticklabels=model.classes_,
                   yticklabels=model.classes_)
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.savefig(os.path.join(BASE_DIR, 'confusion_matrix.png'))
        plt.close()
        
        # Print feature importances
        importance_dict = dict(zip(feature_columns, model.feature_importances_))
        print("\nFeature Importances:")
        for feature, importance in sorted(
            importance_dict.items(), 
            key=lambda x: x[1], 
            reverse=True
        ):
            print(f"{feature}: {importance:.3f}")
        
        # Visualize feature importances
        plt.figure(figsize=(10,6))
        features_df = pd.DataFrame({
            'feature': feature_columns,
            'importance': model.feature_importances_
        })
        sns.barplot(x='importance', y='feature', data=features_df.sort_values('importance'))
        plt.title('Feature Importance')
        plt.savefig(os.path.join(BASE_DIR, 'feature_importance.png'))
        plt.close()
        
        # Save the model
        with open(MODEL_PATH, 'wb') as file:
            pickle.dump(model, file)
        print(f"\nModel saved to {MODEL_PATH}")
        
        # Test predictions
        print("\nTest Predictions:")
        test_cases = [
            {
                'extraversion': 75,
                'agreeableness': 80,
                'openness': 85,
                'neuroticism': 45,
                'conscientiousness': 85,
                'math': 95,
                'verbal': 80,
                'logic': 90
            },
            {
                'extraversion': 90,
                'agreeableness': 95,
                'openness': 80,
                'neuroticism': 35,
                'conscientiousness': 90,
                'math': 70,
                'verbal': 95,
                'logic': 80
            }
        ]
        
        for i, test_case in enumerate(test_cases, 1):
            test_df = pd.DataFrame([test_case])
            prediction = model.predict(test_df)
            probabilities = model.predict_proba(test_df)
            print(f"\nTest Case {i}:")
            print(f"Prediction: {prediction[0]}")
            print("Career Probabilities:")
            for career, prob in zip(model.classes_, probabilities[0]):
                print(f"{career}: {prob:.2%}")
        
        return True
        
    except Exception as e:
        print(f"Error in training model: {str(e)}")
        return False

if __name__ == "__main__":
    train_model()