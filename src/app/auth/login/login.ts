import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import { LoginRequestDto } from '../interfaces/auth.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  
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

    this.authService.login(request).subscribe({
      next: (res) => {
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
        const mensajeError = err.error?.message || 'Error al conectar con el servidor';
        Swal.fire('Error', mensajeError, 'error');
      }
    });
  }
}
