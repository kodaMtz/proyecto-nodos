import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  nodo_origen: string;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://3.16.137.85:3001/api';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  insertarUsuario(nombre: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, { nombre });
  }

  actualizarUsuario(id: number, nombre: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, { nombre });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }
}
