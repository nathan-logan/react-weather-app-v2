import axios, { AxiosError } from 'axios';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { WeatherAppContext } from '../../App';
import CityCard, { buildCityCardProps, CityCardProps } from '../CityCard/CityCard';
import CitySearch from '../CitySearch/CitySearch';

import './weatherApp.css';

const WeatherApp: React.FC = () => {
  const { openWeatherAPI } = useContext(WeatherAppContext);
  
  const [geoIsEnabled, setGeoIsEnabled] = useState(false);
  const [localLatitude, setLocalLatitude] = useState(0);
  const [localLongitude, setLocalLongitude] = useState(0);

  const [localWeather, setLocalWeather] = useState<CityCardProps>();
  const [cities, setCities] = useState<CityCardProps[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const handleError = (err: AxiosError | Error): void => {
    let message: string;
    
    if (axios.isAxiosError(err)) {
      message = err.response?.data.message ?? `No message returned in API response, got ${err.response?.status} status`;
    } else {
      message = err.message;
    }

    setErrorMessage(message);
  };

  const updateLocalWeather = useCallback((): void => {
    openWeatherAPI.weather.getByCoordinates(localLatitude, localLongitude)
      .then((localWeatherResponse) => {
        const localWeatherCardProps = buildCityCardProps(localWeatherResponse.data);
        setLocalWeather(localWeatherCardProps);
      })
      .catch((err) => {
        handleError(err);
      });
  }, [localLatitude, localLongitude, openWeatherAPI]);
  
  const addCity = (payload: CityCardProps): void => {
    setCities((currentCities) => [...currentCities, payload]);
  };

  const removeCity = (name: string): void => {
    const citiesCopy = cities;
    const cityToRemoveIndex = citiesCopy.findIndex(x => x.name === name);

    // I doubt this case will ever happen
    if (cityToRemoveIndex === -1) {
      console.error('Cannot find city "%s" to remove', name);
      return;
    }

    citiesCopy.splice(cityToRemoveIndex, 1);
    setCities([...citiesCopy]);
  };
  
  const handleCitySearch = async (cityName: string): Promise<void> => {
    setErrorMessage('');
    
    await openWeatherAPI.weather.getByCityName(cityName)
      .then((weatherResponse) => {
        const newCityPayload = buildCityCardProps(weatherResponse.data);
        addCity(newCityPayload);
      })
      .catch((err) => {
        handleError(err);
      });
  };
  
  useEffect(() => {
    if (localLatitude !== 0 && localLongitude !== 0) {
      updateLocalWeather();
    }
  }, [localLatitude, localLongitude, updateLocalWeather]);
  
  const geolocationPositionCallback = (pos: GeolocationPosition): void => {
    setGeoIsEnabled(true);
    setLocalLatitude(pos.coords.latitude);
    setLocalLongitude(pos.coords.longitude);
  };

  const geolocationErrorCallback = (err: GeolocationPositionError): void => {
    // this callback will be triggered when a user has disabled geolocation
    console.error(err);
    setGeoIsEnabled(false);
  };
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(geolocationPositionCallback, geolocationErrorCallback);
  }, []);
  
  return (
    <div className="weather-app__wrapper">
      {!geoIsEnabled && <span>Consider allowing location in your browser to see the weather in your location!</span>}
      
      <div className="weather-app__error">
        <span className="error">{errorMessage}</span>
      </div>

      <div className="weather-app__search__wrapper">
        <CitySearch handleSearch={handleCitySearch} />
      </div>

      <div className="weather-app__current-location">
        {localWeather && <CityCard name={localWeather.name} weatherData={localWeather.weatherData} local />}
      </div>

      <div className="weather-app__cities__wrapper">
        {cities.map((data, idx) => <CityCard key={idx} name={data.name} weatherData={data.weatherData} removeCity={removeCity} />)}
      </div>
    </div>
  );
};

export default WeatherApp;
