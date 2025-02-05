import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from '../../Components/Function/useAuth';
import './TestBox.css';

const TestBox = () => {
  useAuth();
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
          <Link to="/blogs" className="nav-item">Blogs</Link>
          <Link to="/tests" className="nav-item">Tests</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="welcome-section">
          <div className="section-header">
            <h2>Available Tests</h2>
            {/* <div className="search-box">
              <input type="text" placeholder="Search tests..." className="search-input" />
            </div> */}
          </div>

          {loading && <div className="loading">Loading tests...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && !mockTests.length && (
            <div className="empty">No tests available</div>
          )}

          <div className="tests-container">
            {mockTests.map((test) => (
              <div 
                key={test._id} 
                className="test-box"
                onClick={() => navigate(`/quiz/${test._id}`)}
              >
                <h2 className="test-title">{test.title}</h2>
                <div className="test-details">
                  <span>Total Marks: {test.totalMarks}</span>
                  {/* <span>Duration: {test.duration} mins</span> */}
                </div>
                <button className="start-test-btn">Start Test</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBox;
