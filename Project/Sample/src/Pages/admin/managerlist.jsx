import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './managerlist.css'; // Assuming similar styling file like joblist.css
import Sidebar from './sidebar'; // Assuming Sidebar component exists

const ManagerList = () => {
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/viewmanager/all`); // API route for fetching managers
                if (!response.ok) {
                    throw new Error('Failed to fetch managers');
                }
                const data = await response.json();
                setManagers(data); // Setting the fetched managers
            } catch (error) {
                console.error('Failed to fetch managers:', error);
            }
        };

        fetchManagers();
    }, []);

    return (
        <div className="manager-list-page">
            <Sidebar />
            <div className="manager-list">
                {managers.map((manager) => (
                    <div key={manager._id} className="manager-item">
                        <h2>{manager.name}</h2>
                        <p>{manager.email}</p> {/* Example: Manager department */}
                        <Link to={`#viewmanager/${manager._id}`}>
                            <button className="detail-btn">Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagerList;
