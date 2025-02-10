import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './managerlist.css'; // Assuming similar styling file like joblist.css
import Sidebar from './sidebar'; // Assuming Sidebar component exists
import useAuth from '../../Components/Function/useAuth';
import Swal from 'sweetalert2';

const ManagerList = () => {
    useAuth();
    const [managers, setManagers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchManagers();
    }, []);

    const fetchManagers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/viewmanager/all`);
            if (!response.ok) {
                throw new Error('Failed to fetch managers');
            }
            const data = await response.json();
            setManagers(data);
        } catch (error) {
            console.error('Failed to fetch managers:', error);
        }
    };

    const handleDelete = async (managerId, managerName) => {
        // Sweet Alert confirmation
        const result = await Swal.fire({
            title: 'Are you sure?',
            html: `You are about to delete manager <b>${managerName}</b>.<br>This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/deletemanager/${managerId}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    throw new Error('Failed to delete manager');
                }

                // Show success message
                await Swal.fire({
                    title: 'Deleted!',
                    text: 'Manager has been deleted successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                // Refresh the managers list
                fetchManagers();
            } catch (error) {
                console.error('Error deleting manager:', error);
                // Show error message
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete manager.',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                });
            }
        }
    };

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
                <div className="welcome-section">
                    <div className="section-header">
                        <h2>Managers</h2>
                        <button className="action-button" onClick={() => navigate('/addmanager')}>+ Add New Manager</button>
                    </div>
                    
                    <div className="job-grid">
                        {managers.map((manager) => (
                            <div key={manager._id} className="job-card">
                                <div className="job-card-content">
                                    <h3>{manager.name}</h3>
                                    <p className="job-description">{manager.email}</p>
                                    <div className="job-meta">
                                        <span className="job-type">
                                            <i className="fas fa-user"></i> Manager
                                        </span>
                                    </div>
                                    <button 
                                        className="view-details-btn delete"
                                        onClick={() => handleDelete(manager._id, manager.name)}
                                    >
                                        Delete Manager
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerList;
