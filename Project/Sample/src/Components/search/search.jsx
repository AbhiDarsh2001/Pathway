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
    navigate(`/searchcourse-results?query=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Course..."
        style={{ padding: '8px', flex: '1' }}
      />
      <button onClick={handleSearch} style={{ padding: '8px 16px' }}>
        Search
      </button>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default USearchEntrance;
