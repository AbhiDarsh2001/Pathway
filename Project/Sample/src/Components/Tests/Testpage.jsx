import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from '../../Components/Function/useAuth';
import './TestBox.css';

const QuizPage = () => {
    useAuth();
  const { testId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);
  
  // Add new state variables for timer
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_URL}/test/test/${testId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data) {
          throw new Error('Quiz not found');
        }
        
        setQuiz(data);
        // Set initial time from quiz duration (converting minutes to seconds)
        setTimeRemaining(data.duration * 60);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchQuiz();
    }
  }, [testId]);

  // Add timer effect
  useEffect(() => {
    let timer;
    if (timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(true); // Auto submit when time expires
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  // Format time remaining
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    setTimerActive(true);
    // You might want to show a confirmation dialog here
    Swal.fire({
      title: 'Start Test?',
      text: `You will have ${quiz.duration} minutes to complete this test.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Start',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setTimerActive(true);
      }
    });
  };

  const handleOptionChange = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (submitted) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const answersArray = quiz.questions.map((_, index) => ({
        questionIndex: index,
        selectedOption: answers[index] !== undefined ? answers[index] : null
      }));

      const response = await fetch(`${import.meta.env.VITE_URL}/test/submit/${testId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ 
          answers: answersArray,
          timeRemaining // Include remaining time in submission
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit quiz');
      }

      setSubmitted(true);
      setScore(data.score);
      setTimerActive(false);
      
      Swal.fire({
        title: isAutoSubmit ? 'Time\'s Up!' : 'Quiz Submitted!',
        text: `Your score: ${data.score}/${data.totalPossibleScore} (${data.percentage.toFixed(2)}%)`,
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (err) {
      console.error("Error submitting quiz:", err);
      Swal.fire({
        title: 'Error!',
        text: err.message || 'Failed to submit quiz',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container">Loading quiz...</div>;
  if (error) return (
    <div className="error-container">
      <p>Error: {error}</p>
      <button onClick={() => navigate('/tests')}>Back to Tests</button>
    </div>
  );
  if (!quiz) return <div className="not-found-container">Quiz not found</div>;

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img
            src="src/assets/CareerPathway.png"
            alt="Career Pathway Logo"
            className="logo"
          />
        </div>
        
        <div className="sidebar-nav">
          <Link to="/home" className="nav-item">Home</Link>
          <Link to="/ujoblist" className="nav-item">Jobs</Link>
          <Link to="/ucourselist" className="nav-item">Courses</Link>
          <Link to="/ubloglist" className="nav-item">Blogs</Link>
          <Link to="/tests" className="nav-item">Tests</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        {loading && <div className="loading">Loading quiz...</div>}
        {error && (
          <div className="error">
            <p>Error: {error}</p>
            <button className="start-test-btn" onClick={() => navigate('/tests')}>
              Back to Tests
            </button>
          </div>
        )}
        {!loading && !error && quiz && (
          <div className="welcome-section">
            <div className="quiz-container">
              <div className="quiz-header">
                <h1>{quiz.title}</h1>
                {timerActive && (
                  <div className="timer">
                    Time Remaining: {formatTime(timeRemaining)}
                  </div>
                )}
              </div>

              {!timerActive ? (
                <div className="start-section">
                  <h2>Test Instructions</h2>
                  <p>Duration: {quiz.duration} minutes</p>
                  <p>Total Marks: {quiz.totalMarks}</p>
                  <p>{quiz.description}</p>
                  <button 
                    className="start-test-btn"
                    onClick={startTest}
                  >
                    Start Test
                  </button>
                </div>
              ) : (
                <div className="quiz-content">
                  {quiz.questions?.map((q, qIndex) => (
                    <div key={qIndex} style={{ 
                      marginBottom: "20px", 
                      padding: "15px", 
                      border: "1px solid #ddd", 
                      borderRadius: "10px", 
                      backgroundColor: "#f9f9f9" 
                    }}>
                      <h3>Q{qIndex + 1}. {q.questionText}</h3>
                      {q.options?.map((option, oIndex) => (
                        <label key={oIndex} style={{ 
                          display: "block", 
                          margin: "10px 0",
                          padding: "8px",
                          cursor: submitted ? "default" : "pointer",
                          backgroundColor: answers[qIndex] === oIndex ? "#e3f2fd" : "transparent",
                          borderRadius: "5px"
                        }}>
                          <input 
                            type="radio" 
                            name={`question-${qIndex}`} 
                            value={oIndex} 
                            checked={answers[qIndex] === oIndex}
                            onChange={() => handleOptionChange(qIndex, oIndex)}
                            disabled={submitted}
                          />
                          {option.optionText}
                        </label>
                      ))}
                      <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                        Marks: {q.marks}
                      </p>
                    </div>
                  ))}

                  {!submitted ? (
                    <button 
                      onClick={() => handleSubmit()} 
                      disabled={loading}
                      className="start-test-btn"
                    >
                      {loading ? "Submitting..." : "Submit Quiz"}
                    </button>
                  ) : (
                    <div className="success-message">
                      <p>Quiz submitted! Your responses have been recorded.</p>
                      <p>Score: {score}</p>
                      <button 
                        className="start-test-btn"
                        onClick={() => navigate('/tests')}
                      >
                        Back to Tests
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
