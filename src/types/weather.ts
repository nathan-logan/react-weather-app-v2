export interface WeatherData {
  temperature?: number;
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