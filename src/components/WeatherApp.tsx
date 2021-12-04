import React, { useContext, useEffect, useState } from 'react';
import { WeatherAppContext } from '../App';
import CityCard, { CityCardProps } from './CityCard';
import CitySearch from './CitySearch';

const WeatherApp: React.FC = () => {
  const { openWeatherAPI } = useContext(WeatherAppContext);
  
  const [geoIsEnabled, setGeoIsEnabled] = useState(false);
  const [localLatitude, setLocalLatitude] = useState(0);
  const [localLongitude, setLocalLongitude] = useState(0);

  const [cities, setCities] = useState<CityCardProps[]>([]);
  
  const geolocationPositionCallback = (pos: GeolocationPosition): void => {
    setLocalLatitude(pos.coords.latitude);
    setLocalLongitude(pos.coords.longitude);
  };

  const geolocationErrorCallback = (err: GeolocationPositionError): void => {
    // this callback will be triggered when a user has disabled geolocation
    console.error(err);
    setGeoIsEnabled(false);
  };
  
  const handleCitySearch = async (cityName: string) => {
    const weatherResponse = await openWeatherAPI.weather.getByCityName(cityName);
    console.log('weatherResponse: ', weatherResponse);
  };
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(geolocationPositionCallback, geolocationErrorCallback);
  }, [localLatitude, localLongitude]);
  
  return (
    <div className="weather-app__wrapper">
      <span>Geolocation Enabled? {JSON.stringify(!geoIsEnabled)}</span>
      <br />

      <span>Latitude: {localLatitude}</span>
      <br />
      <span>Longitude: {localLongitude}</span>

      <CitySearch handleSearch={handleCitySearch} />
      {cities.map((data) => {
        <CityCard name={data.name} weatherData={data.weatherData} />;
      })}
    </div>
  );
};

export default WeatherApp;
