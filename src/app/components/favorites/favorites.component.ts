import { Component } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { City } from '../../types/main.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  title: string = 'Favorites';
  favoriteCities: City[] = [];
  
  constructor(private favoriteService: FavoriteService) {}

  
  ngOnInit() {
    
    this.loadFavoriteCities();
    this.refreshWeatherData();
  }

  loadFavoriteCities() {
    this.favoriteService.favoriteCities$.subscribe((cities)=>{
      this.favoriteCities = cities
    })
  }

  addCityIntoFavorites(city: City) {
   this.favoriteService.addCityIntoFavorites(city)
  }

  refreshWeatherData(): void {
    this.favoriteService.refreshWeatherData();
  }

  removeFavoriteCity(id:number|string){
    this.favoriteService.removeFavoriteCity(id)
  }
}
