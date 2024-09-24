import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './joblist.css';
import Sidebar from './sidebar'; // Assuming Sidebar component exists

const JobList = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('http://localhost:8080/viewjob/all'); // Correct route
                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }
                const data = await response.json();
                setJobs(data); // Correct setJobs
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="job-list-page">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="job-list">
                {jobs.map((job) => (
                    <div key={job._id} className="job-item">
                        <Link to={`/viewjob/${job._id}`}>{job.name}</Link>
                        <p>{job.description}</p> {/* Example additional job details */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobList;
