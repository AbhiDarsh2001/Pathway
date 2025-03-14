// Home.jsx
import React, { useState, useEffect } from "react";
import "./home.css"; // Style from a separate CSS file
import useAuth from "../Function/useAuth";
import FilterComponent from "../Filter/filter";
import Header from "../../Pages/users/Header";
import { useNavigate } from "react-router-dom";
import { loadRazorpay } from "../../utils/razorpay";
import Swal from "sweetalert2"; // Import SweetAlert2
import axios from "axios";

const Home = () => {
  useAuth();

  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${import.meta.env.VITE_URL}/api/users/${userId}`);
        const userData = response.data;
        console.log("userData",userData);
        console.log("userData.isPremium",userData.isPremium);
        setIsPremium(userData.isPremium);
        
        if (userData.premiumExpiresAt) {
          setPremiumExpiresAt(new Date(userData.premiumExpiresAt));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Format the expiration date
  const formatExpirationDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days remaining until expiration
  const getDaysRemaining = (expirationDate) => {
    if (!expirationDate) return 0;
    
    const now = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const handleviewcourse = () => {
    navigate("/Ucourselist");
  }
  const handletest = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    if (isPremium) {
      navigate("/tests");
    } else {
      Swal.fire({
        title: "Premium Feature",
        text: "This feature is available for premium members only. Please purchase a premium membership to access it.",
        icon: "info",
        confirmButtonText: "Become a Premium Member",
        confirmButtonColor: "#ff9800",
      }).then((result) => {
        if (result.isConfirmed) {
          handlePayment();
        }
      });
    }
  }
  const handleblog = () => {
    navigate("/blogs");
  }

  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_0fBRzB7XSBDDbx", // Replace with your Razorpay key
      amount: "50000", // Amount in paise (50000 paise = 500 INR)
      currency: "INR",
      name: "CareerPathway",
      description: "Premium Membership",
      handler: async function (response) {
        alert("Payment successful!");
        setIsPremium(true);
        

        try {
          const userId = localStorage.getItem("userId");
          const paymentStatus = "success";
          const datas ={
            userId:userId,
            paymentStatus:paymentStatus
          }
          const res = await axios.post(`${import.meta.env.VITE_URL}/api/payments/update-payment-status`, datas);

          const data = await res.json();
          if (data.isPremium) {
            setIsPremium(true);
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
      },
      prefill: {
        name: "Your Name",
        email: "email@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
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
        {/* Add navigation links */}
        <nav className="sidebar-nav">
          <a href="/home" className="nav-item">Dashboard</a>
          <a href="/Ucourselist" className="nav-item">Courses</a>
          <a className="nav-item premium-nav-item" onClick={handletest}>
            Psychometric Tests & Career Path
            <span className="premium-icon">👑</span>
          </a>
          <a href="/blogs" className="nav-item">Discussions</a>
        </nav>
        {isPremium === true ? (
          <div className="premium-message">
            You are a Premium Member!
            <div className="expiration-info">
              Expires on: {formatExpirationDate(premiumExpiresAt)}
              <br />
              {getDaysRemaining(premiumExpiresAt)} days remaining
            </div>
          </div>
        ) : (
          <button className="premium-button" onClick={handlePayment}>
            Become a Premium Member
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="content">
        <Header />

        {/* Welcome Section with enhanced styling */}
        <div className="welcome-section">
          <h2>Welcome to CareerPathway</h2>
          <div className="welcome-cards">
            <div className="info-card">
              <h3>Explore Courses</h3>
              <p>Browse through our extensive collection of courses and educational programs.</p>
              <button className="action-button" onClick={handleviewcourse}>View Courses</button>
            </div>
            <div className="info-card">
              <h3>Take Tests</h3>
              <p>Discover your strengths with our psychometric tests and choose your career.</p>
              <button className="action-button" id="tests" onClick={handletest}>Take Test</button>
            </div>
            <div className="info-card">
              <h3>Join Discussions</h3>
              <p>Connect with peers and share your experiences.</p>
              <button className="action-button" onClick={handleblog}>Join Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
