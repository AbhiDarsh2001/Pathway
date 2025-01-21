import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import { useNavigate } from 'react-router-dom'; // React Router's navigation hook
import './institute.css'

const InstituteRegistration = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    //lastname: "",
    email: "",
    phone: "",
    //gender: "",
    address: "",
    founded: "",
    idCard: null,
    photo: null,
    //degreeCertificate: null,
    //experienceCertificate: null,
    resume: null,
    //subjects:'',
    altPhone: "",
  //qualification: "",
  specialization: "",
  //experience: "",
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
      // case "lastname":
      //   if (!value.trim()) {
      //     error = "Last name is required.";
      //   } else if (/[^a-zA-Z\s]/.test(value)) {
      //     error = "Last name can only contain alphabets.";
      //   }
      //   break;
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
          error = "Phone must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.";
        }
        break;
      // case "gender":
      //   if (!value) {
      //     error = "Gender is required.";
      //   }
      //   break;
      case "founded":
        if (!value) {
          error = "Date of birth is required.";
        } else {
          const today = new Date();
          const dob = new Date(value);
          if (dob > today) {
            error = "Date of birth cannot be in the future.";
          }
        }
        break;
        case "altPhone":
  if (value && !/^[6-9]\d{9}$/.test(value)) {
    error = "Alternative phone must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.";
  }
  break;

// case "qualification":
//   if (!value) {
//     error = "Please select your highest qualification.";
//   }
//   break;

case "specialization":
  if (!value.trim()) {
    error = "Specialization cannot be empty.";
  }
  break;

// case "experience":
//   if (!value || isNaN(value) || value <= 0) {
//     error = "Please enter a valid number of years of experience.";
//   }
//   break;


