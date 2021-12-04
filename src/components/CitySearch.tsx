import React, { useState } from 'react';

export interface CitySearchProps {
  handleSearch: (cityName: string) => void;
}

const CitySearch: React.FC<CitySearchProps> = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<Error | null>(null);

  const handleCitySeachChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchError) {
      setSearchError(null);
    }

    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    
    if (!searchQuery) {
      setSearchError(new Error('City name cannot be blank'));
      return;
    }

    props.handleSearch(searchQuery);
  };
  
  return (
    <div>
      <input type="text" name="city-search" id="city-search" value={searchQuery} onChange={handleCitySeachChange} />
      <button onClick={handleSearch}>Search</button>
      <br />
      <span className="error">{searchError && searchError.message}</span>
    </div>
  );
};

export default CitySearch;