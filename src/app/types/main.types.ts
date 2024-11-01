export interface CurrentWeather {
    temperature: number;
    windspeed: number;
    weathercode: number;
}

export interface WeatherApiResponse {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    daily_units: {
        time: string;
        temperature_2m_max: string;
        temperature_2m_min: string;
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
    current_weather: CurrentWeather;
}

export interface WeatherData {
    minTemperature: number;
    maxTemperature: number;
    upcomingTemperatures: number[];
    upcomingMinTemperatures: number[];
    currentWeather?: {
        description: string;
        image: string;
        feelsLike: number;
        currentTemperature: number;
    } | null;
}

export interface City {
    id: number | string;
    name: string;
    lat?: number | string | undefined;
    long?: number | string | undefined;
    latitude: number | string;
    longitude: number | string;
    elevation: number;
    feature_code: string;
    country_code: string;
    timezone: string;
    population: number;
    country_id: number;
    country: string;
    data?: WeatherData | null; 
    updated_at?: number | null;
}

export type WeatherCode = 0 | 1 | 2 | 3 | 45 | 51 | 61 | 71;
