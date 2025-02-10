// src/Pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Sidebar from './sidebar'; // Adjust the import path if necessary
import './dashboard.css';
import useAuth from '../../Components/Function/useAuth';

const Dashboard = () => {
  useAuth();
  const navigate = useNavigate(); // Initialize navigate
  const [stats, setStats] = useState({
    courses: 0,
    jobs: 0,
    managers: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch counts from different endpoints
      const [coursesRes, jobsRes, managersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_URL}/viewcourse/all`),
        fetch(`${import.meta.env.VITE_URL}/viewjob/all`),
        fetch(`${import.meta.env.VITE_URL}/viewmanager/all`)
      ]);

      const courses = await coursesRes.json();
      const jobs = await jobsRes.json();
      const managers = await managersRes.json();

      setStats({
        courses: courses.length,
        jobs: jobs.length,
        managers: managers.length
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
      path: '/courselist'
    },
    {
      title: 'Total Jobs',
      count: stats.jobs,
      color: '#2196F3', // Blue
      icon: '💼',
      path: '/joblist'
    },
    {
      title: 'Total Managers',
      count: stats.managers,
      color: '#FF9800', // Orange
      icon: '👥',
      path: '/managerlist'
    }
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-dashboard">
        <h2 className="dashboard-header">Admin Dashboard Overview</h2>
        
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
          <p>Welcome to the admin dashboard! Click on any box above to manage the respective section.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
