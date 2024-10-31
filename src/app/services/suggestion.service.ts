import {Injectable} from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"

@Injectable({
    providedIn: 'root',
})
export class CitySuggestionService{
    private api = 'https://geocoding-api.open-meteo.com/v1/search'
    constructor(private http:HttpClient){}

    getSuggestions(query:string): Observable<string[]>{
        return this.http.get<string[]>(`${this.api}?name=${query}`);
    }
    getCityDetails(lang:string|number, lat:string|number): Observable<string[]>{
        return this.http.get<string[]>(`${this.api}?name=${lang}`);
    }
}