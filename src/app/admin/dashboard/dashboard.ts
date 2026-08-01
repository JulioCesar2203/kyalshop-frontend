import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../auth/services/storage.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  private storageService = inject(StorageService);
  private router = inject(Router);

  cerrarSesion() {
    this.storageService.clearSession();
    this.router.navigate(['/login']);
  }
}
