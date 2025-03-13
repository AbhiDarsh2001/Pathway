import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faEye, faUser, faFile, faThList, faSignOutAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();



  return (
    <div className={"sidebar"}>
      
      <h3 className="sidebar-title">Admin Functions</h3>
      
      <div className="sidebar-content">
        <button onClick={() => navigate('/admin')}>
          <FontAwesomeIcon icon={faHome} />
          <span className="sidebar-label">Dashboard</span>
        </button>
        {/* <button onClick={() => navigate('/addcourse')}>
          <FontAwesomeIcon icon={faPlus} />
          <span className="sidebar-label">Add Course</span>
        </button> */}
        <button onClick={() => navigate('/iconcourse')}>
          <FontAwesomeIcon icon={faEye} />
           <span className="sidebar-label">View Courses</span>
        </button>
        {/* <button onClick={() => navigate('/addjob')}>
          <FontAwesomeIcon icon={faPlus} />
           <span className="sidebar-label">Add Job</span>
        </button> */}
        <button onClick={() => navigate('/iconjob')}>
          <FontAwesomeIcon icon={faEye} /> 
        <span className="sidebar-label">View Jobs</span>
        </button>
        {/* <button onClick={() => navigate('/addmanager')}>
          <FontAwesomeIcon icon={faUser} />
          <span className="sidebar-label">Add Manager</span>
        </button> */}
        <button onClick={() => navigate('/iconmanager')}>
          <FontAwesomeIcon icon={faEye} />
         <span className="sidebar-label">View Managers</span>
        </button>
        <button onClick={() => navigate('/reports')}>
          <FontAwesomeIcon icon={faFile} />
          <span className="sidebar-label">Reports</span>
        </button>
        <button onClick={() => navigate('/catagory')}>
          <FontAwesomeIcon icon={faThList} />
          <span className="sidebar-label">Category</span>
        </button>
        <button onClick={() => navigate('/addtest')}>
          <FontAwesomeIcon icon={faThList} />
          <span className="sidebar-label">Test</span>
        </button>
        <button onClick={() => navigate('/personality-test')}>
          Personality Test
        </button>
        <button onClick={() => navigate('/aptitude-test')}>
          Aptitude Test
        </button>
      
      <button className="logout-btn" onClick={() => navigate('/logout')}>
        <FontAwesomeIcon icon={faSignOutAlt} />
      <span className="sidebar-label">Logout</span>
      </button>
      </div>
    </div>
  );
};

export default Sidebar;