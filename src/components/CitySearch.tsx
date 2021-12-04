import React, { useState } from 'react';

const CitySearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleCitySeachChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const executeCitySearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

  };
  
  return (
    <div>
      <input type="text" name="city-search" id="city-search" value={searchQuery} onChange={handleCitySeachChange} />
      <button onClick={executeCitySearch}>Search</button>
    </div>
  );
};

export default CitySearch;