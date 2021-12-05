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
  
  const updateCitiesStore = (updatedCitiesStoreItems: CityCardProps[]): void => {
    window.localStorage.setItem('cities', JSON.stringify(updatedCitiesStoreItems));
  };
  
  const getCitiesStore = (): CityCardProps[] => {
    const citiesStore = window.localStorage.getItem('cities');

    if (citiesStore) {
      try {
        const citiesStoreArray = JSON.parse(citiesStore);
        return citiesStoreArray;
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.stack);
          setErrorMessage(`Failed to parse cities store ${err.message}`);
        }
      }
    }
    
    return [];
  };

  const addCity = (payload: CityCardProps): void => {
    const citiesStore = getCitiesStore();

    if (citiesStore) {
      citiesStore.push(payload);
      updateCitiesStore(citiesStore);
    } else {
      setErrorMessage('Failed to update store: Missing cities store item');
    }
    
    setCities((currentCities) => [...currentCities, payload]);
  };

  const removeCity = (name: string): void => {
    const citiesStateCopy = cities;
    const cityStateIndex = citiesStateCopy.findIndex((x) => x.name === name);

    if (cityStateIndex === -1) {
      setErrorMessage(`Cannot find city "${name}" in state`);
      return;
    }

    citiesStateCopy.splice(cityStateIndex, 1);
    updateCitiesStore(citiesStateCopy);
    setCities([...citiesStateCopy]);
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
    const citiesStore = getCitiesStore();
    setCities(citiesStore);
    
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
