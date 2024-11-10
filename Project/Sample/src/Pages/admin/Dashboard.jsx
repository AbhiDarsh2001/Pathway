// src/Pages/admin/Dashboard.jsx
import React from 'react';
import Sidebar from './sidebar'; // Adjust the import path if necessary
import './dashboard.css';
import useAuth from '../../Components/Function/useAuth';

const Dashboard = () => {
  useAuth();
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

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
