import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfiguracionService } from '../../services/configuracion.service';

@Component({
  selector: 'app-seguridad',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seguridad.html',
  styleUrl: './seguridad.scss',
})
export class SeguridadComponent {
  seguridadForm!: FormGroup;
  
  private fb = inject(FormBuilder);
  private configService = inject(ConfiguracionService);

  // Variables ocultas para evitar que el backend borre nuestros datos públicos
  private datosActuales = {
    nombreEmprendimiento: '',
    whatsapp: ''
  };

  ngOnInit() {
    this.seguridadForm = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.cargarDatosActuales();
  }

  // Obtenemos los datos actuales para enviarlos intactos junto con la clave
  cargarDatosActuales() {
    this.configService.obtenerConfiguracion().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.datosActuales.nombreEmprendimiento = res.data.nombreEmprendimiento;
          this.datosActuales.whatsapp = res.data.whatsapp;
        }
      },
      error: (err) => console.error('Error al cargar configuración', err)
    });
  }

  guardar() {
    if (this.seguridadForm.invalid) {
      this.seguridadForm.markAllAsTouched();
      return;
    }

    // Armamos el Request mezclando los datos públicos guardados + la nueva contraseña
    const request = {
      nombreEmprendimiento: this.datosActuales.nombreEmprendimiento,
      whatsapp: this.datosActuales.whatsapp,
      nuevaContrasena: this.seguridadForm.value.nuevaContrasena
    };

    this.configService.actualizarConfiguracion(request).subscribe({
      next: (res: any) => {
        if (res.success) {
          Swal.fire({
            title: '¡Contraseña Actualizada!',
            text: 'Tus credenciales han sido cambiadas con éxito.',
            icon: 'success',
            confirmButtonColor: '#0d6efd'
          });

          // Limpiamos la caja de texto por seguridad
          this.seguridadForm.reset();
        }
      },
      error: (err) => {
        const mensajeError = err.error?.message || 'Error al actualizar contraseña';
        Swal.fire('Error', mensajeError, 'error');
      }
    });
  }
}
