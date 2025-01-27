import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './institutionList.css';
import Sidebar from './sidebar';

const InstitutionList = () => {
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    // Fetch institution data from the backend
    const fetchInstitutions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/institute/teachersreq`); // Adjust API path
        setInstitutions(response.data); // Assuming response structure
      } catch (error) {
        console.error('Error fetching institutions:', error);
      }
    };

    fetchInstitutions();
  }, []);

  const handleViewDetails = (institution) => {
    alert(`Institution Details:\nName: ${institution.firstname}\nEmail: ${institution.email}\nPhone: ${institution.phone}\nAddress: ${institution.address}\nSpecialization: ${institution.specialization}`);
  };

  return (
    <>
      <div>
        <Sidebar />
      </div>
      <div className="institution-list-container">
        <h2>Registered Institutions</h2>
        <div className="institution-cards">
          {institutions.map((institution) => (
            <div className="institution-card" key={institution._id}>
              <img
                src={institution.photo || "https://via.placeholder.com/150"}
                alt={`${institution.firstname}'s photo`}
                className="institution-image"
              />
              <div className="institution-details">
                <h3>{institution.firstname}</h3>
                <p><strong>Email:</strong> {institution.email}</p>
                <p><strong>Phone:</strong> {institution.phone}</p>
                <p><strong>Address:</strong> {institution.address}</p>
                <p><strong>Specialization:</strong> {institution.specialization}</p>
                <button className="view-details-btn" onClick={() => handleViewDetails(institution)}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InstitutionList;
