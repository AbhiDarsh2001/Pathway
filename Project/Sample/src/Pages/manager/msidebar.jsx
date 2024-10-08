// src/Pages/admin/Sidebar.jsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import './msidebar.css'; // Assuming you have a CSS file for styling

const MSidebar = () => {
  const navigate = useNavigate();
 
  return (
    <div className="sidebar">
      <h3> Functions</h3>
      <button onClick={() => navigate('/mdashboard')}>Manager</button>
      <button onClick={() => navigate('/maddcourse')}>Add Course</button>
      <button onClick={() => navigate('#maddjob')}>Add Job</button>
      <button onClick={() => navigate('#miconjob')}>View Job</button>
      <button onClick={() => navigate('#miconcourse')}>View Course</button>
    </div>
  );
};

export default MSidebar;
