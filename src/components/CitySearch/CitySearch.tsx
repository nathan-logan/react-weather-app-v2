import React, { useState } from 'react';

export interface CitySearchProps {
  handleSearch: (cityName: string) => void;
}

const CitySearch: React.FC<CitySearchProps> = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<Error | null>(null);

  const handleCitySeachChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    if (searchError) {
      setSearchError(null);
    }

    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
    e.preventDefault();
    
    if (!searchQuery) {
      setSearchError(new Error('City name cannot be blank'));
      return;
    }

    props.handleSearch(searchQuery);
    setSearchQuery('');
  };

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      props.handleSearch(searchQuery);
      setSearchQuery('');
    }
  };
  
  return (
    <>
      <input type="text" name="city-search" id="city-search" value={searchQuery} onChange={handleCitySeachChange} onKeyDown={handleSearchInputKeyDown} />
      <button onClick={handleSearch}>Add City</button>
      <br />
      <span className="error">{searchError && searchError.message}</span>
    </>
  );
};

export default CitySearch;