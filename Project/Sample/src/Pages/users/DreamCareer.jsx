import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./DreamCareer.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaChartBar } from 'react-icons/fa';

const DreamCareer = () => {
  const [dreamJob, setDreamJob] = useState("");
  const [careerPath, setCareerPath] = useState(null);
  const [scores, setScores] = useState({
    extraversion: '',
    agreeableness: '',
    openness: '',
    neuroticism: '',
    conscientiousness: '',
    math: '',
    verbal: '',
    logic: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [academicDetails, setAcademicDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScores, setEditedScores] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportOptions, setReportOptions] = useState({
    includeScores: true,
    includeAcademics: true,
    includeCareerPath: true
  });
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch user profile data
        const profileResponse = await axios.get(`${import.meta.env.VITE_URL}/vuprofile`, {
          headers: { Authorization: token }
        });
        
        setUserProfile({
          name: profileResponse.data.name || 'User',
          email: profileResponse.data.email || 'Not provided',
          phone: profileResponse.data.phone || 'Not provided',
        });
        
        // Fetch academic details
        const academicResponse = await axios.get(`${import.meta.env.VITE_URL}/vuprofile`, {
          headers: { Authorization: token }
        });
        setAcademicDetails(academicResponse.data.marks);

        // Fetch personality scores
        const personalityResponse = await fetch(
          `${import.meta.env.VITE_URL}/personal/results`,
          { headers: { Authorization: token } }
        );

        // Fetch aptitude scores
        const aptitudeResponse = await fetch(
          `${import.meta.env.VITE_URL}/aptitude/results`,
          { headers: { Authorization: token } }
        );

        if (personalityResponse.ok && aptitudeResponse.ok) {
          const personalityData = await personalityResponse.json();
          const aptitudeData = await aptitudeResponse.json();

          const personalityScores = personalityData.data.scores;
          let aptitudeScores = {
            math: 0,
            verbal: 0,
            logic: 0
          };

          if (aptitudeData.success && aptitudeData.data && aptitudeData.data.scores) {
            aptitudeScores = {
              math: aptitudeData.data.scores.math,
              verbal: aptitudeData.data.scores.verbal,
              logic: aptitudeData.data.scores.logic
            };
          }

          setScores({
            extraversion: (personalityScores.extraversion * 2.5).toString(),
            agreeableness: (personalityScores.agreeableness * 2.5).toString(),
            openness: (personalityScores.openness * 2.5).toString(),
            neuroticism: (personalityScores.neuroticism * 2.5).toString(),
            conscientiousness: (personalityScores.conscientiousness * 2.5).toString(),
            math: aptitudeScores.math.toFixed(2).toString(),
            verbal: aptitudeScores.verbal.toFixed(2).toString(),
            logic: aptitudeScores.logic.toFixed(2).toString()
          });
        } else {
          throw new Error('Failed to fetch scores');
        }
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to fetch details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [token]);

  const handleInputChange = (event) => {
    setDreamJob(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!dreamJob.trim()) {
      alert("Please enter a valid career.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/getCareerPath`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          dreamJob,
          scores,
          academicDetails
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to fetch career path");
      }

      if (data.success && data.steps) {
        setCareerPath(data);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error fetching career path:", error);
      alert(error.message || "Failed to fetch career path. Please try again later.");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedScores(scores);
  };

  const handleScoreChange = (trait, value) => {
    // Ensure the value is between 0 and 100
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0), 100);
    setEditedScores(prev => ({
      ...prev,
      [trait]: numValue.toString()
    }));
  };

  const handleSaveScores = () => {
    setScores(editedScores);
    setIsEditing(false);
    // Store the manual test results in localStorage
    localStorage.setItem('manualTestResults', JSON.stringify({
      scores: editedScores,
      careerRecommendation: dreamJob || 'Not specified'
    }));
  };

  const handleHome = () => {
    navigate("/home");
  };
  
  const handleCourses = () => {
    navigate("/Ucourselist");
  };
  
  const handleTests = () => {
    navigate("/tests");
  };
  
  const handleBlogs = () => {
    navigate("/blogs");
  };

  const toggleReportModal = () => {
    setShowReportModal(!showReportModal);
  };

  const handleReportOptionChange = (option) => {
    setReportOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const generateReport = () => {
    setIsLoading(true);
    
    // Check if we have career path data first
    if (!careerPath || !careerPath.steps || careerPath.steps.length === 0) {
      alert("No career path data to include in report.");
      setIsLoading(false);
      return;
    }

    // Close the modal during PDF generation
    setShowReportModal(false);
    
    // Initialize the PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Create header rectangle with gradient-like appearance
    pdf.setFillColor(52, 152, 219); // Main blue color
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    // Add title to the PDF header
    pdf.setFontSize(20);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Career Path Report', 20, 15);
    
    // Add user info to header
    pdf.setFontSize(10);
    pdf.setTextColor(230, 230, 230);
    pdf.text(`Name: ${userProfile.name}`, pageWidth - 60, 10);
    pdf.text(`Email: ${userProfile.email}`, pageWidth - 60, 16);
    
    // Add dream job and date below header
    pdf.setFontSize(16);
    pdf.setTextColor(52, 73, 94);
    pdf.text(`Career Path: ${dreamJob}`, 20, 40);
    
    // Add date
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 60, 40);

    // Start Y position for content
    let yPos = 50;
    const contentMargin = 20; // Left and right margins
    const availableWidth = pageWidth - (contentMargin * 2);
    
    // Add user info section to the first page (more details than the header)
    pdf.setDrawColor(52, 152, 219);
    pdf.setFillColor(240, 248, 255);
    pdf.rect(contentMargin - 5, yPos - 5, availableWidth + 10, 40, 'F');
    pdf.setLineWidth(0.5);
    pdf.line(contentMargin - 5, yPos - 5, contentMargin - 5 + availableWidth + 10, yPos - 5);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text('Personal Information', contentMargin, yPos + 5);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 64, 67);
    pdf.text(`Name: ${userProfile.name}`, contentMargin, yPos + 15);
    pdf.text(`Email: ${userProfile.email}`, contentMargin, yPos + 22);
    pdf.text(`Phone: ${userProfile.phone}`, contentMargin, yPos + 29);
    
    yPos += 45;
    
    // Add scores section if selected
    if (reportOptions.includeScores) {
      pdf.setDrawColor(52, 152, 219);
      pdf.setFillColor(240, 248, 255);
      pdf.rect(contentMargin - 5, yPos - 5, availableWidth + 10, 70, 'F');
      pdf.setLineWidth(0.5);
      pdf.line(contentMargin - 5, yPos - 5, contentMargin - 5 + availableWidth + 10, yPos - 5);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(44, 62, 80);
      pdf.text('Personality & Aptitude Assessment', contentMargin, yPos + 5);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 64, 67);
      
      let col1X = contentMargin;
      let col2X = contentMargin + availableWidth/2;
      
      // Personality scores
      pdf.text(`Extraversion: ${scores.extraversion}`, col1X, yPos + 18);
      pdf.text(`Agreeableness: ${scores.agreeableness}`, col1X, yPos + 26);
      pdf.text(`Openness: ${scores.openness}`, col1X, yPos + 34);
      pdf.text(`Neuroticism: ${scores.neuroticism}`, col1X, yPos + 42);
      pdf.text(`Conscientiousness: ${scores.conscientiousness}`, col1X, yPos + 50);
      
      // Aptitude scores
      pdf.text(`Math: ${scores.math}`, col2X, yPos + 18);
      pdf.text(`Verbal: ${scores.verbal}`, col2X, yPos + 26);
      pdf.text(`Logic: ${scores.logic}`, col2X, yPos + 34);
      
      yPos += 75;
    }
    
    // Add academic section if selected
    if (reportOptions.includeAcademics && academicDetails) {
      pdf.setDrawColor(52, 152, 219);
      pdf.setFillColor(240, 248, 255);
      pdf.rect(contentMargin - 5, yPos - 5, availableWidth + 10, 50, 'F');
      pdf.setLineWidth(0.5);
      pdf.line(contentMargin - 5, yPos - 5, contentMargin - 5 + availableWidth + 10, yPos - 5);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(44, 62, 80);
      pdf.text('Academic Information', contentMargin, yPos + 5);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 64, 67);
      
      let col1X = contentMargin;
      let col2X = contentMargin + availableWidth/2;
      let textY = yPos + 18;
      
      if (academicDetails.tenthMark > 0) {
        pdf.text(`10th Mark: ${academicDetails.tenthMark}%`, col1X, textY);
        textY += 8;
      }
      
      if (academicDetails.twelthMark > 0) {
        pdf.text(`12th Mark: ${academicDetails.twelthMark}%`, col1X, textY);
        textY += 8;
      }
      
      textY = yPos + 18;
      
      if (academicDetails.degreeMark > 0) {
        pdf.text(`Degree Mark: ${academicDetails.degreeMark}%`, col2X, textY);
        textY += 8;
      }
      
      if (academicDetails.pgMark > 0) {
        pdf.text(`PG Mark: ${academicDetails.pgMark}%`, col2X, textY);
      }
      
      yPos += 55;
    }
    
    // Start career path on a new page if it would overflow
    if (yPos > 220 || !reportOptions.includeCareerPath) {
      // Add footer to the first page
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page 1 | Career Pathway - Your Journey to Success`, pageWidth/2, pageHeight - 10, { align: 'center' });
    }
    
    // Add career path section if selected
    if (reportOptions.includeCareerPath) {
      let currentSection = "";
      let pageCount = 1;
      
      // Start a new page for career path
      if (yPos > 220) {
        pdf.addPage();
        pageCount++;
        yPos = 20;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(44, 62, 80);
      pdf.text(`Career Path Analysis: ${dreamJob}`, pageWidth/2, yPos, { align: 'center' });
      
      yPos += 10;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`The following analysis is based on your profile and test results`, pageWidth/2, yPos, { align: 'center' });
      
      yPos += 15;
      
      // Process each step in the career path
      for (let i = 0; i < careerPath.steps.length; i++) {
        const step = careerPath.steps[i];
        
        // Check if we need a new page
        if (yPos > pageHeight - 30) {
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(`Page ${pageCount} | Career Pathway - Your Journey to Success`, pageWidth/2, pageHeight - 10, { align: 'center' });
          
          pdf.addPage();
          pageCount++;
          yPos = 20;
          
          // Add section header to new page for context
          if (currentSection) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(44, 62, 80);
            pdf.text(`${currentSection} (continued)`, contentMargin, yPos);
            yPos += 10;
          }
        }
        
        // Format section headers
        if (step.includes('1. A step-by-step') || 
            step.includes('2. Required qualifications') ||
            step.includes('3. Skills') ||
            step.includes('4. Potential challenges') ||
            step.includes('5. Alternative careers')) {
            
          const headerText = step.split('.')[1].trim();
          currentSection = headerText;
          
          pdf.setFillColor(248, 250, 252);
          pdf.rect(contentMargin - 5, yPos - 5, availableWidth + 10, 10, 'F');
          
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(44, 62, 80);
          pdf.text(headerText, contentMargin, yPos);
          
          yPos += 15;
        }
        // Format list items
        else if (step.startsWith('-')) {
          const content = step.substring(1).trim().replace(/\*\*([^*]+)\*\*/g, '$1');
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(60, 64, 67);
          
          // Handle text wrapping for bullet points
          const textLines = pdf.splitTextToSize(`• ${content}`, availableWidth - 5);
          textLines.forEach(line => {
            pdf.text(line, contentMargin + 5, yPos);
            yPos += 6;
            
            // Check if we need a new page after adding a line
            if (yPos > pageHeight - 30 && i < careerPath.steps.length - 1) {
              pdf.setFontSize(8);
              pdf.setTextColor(150, 150, 150);
              pdf.text(`Page ${pageCount} | Career Pathway - Your Journey to Success`, pageWidth/2, pageHeight - 10, { align: 'center' });
              
              pdf.addPage();
              pageCount++;
              yPos = 20;
              
              // Add section header to new page for context
              if (currentSection) {
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(44, 62, 80);
                pdf.text(`${currentSection} (continued)`, contentMargin, yPos);
                yPos += 10;
              }
            }
          });
          
          yPos += 2; // Extra space after each bullet
        }
        // Format numbered steps
        else if (step.match(/^\d+\./)) {
          const parts = step.split('.');
          const number = parts[0];
          const content = parts.slice(1).join('.').trim().replace(/\*\*([^*]+)\*\*/g, '$1');
          
          pdf.setFontSize(10);
          pdf.setTextColor(60, 64, 67);
          
          // Number in a circle
          pdf.setFillColor(52, 152, 219);
          pdf.circle(contentMargin + 5, yPos - 2, 4, 'F');
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(255, 255, 255);
          pdf.text(number, contentMargin + 5, yPos, { align: 'center' });
          
          // Text content
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(60, 64, 67);
          
          // Handle text wrapping for numbered steps
          const textLines = pdf.splitTextToSize(content, availableWidth - 15);
          textLines.forEach((line, lineIndex) => {
            pdf.text(line, contentMargin + 15, yPos + (lineIndex * 6));
            
            // Check if we need a new page after adding a line
            if (yPos + (lineIndex * 6) > pageHeight - 30 && (lineIndex < textLines.length - 1 || i < careerPath.steps.length - 1)) {
              pdf.addPage();
              pageCount++;
              yPos = 20 - (lineIndex * 6);
              
              // Add section header to new page for context
              if (currentSection) {
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(44, 62, 80);
                pdf.text(`${currentSection} (continued)`, contentMargin, yPos);
                yPos += 10;
              }
            }
          });
          
          yPos += (textLines.length * 6) + 2; // Move Y position after all text lines
        }
        // Format regular paragraphs
        else {
          const content = step.replace(/\*\*([^*]+)\*\*/g, '$1');
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(60, 64, 67);
          
          // Handle text wrapping for paragraphs
          const textLines = pdf.splitTextToSize(content, availableWidth);
          textLines.forEach((line, lineIndex) => {
            pdf.text(line, contentMargin, yPos + (lineIndex * 6));
            
            // Check if we need a new page after adding a line
            if (yPos + (lineIndex * 6) > pageHeight - 30 && (lineIndex < textLines.length - 1 || i < careerPath.steps.length - 1)) {
              pdf.addPage();
              pageCount++;
              yPos = 20 - (lineIndex * 6);
              
              // Add section header to new page for context
              if (currentSection) {
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(44, 62, 80);
                pdf.text(`${currentSection} (continued)`, contentMargin, yPos);
                yPos += 10;
              }
            }
          });
          
          yPos += (textLines.length * 6) + 4; // Move Y position after all text lines
        }
      }
      
      // Add footer to the last page
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${pageCount} | Career Pathway - Your Journey to Success`, pageWidth/2, pageHeight - 10, { align: 'center' });
    }
    
    // Add page header and footer to all pages
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Add header to each page
      pdf.setFillColor(52, 152, 219);
      pdf.rect(0, 0, pageWidth, 20, 'F');
      
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Career Pathway', 20, 13);
      
      // Add user info to each page's header
      pdf.setFontSize(8);
      pdf.text(`${userProfile.name} | ${userProfile.email}`, pageWidth - 60, 13);
      
      // Add footer with better styling
      pdf.setFillColor(245, 245, 245); // Light gray background
      pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
      pdf.setFontSize(8);
      pdf.setTextColor(80, 80, 80); // Darker text for better readability
      pdf.text(`Page ${i} of ${totalPages}`, 20, pageHeight - 6);
      pdf.text(`Career Pathway - Your Journey to Success`, pageWidth - 20, pageHeight - 6, { align: 'right' });
    }
    
    // Save the PDF
    pdf.save(`${userProfile.name}_${dreamJob || 'Career'}_Path_Report.pdf`);
    setIsLoading(false);
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
        <nav className="sidebar-nav">
          <a href="/home" className="nav-item">Dashboard</a>
          <a href="/Ucourselist" className="nav-item">Courses</a>
          <a href="/tests" className="nav-item">Psychometric Tests</a>
          <a href="/blogs" className="nav-item">Discussions</a>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="content">
        <Header userName={userProfile.name} userEmail={userProfile.email} />
        
        <div className="dream-career-content">
          <div className="welcome-section">
            <h2>Find Your Dream Career Path</h2>
            
            {isLoading ? (
              <div className="loading-indicator">Loading...</div>
            ) : (
              <>
                {error && <div className="error-message">{error}</div>}
                
                <div className="career-search-section">
                  <form onSubmit={handleSubmit} className="career-search-form">
                    <input
                      type="text"
                      placeholder="Enter your dream Career"
                      value={dreamJob}
                      onChange={handleInputChange}
                      className="career-input"
                    />
                    <button type="submit" className="action-button">Find Path</button>
                  </form>
                </div>

                <div className="career-info-cards">
                  {/* Scores Card */}
                  <div className="info-card">
                    <h3>Your Scores</h3>
                    {!isEditing ? (
                      <>
                        <div className="scores-list">
                          <div className="score-item">
                            <span>Extraversion:</span> {scores.extraversion}
                          </div>
                          <div className="score-item">
                            <span>Agreeableness:</span> {scores.agreeableness}
                          </div>
                          <div className="score-item">
                            <span>Openness:</span> {scores.openness}
                          </div>
                          <div className="score-item">
                            <span>Neuroticism:</span> {scores.neuroticism}
                          </div>
                          <div className="score-item">
                            <span>Conscientiousness:</span> {scores.conscientiousness}
                          </div>
                          <div className="score-item">
                            <span>Math:</span> {scores.math}
                          </div>
                          <div className="score-item">
                            <span>Verbal:</span> {scores.verbal}
                          </div>
                          <div className="score-item">
                            <span>Logic:</span> {scores.logic}
                          </div>
                        </div>
                        <button onClick={handleEditClick} className="action-button">Edit Scores</button>
                      </>
                    ) : (
                      <div className="edit-scores">
                        {Object.entries(editedScores).map(([trait, score]) => (
                          <div key={trait} className="score-input">
                            <label>{trait.charAt(0).toUpperCase() + trait.slice(1)}:</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={score}
                              onChange={(e) => handleScoreChange(trait, e.target.value)}
                            />
                          </div>
                        ))}
                        <div className="edit-buttons">
                          <button onClick={handleSaveScores}>Save</button>
                          <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Academic Details Card */}
                  {academicDetails && (
                    <div className="info-card">
                      <h3>Academic Information</h3>
                      <div className="academic-list">
                        {academicDetails.tenthMark > 0 && (
                          <div className="academic-item">
                            <span>10th Mark:</span> {academicDetails.tenthMark}%
                          </div>
                        )}
                        {academicDetails.twelthMark > 0 && (
                          <div className="academic-item">
                            <span>12th Mark:</span> {academicDetails.twelthMark}%
                          </div>
                        )}
                        {academicDetails.degreeMark > 0 && (
                          <div className="academic-item">
                            <span>Degree Mark:</span> {academicDetails.degreeMark}%
                          </div>
                        )}
                        {academicDetails.pgMark > 0 && (
                          <div className="academic-item">
                            <span>PG Mark:</span> {academicDetails.pgMark}%
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Career Path Results */}
                {careerPath && (
                  <div className="career-path-container">
                    <h2>Career Path: {dreamJob}</h2>
                    
                    <button onClick={toggleReportModal} className="action-button report-button">
                      Generate Custom Report
                    </button>
                    
                    <div id="report-content" className="career-path-content">
                      {/* Report Header with User Info */}
                      <div className="report-header">
                        <div className="report-logo">
                          <h1>Career Pathway</h1>
                        </div>
                        <div className="report-title">
                          <h2>Career Path Analysis Report</h2>
                          <h3>{dreamJob}</h3>
                        </div>
                      </div>
                      
                      {/* User Profile Information */}
                      <div className="report-user-info">
                        <h3><FaUser className="report-icon" /> Personal Information</h3>
                        <div className="user-info-grid">
                          <div className="user-info-item">
                            <span className="info-label">Name:</span>
                            <span className="info-value">{userProfile.name}</span>
                          </div>
                          <div className="user-info-item">
                            <span className="info-label"><FaEnvelope className="mini-icon" /> Email:</span>
                            <span className="info-value">{userProfile.email}</span>
                          </div>
                          <div className="user-info-item">
                            <span className="info-label"><FaPhone className="mini-icon" /> Phone:</span>
                            <span className="info-value">{userProfile.phone}</span>
                          </div>
                        </div>
                        
                        <div className="profile-summary">
                          <div className="scores-summary">
                            <h4><FaChartBar className="mini-icon" /> Personality & Aptitude Assessment</h4>
                            <div className="scores-grid">
                              <div><span className="trait-label">Extraversion:</span> <span className="trait-value">{scores.extraversion}</span></div>
                              <div><span className="trait-label">Agreeableness:</span> <span className="trait-value">{scores.agreeableness}</span></div>
                              <div><span className="trait-label">Openness:</span> <span className="trait-value">{scores.openness}</span></div>
                              <div><span className="trait-label">Neuroticism:</span> <span className="trait-value">{scores.neuroticism}</span></div>
                              <div><span className="trait-label">Conscientiousness:</span> <span className="trait-value">{scores.conscientiousness}</span></div>
                              <div><span className="trait-label">Math:</span> <span className="trait-value">{scores.math}</span></div>
                              <div><span className="trait-label">Verbal:</span> <span className="trait-value">{scores.verbal}</span></div>
                              <div><span className="trait-label">Logic:</span> <span className="trait-value">{scores.logic}</span></div>
                            </div>
                          </div>
                          
                          {academicDetails && (
                            <div className="academic-summary">
                              <h4><FaGraduationCap className="mini-icon" /> Academic Information</h4>
                              <div className="academic-grid">
                                {academicDetails.tenthMark > 0 && (
                                  <div><span className="academic-label">10th Mark:</span> <span className="academic-value">{academicDetails.tenthMark}%</span></div>
                                )}
                                {academicDetails.twelthMark > 0 && (
                                  <div><span className="academic-label">12th Mark:</span> <span className="academic-value">{academicDetails.twelthMark}%</span></div>
                                )}
                                {academicDetails.degreeMark > 0 && (
                                  <div><span className="academic-label">Degree Mark:</span> <span className="academic-value">{academicDetails.degreeMark}%</span></div>
                                )}
                                {academicDetails.pgMark > 0 && (
                                  <div><span className="academic-label">PG Mark:</span> <span className="academic-value">{academicDetails.pgMark}%</span></div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Career Path Analysis */}
                      <div className="career-path-analysis">
                        <h3>Career Path Analysis: {dreamJob}</h3>
                        <div className="analysis-date">Generated on: {new Date().toLocaleDateString()}</div>
                        
                        {/* Existing career path steps */}
                        {careerPath.steps.map((step, index) => {
                          // Updated function to convert text with asterisks to bold without showing asterisks
                          const formatText = (text) => {
                            if (!text) return '';
                            
                            // Replace **text** with bold elements
                            const parts = text.split(/(\*\*.*?\*\*)/g);
                            
                            return parts.map((part, i) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                // Extract just the text between ** and make it bold
                                const boldText = part.substring(2, part.length - 2);
                                return <strong key={i}>{boldText}</strong>;
                              }
                              return part;
                            });
                          };

                          // Check for section headers
                          if (step.includes('1. A step-by-step') || 
                              step.includes('2. Required qualifications') ||
                              step.includes('3. Skills') ||
                              step.includes('4. Potential challenges') ||
                              step.includes('5. Alternative careers')) {
                            return (
                              <div key={index} className="section-header">
                                <h3>{formatText(step.split('.')[1])}</h3>
                              </div>
                            );
                          }
                          
                          // Regular content
                          return (
                            <div key={index} className="career-step">
                              {step.startsWith('-') ? (
                                <li>{formatText(step.substring(1).trim())}</li>
                              ) : step.match(/^\d+\./) ? (
                                <div className="numbered-step">
                                  <span className="step-number">{step.split('.')[0]}</span>
                                  <span className="step-content">{formatText(step.split('.')[1])}</span>
                                </div>
                              ) : (
                                <p>{formatText(step)}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showReportModal && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Generate Report</h3>
            <div className="report-options">
              <label>
                <input 
                  type="checkbox" 
                  checked={reportOptions.includeScores} 
                  onChange={() => handleReportOptionChange('includeScores')} 
                />
                Include Personality & Aptitude Scores
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={reportOptions.includeAcademics} 
                  onChange={() => handleReportOptionChange('includeAcademics')} 
                />
                Include Academic Details
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={reportOptions.includeCareerPath} 
                  onChange={() => handleReportOptionChange('includeCareerPath')} 
                />
                Include Career Path Details
              </label>
            </div>
            <div className="modal-buttons">
              <button onClick={generateReport}>Generate PDF</button>
              <button onClick={toggleReportModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamCareer;