case "declaration":
  if (!value) {
    error = "You must accept the terms and conditions.";
  }
  break;

  //       case "subjects":
  // if (!value) {
  //   error = "Please select a subject.";
  // }
  // break;

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
            // case "degreeCertificate":
            // case "experienceCertificate":
            case "resume":
              if (!value) {
                error = `${name.replace(/([A-Z])/g, " $1")} is required`; // Convert camelCase to spaced words
              } else if (value && value.name && value.name.split('.').pop().toLowerCase() !== 'pdf') {
                error = `${name.replace(/([A-Z])/g, " $1")} must be a PDF file.`;
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
  
      // Send form data to backend using Axios
      axios.post(`${import.meta.env.VITE_URL}/institute/register`, formDataToSend)
      .then((response) => {
        console.log(response);  // Log the full response to inspect it
    
        // Check if the backend returns the 'success' flag
        if (response.data.success) {
          Swal.fire({
            title: 'Success!',
            text: 'Teacher registered successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/teacher-dashboard');  // Redirect after success
          });
        } else {
          // If success flag is not present, handle it as an error
          Swal.fire({
            title: 'Error!',
            text: response.data.message || 'An unexpected error occurred.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      })
      .catch((error) => {
        // Handle Axios error here
        console.error('Axios error:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK'
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
          {errors.firstname && <span className="teachreg">{errors.firstname}</span>}
        </div>
        {/* <div>
          <input
            type="text"
            placeholder="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="teachreg"
          />
          {errors.lastname && <span className="teachreg">{errors.lastname}</span>}
        </div> */}
        <div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="teachreg"
          />
          {errors.email && <span className="teachreg">{errors.email}</span>}
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
          {errors.phone && <span className="teachreg">{errors.phone}</span>}
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
  {errors.altPhone && <span className="teachreg">{errors.altPhone}</span>}
</div>
        {/* <fieldset>
          <legend>Gender</legend>
          <label htmlFor="male">Male</label>
          <input
            type="radio"
            id="male"
            name="gender"
            value="Male"
            checked={formData.gender === "Male"}
            onChange={handleChange}
            className="teachreg"
          />
          <label htmlFor="female">Female</label>
          <input
            type="radio"
            id="female"
            name="gender"
            value="Female"
            checked={formData.gender === "Female"}
            onChange={handleChange}
            className="teachreg"
          />
        </fieldset>
        {errors.gender && <span className="teachreg">{errors.gender}</span>} */}
        <div>
        <div>
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="teachreg"
          />
          {errors.address && <span className="teachreg">{errors.address}</span>}
        </div>
        <div>
          <label htmlFor="founded">Founded:</label>
          <input
            type="date"
            id="founded"
            name="founded"
            value={formData.dateofbirth}
            onChange={handleChange}
            className="teachreg"
          />
          {errors.dateofbirth && <span className="teachreg">{errors.dateofbirth}</span>}
        </div>
  {/* <label htmlFor="subjects">Subject Interested:</label>
  <select
    id="subjects"
    name="subjects"
    value={formData.subjects || ""}
    onChange={handleChange}
    className="teachreg"
  >
    <option value="" disabled>Select a subject</option>
    <option value="Mathematics">Mathematics</option>
    <option value="Physics">Physics</option>
    <option value="Chemistry">Chemistry</option>
    <option value="Biology">Biology</option>
    <option value="English">English</option>
    <option value="Computer Science">Computer Science</option>
  </select>
  {errors.subjects && <span className="teachreg">{errors.subjects}</span>} */}
</div>
{/* <div>
  <label htmlFor="qualification">Highest Qualification:</label>
  <select
    id="qualification"
    name="qualification"
    value={formData.qualification}
    onChange={handleChange}
    className="teachreg"
  >
    <option value="" disabled>Select Qualification</option>
    <option value="B.Ed">B.Ed</option>
    <option value="M.Ed">M.Ed</option>
    <option value="PhD">PhD</option>
  </select>
  {errors.qualification && <span className="teachreg">{errors.qualification}</span>}
</div> */}

<div>
  <textarea
    placeholder="Specialization Areas (e.g., Competitive Exams, Soft Skills)"
    name="specialization"
    value={formData.specialization}
    onChange={handleChange}
    className="teachreg"
  ></textarea>
  {errors.specialization && <span className="teachreg">{errors.specialization}</span>}
</div>

{/* <div>
  <label>Experience:</label>
  <input
    type="number"
    placeholder="Years of Experience"
    name="experience"
    value={formData.experience}
    onChange={handleChange}
    className="teachreg"
  />
  {errors.experience && <span className="teachreg">{errors.experience}</span>}
</div> */}
        <h2>Upload Documents</h2><br></br>
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
          {errors.idCard && <span className="teachreg">{errors.idCard}</span>}
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
  {errors.photo && <span className="teachreg error">{errors.photo}</span>}
  {formData.photo && (
    <p className="teachreg success">
      Selected file: {formData.photo.name} ({(formData.photo.size / 1024).toFixed(2)} KB)
    </p>
  )}
</div>

        {/* <div>
          <label htmlFor="degreeCertificate">Degree Certificate (PDF only):</label>
          <input
            type="file"
            id="degreeCertificate"
            name="degreeCertificate"
            accept="application/pdf"
            onChange={handleChange}
            className="teachreg"
          />
          {errors.degreeCertificate && <span className="teachreg">{errors.degreeCertificate}</span>}
        </div> */}
        {/* <div>
          <label htmlFor="experienceCertificate">Experience Certificate (PDF only):</label>
          <input
            type="file"
            id="experienceCertificate"
            name="experienceCertificate"
            accept="application/pdf"
            onChange={handleChange}
            className="teachreg"
          />
          {errors.experienceCertificate && <span className="teachreg">{errors.experienceCertificate}</span>}
        </div> */}
        <div>
          <label htmlFor="resume">Resume (PDF only):</label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept="application/pdf"
            onChange={handleChange}
            className="teachreg"
          />
          {errors.resume && <span className="teachreg">{errors.resume}</span>}
        </div>
        <div>
  <label>
    <input
      type="checkbox"
      name="declaration"
      checked={formData.declaration}
      onChange={(e) =>
        setFormData({ ...formData, declaration: e.target.checked })
      }
      className="teachreg"
    />
    I agree to the terms and conditions and confirm the accuracy of the information provided.
  </label>
  {errors.declaration && <span className="teachreg">{errors.declaration}</span>}
</div>

        <button type="submit" className="teachreg">Register</button>
      </form>
    </div>
  );
};

export default InstituteRegistration;