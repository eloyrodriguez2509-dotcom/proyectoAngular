import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonajeService {

  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getPersonajes() {
    return this.http.get<any>(this.apiUrl);
  }

  getPersonajePorId(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}