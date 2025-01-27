// src/Pages/admin/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Sidebar from './sidebar'; // Adjust the import path if necessary
import './dashboard.css';
import useAuth from '../../Components/Function/useAuth';

const Dashboard = () => {
  useAuth();
  const navigate = useNavigate(); // Initialize navigate

  const handleInstitutionList = () => {
    navigate('/institutionList'); // Navigate to the institution list page
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <div className="dashboard">
        <h2>Admin Dashboard Overview</h2>
        <div className="dashboard-content">
          <p>Welcome to the admin dashboard! You can manage courses, jobs, and view statistics here.</p>
          
          {/* Button to navigate to the institution list */}
          <button className="btn-institution-list" onClick={handleInstitutionList}>
            View Institution List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
