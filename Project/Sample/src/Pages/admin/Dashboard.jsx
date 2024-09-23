// Dashboard.js
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './dashboard.css';


const Dashboard = () => {

    const navigate=useNavigate();
    
  return (
    <div className="dashboard">
      <h2>Admin Dashboard Overview</h2>
      <div className="stats">
        {/* <div className="card">Users: 120</div> */}
        <button onClick={ () => navigate('/addcourse')}>Add course </button>

        <div className="card">Jobs</div>
        {/* <div className="card">Comments: 100</div> */}
      </div>
    </div>
  );
};

export default Dashboard;
