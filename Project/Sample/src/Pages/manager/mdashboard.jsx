// src/Pages/admin/Dashboard.jsx
import React from 'react';
import MSidebar from './msidebar'; // Adjust the import path if necessary
import './mdashboard.css';

const MDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <MSidebar />

      {/* Main Dashboard Content */}
      <div className="dashboard">
        <h2>Dashboard Overview</h2>
        <div className="dashboard-content">
          <p>Welcome to the Managers dashboard! You can manage courses, jobs, and view statistics here.</p>
        </div>
      </div>
    </div>
  );
};

export default MDashboard;
