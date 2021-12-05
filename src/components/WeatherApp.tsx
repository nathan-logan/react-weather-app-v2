import axios, { AxiosError } from 'axios';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { WeatherAppContext } from '../App';
import CityCard, { buildCityCardProps, CityCardProps } from './CityCard';
import CitySearch from './CitySearch';

const WeatherApp: React.FC = () => {
  const { openWeatherAPI } = useContext(WeatherAppContext);
  
  const [geoIsEnabled, setGeoIsEnabled] = useState(false);
  const [localLatitude, setLocalLatitude] = useState(0);
  const [localLongitude, setLocalLongitude] = useState(0);

  const [currentCityWeather, setCurrentCityWeather] = useState<CityCardProps>();
  const [cities, setCities] = useState<CityCardProps[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const handleError = (err: AxiosError | Error): void => {
    let message: string;
    
    if (axios.isAxiosError(err)) {
      message = err.response?.data.message || 'No message returned in API response';
    } else {
      message = err.message;
    }

    setErrorMessage(message);
  };

  const updateLocalWeather = useCallback((): void => {
    openWeatherAPI.weather.getByCoordinates(localLatitude, localLongitude)
      .then((localWeatherResponse) => {
        const currentCityWeatherCardProps = buildCityCardProps(localWeatherResponse.data);
        setCurrentCityWeather(currentCityWeatherCardProps);
      })
      .catch((err) => {
        handleError(err);
      });
  }, [localLatitude, localLongitude, openWeatherAPI]);
  
  const geolocationPositionCallback = (pos: GeolocationPosition): void => {
    setLocalLatitude(pos.coords.latitude);
    setLocalLongitude(pos.coords.longitude);
  };

  const geolocationErrorCallback = (err: GeolocationPositionError): void => {
    // this callback will be triggered when a user has disabled geolocation
    console.error(err);
    setGeoIsEnabled(false);
  };
  
  const addCity = (payload: CityCardProps): void => {
    setCities((currentCities) => [...currentCities, payload]);
  };
  
  const handleCitySearch = async (cityName: string): Promise<void> => {
    const weatherResponse = await openWeatherAPI.weather.getByCityName(cityName)
      .catch((err) => {
        handleError(err);
      });
      
    if (!weatherResponse || weatherResponse.status !== 200) {
      handleError(new Error(`Got status ${weatherResponse?.status}`));
      return;
    }
    
    const newCityPayload = buildCityCardProps(weatherResponse.data);
    addCity(newCityPayload);
  };
  
  useEffect(() => {
    console.log('lat or long updated');
    if (localLatitude !== 0 && localLongitude !== 0) {
      updateLocalWeather();
    }
  }, [localLatitude, localLongitude, updateLocalWeather]);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(geolocationPositionCallback, geolocationErrorCallback);
  }, []);
  
  return (
    <div className="weather-app__wrapper">
      <span className="error">{errorMessage}</span>
      <br />
      
      <span>Geolocation Enabled? {JSON.stringify(!geoIsEnabled)}</span>
      <br />

      <span>Latitude: {localLatitude}</span>
      <br />
      <span>Longitude: {localLongitude}</span>

      <CitySearch handleSearch={handleCitySearch} />

      <h1>Current location</h1>
      {currentCityWeather && <CityCard name={currentCityWeather.name} weatherData={currentCityWeather.weatherData} />}

      {cities.map((data) => {
        <CityCard name={data.name} weatherData={data.weatherData} />;
      })}
    </div>
  );
};

export default WeatherApp;
