import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { diasPermitidosValidator } from '../../utils/validators';
import { PedidoService } from '../../admin/services/pedido.service';
import {
  REGEX_PATTERN,
  VALIDATION_MESSAGE,
} from '../../core/constants/constantes';

@Component({
  selector: 'app-formulario-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-pedido.html',
  styleUrl: './formulario-pedido.scss',
})
export class FormularioPedidoComponent implements OnInit {
  pedidoForm!: FormGroup;
  telefonoNegocio: string = '';
  fechaMinima: string = '';

  agenciasShalom: any[] = [];
  distritos: any[] = [];
  agenciasFiltradas: any[] = [];
  mostrarDropdown: boolean = false;
  mensajes = VALIDATION_MESSAGE;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private pedidoService = inject(PedidoService);

  ngOnInit() {
    this.telefonoNegocio = this.route.snapshot.paramMap.get('telefono') || '';
    this.configurarFechaMinima();

    this.pedidoForm = this.fb.group({
      whatsappCliente: [
        '',
        [Validators.required, Validators.pattern(REGEX_PATTERN.CELULAR_PERU)],
      ],
      tipoEnvio: ['', Validators.required],
      nombreCompleto: [
        '',
        [Validators.required, Validators.pattern(REGEX_PATTERN.NOMBRES)],
      ],
      fechaEnvio: ['', [Validators.required, diasPermitidosValidator()]],
      agenciaShalom: [''],
      tipoDocumento: ['DNI'],
      dni: [''],
      distrito: [''],
      direccion: [''],
      referencia: [''],
    });

    this.cargarDatosEstaticos();

    this.pedidoForm.get('agenciaShalom')?.valueChanges.subscribe((texto) => {
      this.filtrarAgencias(texto);
    });

    this.pedidoForm.get('tipoEnvio')?.valueChanges.subscribe((tipo) => {
      this.actualizarValidacionesDinamicas(tipo);
    });

    this.pedidoForm.get('tipoDocumento')?.valueChanges.subscribe(() => {
      this.pedidoForm.get('dni')?.setValue('');
      this.actualizarValidacionDocumento();
    });
  }

  // --- LÓGICA DE VALIDACIONES DINÁMICAS ---
  actualizarValidacionesDinamicas(tipoEnvio: string) {
    const agencia = this.pedidoForm.get('agenciaShalom');
    const distrito = this.pedidoForm.get('distrito');
    const direccion = this.pedidoForm.get('direccion');

    if (tipoEnvio === 'shalom') {
      agencia?.setValidators([Validators.required]);
      this.actualizarValidacionDocumento();

      distrito?.clearValidators();
      direccion?.clearValidators();
    } else if (tipoEnvio === 'delivery') {
      distrito?.setValidators([Validators.required]);
      direccion?.setValidators([Validators.required]);

      agencia?.clearValidators();
      this.pedidoForm.get('dni')?.clearValidators();
    }

    agencia?.updateValueAndValidity();
    this.pedidoForm.get('dni')?.updateValueAndValidity();
    distrito?.updateValueAndValidity();
    direccion?.updateValueAndValidity();
  }

