import React, { useEffect, useState } from 'react';
import './mviewjob.css';
import { useParams, useNavigate } from 'react-router-dom';
import MSidebar from './msidebar';
import useAuth from '../../Components/Function/useAuth';

const MVJobDetails = () => {
    useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/viewjob/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }
                const data = await response.json();
                setJob(data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/deljob/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Job deleted successfully');
                navigate('/miconjob');
            } else {
                const errorMessage = await response.text();
                alert(`Failed to delete the job: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Could not delete job. Please try again later.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!job) return <div>Job not found</div>;

    return (
        <div>
            <div className="Job-details">
                <MSidebar />
                <h1>{job.name}</h1>
                <p><strong>Description:</strong> {job.description}</p>
                {job.eligibility && <p><strong>Eligibility:</strong> {job.eligibility.join(', ')}</p>}
                {job.industry && <p><strong>Industry:</strong> {job.industry.join(', ')}</p>}
                <p><strong>Category:</strong> {job.category ? job.category.name : 'N/A'}</p>
                <div className="button-container">
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                    <button className="edit-button" onClick={() => navigate(`/meditjob/${id}`)}>Edit</button>
                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default MVJobDetails;
