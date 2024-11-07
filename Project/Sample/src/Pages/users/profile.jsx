import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './profile.css'
import Header from './Header';
import useAuth from '../../Components/Function/useAuth';

function Profile() {
  useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/vuprofile`, {
          headers: { Authorization: token }
        });
        setUser(response.data);
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        navigate('/login'); // Redirect to login if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div>
        <Header />
    <div className="uprofile-container">
      <h1>User Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>

      {/* Conditionally render Courses if they exist */}
      {user.courses && user.courses.length > 0 && (
        <p><strong>Courses:</strong> {user.courses.join(', ')}</p>
      )}

      {/* Conditionally render Marks only if they exist and are greater than 0 */}
      {(user.marks?.tenthMark > 0 || user.marks?.twelfthMark > 0 || user.marks?.degreeMark > 0 || user.marks?.pgMark > 0) && (
        <>
          <p><strong>Marks:</strong></p>
          <ul>
            {user.marks?.tenthMark > 0 && <li>Tenth Mark: {user.marks.tenthMark}</li>}
            {user.marks?.twelfthMark > 0 && <li>Twelfth Mark: {user.marks.twelfthMark}</li>}
            {user.marks?.degreeMark > 0 && <li>Degree Mark: {user.marks.degreeMark}</li>}
            {user.marks?.pgMark > 0 && <li>PG Mark: {user.marks.pgMark}</li>}
          </ul>
        </>
      )}

      <button className="uprofilebutton" onClick={() => navigate('/userpro')}>Edit Profile</button>
    </div>
    </div>
  );
}

export default Profile;