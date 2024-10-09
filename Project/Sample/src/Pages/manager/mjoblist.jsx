import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './mjoblist.css';
import MSidebar from './msidebar'; // Assuming Sidebar component exists

const MJobList = () => {
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
        <div className="job-list-page" >
            {<MSidebar /> }
            <div className="job-list" >
                {jobs.map((job) => (
                    <div key={job._id} className="job-item">
                        <h2>{job.name}</h2>
                        <p>{job.description}</p> {/* Example additional job details */}
                        <Link to={`/mviewjob/${job._id}`}>
                            <button className="detail-btn">Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MJobList;
