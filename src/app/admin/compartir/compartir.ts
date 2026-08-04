import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compartir',
  imports: [CommonModule],
  templateUrl: './compartir.html',
  styleUrl: './compartir.scss',
})
export class CompartirComponent {
  public linkShop: string = '';
  public linkCourier: string = '';

  ngOnInit() {
    const dominio = window.location.origin;
    this.linkShop = `${dominio}/form/shop`; 
    this.linkCourier = `${dominio}/form/courier`; 
  }

  copiarLink(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      Swal.fire({
        toast: true, position: 'top-end', icon: 'success', title: '¡Enlace copiado!', showConfirmButton: false, timer: 2000
      });
    });
  }

  abrirNuevaPestana(link: string) {
    window.open(link, '_blank');
  }
}