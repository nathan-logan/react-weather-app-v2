import React, { createContext } from 'react';
import WeatherApp from './components/WeatherApp/WeatherApp';
import OpenWeather from './lib/openWeather';

const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY || '';
const apiBase = process.env.REACT_APP_OPENWEATHER_API_BASE || '';
const openWeatherAPI = new OpenWeather(apiKey, apiBase);
const defaultContext = { openWeatherAPI };
export const WeatherAppContext = createContext(defaultContext);

const App: React.FC = () => {

  return (
    <>
      <WeatherAppContext.Provider value={defaultContext}>
        <WeatherApp />
      </WeatherAppContext.Provider>
    </>
  );
};

export default App;
