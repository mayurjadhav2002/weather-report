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
  isInputFocused: boolean = false;
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

  hasSuggestions(): boolean {
    return this.suggestions && this.suggestions.length > 0;
  }
  onInputFocus() {
    this.isInputFocused = true; 
  }

  onInputBlur() {
    this.isInputFocused = false;
  }


  onCitySelected(event: Event, suggestion: any) {
    event.preventDefault();
    this.citySelected.emit(suggestion);
    this.searchControl.setValue('');
    this.suggestions = [];
  }

  isFav(cityId: number | string){
    return this.favoriteService.isFavorite(cityId)
  }

  addCityIntoFavorites(event: Event, suggestion: any) {
    event.stopPropagation(); 
    const isFav = this.isFav(suggestion.id);
    if (isFav) {
      this.favoriteService.removeFavoriteCity(suggestion.id); 
      this.showToast(`${suggestion.name} removed from favorites!`);
    } else {
      this.favoriteService.addCityIntoFavorites(suggestion);
      this.showToast(`${suggestion.name} added to favorites!`);
    }
  }

  showToast(message: string) {
    console.log(message);
  }

  refreshWeatherData(): void {
    this.favoriteService.refreshWeatherData();
  }

  removeFavoriteCity(id: number | string) {
    this.favoriteService.removeFavoriteCity(id);
  }
}
