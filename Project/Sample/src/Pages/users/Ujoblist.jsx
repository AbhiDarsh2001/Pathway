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
    <div>
      <Header />
      <div className="job-list-container">
        {/* <div className="filter-component">
          <FilterComponent setFilters={setFilters} type="job" />
        </div> */}

        <div className="job-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-item">
              <h2>{job.name}</h2>
              <p>{job.description}</p>
              <p>Category: {job.category ? job.category.name : 'N/A'}</p>
              <Link to={`/Uviewjob/${job._id}`}>
                <button className="detail-btn">Details</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UJobList;
