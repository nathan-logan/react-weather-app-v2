import React from 'react';
import moment from 'moment';
import { OpenWeatherResponse } from '../../types/weather';

import './cityCard.css';

export interface CityCardWeatherProps {
  currentTemp: number;
  feelsLikeTemp: number;
  minTemp: number;
  maxTemp: number;
  icon: string;
  sunrise: number;
  sunset: number;
}

export interface CityCardProps {
  name: string;
  weatherData: CityCardWeatherProps;
  local?: boolean;
  removeCity?: (cityName: string) => void;
}

export const buildCityCardProps = (weatherResponse: OpenWeatherResponse): CityCardProps => {
  const props: CityCardProps = {
    name: weatherResponse.name,
    weatherData: {
      currentTemp: weatherResponse.main.temp,
      feelsLikeTemp: weatherResponse.main.feels_like,
      minTemp: weatherResponse.main.temp_min,
      maxTemp: weatherResponse.main.temp_max,
      sunrise: weatherResponse.sys.sunrise,
      sunset: weatherResponse.sys.sunset,
      icon: weatherResponse.weather[0].icon,
    },
  };
  return props;
};

const CityCard: React.FC<CityCardProps> = (props) => {
  const { name, weatherData, local, removeCity } = props;

  const handleRemoveCity = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (removeCity) {
      removeCity(name);
    }
  };
  
  return (
    <div className="city-card__wrapper">
      {local && <span className="city-card__local">Current Location</span>}
      
      <div className="city-card__header">
        {local && <span className="city-card__header__icon">📍</span>}
        <h1 className="city-card__header__name">{name}</h1>
        <img className="city-card__header__weather-icon" src={`http://openweathermap.org/img/w/${weatherData.icon}.png`} alt="Missing weather icon" />
      </div>
      <div className="city-card__content">
        <span className="city-card__content__item"><span className="bold">Current</span> {weatherData.currentTemp}℃</span>
        <span className="city-card__content__item"><span className="bold">Feels like</span> {weatherData.feelsLikeTemp}℃</span>
        
        <div className="city-card__content__item">
          <span><span className="bold">Min</span> {weatherData.minTemp}℃</span> / <span><span className="bold">Max</span> {weatherData.maxTemp}℃</span>
        </div>

        <div className="city-card__content__item">
          <span><span className="bold">Sunrise</span> {moment.unix(weatherData.sunrise).format('hh:mm A')}</span> / <span className="bold">Sunset</span> <span>{moment.unix(weatherData.sunset).format('hh:mm A')}</span>
        </div>

      </div>
      <div className="city-card__footer">
        {removeCity && <button onClick={handleRemoveCity}>Remove</button>}
      </div>
    </div>
  );
};

export default CityCard;