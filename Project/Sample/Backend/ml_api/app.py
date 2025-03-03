from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Get the directory where app.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'career_predictor_model.pkl')

# Load the pre-trained model
try:
    with open(MODEL_PATH, 'rb') as file:
        model = pickle.load(file)
    print("Model loaded successfully")
except FileNotFoundError:
    print(f"Error: Model file not found at {MODEL_PATH}")
    model = None
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None

@app.route('/predict-manual', methods=['POST'])
def predict_manual():
    try:
        print("Received request") # Debug log
        data = request.get_json()
        print("Request data:", data) # Debug log
        
        features = [
            'extraversion', 'agreeableness', 'openness', 
            'neuroticism', 'conscientiousness',
            'math', 'verbal', 'logic'
        ]
        
        # Print available classes from the model
        print("Available career classes:", model.classes_)
        
        # Validate and collect features
        feature_values = []
        for feature in features:
            if feature not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {feature}'
                }), 400
            
            try:
                value = float(data[feature])
                if not (0 <= value <= 100):
                    return jsonify({
                        'success': False,
                        'error': f'Score for {feature} must be between 0 and 100'
                    }), 400
                feature_values.append(value/100.0)  # Normalize to 0-1 range
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': f'Invalid value for {feature}'
                }), 400

        # Create DataFrame
        df = pd.DataFrame([dict(zip(features, feature_values))])
        print("Normalized Input DataFrame:", df) # Debug log

        # Make prediction
        probabilities = model.predict_proba(df)[0]  # Get probability predictions
        
        # Print probabilities for each class
        for class_name, prob in zip(model.classes_, probabilities):
            print(f"Probability for {class_name}: {prob:.4f}")
            
        # Get top 3 career indices
        top_3_indices = probabilities.argsort()[-3:][::-1]
        
        # Convert indices to career names
        career_recommendations = [model.classes_[i] for i in top_3_indices]
        
        print("Final career recommendations:", career_recommendations) # Debug log
        
        return jsonify({
            'success': True,
            'careerRecommendations': career_recommendations,
            'probabilities': {
                career: float(prob) 
                for career, prob in zip(model.classes_, probabilities)
            }
        })

    except Exception as e:
        print(f"Error in prediction: {str(e)}")  # Debug log
        print(f"Full error details: ", str(e.__dict__))  # More detailed error info
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 