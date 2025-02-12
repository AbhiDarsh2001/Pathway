from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
from sklearn.exceptions import NotFittedError

app = Flask(__name__)
CORS(app)

# Load the pre-trained model
try:
    with open('career_predictor_model.pkl', 'rb') as file:
        model = pickle.load(file)
except FileNotFoundError:
    print("Error: Model file not found!")
    model = None

@app.route('/predict-career', methods=['POST'])
def predict_career():
    try:
        data = request.get_json()
        
        # Extract features in the correct order
        features = np.array([
            data['extraversion'],
            data['agreeableness'],
            data['openness'],
            data['neuroticism'],
            data['conscientiousness'],
            data['math'],
            data['verbal'],
            data['logic']
        ]).reshape(1, -1)

        if model is None:
            return jsonify({
                'error': 'Model not loaded'
            }), 500

        # Make prediction
        prediction = model.predict(features)[0]
        
        return jsonify({
            'careerRecommendation': prediction
        })

    except NotFittedError:
        return jsonify({
            'error': 'Model not fitted'
        }), 500
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True) 