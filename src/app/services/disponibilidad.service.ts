import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Disponibilidad } from '../models/disponibilidad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadService {

  private apiUrl = 'http://localhost:8090/disponibilidad';

  constructor(private http: HttpClient) { }

  getDisponibilidadDoctor(id: number): Observable<Disponibilidad> {
    return this.http.get<Disponibilidad>(`${this.apiUrl}/doctor/${id}`);
  }

}
