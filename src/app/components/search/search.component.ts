import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { CitySuggestionService } from '../../services/suggestion.service';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { City } from '../../types/main.types';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl();
  suggestions: any[] = [];

  @Output() citySelected = new EventEmitter<any>();

  constructor(
    private suggestionService: CitySuggestionService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((query) => this.suggestionService.getSuggestions(query))
      )
      .subscribe((data: any) => {
        this.suggestions = data.results;
      });
  }

  onCitySelected(event: Event, suggestion: any) {
    event.preventDefault();
    this.citySelected.emit(suggestion);
    this.searchControl.setValue('');
    this.suggestions = [];
  }

  addCityIntoFavorites(event: Event, city: City): void {
    event.preventDefault();
    this.favoriteService.addCityIntoFavorites({ ...city, lat: city.latitude, long: city.longitude });
  }

  refreshWeatherData(): void {
    this.favoriteService.refreshWeatherData();
  }

  removeFavoriteCity(id: number | string) {
    this.favoriteService.removeFavoriteCity(id);
  }
}
