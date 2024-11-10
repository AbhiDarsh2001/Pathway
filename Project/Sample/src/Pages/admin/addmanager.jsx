import React, { useState } from "react";
import './addmanager.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from './sidebar'; // Import the Sidebar component
import useAuth from "../../Components/Function/useAuth";

function AddManager() {
  useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      Swal.fire("Email is required", "", "error");
      return false;
    } else if (!emailRegex.test(email)) {
      Swal.fire("Invalid email", "", "error");
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      Swal.fire("Password is required", "", "error");
      return false;
    } else if (!passwordRegex.test(password)) {
      Swal.fire(
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.",
        "",
        "error"
      );
      return false;
    }

    if (!confirmPass) {
      Swal.fire("Please confirm your password", "", "error");
      return false;
    } else if (confirmPass !== password) {
      Swal.fire("Passwords do not match", "", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/addmanager`, { name, email, password, confirmPass });
      Swal.fire("Manager added successfully", "", "success");
      navigate('/admin');
    } catch (error) {
      Swal.fire("Error adding manager", error.response?.data?.message || "Server error", "error");
    }
  };

  return (
    <div className="add-manager-page">
      <Sidebar /> {/* Sidebar component added */}
      <div className="manager-form-container">
        <h2 className="manager-form-title">Add New Manager</h2>
        <form onSubmit={handleSubmit} className="manager-form">
          <div className="manager-form-group">
            <label className="manager-form-label">Name</label>
            <input
              type="text"
              className="manager-form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="manager-form-group">
            <label className="manager-form-label">Email</label>
            <input
              type="email"
              className="manager-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="manager-form-group">
            <label className="manager-form-label">Password</label>
            <input
              type="password"
              className="manager-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="manager-form-group">
            <label className="manager-form-label">Confirm Password</label>
            <input
              type="password"
              className="manager-form-input"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="manager-form-btn">
            Add Manager
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddManager;
