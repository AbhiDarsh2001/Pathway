import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const USearchEntrance = () => {
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSearch = () => {
      if (!query) {
        setError('Please enter a search term.');
        return;
      }
      // Navigate to the search results page with the query as a URL parameter
      navigate(`/searchcourse-results?query=${encodeURIComponent(query)}`);
    };
  
    return (
      <div>
  
        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Entrance..."
        />
        <button onClick={handleSearch}>Search</button>
  
        {/* Error Message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  };
  
  export default USearchEntrance;