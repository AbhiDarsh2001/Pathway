// components/institute/institute.jsx
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import { useNavigate } from "react-router-dom"; // React Router's navigation hook
import "./institute.css";

const InstituteRegistration = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    phone: "",
    address: "",
    founded: "",
    idCard: null,
    photo: null,
    resume: null,
    altPhone: "",
    specialization: "",
    declaration: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // React Router's navigation hook

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstname":
        if (!value.trim()) {
          error = "First name is required.";
        } else if (/[^a-zA-Z\s]/.test(value)) {
          error = "First name can only contain alphabets.";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = "Invalid email address.";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone is required.";
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          error = "Phone must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.";
        }
        break;
      case "altPhone":
        if (value && !/^[6-9]\d{9}$/.test(value)) {
          error = "Alternative phone must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.";
        }
        break;
      case "founded":
        if (!value) {
          error = "Founded date is required.";
        } else {
          const today = new Date();
          const dob = new Date(value);
          if (dob > today) {
            error = "Founded date cannot be in the future.";
          }
        }
        break;
      case "address":
        if (!value.trim()) {
          error = "Address is required.";
        } else if (/[^a-zA-Z.,\s]/.test(value)) {
          error = "Address must be in the correct format.";
        }
        break;
      case "photo":
        if (!value) {
          error = "Photo is required.";
        } else if (value.type !== "image/jpeg") {
          error = "Only JPG files are allowed.";
        } else if (value.size > 2 * 1024 * 1024) {
          error = "File size should not exceed 2MB.";
        }
        break;
      case "idCard":
      case "resume":
        if (!value) {
          error = `${name.replace(/([A-Z])/g, " $1")} is required.`; // Convert camelCase to spaced words
        } else if (value && value.name && value.name.split('.').pop().toLowerCase() !== "pdf") {
          error = `${name.replace(/([A-Z])/g, " $1")} must be a PDF file.`;
        }
        break;
      case "specialization":
        if (!value.trim()) {
          error = "Specialization cannot be empty.";
        }
        break;
      case "declaration":
        if (!value) {
          error = "You must accept the terms and conditions.";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      axios
        .post(`${import.meta.env.VITE_URL}/institute/register`, formDataToSend)
        .then((response) => {
          if (response.data.success) {
            Swal.fire({
              title: "Success!",
              text: "Registered successfully!",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/institution-dashboard");
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: response.data.message || "An unexpected error occurred.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "An unexpected error occurred.",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    }
  };

  return (
    <div className="teachreg">
      <h1>Institute Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="teachreg"
          />
          {errors.firstname && <span className="error">{errors.firstname}</span>}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="teachreg"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="teachreg"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Alternative Phone"
            name="altPhone"
            value={formData.altPhone}
            onChange={handleChange}
            className="teachreg"
          />
          {errors.altPhone && <span className="error">{errors.altPhone}</span>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="teachreg"
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>
        <div>
          <label htmlFor="founded">Founded:</label>
          <input
            type="date"
            id="founded"
            name="founded"
            value={formData.founded}
            onChange={handleChange}
            className="teachreg"
          />
          {errors.founded && <span className="error">{errors.founded}</span>}
        </div>
        <div>
          <textarea
            placeholder="Specialization Areas (e.g., Competitive Exams, Soft Skills)"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="teachreg"
          ></textarea>
          {errors.specialization && <span className="error">{errors.specialization}</span>}
        </div>
        <h2>Upload Documents</h2>
        <div>
          <label htmlFor="idCard">ID Card (PDF only):</label>
          <input
            type="file"
            id="idCard"
            name="idCard"
            accept="application/pdf"
            onChange={handleChange}
            className="teachreg"
          />
          {errors.idCard && <span className="error">{errors.idCard}</span>}
        </div>
        <div>
          <label htmlFor="photo">Photo (JPG only, max 2MB):</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/jpeg"
            onChange={handleChange}
            className="teachreg"
          />
          {errors.photo && <span className="error">{errors.photo}</span>}
        </div>
        <div>
          <label htmlFor="resume">Document (PDF only):</label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept="application/pdf"
            onChange={handleChange}
            className="teachreg"
          />
          {errors.resume && <span className="error">{errors.resume}</span>}
        </div>
        <div>
          <input
            type="checkbox"
            id="declaration"
            name="declaration"
            checked={formData.declaration}
            onChange={(e) =>
              setFormData({ ...formData, declaration: e.target.checked })
            }
            className="teachreg"
          />
          <label htmlFor="declaration">
            I accept the <a href="/terms">terms and conditions</a>.
          </label>
          {errors.declaration && <span className="error">{errors.declaration}</span>}
        </div>
        <div>
          <button type="submit" className="teachreg">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstituteRegistration;