import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './joblist.css';
import Sidebar from './sidebar';
import useAuth from '../../Components/Function/useAuth';
import { useParams, useNavigate } from 'react-router-dom';

const JobList = () => {
    useAuth();
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/viewjob/all`);
                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="home-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo-container">
                    <img
                        src="src/assets/CareerPathway.png"
                        alt="Career Pathway Logo"
                        className="logo"
                    />
                </div>
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="content">
                {/* Job List Section */}
                <div className="welcome-section">
                    <div className="section-header">
                        <h2>Job </h2>
                        <button className="action-button" onClick={() => navigate(`/addjob`)}>+ Add New Job</button>
                    </div>
                    
                    <div className="job-grid">
                        {jobs.map((job) => (
                            <div key={job._id} className="job-card">
                                <div className="job-card-content">
                                    <h3>{job.name}</h3>
                                    <p className="job-description">{job.description}</p>
                                    <div className="job-meta">
                                        <span className="job-location">
                                            <i className="fas fa-map-marker-alt"></i> {job.location || 'Location N/A'}
                                        </span>
                                        <span className="job-type">
                                            <i className="fas fa-briefcase"></i> {job.type || 'Full Time'}
                                        </span>
                                    </div>
                                    <Link to={`/viewjob/${job._id}`}>
                                        <button className="view-details-btn">View Details</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobList;
