import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'], 
})
export class StatsComponent {
  @Input() weatherDetails: {
    windSpeed: number;
    humidity: number;
    pressure: number;
    elevation: number;
  } = {
    windSpeed: 0,
    humidity: 0,
    pressure: 0,
    elevation: 0,
  };
}
