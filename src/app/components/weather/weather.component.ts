import { Component, input, Input } from '@angular/core';
import { City } from '../../types/main.types';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {
  @Input() currentCity: City | null = null;
}