  actualizarValidacionDocumento() {
    const tipoDoc = this.pedidoForm.get('tipoDocumento')?.value;
    const dni = this.pedidoForm.get('dni');

    if (this.pedidoForm.get('tipoEnvio')?.value === 'shalom') {
      if (tipoDoc === 'DNI') {
        dni?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{8}$'),
        ]);
      } else {
        dni?.setValidators([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9]{9,20}$'),
        ]);
      }
      dni?.updateValueAndValidity();
    }
  }

  // --- BLOQUEOS FÍSICOS DE TECLADO ---
  soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    const input = event.target as HTMLInputElement;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return;
    }

    if (input.selectionStart === 0 && event.key !== '9') {
      event.preventDefault();
    }
  }

  inputDocumento(event: KeyboardEvent) {
    const tipoDoc = this.pedidoForm.get('tipoDocumento')?.value;
    const charCode = event.key.charCodeAt(0);

    if (tipoDoc === 'DNI') {
      if (charCode < 48 || charCode > 57) event.preventDefault();
    } else {
      if (
        !(charCode >= 48 && charCode <= 57) &&
        !(charCode >= 65 && charCode <= 90) &&
        !(charCode >= 97 && charCode <= 122)
      ) {
        event.preventDefault();
      }
    }
  }

  soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode >= 48 && charCode <= 57) {
      event.preventDefault();
    }
  }

  // --- CARGA DE DATOS Y ÚTILES ---
  configurarFechaMinima() {
    const hoy = new Date();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoy.getDate().toString().padStart(2, '0');
    this.fechaMinima = `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  cargarDatosEstaticos() {
    this.http.get('/assets/lstShalom.json').subscribe({
      next: (res: any) => {
        if (res) {
          this.agenciasShalom = res;
          this.agenciasFiltradas = res.slice(0, 50);
        }
      },
    });

    this.http.get('/assets/lstDistritos.json').subscribe({
      next: (res: any) => {
        if (res) {
          this.distritos = res;
        }
      },
    });
  }

  filtrarAgencias(texto: string) {
    if (!texto) {
      this.agenciasFiltradas = this.agenciasShalom.slice(0, 50);
      return;
    }
    const busqueda = texto.toLowerCase();
    this.agenciasFiltradas = this.agenciasShalom
      .filter(
        (agencia) =>
          agencia.Agencia.toLowerCase().includes(busqueda) ||
          agencia.Direccion.toLowerCase().includes(busqueda),
      )
      .slice(0, 50);
  }

  seleccionarAgencia(agencia: any) {
    const direccionCompleta = `${agencia.Agencia} | ${agencia.Direccion}`;
    this.pedidoForm.patchValue({ agenciaShalom: direccionCompleta }, { emitEvent: false });
    this.mostrarDropdown = false;
  }

  ocultarDropdown() {
    setTimeout(() => (this.mostrarDropdown = false), 200);
  }

  get showTipoEnvio() {
    return this.pedidoForm.get('whatsappCliente')?.valid;
  }
  get tipoSeleccionado() {
    return this.pedidoForm.get('tipoEnvio')?.value;
  }

  // --- ACCIÓN PRINCIPAL ---
  agendar() {
    if (this.pedidoForm.invalid) {
      this.pedidoForm.markAllAsTouched();
      
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos obligatorios correctamente.',
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Entendido'
      });
      
      return;
    }

    const form = this.pedidoForm.value;

    const nuevoPedido = {
      clienteWhatsapp: form.whatsappCliente,
      metodoRecibo: form.tipoEnvio,
      clienteDni: form.dni,
      clienteNombre: form.nombreCompleto,
      fechaEnvio: form.fechaEnvio,
      agenciaShalom: form.tipoEnvio === 'shalom' ? form.agenciaShalom : null,
      distrito: form.tipoEnvio === 'delivery' ? form.distrito : null,
      direccion: form.tipoEnvio === 'delivery' ? form.direccion : null,
      referencia: form.tipoEnvio === 'delivery' ? form.referencia : null
    };

    this.pedidoService.crearPedido(nuevoPedido).subscribe({
      next: (res: any) => {
        if (res.success) {
          Swal.fire({
            icon: 'success', 
            title: '¡Agendado!', 
            text: res.message, 
            confirmButtonColor: '#0d6efd', 
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.pedidoForm.reset(); 
              this.mostrarDropdown = false;
            }
          });
        } else {
          Swal.fire({ 
            icon: 'error', 
            title: 'Ups...', 
            text: res.message, 
            confirmButtonColor: '#0d6efd' 
          });
        }
      },
      error: (err) => {
        console.error('Error HTTP:', err);
        Swal.fire({ 
          icon: 'error', 
          title: 'Error de conexión', 
          text: 'No pudimos conectar con el servidor.', 
          confirmButtonColor: '#0d6efd' 
        });
      }
    });
  }
}
