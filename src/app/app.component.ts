import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { SearchComponent } from './components/search/search.component';
import { WeatherComponent } from './components/weather/weather.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { ChartComponent } from './components/chart/chart.component';
import { City, WeatherApiResponse, WeatherCode } from './types/main.types';
import { WeatherService } from './services/weather.service';
import {
  calculateFeelsLike,
  getWeatherDescriptionAndImage,
} from './utils/operations.functions';
import { StatsComponent } from './components/stats/stats.component';
import { isPlatformBrowser } from '@angular/common';

const defaultCity: City = {
  id: 3175395,
  name: 'Italy',
  latitude: 42.83333,
  longitude: 12.83333,
  elevation: 673,
  feature_code: 'PCLI',
  country_code: 'IT',
  timezone: 'Europe/Rome',
  population: 60431283,
  country_id: 3175395,
  country: 'Italy',
};
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    SearchComponent,
    WeatherComponent,
    FavoritesComponent,
    ChartComponent,
    StatsComponent,
  ],
})
export class AppComponent {
  title: string = 'Weather app';
  hourlyData: any[] = [];
  weatherDetails: any = {};
  currentCity: City = {
    id: 3175395,
    name: 'Italy',
    latitude: 42.83333,
    longitude: 12.83333,
    elevation: 673,
    feature_code: 'PCLI',
    country_code: 'IT',
    timezone: 'Europe/Rome',
    population: 60431283,
    country_id: 3175395,
    country: 'Italy',
  };

  constructor(
    private weatherReport: WeatherService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const savedCity = this.getSavedCity();
    this.currentCity = savedCity ? savedCity : defaultCity;
    this.getWeatherDetails(this.currentCity);
  }
  private saveCurrentCity(city: City) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentCity', JSON.stringify(city));
    }
  }

  private getSavedCity(): City | null {
    if (isPlatformBrowser(this.platformId)) {
      const savedCity = localStorage.getItem('currentCity');
      return savedCity ? JSON.parse(savedCity) : null;
    }
    return null;
  }
  onCitySelected(city: City) {
    this.saveCurrentCity(city);
    this.getWeatherDetails(city);
  }
  getWeatherDetails(city: City) {
    this.currentCity = city;
    const today = new Date().toISOString().split('T')[0];

    this.weatherReport
      .getWeatherReport(city.latitude, city.longitude)
      .subscribe({
        next: (data: WeatherApiResponse) => {
          if (data && data.current_weather) {
            const currentWeather = data.current_weather;

            const todayIndex = new Date().getUTCDate() - 1;

            this.hourlyData = data.hourly.time.reduce<number[]>(
              (acc, time, index) => {
                if (time.startsWith(today)) {
                  acc.push(data.hourly.temperature_2m[index]);
                }
                return acc;
              },
              []
            );

            const weatherCode = currentWeather.weathercode || 1;
            const { description, image } = getWeatherDescriptionAndImage(
              weatherCode as WeatherCode
            );
            const currentHour = new Date().getHours();
            const feelsLikeTemperature = calculateFeelsLike(
              currentWeather.temperature,
              currentWeather.humidity || 0
            );

            this.weatherDetails = {
              windSpeed: currentWeather.windspeed || 0,
              humidity: data.hourly.relative_humidity_2m[currentHour] || 0,
              pressure: data.current_weather.pressure || 0,
              elevation: data.elevation || 0,
            };

            this.currentCity.data = {
              minTemperature: data.daily.temperature_2m_min[todayIndex] || null,
              maxTemperature: data.daily.temperature_2m_max[todayIndex] || null,
              upcomingTemperatures: this.hourlyData.map(
                (hour) => hour.temperature
              ),
              upcomingMinTemperatures:
                data.daily.temperature_2m_min.slice(todayIndex + 1) || null,
              currentWeather: {
                description: description,
                image: image,
                feelsLike: feelsLikeTemperature,
                currentTemperature: currentWeather.temperature,
                windSpeed: currentWeather.windspeed,
                humidity: currentWeather.humidity,
              },
            };
          } else {
            console.error('Invalid weather data:', data);
          }
        },
        error: (error) => {
          console.error('Error fetching weather data:', error);
        },
        complete: () => {
          console.log('Weather data fetched successfully');
        },
      });
  }
}
