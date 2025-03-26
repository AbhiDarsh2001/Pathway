// src/Pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MSidebar from './msidebar'; // Adjust the import path if necessary
import './mdashboard.css';
import useAuth from '../../Components/Function/useAuth';

const MDashboard = () => {
  useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    courses: 0,
    jobs: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch counts from different endpoints
      const [coursesRes, jobsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_URL}/viewcourse/all`),
        fetch(`${import.meta.env.VITE_URL}/viewjob/all`)
      ]);

      const courses = await coursesRes.json();
      const jobs = await jobsRes.json();

      setStats({
        courses: courses.length,
        jobs: jobs.length
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const statBoxes = [
    {
      title: 'Total Courses',
      count: stats.courses,
      color: '#4CAF50', // Green
      icon: '📚',
      path: '/miconcourse' // Adjust path as needed for manager routes
    },
    {
      title: 'Total Jobs',
      count: stats.jobs,
      color: '#2196F3', // Blue
      icon: '💼',
      path: '/miconjob' // Adjust path as needed for manager routes
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <MSidebar />

      {/* Main Dashboard Content */}
      <main className="main-dashboard">
        <h2 className="dashboard-header">Manager Dashboard Overview</h2>
        
        <div className="stats-container">
          {statBoxes.map((stat, index) => (
            <div
              key={index}
              className="stat-box"
              style={{ backgroundColor: stat.color }}
              onClick={() => navigate(stat.path)}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h3>{stat.title}</h3>
                <p className="stat-count">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-content">
          <p>Welcome to the Manager dashboard! Click on any box above to manage your courses and job listings.</p>
        </div>
      </main>
    </div>
  );
};

export default MDashboard;
