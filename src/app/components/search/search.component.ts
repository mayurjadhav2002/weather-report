import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { CitySuggestionService } from '../../services/suggestion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'] // Fixed typo here: `styleUrl` should be `styleUrls`
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl();
  suggestions: any[] = [];

  @Output() citySelected = new EventEmitter<any>(); // Emit selected city

  constructor(private suggestionService: CitySuggestionService) {}

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

  // Method to handle city selection
  onCitySelected(event: Event,suggestion: any) {
    event.preventDefault();
    this.citySelected.emit(suggestion); // Emit selected city
    this.searchControl.setValue(''); // Set the input value to the selected city name
    this.suggestions = []; // Clear suggestions after selection
  }
}
