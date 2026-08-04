import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequestDto, LoginResponseDto } from '../interfaces/auth.interface';
import { Observable } from 'rxjs';
import { GenericResponse } from '../../core/interfaces/api.interface';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private readonly urlLogin = environment.apiUrl + '/api/auth/login';
  private readonly urlLogout = environment.apiUrl + '/api/auth/logout';

  login(request: LoginRequestDto): Observable<GenericResponse<LoginResponseDto>> {
    return this.http.post<GenericResponse<LoginResponseDto>>(this.urlLogin, request);
  }

  logout(): Observable<GenericResponse<string>> {
    return this.http.post<GenericResponse<string>>(this.urlLogout, {});
  }
}
