import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import { LoginRequestDto } from '../interfaces/auth.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  cargando = false;
  
  private authService = inject(LoginService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.username || !this.password) {
      Swal.fire('Atención', 'Por favor ingrese su usuario y contraseña', 'warning');
      return;
    }

    const request: LoginRequestDto = {
      username: this.username,
      password: this.password
    };

    this.cargando = true;

    this.authService.login(request).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.success && res.data) {
          this.storageService.saveSession(res.data.token, res.data);
          
          Swal.fire({
            title: '¡Éxito!',
            text: res.message,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/admin/inicio']);
          });
        }
      },
      error: (err) => {
        this.cargando = false;
        const mensajeError = err.error?.message || 'Error al conectar con el servidor';
        Swal.fire('Error', mensajeError, 'error');
      }
    });
  }
}
