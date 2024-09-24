import React from 'react';
import { useNavigate } from "react-router-dom";
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Admin Functions</h3>
        <button onClick={() => navigate('/addcourse')}>Add Course</button>
        <button onClick={() => navigate('/addjob')}>Add Job</button>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard">
        <h2>Admin Dashboard Overview</h2>
        <div className="dashboard-content">
          <p>Welcome to the admin dashboard! You can manage courses, jobs, and view statistics here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
