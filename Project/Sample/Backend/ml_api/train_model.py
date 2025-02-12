# Create a new file: Backend/ml_api/train_model.py

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle

# Function to create synthetic data based on career patterns
def create_synthetic_data(n_samples=100):
    np.random.seed(42)
    
    # Career patterns - each tuple contains (career, typical_scores_range)
    career_patterns = {
        'Software Engineer': {
            'extraversion': (4, 7),
            'agreeableness': (6, 8),
            'openness': (7, 9),
            'neuroticism': (4, 6),
            'conscientiousness': (7, 9),
            'math': (7, 9),
            'verbal': (6, 8),
            'logic': (8, 10)
        },
        'Data Scientist': {
            'extraversion': (4, 7),
            'agreeableness': (6, 8),
            'openness': (8, 10),
            'neuroticism': (4, 6),
            'conscientiousness': (8, 10),
            'math': (8, 10),
            'verbal': (6, 8),
            'logic': (8, 10)
        },
        'Teacher': {
            'extraversion': (7, 9),
            'agreeableness': (8, 10),
            'openness': (7, 9),
            'neuroticism': (3, 5),
            'conscientiousness': (8, 10),
            'math': (6, 8),
            'verbal': (8, 10),
            'logic': (7, 9)
        },
        'HR Manager': {
            'extraversion': (8, 10),
            'agreeableness': (8, 10),
            'openness': (7, 9),
            'neuroticism': (3, 5),
            'conscientiousness': (7, 9),
            'math': (6, 8),
            'verbal': (8, 10),
            'logic': (7, 9)
        },
        'Business Analyst': {
            'extraversion': (6, 8),
            'agreeableness': (7, 9),
            'openness': (7, 9),
            'neuroticism': (4, 6),
            'conscientiousness': (8, 10),
            'math': (7, 9),
            'verbal': (8, 10),
            'logic': (8, 10)
        }
    }
    
    data = []
    for career, patterns in career_patterns.items():
        n_career_samples = n_samples // len(career_patterns)
        
        for _ in range(n_career_samples):
            sample = {
                trait: np.random.uniform(low, high) 
                for trait, (low, high) in patterns.items()
            }
            sample['career'] = career
            data.append(sample)
    
    return pd.DataFrame(data)

# Create training data
df = create_synthetic_data(500)  # 500 samples, 100 for each career

# Split features and target
X = df.drop('career', axis=1)
y = df['career']

# Train the model
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42
)
model.fit(X, y)

# Test with your provided example
# Convert scores to 0-10 scale
test_case = {
    'neuroticism': (31/40) * 10,      # 7.75
    'agreeableness': (38/40) * 10,    # 9.5
    'conscientiousness': (34/40) * 10, # 8.5
    'openness': (37/40) * 10,         # 9.25
    'extraversion': (20/40) * 10,     # 5.0
    'math': 5.33,                     # 53.33%
    'verbal': 7.0,                    # 70%
    'logic': 6.0                      # 60%
}

# Create a DataFrame with the test case
test_df = pd.DataFrame([test_case])

# Make prediction
prediction = model.predict(test_df)
print(f"Predicted career for the test case: {prediction[0]}")

# Save the model
with open('career_predictor_model.pkl', 'wb') as file:
    pickle.dump(model, file)

print("Model saved as career_predictor_model.pkl")

# Print feature importances
importance_dict = dict(zip(X.columns, model.feature_importances_))
print("\nFeature Importances:")
for feature, importance in sorted(importance_dict.items(), key=lambda x: x[1], reverse=True):
    print(f"{feature}: {importance:.3f}")