import React from 'react';
import { OpenWeatherResponse } from '../types/weather';

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
  const { name, weatherData } = props;
  
  return (
    <div>
      <h1>{name}</h1>
      <span>Current {weatherData.currentTemp}℃</span><br />
      <span>Feels like {weatherData.feelsLikeTemp}℃</span><br />
      <span>Min {weatherData.minTemp}℃</span><br />
      <span>Max {weatherData.maxTemp}℃</span><br />
      <span>Sunrise {weatherData.sunrise}</span><br />
      <span>Sunset {weatherData.sunset}</span><br />
      <img src={`http://openweathermap.org/img/w/${weatherData.icon}.png`} alt="Missing weather icon" />
    </div>
  );
};

export default CityCard;