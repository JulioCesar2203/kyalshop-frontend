import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../auth/services/storage.service';
import { LoginService } from '../../auth/services/login.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  private storageService = inject(StorageService);
  private router = inject(Router);
  private loginService = inject(LoginService);

  cerrarSesion() {
    this.loginService.logout().subscribe({
      next: (res) => {
        this.storageService.clearSession();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.storageService.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}
