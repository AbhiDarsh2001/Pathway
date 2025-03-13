import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import sweetalert2
import './TakeAptitudeTest.css';
import useAuth from '../../Components/Function/useAuth';

const TakeAptitudeTest = () => {
    useAuth(); // Add authentication check
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Get token from localStorage
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/aptitude/questions`, {
                headers: { Authorization: token }
            });
            setQuestions(response.data.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch questions');
            setLoading(false);
            if (error.response?.status === 403) {
                navigate('/login');
            }
        }
    };

    const handleAnswer = (questionId, selectedOption) => {
        setAnswers({
            ...answers,
            [questionId]: selectedOption
        });
        
        // Automatically move to next question if not the last question
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(curr => curr + 1);
        }
    };

    const calculateTraitScores = () => {
        const traitScores = {
            math: 0,
            verbal: 0,
            logic: 0
        };

        // Calculate scores based on answers (keeping original 0-40 scale)
        Object.entries(answers).forEach(([questionId, selectedOption]) => {
            const question = questions.find(q => q._id === questionId);
            if (question) {
                const trait = question.trait.toLowerCase();
                traitScores[trait] += selectedOption.score; // Keep original score (0-40)
            }
        });

        // Log calculated scores for debugging
        console.log('Calculated trait scores:', traitScores);

        // Ensure scores are within the 0-40 range
        Object.keys(traitScores).forEach(trait => {
            if (traitScores[trait] < 0 || traitScores[trait] > 40) {
                console.error(`Invalid score for ${trait}: ${traitScores[trait]}. Must be between 0 and 40.`);
                throw new Error(`Invalid score for ${trait}. Must be between 0 and 40.`);
            }
        });

        return traitScores;
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length !== questions.length) {
            setError('Please answer all questions');
            return;
        }
    
        try {
            const scores = calculateTraitScores();
            
            // Log scores before submission
            console.log('Scores to be submitted:', scores);

            const response = await axios.post(
                `${import.meta.env.VITE_URL}/aptitude/submit-test`, 
                { scores },
                { 
                    headers: { 
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    } 
                }
            );

            if (response.data.success) {
                // Display results using SweetAlert2
                Swal.fire({
                    title: 'Test Submitted Successfully!',
                    html: `<p>Your scores are:</p>
                           <ul>
                             <li>Math: ${scores.math}</li>
                             <li>Verbal: ${scores.verbal}</li>
                             <li>Logic: ${scores.logic}</li>
                           </ul>`,
                    icon: 'success',
                    confirmButtonText: 'Go to Tests',
                }).then(() => {
                    navigate('/tests');
                });
            } else {
                setError(response.data.message || 'Failed to submit test');
            }
        } catch (error) {
            console.error('Submit error:', error.response?.data || error);
            setError(error.response?.data?.message || 'Failed to submit test');
            if (error.response?.status === 403) {
                navigate('/login');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (questions.length === 0) return <div>No questions available</div>;

    return (
        <div className="take-aptitude-test-container">
            <div className="progress-bar">
                <div 
                    className="progress"
                    style={{ width: `${(currentQuestion + 1) / questions.length * 100}%` }}
                />
            </div>

            <div className="question-card">
                <h2>Question {currentQuestion + 1} of {questions.length}</h2>
                <p className="question-text">{questions[currentQuestion].question}</p>

                <div className="options-list">
                    {questions[currentQuestion].options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-button ${
                                answers[questions[currentQuestion]._id]?.text === option.text 
                                    ? 'selected' 
                                    : ''
                            }`}
                            onClick={() => handleAnswer(questions[currentQuestion]._id, option)}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
                <div className="navigation-buttons">
          {currentQuestion > 0 && (
            <button
              className="nav-button"
              onClick={() => setCurrentQuestion(curr => curr - 1)}
            >
              Previous
            </button>
          )}
          
          {currentQuestion < questions.length - 1 ? (
            <button
              className="nav-button"
              onClick={() => setCurrentQuestion(curr => curr + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="submit-button"
              onClick={handleSubmit}
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeAptitudeTest;