import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  imports: [CommonModule]
})
export class ChartComponent implements OnChanges {
  @Input() temperatureData: number[] | null | undefined = [];
  public labels: string[] = [
    '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];
  chart: any;
  isLoading: boolean = true; 

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['temperatureData']) {
      this.isLoading = true;
      this.createChart();
    }
  }

  private createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('canvas', {
      type: 'line', 
      data: {
        labels: this.labels, 
        datasets: [
          {
            data: this.temperatureData || [], 
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time (Hourly)'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Temperature (°C)'
            }
          },
        },
      },
    });

    this.isLoading = false;
  }
}
