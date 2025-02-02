import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TestBox = () => {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/test/viewallmocktest")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch mock tests');
        }
        return response.json();
      })
      .then((data) => {
        setMockTests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching mock tests:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-container">Loading tests...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!mockTests.length) return <div className="no-data-container">No tests available</div>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
      {mockTests.map((test) => (
        <div 
          key={test._id} 
          onClick={() => navigate(`/quiz/${test._id}`)} 
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            width: "250px",
            backgroundColor: "#fff",
            cursor: "pointer",
            transition: "transform 0.2s",
            '&:hover': {
              transform: "scale(1.02)"
            }
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{test.title}</h2>
          <p style={{ fontSize: "14px", color: "#555" }}>Total Marks: {test.totalMarks}</p>
          <p style={{ fontSize: "14px", color: "#666" }}>Duration: {test.duration} mins</p>
        </div>
      ))}
    </div>
  );
};

export default TestBox;
