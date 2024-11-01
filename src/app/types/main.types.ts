export interface CurrentWeather {
    temperature: number;
    windspeed: number;
    weathercode: WeatherCode;
    humidity?: number;
    pressure?: number;
    visibility?: number;
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
    current: any;
    current_weather: CurrentWeather; 
    hourly: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
    };
}

export interface WeatherData {
    minTemperature: number | null; 
    maxTemperature: number | null; 
    upcomingTemperatures: number[]; 
    upcomingMinTemperatures: number[] | null;
    currentWeather?: {
        description: string;
        image: string;
        feelsLike: number;
        currentTemperature: number;
        windSpeed?: number;
        humidity?: number;
        pressure?: number;
        visibility?: number;
    } | null; 
    hourly?: Array<HourlyData> | number[] | null; 
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
export interface HourlyData {
    time: string;
    temperature: number;
    relative_humidity_2m?: number; 
}
