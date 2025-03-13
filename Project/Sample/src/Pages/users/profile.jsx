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
  const [personalityResults, setPersonalityResults] = useState(null);
  const [personalityTraits, setPersonalityTraits] = useState({
    extraversion: 0,
    agreeableness: 0,
    openness: 0,
    neuroticism: 0,
    conscientiousness: 0
  });
  const [aptitudeScores, setAptitudeScores] = useState({
    math: 0,
    verbal: 0,
    logic: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch user profile
        const userResponse = await axios.get(`${import.meta.env.VITE_URL}/vuprofile`, {
          headers: { Authorization: token }
        });
        setUser(userResponse.data);
        setPersonalityResults(userResponse.data.personalityResults);
        
        // Fetch detailed personality scores
        const personalityResponse = await fetch(
          `${import.meta.env.VITE_URL}/personal/results`,
          { headers: { Authorization: token } }
        );
        
        if (personalityResponse.ok) {
          const personalityData = await personalityResponse.json();
          
          if (personalityData.data && personalityData.data.scores) {
            const personalityScores = personalityData.data.scores;
            setPersonalityTraits({
              extraversion: (personalityScores.extraversion * 2.5),
              agreeableness: (personalityScores.agreeableness * 2.5),
              openness: (personalityScores.openness * 2.5),
              neuroticism: (personalityScores.neuroticism * 2.5),
              conscientiousness: (personalityScores.conscientiousness * 2.5)
            });
          }
        }
        
        // Fetch aptitude scores
        const aptitudeResponse = await fetch(
          `${import.meta.env.VITE_URL}/aptitude/results`,
          { headers: { Authorization: token } }
        );
        
        if (aptitudeResponse.ok) {
          const aptitudeData = await aptitudeResponse.json();
          
          if (aptitudeData.success && aptitudeData.data && aptitudeData.data.scores) {
            setAptitudeScores({
              math: aptitudeData.data.scores.math,
              verbal: aptitudeData.data.scores.verbal,
              logic: aptitudeData.data.scores.logic
            });
          }
        }
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

  const getTraitScoreDescription = (trait, percentage) => {
    let level;
    if (percentage <= 33) level = 'Low';
    else if (percentage <= 66) level = 'Moderate';
    else level = 'High';
    
    const descriptions = {
      extraversion: {
        Low: 'Reserved and thoughtful',
        Moderate: 'Balance between social and solitary',
        High: 'Outgoing and energized by social interaction'
      },
      agreeableness: {
        Low: 'Direct and straightforward',
        Moderate: 'Balance between competitive and cooperative',
        High: 'Cooperative and compassionate'
      },
      openness: {
        Low: 'Prefers routine and familiar experiences',
        Moderate: 'Balance between tradition and new experiences',
        High: 'Curious and open to new experiences'
      },
      neuroticism: {
        Low: 'Calm and emotionally stable',
        Moderate: 'Balanced emotional responses',
        High: 'Sensitive and emotionally responsive'
      },
      conscientiousness: {
        Low: 'Flexible and spontaneous',
        Moderate: 'Balanced between organized and flexible',
        High: 'Organized and detail-oriented'
      }
    };

    return descriptions[trait][level];
  };
  
  const getAptitudeDescription = (skill, score) => {
    let level;
    if (score <= 33) level = 'Developing';
    else if (score <= 66) level = 'Proficient';
    else level = 'Advanced';
    
    const descriptions = {
      math: {
        Developing: 'Basic mathematical operations. Consider additional practice.',
        Proficient: 'Good grasp of mathematical concepts. Continue to challenge yourself.',
        Advanced: 'Excellent mathematical abilities. Consider pursuing math-intensive fields.'
      },
      verbal: {
        Developing: 'Basic verbal reasoning. Focus on improving communication skills.',
        Proficient: 'Good verbal and communication skills. Continue to expand vocabulary.',
        Advanced: 'Excellent verbal abilities. Well-suited for communication-intensive roles.'
      },
      logic: {
        Developing: 'Basic logical reasoning. Work on developing analytical skills.',
        Proficient: 'Good logical thinking abilities. Continue working on problem-solving.',
        Advanced: 'Excellent logical reasoning. Consider careers requiring analytical thinking.'
      }
    };

    return descriptions[skill][level];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return <div className="error-container">No user data found. Please log in again.</div>;
  }

  // Calculate first name for display
  const firstName = user.name ? user.name.split(' ')[0] : '';
  
  // Get initial for avatar
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
            <i className="fas fa-home"></i> Home
          </Link>
          <Link to="/ujoblist" className="nav-item">
            <i className="fas fa-briefcase"></i> Jobs
          </Link>
          <Link to="/ucourselist" className="nav-item">
            <i className="fas fa-graduation-cap"></i> Courses
          </Link>
          <Link to="/blogs" className="nav-item">
            <i className="fas fa-book-open"></i> Blogs
          </Link>
          <Link to="/tests" className="nav-item">
            <i className="fas fa-tasks"></i> Tests
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="top-nav">
          <div className="user-welcome">Welcome, {firstName}!</div>
          <Header />
        </div>
        
        <div className="uprofile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {getInitials(user.name)}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email">{user.email}</p>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <div className="stat-label">Phone</div>
                  <div className="stat-value">{user.phone || 'Not provided'}</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-label">Degree</div>
                  <div className="stat-value">{user.marks?.degreeMark > 0 ? `${user.marks.degreeMark}%` : 'Not provided'}</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-label">Personality Type</div>
                  <div className="stat-value">
                    {Object.entries(personalityTraits).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Not assessed'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Personal Details Section */}
            <div className="personal-details">
              <h2 className="section-title">
                <i className="fas fa-user"></i> Personal Information
              </h2>
              
              <ul className="detail-list">
                <li className="detail-item">
                  <i className="fas fa-user"></i>
                  <div className="detail-content">
                    <div className="detail-label">Full Name</div>
                    <div className="detail-value">{user.name}</div>
                  </div>
                </li>
                
                <li className="detail-item">
                  <i className="fas fa-envelope"></i>
                  <div className="detail-content">
                    <div className="detail-label">Email Address</div>
                    <div className="detail-value">{user.email}</div>
                  </div>
                </li>
                
                <li className="detail-item">
                  <i className="fas fa-phone"></i>
                  <div className="detail-content">
                    <div className="detail-label">Phone Number</div>
                    <div className="detail-value">{user.phone || 'Not provided'}</div>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Academic Details Section */}
            {(user.marks?.tenthMark > 0 || user.marks?.twelthMark > 0 || 
              user.marks?.degreeMark > 0 || user.marks?.pgMark > 0) && (
              <div className="academic-details">
                <h2 className="section-title">
                  <i className="fas fa-graduation-cap"></i> Academic Information
                </h2>
                
                <div className="academic-grid">
                  {user.marks?.tenthMark > 0 && (
                    <div className="academic-item">
                      <div className="academic-value">{user.marks.tenthMark}%</div>
                      <div className="academic-label">10th Grade</div>
                    </div>
                  )}
                  
                  {user.marks?.twelthMark > 0 && (
                    <div className="academic-item">
                      <div className="academic-value">{user.marks.twelthMark}%</div>
                      <div className="academic-label">12th Grade</div>
                    </div>
                  )}
                  
                  {user.marks?.degreeMark > 0 && (
                    <div className="academic-item">
                      <div className="academic-value">{user.marks.degreeMark}%</div>
                      <div className="academic-label">Bachelor's Degree</div>
                    </div>
                  )}
                  
                  {user.marks?.pgMark > 0 && (
                    <div className="academic-item">
                      <div className="academic-value">{user.marks.pgMark}%</div>
                      <div className="academic-label">Post Graduate</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Aptitude Scores Section */}
            <div className="aptitude-scores">
              <h2 className="section-title">
                <i className="fas fa-brain"></i> Aptitude Assessment
              </h2>
              
              <div className="score-grid">
                {Object.entries(aptitudeScores).map(([skill, score]) => {
                  const normalizedScore = Math.min(100, Math.max(0, score));
                  const circumference = 2 * Math.PI * 50;
                  const dashoffset = circumference * (1 - normalizedScore / 100);
                  
                  return (
                    <div key={skill} className={`score-circle-container score-${skill}`}>
                      <div className="score-circle">
                        <svg viewBox="0 0 120 120">
                          <circle 
                            className="score-circle-bg" 
                            cx="60" 
                            cy="60" 
                            r="50"
                          />
                          <circle 
                            className="score-circle-progress" 
                            cx="60" 
                            cy="60" 
                            r="50"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashoffset}
                          />
                        </svg>
                        <div className="score-circle-text">{normalizedScore}%</div>
                      </div>
                      <div className="score-label">{skill.charAt(0).toUpperCase() + skill.slice(1)}</div>
                      <div className="score-description">
                        {getAptitudeDescription(skill, normalizedScore)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Personality Traits Section */}
            <div className="personality-traits">
              <h2 className="section-title">
                <i className="fas fa-chart-bar"></i> Personality Profile
              </h2>
              
              {Object.entries(personalityTraits).map(([trait, score]) => (
                <div key={trait} className={`trait-container trait-${trait}`}>
                  <div className="trait-header">
                    <div className="trait-name">{trait.charAt(0).toUpperCase() + trait.slice(1)}</div>
                    <div className="trait-value">{score.toFixed(1)}%</div>
                  </div>
                  <div className="trait-bar">
                    <div 
                      className="trait-progress"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <div className="trait-description">
                    {getTraitScoreDescription(trait, score)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Edit Profile Button */}
          <div className="action-buttons">
            <button className="edit-profile-btn" onClick={() => navigate('/userpro')}>
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;