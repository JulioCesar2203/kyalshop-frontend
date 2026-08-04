import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const token = storageService.getToken();

  let peticion = req;

  if (token) {
    peticion = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        
        storageService.clearSession();
        
        Swal.fire({
          icon: 'info',
          title: 'Sesión expirada',
          text: 'Por tu seguridad, hemos cerrado la sesión por inactividad. Por favor, vuelve a ingresar.',
          confirmButtonColor: '#0b3d60',
          confirmButtonText: 'Entendido'
        });

        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};
