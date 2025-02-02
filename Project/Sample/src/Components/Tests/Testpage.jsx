import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QuizPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const response = await fetch(`http://localhost:8080/test/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          testId,
          answers 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await response.json();
      setSubmitted(true);
      console.log("Quiz submitted successfully", result);
    } catch (err) {
      console.error("Error submitting quiz:", err);
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
          <button onClick={() => navigate('/tests')}>Back to Tests</button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
