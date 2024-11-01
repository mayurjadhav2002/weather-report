import { Component } from '@angular/core';
import { SearchComponent } from './components/search/search.component';
import { WeatherComponent } from './components/weather/weather.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { ChartComponent } from './components/chart/chart.component';
import { City, WeatherApiResponse, WeatherCode } from './types/main.types';
import { WeatherService } from './services/weather.service';
import { calculateFeelsLike, getWeatherDescriptionAndImage } from './utils/operations.functions';

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
  ],
})
export class AppComponent {
  title: string = 'Weather app';

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

  constructor(private weatherReport: WeatherService) {
    this.getWeatherDetails(this.currentCity);
  }

  onCitySelected(city: City) {
    this.currentCity = city;
    this.getWeatherDetails(city);
  }
  getWeatherDetails(city: City) {
    this.weatherReport
      .getWeatherReport(city.latitude, city.longitude)
      .subscribe({
        next: (data: WeatherApiResponse) => {
          if (data && data.current_weather) {
            const todayIndex = new Date().getUTCDate() - 1;
            const currentWeather = data.current_weather;
  
            const weatherCode = currentWeather.weathercode || 1; 
            const { description, image } = getWeatherDescriptionAndImage(weatherCode as WeatherCode);
            const feelsLikeTemperature = calculateFeelsLike(currentWeather.temperature, currentWeather.windspeed);
  
            this.currentCity.data = {
              minTemperature: data.daily.temperature_2m_min[todayIndex],
              maxTemperature: data.daily.temperature_2m_max[todayIndex],
              upcomingTemperatures: data.daily.temperature_2m_max.slice(todayIndex + 1),
              upcomingMinTemperatures: data.daily.temperature_2m_min.slice(todayIndex + 1),
              currentWeather: {
                description: description,
                image: image,
                feelsLike: feelsLikeTemperature,
                currentTemperature: currentWeather.temperature,
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
          console.log('Weather data fetched successfully');}
      });
  }
  
  

}

