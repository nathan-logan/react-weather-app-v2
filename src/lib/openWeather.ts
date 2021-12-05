import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { OpenWeatherResponse } from '../types/openWeather';

/**
 * https://openweathermap.org/current#one
 */
class Weather {
  private request: OpenWeatherRequestService;

  public constructor(requestService: OpenWeatherRequestService) {
    this.request = requestService;
  }
  
  /**
   * Get weather data for a specific city
   * @param cityName The city name to query for
   * @param stateCode Optional state code to refine the city search (U.S only) 
   * @param countryCode Optional country code to refine the city search
   * @returns A weather data object
   */
  public getByCityName(cityName: string, stateCode?: string, countryCode?: string): Promise<AxiosResponse<OpenWeatherResponse>> {
    if (!cityName) {
      throw new Error('Missing city name');
    }

    let endpoint = `/weather?q=${cityName}`;

    if (stateCode) {
      endpoint += `,${stateCode}`;
    }
    
    if (countryCode) {
      endpoint += `,${countryCode}`;
    }
    
    return this.request.get<OpenWeatherResponse>(endpoint);
  }

  /**
   * Gets weather data for a city ID
   * @param id The city ID to query for
   * @returns A weather data object
   */
  public getByCityId(id: string | number): Promise<AxiosResponse<OpenWeatherResponse>> {
    if (!id) {
      throw new Error('Missing city id');
    }

    const endpoint = `/weather?id=${id}`;

    return this.request.get<OpenWeatherResponse>(endpoint);
  }

  /**
   * Gets the weather data at the coordinates provided
   * @param latitude The latitude coordinate
   * @param longitude The longitude coordinate
   * @returns A weather data object
   */
  public getByCoordinates(latitude: number, longitude: number): Promise<AxiosResponse<OpenWeatherResponse>> {
    if (!latitude) {
      throw new Error('Missing latitude');
    }

    if (!longitude) {
      throw new Error('Missing longitude');
    }

    const endpoint = `/weather?lat=${latitude}&lon=${longitude}`;

    return this.request.get<OpenWeatherResponse>(endpoint);
  }
}

/**
 * Provides methods to send authenticated requests to the OpenWeather API
 */
class OpenWeatherRequestService {
  private apiKey: string;

  private apiBase: string;

  public constructor(apiKey: string, apiBase: string) {
    this.apiKey = apiKey;
    this.apiBase = apiBase;
  }

  public get<T>(endpoint: string, opts?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const authorisedUrl = `${this.apiBase}${endpoint}&appid=${this.apiKey}&units=metric`;
    return axios.get(authorisedUrl, opts);
  }
}

/**
 * Wrapper around the OpenWeather API to facilitate weather data requests
 * https://openweathermap.org/
 */
export default class OpenWeather {
  public weather: Weather;

  public constructor(apiKey: string, apiBase: string) {
    const requestService = new OpenWeatherRequestService(apiKey, apiBase);
    
    this.weather = new Weather(requestService);
  }
}