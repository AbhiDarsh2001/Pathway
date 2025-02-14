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
        
        # Validate input
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data received'
            }), 400

        # Check model
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 500

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
                if not (0 <= value <= 100):  # Updated validation range
                    return jsonify({
                        'success': False,
                        'error': f'Score for {feature} must be between 0 and 100'
                    }), 400
                feature_values.append(value)
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': f'Invalid value for {feature}'
                }), 400

        # Create DataFrame
        df = pd.DataFrame([dict(zip(features, feature_values))])
        print("Input DataFrame:", df) # Debug log

        # Make prediction
        prediction = model.predict(df)[0]
        print("Prediction:", prediction) # Debug log
        
        return jsonify({
            'success': True,
            'careerRecommendation': prediction
        })

    except Exception as e:
        print(f"Error in prediction: {str(e)}")  # Debug log
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 