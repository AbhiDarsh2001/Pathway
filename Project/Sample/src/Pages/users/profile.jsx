import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './profile.css'
import Header from './Header';
import useAuth from '../../Components/Function/useAuth';

function Profile() {
  useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState([]);
  const [personalityResults, setPersonalityResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch user profile and test results
        const userResponse = await axios.get(`${import.meta.env.VITE_URL}/vuprofile`, {
          headers: { Authorization: token }
        });
        setUser(userResponse.data);
        setPersonalityResults(userResponse.data.personalityResults);

        // Fetch aptitude test results
        const testResponse = await axios.get(`${import.meta.env.VITE_URL}/test/results/${userResponse.data.email}`, {
          headers: { Authorization: token }
        });
        const validResults = testResponse.data.filter(result => result.testId != null);
        setTestResults(validResults);
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const getTraitDescription = (trait, score) => {
    const level = score <= 13 ? 'Low' : score <= 26 ? 'Moderate' : 'High';
    
    const descriptions = {
      Openness: {
        Low: 'Prefers routine and familiar experiences',
        Moderate: 'Balance between tradition and new experiences',
        High: 'Curious and open to new experiences'
      },
      Conscientiousness: {
        Low: 'Flexible and spontaneous',
        Moderate: 'Balanced between organized and flexible',
        High: 'Organized and detail-oriented'
      },
      Extraversion: {
        Low: 'Reserved and thoughtful',
        Moderate: 'Balance between social and solitary',
        High: 'Outgoing and energized by social interaction'
      },
      Agreeableness: {
        Low: 'Direct and straightforward',
        Moderate: 'Balance between competitive and cooperative',
        High: 'Cooperative and compassionate'
      },
      Neuroticism: {
        Low: 'Calm and emotionally stable',
        Moderate: 'Balanced emotional responses',
        High: 'Sensitive and emotionally responsive'
      }
    };

    return descriptions[trait][level];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

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
          <Link to="/home" className="nav-item">
            Home
          </Link>
          <Link to="/ujoblist" className="nav-item">
            Jobs
          </Link>
          <Link to="/ucourselist" className="nav-item">
            Courses
          </Link>
          <Link to="/blogs" className="nav-item">
            Blogs
          </Link>
          <Link to="/tests" className="nav-item">
            Tests
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        <Header />
        <div className="uprofile-container">
          <h1>User Profile</h1>
          
          {/* Personal Information Section */}
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{user.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{user.phone}</span>
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          {(user.marks?.tenthMark > 0 || user.marks?.twelthMark > 0 || 
            user.marks?.degreeMark > 0 || user.marks?.pgMark > 0) && (
            <div className="profile-section">
              <h2>Academic Information</h2>
              <div className="info-grid">
                {user.marks?.tenthMark > 0 && (
                  <div className="info-item">
                    <label>10th Mark:</label>
                    <span>{user.marks.tenthMark}%</span>
                  </div>
                )}
                {user.marks?.twelthMark > 0 && (
                  <div className="info-item">
                    <label>12th Mark:</label>
                    <span>{user.marks.twelthMark}%</span>
                  </div>
                )}
                {user.marks?.degreeMark > 0 && (
                  <div className="info-item">
                    <label>Degree Mark:</label>
                    <span>{user.marks.degreeMark}%</span>
                  </div>
                )}
                {user.marks?.pgMark > 0 && (
                  <div className="info-item">
                    <label>PG Mark:</label>
                    <span>{user.marks.pgMark}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aptitude Test Results Section */}
          {testResults.length > 0 && (
            <div className="profile-section">
              <h2>Aptitude Test Results</h2>
              <div className="test-results-grid">
                {testResults.map((result, index) => (
                  result.testId && (
                    <div key={index} className="test-result-item">
                      <h3>{result.testId.title}</h3>
                      <div className="result-details">
                        <p>Score: {result.score} / {result.testId.totalMarks}</p>
                        <p>Percentage: {((result.score / result.testId.totalMarks) * 100).toFixed(2)}%</p>
                        <p>Taken on: {new Date(result.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Personality Test Results Section */}
          {personalityResults && (
            <div className="profile-section">
              <h2>Personality Test Results</h2>
              <div className="traits-grid">
                {Object.entries(personalityResults.scores).map(([trait, score]) => (
                  <div key={trait} className="trait-card">
                    <h4>{trait}</h4>
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ width: `${(score / 40) * 100}%` }}
                      />
                    </div>
                    <p className="score-value">{score}/40</p>
                    <p className="trait-description">{getTraitDescription(trait, score)}</p>
                  </div>
                ))}
              </div>
              <p className="test-date">
                Test taken on: {new Date(personalityResults.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          <button className="uprofilebutton" onClick={() => navigate('/userpro')}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;