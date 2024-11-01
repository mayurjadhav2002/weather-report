import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { City, WeatherApiResponse, WeatherCode } from "../types/main.types";
import { WeatherService } from "./weather.service";
import { isPlatformBrowser } from '@angular/common';
import { calculateFeelsLike, getWeatherDescriptionAndImage } from "../utils/operations.functions";

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private favoriteCities = new BehaviorSubject<City[]>([]);
    favoriteCities$ = this.favoriteCities.asObservable();

    constructor(
        private weatherService: WeatherService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.loadFavoriteCities();
    }

    loadFavoriteCities() {
        if (isPlatformBrowser(this.platformId)) {
            const favoriteCity = JSON.parse(
                localStorage.getItem('favoriteCities') || '[]'
            );
            this.favoriteCities.next(favoriteCity);
        }
    }

    isFavorite(cityId: string | number): boolean {
        return this.favoriteCities.getValue().some(city => city.id === cityId);
      }
    
    addCityIntoFavorites(city: City) {
        const newFavoriteCity = {
            ...city,
            updated_at: null,
            data: null,
        };
        const currentCities = this.favoriteCities.getValue();
        currentCities.push(newFavoriteCity);
        this.saveFavoriteCities(currentCities);
        this.fetchWeatherDetails(city.latitude, city.longitude, newFavoriteCity);
    }

    refreshWeatherData(): void {
        const currentTime = Date.now();
        const currentCities = this.favoriteCities.getValue();
        currentCities.forEach((city: City) => {
            if (!city.updated_at || currentTime - city.updated_at > 3600000) {
                this.fetchWeatherDetails(city.lat, city.long, city);
            }
        });
    }

    private saveFavoriteCities(cities: City[]) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('favoriteCities', JSON.stringify(cities));
        }
        this.favoriteCities.next(cities);
    }

    fetchWeatherDetails(
        lat: number | string | undefined,
        long: number | string | undefined,
        city: City
    ) {
        this.weatherService.getWeatherReport(lat, long).subscribe({
            next: (data: WeatherApiResponse) => {
                const currentWeather = data.current_weather;
    
                const weatherCode = currentWeather.weathercode || 1; 
                const { description, image } = getWeatherDescriptionAndImage(weatherCode as WeatherCode);
                const feelsLikeTemperature = calculateFeelsLike(currentWeather.temperature, currentWeather.windspeed);
    
                const todayIndex = new Date().getUTCDate() - 1;
    
                city.data = {
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
                    hourly: data.hourly.temperature_2m,
                };
                city.updated_at = Date.now();
                this.saveFavoriteCities(this.favoriteCities.getValue());
            },
            error: (error) => {
                console.error('Error fetching weather data:', error);
            }
        });
    }
    

    removeFavoriteCity(id: number | string) {
        const currentCities = this.favoriteCities.getValue();
        const updatedFavorites = currentCities.filter((city: City) => city.id !== id);
        this.saveFavoriteCities(updatedFavorites);
    }

    sortFavoriteCities(sortBy: string) {
        const allCities = this.favoriteCities.getValue();
        const sortedCities = allCities.slice().sort((a,b)=>{
            if(sortBy === 'Temperature'){
                return (b.data?.maxTemperature||0) - (a.data?.maxTemperature||0)
            }else if(sortBy === 'City'){
                return a.name.localeCompare(b.name)
            }else{
                return (b.updated_at || 0) - (a.updated_at || 0)
            }
        })
        this.favoriteCities.next(sortedCities)
    }
}
