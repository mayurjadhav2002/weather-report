import { Component } from '@angular/core';
import { SearchComponent } from './components/search/search.component';
import { FormControl } from '@angular/forms';
import { CitySuggestionService } from './services/suggestion.service';
import { WeatherComponent } from './components/weather/weather.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { ChartComponent } from './components/chart/chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports:[SearchComponent, WeatherComponent, FavoritesComponent, ChartComponent]
})
export class AppComponent {
  title: string = "Weather app"
  currentCity: string | null = null;
  searchControl = new FormControl();
  suggestions: { name: string; latitude: number; longitude: number }[] | any[] = []; 

  constructor(private citySuggestionService: CitySuggestionService) {}

  onCitySelected(city: { name: string; latitude: number; longitude: number }) {
    this.currentCity = city.name;
    this.searchControl.setValue(city.name); 
    this.fetchCityDetails(city); 
  }

  fetchCityDetails(city: { name: string; latitude: number; longitude: number }) {
    this.citySuggestionService.getCityDetails(city.latitude, city.longitude).subscribe(response => {
      console.log(response); 
    });
  }
  showSuggestions() {
    const query = this.searchControl.value;
    this.citySuggestionService.getSuggestions(query).subscribe((data:any) => {
      this.suggestions = data.results; // Update suggestions based on the API response
    });
  }
  
}
