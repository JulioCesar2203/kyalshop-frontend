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
  public linkCompartir: string = '';
  
  private numeroWhatsApp: string = '934483984'; 

  ngOnInit() {
    const dominio = window.location.origin;
    this.linkCompartir = `${dominio}/form/${this.numeroWhatsApp}`;
  }

  copiarLink() {
    navigator.clipboard.writeText(this.linkCompartir).then(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: '¡Enlace copiado!',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }

  enviarWhatsApp() {
    const mensaje = `¡Hola! Aquí tienes el enlace de KYALSHOP para registrar tu envío de forma rápida: ${this.linkCompartir}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  abrirNuevaPestana() {
    window.open(this.linkCompartir, '_blank');
  }
}
