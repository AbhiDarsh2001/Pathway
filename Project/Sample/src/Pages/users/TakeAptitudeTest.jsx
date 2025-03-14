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
    const [testSettings, setTestSettings] = useState(null);
    
    // Add timer states
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [timerActive, setTimerActive] = useState(false);
    const [testStarted, setTestStarted] = useState(false);

    // Get token from localStorage
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchQuestions();
        fetchTestSettings();
    }, []);
    
    // Timer effect
    useEffect(() => {
        let timer;
        if (timerActive && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        handleAutoSubmit(); // Auto-submit when time expires
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        
        return () => clearInterval(timer);
    }, [timerActive, timeRemaining]);

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
    
    const fetchTestSettings = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/aptitude/test-settings`, {
                headers: { Authorization: token }
            });
            
            if (response.data.success) {
                setTestSettings(response.data.data);
                // Set initial time from test settings (converting minutes to seconds)
                setTimeRemaining(response.data.data.duration * 60);
            }
        } catch (error) {
            console.error('Error fetching test settings:', error);
        }
    };
    
    // Format time remaining for display
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    
    const startTest = () => {
        setTestStarted(true);
        setTimerActive(true);
        Swal.fire({
            title: 'Start Test',
            text: `You will have ${testSettings.duration} minutes to complete this test.`,
            icon: 'info',
            confirmButtonText: 'Begin'
        });
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

        // Calculate scores based on answers
        Object.entries(answers).forEach(([questionId, selectedOption]) => {
            const question = questions.find(q => q._id === questionId);
            if (question) {
                const trait = question.trait.toLowerCase();
                traitScores[trait] += selectedOption.score;
            }
        });

        // Log calculated scores for debugging
        console.log('Calculated trait scores:', traitScores);

        // Ensure scores are within the 0-100 range instead of 0-40
        Object.keys(traitScores).forEach(trait => {
            if (traitScores[trait] < 0 || traitScores[trait] > 100) {
                console.error(`Invalid score for ${trait}: ${traitScores[trait]}. Must be between 0 and 100.`);
                throw new Error(`Invalid score for ${trait}. Must be between 0 and 100.`);
            }
        });

        return traitScores;
    };
    
    const handleAutoSubmit = () => {
        Swal.fire({
            title: 'Time\'s Up!',
            text: 'Your test will be automatically submitted.',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK'
        }).then(() => {
            handleSubmit(true);
        });
    };

    const handleSubmit = async (isAutoSubmit = false) => {
        if (Object.keys(answers).length !== questions.length && !isAutoSubmit) {
            setError('Please answer all questions');
            
            Swal.fire({
                title: 'Incomplete Test',
                text: 'Please answer all questions before submitting.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            
            return;
        }
    
        try {
            const scores = calculateTraitScores();
            
            // Log scores before submission
            console.log('Scores to be submitted:', scores);

            const response = await axios.post(
                `${import.meta.env.VITE_URL}/aptitude/submit-test`, 
                { 
                    scores,
                    timeRemaining // Include remaining time in submission
                },
                { 
                    headers: { 
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    } 
                }
            );

            if (response.data.success) {
                // Stop the timer
                setTimerActive(false);
                
                // Display results using SweetAlert2
                Swal.fire({
                    title: isAutoSubmit ? 'Time\'s Up!' : 'Test Submitted Successfully!',
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
            {!testStarted ? (
                <div className="test-intro">
                    <h2>{testSettings?.title || 'Aptitude Test'}</h2>
                    <p>{testSettings?.description || 'Test your cognitive abilities.'}</p>
                    <div className="test-details">
                        <p><strong>Duration:</strong> {testSettings?.duration || 30} minutes</p>
                        <p><strong>Questions:</strong> {questions.length}</p>
                    </div>
                    <button className="start-test-button" onClick={startTest}>
                        Start Test
                    </button>
                </div>
            ) : (
                <>
                    {/* Timer display */}
                    <div className="timer-container">
                        <div className="timer">
                            Time Remaining: {formatTime(timeRemaining)}
                        </div>
                    </div>
                    
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
                                    onClick={() => handleSubmit()}
                                >
                                    Submit Test
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TakeAptitudeTest;