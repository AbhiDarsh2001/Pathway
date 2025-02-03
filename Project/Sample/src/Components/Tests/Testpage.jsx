import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const QuizPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/test/test/${testId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data) {
          throw new Error('Quiz not found');
        }
        
        setQuiz(data);
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

  const handleOptionChange = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert answers object to array format
      const answersArray = quiz.questions.map((_, index) => {
        return {
          questionIndex: index,
          selectedOption: answers[index] !== undefined ? answers[index] : null
        };
      });

      // Log the data being sent
      console.log('Submitting answers:', answersArray);

      const response = await fetch(`http://localhost:8080/test/submit/${testId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', data);
        throw new Error(data.message || 'Failed to submit quiz');
      }

      setSubmitted(true);
      setScore(data.score);
      
      Swal.fire({
        title: 'Quiz Submitted!',
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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>{quiz.title}</h1>
      <p><strong>Duration:</strong> {quiz.duration} minutes</p>
      <p><strong>Total Marks:</strong> {quiz.totalMarks}</p>
      <p><strong>Description:</strong> {quiz.description}</p>
      
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
          onClick={handleSubmit} 
          disabled={loading}
          style={{ 
            padding: "10px 20px", 
            backgroundColor: loading ? "#ccc" : "#007bff", 
            color: "#fff", 
            border: "none", 
            borderRadius: "5px", 
            cursor: loading ? "not-allowed" : "pointer" 
          }}
        >
          {loading ? "Submitting..." : "Submit Quiz"}
        </button>
      ) : (
        <div className="success-message">
          <p>Quiz submitted! Your responses have been recorded.</p>
          <p>Score: {score}</p>
          <button onClick={() => navigate('/tests')}>Back to Tests</button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
