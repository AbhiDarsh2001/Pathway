import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Ujoblist.css";
import Header from "./Header";
import useAuth from "../../Components/Function/useAuth";
import FilterComponent from "../../Components/Filter/filter";

const UJobList = () => {
  useAuth();
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ categories: [], subcategories: [] });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filters.categories.length) {
          queryParams.append("categories", filters.categories.join(","));
        }
        if (filters.subcategories.length) {
          queryParams.append("subcategories", filters.subcategories.join(","));
        }

        const response = await fetch(`${import.meta.env.VITE_URL}/viewjob/all?${queryParams}`);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
  }, [filters]);

  return (
    <div className="home-container">
      {/* Filter Sidebar */}
      <div className="filter-sidebar">
        <div className="logo-container">
          <img
            src="src/assets/CareerPathway.png"
            alt="Career Pathway Logo"
            className="logo"
          />
        </div>
        <FilterComponent setFilters={setFilters} type="job" />
      </div>

      {/* Main Content */}
      <div className="content">
        <Header />
        <div className="welcome-section">
          <div className="section-header">
            <h2>Available Job Opportunities</h2>
            {/* <div className="search-box">
              <input type="text" placeholder="Search jobs..." className="search-input" />
            </div> */}
          </div>

          <div className="job-grid">
            {jobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-card-content">
                  <h3>{job.name}</h3>
                  <p className="job-description">{job.description}</p>
                  <div className="job-meta">
                    <span className="category-tag">
                      {job.category ? job.category.name : 'N/A'}
                    </span>
                    <span className="job-location">
                      <i className="fas fa-map-marker-alt"></i> {job.location || 'Location N/A'}
                    </span>
                  </div>
                  <Link to={`/Uviewjob/${job._id}`}>
                    <button className="view-details-btn">View Details</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UJobList;
