import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfiguracionRequest } from '../interfaces/configuracion.interface';
import { Observable } from 'rxjs';
import { GenericResponse } from '../../core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8095/api/configuracion';

  actualizarConfiguracion(datos: ConfiguracionRequest): Observable<GenericResponse<void>> {
    return this.http.put<GenericResponse<void>>(this.apiUrl, datos);
  }

  obtenerConfiguracion(): Observable<GenericResponse<ConfiguracionRequest>> {
    return this.http.get<GenericResponse<ConfiguracionRequest>>(this.apiUrl);
  }
}
