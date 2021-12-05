export interface OpenWeatherResponseCoord {
  lon: number;
  lat: number;
}

export interface OpenWeatherResponseWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OpenWeatherResponseMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface OpenWeatherResponseWind {
  speed: number;
  deg: number;
  gust: number;
}

export interface OpenWeatherResponseClouds {
  all: number;
}

export interface OpenWeatherResponseSys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface OpenWeatherResponse {
  coord: OpenWeatherResponseCoord;
  weather: OpenWeatherResponseWeather[];
  base: string;
  main: OpenWeatherResponseMain;
  visibility: number;
  wind: OpenWeatherResponseWind;
  clouds: OpenWeatherResponseClouds;
  dt: number;
  sys: OpenWeatherResponseSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export enum OpenWeatherRequestType {
  CITY_NAME = 'CITY_NAME',
  CITY_ID = 'CITY_ID',
  COORDS = 'COORDS',
  ZIP_CODE = 'ZIP_CODE',
}

export interface OpenWeatherQueryPayload {
  type: OpenWeatherRequestType;
  latitude?: string;
  longitude?: string;
  cityName?: string;
  stateCode?: string;
  countryCode?: string;
}