import React from 'react';
import { WeatherData } from '../types/weather';

interface CityCardProps {
  name: string;
  weatherData: WeatherData;
}

const CityCard: React.FC<CityCardProps> = (props) => {
  return (
    <div>
      <h1>City card - {props.name}</h1>
    </div>
  );
};

export default CityCard;