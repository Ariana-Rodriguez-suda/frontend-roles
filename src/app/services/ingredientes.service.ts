import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ingrediente {
  id?: number;
  nombre: string;
  precio: number;
  unidad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IngredientesService {
constructor(private http: HttpClient) {}
private apiUrl = 'http://localhost:3000/ingredientes';

getIngredientes(): Observable<Ingrediente[]> {
  return this.http.get<Ingrediente[]>(this.apiUrl);
}

addIngrediente(data: Ingrediente): Observable<Ingrediente> {
  return this.http.post<Ingrediente>(this.apiUrl, data);
}

deleteIngrediente(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

updateIngrediente(ingrediente: Ingrediente) { 
  return this.http.put<Ingrediente>(`${this.apiUrl}/${ingrediente.id}`, ingrediente);
}

}
