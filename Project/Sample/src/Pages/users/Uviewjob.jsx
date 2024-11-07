import React, { useEffect, useState } from 'react';
import './Uviewjob.css';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import useAuth from '../../Components/Function/useAuth';

const Uviewjob = () => {
    useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);  // State for job details
    const [loading, setLoading] = useState(true);  // State for loading status

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/viewjob/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }
                const data = await response.json();
                setJob(data);  // Set the job details
            } catch (error) {
                console.error('Error fetching job details:', error);
            } finally {
                setLoading(false);  // Set loading to false regardless of success or failure
            }
        };

        fetchJobDetails();
    }, [id]);

    // Loading state
    if (loading) return <div>Loading...</div>;

    // If job is null or doesn't exist, show a message
    if (!job) return <div>Job not found</div>;

    return (
        <div>
            <Header />
            <div className="Job-details">
                {/* <Sidebar /> */}
                <h1>{job.name}</h1> {/* Accessing job.name now safe */}
                <p><strong>Description:</strong> {job.description}</p>
                {job.eligibility && <p><strong>Eligibility:</strong> {job.eligibility.join(', ')}</p>}
                {job.industry && <p><strong>Industry:</strong> {job.industry.join(', ')}</p>}
                <p><strong>Category:</strong> {job.category ? job.category.name : 'N/A'}</p>
                <div className="button-container">
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                    {/* <button className="delete-button" onClick={handleDelete}>Delete</button> */}
                </div>
            </div>
        </div>
    );
};

export default Uviewjob;
