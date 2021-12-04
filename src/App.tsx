import React, { useEffect, useState } from 'react';
import CityCard from './components/CityCard';
import CitySearch from './components/CitySearch';

const App: React.FC = () => {
  const [geoEnabled, setGeoEnabled] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const geolocationPositionCallback = (pos: GeolocationPosition): void => {
    setLatitude(pos.coords.latitude);
    setLongitude(pos.coords.longitude);
  };

  const geolocationErrorCallback = (err: GeolocationPositionError): void => {
    // this callback will be triggered when a user has disabled geolocation
    console.error(err);
    setGeoEnabled(false);
  };
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(geolocationPositionCallback, geolocationErrorCallback);
  }, [latitude, longitude]);
  
  return (
    <div className="App">
      <span>Geolocation Enabled? {JSON.stringify(!geoEnabled)}</span>
      <br />

      <span>Latitude: {latitude}</span>
      <br />
      <span>Longitude: {longitude}</span>

      <CitySearch />
      <CityCard name="Brisbane" weatherData={{}} />
    </div>
  );
};

export default App;
