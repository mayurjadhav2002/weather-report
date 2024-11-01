import {Injectable} from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import {WeatherApiResponse} from '../types/main.types'
@Injectable({
    providedIn: 'root',
})
export class WeatherService{
    private api = 'https://api.open-meteo.com/v1/forecast?daily=temperature_2m_max,temperature_2m_min&timezone=Europe/Berlin&current_weather=true'
    constructor(private http:HttpClient){}

    getWeatherReport(lat:number|string|undefined, long:number|string|undefined): Observable<WeatherApiResponse>{
        return this.http.get<WeatherApiResponse>(`${this.api}&latitude=${lat}&longitude=${long}`);
    }
}