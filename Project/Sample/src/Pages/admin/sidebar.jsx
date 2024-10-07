// src/Pages/admin/Sidebar.jsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import './sidebar.css'; // Assuming you have a CSS file for styling

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h3>Admin Functions</h3>
      <button onClick={() => navigate('/admin')}>Admin</button>
      <button onClick={() => navigate('/addcourse')}>Add Course</button>
      <button onClick={() => navigate('/addjob')}>Add Job</button>
      <button onClick={() => navigate('/iconjob')}>View Job</button>
      <button onClick={() => navigate('/viewcourse')}>View Course</button>
      <button onClick={() => navigate('/addmanager')}>AddManager</button>
    </div>
  );
};

export default Sidebar;