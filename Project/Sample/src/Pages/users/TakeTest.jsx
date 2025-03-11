import React, { useState } from 'react';
import axios from 'axios';
import './TakeTest.css';

const TakeTest = () => {
    const [formData, setFormData] = useState({
        extraversion: 0,
        agreeableness: 0,
        openness: 0,
        neuroticism: 0,
        conscientiousness: 0,
        math: 0,
        verbal: 0,
        logic: 0
    });

    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/career/predict-career`, formData);
            
            if (response.data.success) {
                setPrediction(response.data.careerRecommendation);
            } else {
                setError('Failed to get career prediction');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while predicting career');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="take-test-container">
            <h2>Career Prediction Test</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="test-section">
                    <h3>Personality Traits (Rate from 1-10)</h3>
                    {['Extraversion', 'Agreeableness', 'Openness', 'Neuroticism', 'Conscientiousness'].map(trait => (
                        <div key={trait} className="input-group">
                            <label htmlFor={trait.toLowerCase()}>{trait}:</label>
                            <input
                                type="range"
                                id={trait.toLowerCase()}
                                name={trait.toLowerCase()}
                                min="1"
                                max="10"
                                value={formData[trait.toLowerCase()]}
                                onChange={handleInputChange}
                            />
                            <span>{formData[trait.toLowerCase()]}</span>
                        </div>
                    ))}
                </div>

                <div className="test-section">
                    <h3>Aptitude Scores (Rate from 1-10)</h3>
                    {['Math', 'Verbal', 'Logic'].map(skill => (
                        <div key={skill} className="input-group">
                            <label htmlFor={skill.toLowerCase()}>{skill}:</label>
                            <input
                                type="range"
                                id={skill.toLowerCase()}
                                name={skill.toLowerCase()}
                                min="1"
                                max="10"
                                value={formData[skill.toLowerCase()]}
                                onChange={handleInputChange}
                            />
                            <span>{formData[skill.toLowerCase()]}</span>
                        </div>
                    ))}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Predicting...' : 'Predict Career'}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {prediction && (
                <div className="prediction-result">
                    <h3>Recommended Career Path:</h3>
                    <p>{prediction}</p>
                </div>
            )}
        </div>
    );
};

export default TakeTest; 