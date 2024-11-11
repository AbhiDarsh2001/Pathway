// src/Pages/admin/Sidebar.jsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import './msidebar.css'; // Assuming you have a CSS file for styling
import useAuth from '../../Components/Function/useAuth';

const MSidebar = () => {
  useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear auth token
    navigate('/login'); // Redirect to login page
  };

  const navigate = useNavigate();
 
  return (
    <div className="sidebar">
      <h3> Functions</h3>
      <button onClick={() => navigate('/manager')}>Manager</button>
      <button id="maddcourse" onClick={() => navigate('/maddcourse')}>Add Course</button>
      <button  onClick={() => navigate('/maddjob')}>Add Job</button>
      <button onClick={() => navigate('/miconjob')}>View Job</button>
      <button onClick={() => navigate('/miconcourse')}>View Course</button>
      <button onClick={handleLogout} className="dropdown-option logout-button">
              Logout
      </button>
    </div>
  );
};

export default MSidebar;
