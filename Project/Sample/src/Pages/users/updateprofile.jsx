import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './updateprofile.css';
import Header from './Header';
import useAuth from '../../Components/Function/useAuth';

function UEditProfile() {
  useAuth();
  const [user, setUser] = useState({
    name: '',
    phone: '',
    education: '',
    courses: [],
    marks: {
      tenthMark: 0,
      twelthMark: 0,
      degreeMark: 0,
      pgMark: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ugCourses = ['B.Tech', 'B.Sc', 'B.Com', 'BA'];
  const pgCourses = ['M.Tech', 'M.Sc', 'MBA', 'MA'];

  useEffect(() => {
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
        if (error.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (name === 'education') {
      setUser((prevState) => ({
        ...prevState,
        courses: [],
        marks: { tenthMark: 0, twelthMark: 0, degreeMark: 0, pgMark: 0 }
      }));
    }
  };

  const handleMarksChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      marks: { ...prevState.marks, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${import.meta.env.VITE_URL}/updateProfile`, user, {
        headers: { Authorization: token }
      });
      Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      navigate('/uprofile');
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'An unexpected error occurred.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

//   const handleChangePassword = async () => {
//     const { value: currentPassword } = await Swal.fire({
//       title: 'Enter Current Password',
//       input: 'password',
//       inputLabel: 'Current Password',
//       inputPlaceholder: 'Enter your current password',
//       showCancelButton: true
//     });

//     if (currentPassword) {
//       const { value: newPassword } = await Swal.fire({
//         title: 'Enter New Password',
//         input: 'password',
//         inputLabel: 'New Password',
//         inputPlaceholder: 'Enter your new password',
//         showCancelButton: true
//       });

//       if (newPassword) {
//         const { value: confirmPassword } = await Swal.fire({
//           title: 'Confirm New Password',
//           input: 'password',
//           inputLabel: 'Confirm New Password',
//           inputPlaceholder: 'Re-enter your new password',
//           showCancelButton: true
//         });

//         if (newPassword === confirmPassword) {
//           const token = localStorage.getItem('token');
//           try {
//             await axios.put('http://localhost:5000/changePassword', { currentPassword, newPassword }, {
//               headers: { Authorization: token }
//             });
//             Swal.fire('Success!', 'Your password has been updated.', 'success');
//           } catch (error) {
//             Swal.fire('Error!', error.response?.data?.message || 'An unexpected error occurred.', 'error');
//           }
//         } else {
//           Swal.fire('Error!', 'New password and confirmation do not match.', 'error');
//         }
//       }
//     }
//   };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <Header />
    <div className="userupprofile-container">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={user.name || ''}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email || ''}
            disabled
          />
        </label>

        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={user.phone || ''}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Education:
          <select
            name="education"
            value={user.education || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select Education</option>
            <option value="10">10</option>
            <option value="+2">+2</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="PostGraduate">PostGraduate</option>
          </select>
        </label>

        {user.education === 'Undergraduate' && (
          <label>
            Courses:
            <select
              name="courses"
              value={user.courses[0] || ''}
              onChange={(e) => handleChange({ target: { name: 'courses', value: [e.target.value] } })}
              required
            >
              <option value="">Select Course</option>
              {ugCourses.map(course => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </label>
        )}

        {user.education === 'PostGraduate' && (
          <label>
            Courses:
            <select
              name="courses"
              value={user.courses[0] || ''}
              onChange={(e) => handleChange({ target: { name: 'courses', value: [e.target.value] } })}
              required
            >
              <option value="">Select Course</option>
              {pgCourses.map(course => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </label>
        )}

        <h3>Marks:</h3>
        {user.education && (
          <>
            {['10', '+2', 'Undergraduate', 'PostGraduate'].includes(user.education) && (
              <label>
                Tenth Mark:
                <input
                  type="number"
                  name="tenthMark"
                  value={user.marks.tenthMark || ''}
                  onChange={handleMarksChange}
                />
              </label>
            )}

            {['+2', 'Undergraduate', 'PostGraduate'].includes(user.education) && (
              <label>
                Twelfth Mark:
                <input
                  type="number"
                  name="twelthMark"
                  value={user.marks.twelthMark || ''}
                  onChange={handleMarksChange}
                />
              </label>
            )}

            {['Undergraduate', 'PostGraduate'].includes(user.education) && (
              <label>
                Degree Mark:
                <input
                  type="number"
                  name="degreeMark"
                  value={user.marks.degreeMark || ''}
                  onChange={handleMarksChange}
                />
              </label>
            )}

            {user.education === 'PostGraduate' && (
              <label>
                PG Mark:
                <input
                  type="number"
                  name="pgMark"
                  value={user.marks.pgMark || ''}
                  onChange={handleMarksChange}
                />
              </label>
            )}
          </>
        )}

        <button type="submit">Update Profile</button>
        {/* <button type="button" onClick={handleChangePassword}>Change Password</button> */}
      </form>
    </div>
    </div>
  );
}

export default UEditProfile;