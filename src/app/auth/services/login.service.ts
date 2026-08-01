import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequestDto, LoginResponseDto } from '../interfaces/auth.interface';
import { Observable } from 'rxjs';
import { GenericResponse } from '../../core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  // Más adelante esto lo pasaremos al environment.ts
  private readonly urlLogin = 'http://localhost:8095/api/auth/login';

  login(request: LoginRequestDto): Observable<GenericResponse<LoginResponseDto>> {
    return this.http.post<GenericResponse<LoginResponseDto>>(this.urlLogin, request);
  }
}
