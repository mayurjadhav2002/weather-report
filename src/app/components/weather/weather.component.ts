import { Component, input, Input } from '@angular/core';
import { City } from '../../types/main.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {
  @Input() currentCity: City | null = null;
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';
  currentDay: string = '';
  currentDate: string = '';

  ngOnInit(): void {
    const now = new Date();
    this.currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    this.currentDate = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  convertTemperature(temp: number | undefined): number | null {
    if (temp === undefined) return null;
    return this.temperatureUnit === 'fahrenheit' ? (temp * 9 / 5) + 32 : temp;
  }
  
  onUnitChange(event: Event): void {
    this.temperatureUnit = (event.target as HTMLSelectElement).value as 'celsius' | 'fahrenheit';
  }

}
