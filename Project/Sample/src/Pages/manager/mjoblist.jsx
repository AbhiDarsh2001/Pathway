import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './mjoblist.css';
import MSidebar from './msidebar';
import useAuth from '../../Components/Function/useAuth';

const MJobList = () => {
    useAuth();
    const [jobs, setJobs] = useState([]);

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
                <MSidebar />
            </div>

            {/* Main Content Area */}
            <div className="content">
                {/* Job List Section */}
                <div className="welcome-section">
                    <div className="section-header">
                        <h2>Jobs</h2>
                    </div>
                    
                    <div className="job-grid">
                        {jobs.map((job) => (
                            <div key={job._id} className="job-card">
                                <div className="job-card-content">
                                    <h3>{job.name}</h3>
                                    <p className="job-description">{job.description}</p>
                                    <p className="job-category">Category: {job.category ? job.category.name : 'N/A'}</p>
                                    <Link to={`/mviewjob/${job._id}`}>
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

export default MJobList;
