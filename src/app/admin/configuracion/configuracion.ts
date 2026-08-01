import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfiguracionService } from '../services/configuracion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss',
})
export class ConfiguracionComponent {
  configForm!: FormGroup;
  
  private fb = inject(FormBuilder);
  private configService = inject(ConfiguracionService);

  ngOnInit() {
    this.configForm = this.fb.group({
      nombreEmprendimiento: ['', Validators.required],
      whatsapp: ['', [Validators.required, Validators.pattern('^9[0-9]{8}$')]],
      nuevaContrasena: ['']
    });

    this.cargarDatosActuales();
  }

  guardar() {
    if (this.configForm.valid) {
      const datos = this.configForm.value;

      this.configService.actualizarConfiguracion(datos).subscribe({
        next: (res) => {
          if (res.success) {
            Swal.fire({
              title: '¡Actualizado!',
              text: res.message,
              icon: 'success',
              confirmButtonColor: '#3b82f6'
            });

            this.configForm.patchValue({ nuevaContrasena: '' });
          }
        },
        error: (err) => {
          const mensajeError = err.error?.message || 'Error al guardar la configuración';
          Swal.fire('Error', mensajeError, 'error');
        }
      });
    } else {
      this.configForm.markAllAsTouched();
      Swal.fire('Atención', 'Revisa los campos del formulario', 'warning');
    }
  }

  cargarDatosActuales() {
    this.configService.obtenerConfiguracion().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.configForm.patchValue({
            nombreEmprendimiento: res.data.nombreEmprendimiento,
            whatsapp: res.data.whatsapp
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar la configuración', err);
      }
    });
  }
}
