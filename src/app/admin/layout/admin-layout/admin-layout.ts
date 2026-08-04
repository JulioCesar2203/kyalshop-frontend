import { Component, inject } from '@angular/core';
import { MENU_KYALSHOP, SUBMENUS_KYALSHOP } from '../../../core/constants/menu';
import { StorageService } from '../../../auth/services/storage.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../auth/services/login.service';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
  private storageService = inject(StorageService);
  public router = inject(Router);
  private loginService = inject(LoginService);

  get esPantallaInicio(): boolean {
    return this.router.url === '/admin/inicio';
  }

  get submenuActual() {
    const url = this.router.url;
    
    if (url.includes('/admin/configuracion')) return SUBMENUS_KYALSHOP['/admin/configuracion'];
    if (url.includes('/admin/envios')) return SUBMENUS_KYALSHOP['/admin/envios'];
    
    return null;
  }

  cerrarSesion() {
    this.loginService.logout().subscribe({
      next: (res) => {
        if (res.success) {
          this.storageService.clearSession();
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Error al cerrar sesión en backend:', err);
        this.storageService.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}
