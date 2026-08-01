import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-envios',
  imports: [CommonModule],
  templateUrl: './gestion-envios.html',
  styleUrl: './gestion-envios.scss',
})
export class GestionEnviosComponent {
  private pedidoService = inject(PedidoService);
  private route = inject(ActivatedRoute);

  listadoPedidos: any[] = [];
  estadoSeleccionado: string = 'PENDIENTE';
  pedidosSeleccionados: Set<number> = new Set<number>();
  tipoBandejaActual: string = 'shalom'; 

  ngOnInit() {
    this.cargarPedidos();

    // Nos suscribimos a los cambios de la URL
    this.route.url.subscribe(url => {
      if (url.length > 0) {
        this.tipoBandejaActual = url[0].path;
        this.pedidosSeleccionados.clear();
      }
    });
  }

  cargarPedidos() {
    this.pedidoService.listarPedidos().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.listadoPedidos = res.data;
        }
      },
      error: (err) => console.error('Error al cargar pedidos:', err)
    });
  }

  get pedidosFiltrados() {
    return this.listadoPedidos.filter(p => 
      p.estado === this.estadoSeleccionado && 
      p.metodoRecibo === this.tipoBandejaActual
    );
  }

  cambiarTab(estado: string) {
    this.estadoSeleccionado = estado;
    this.pedidosSeleccionados.clear();
  }

  toggleSeleccion(id: number) {
    if (this.pedidosSeleccionados.has(id)) {
      this.pedidosSeleccionados.delete(id);
    } else {
      this.pedidosSeleccionados.add(id);
    }
  }

  generarEtiquetas() {
    if (this.pedidosSeleccionados.size === 0) {
      Swal.fire('Atención', 'Selecciona al menos un pedido.', 'warning');
      return;
    }

    const idsSeleccionados = Array.from(this.pedidosSeleccionados);

    const request = {
      ids: idsSeleccionados,
      estado: 'ENVIADO'
    };

    this.pedidoService.cambiarEstadoMasivo(request).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.cargarPedidos();
          this.pedidosSeleccionados.clear();

          Swal.fire({
            title: '¡Estados actualizados!',
            text: 'Abriendo formato de impresión...',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.abrirModalImpresion(idsSeleccionados);
          });
        }
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo generar la etiqueta', 'error');
      }
    });
  }

  abrirModalImpresion(ids: number[]) {
    Swal.fire({
      title: '<h3 class="fw-bold">Formato de Impresión</h3>',
      html: '<p class="text-muted">¿Cómo deseas organizar las etiquetas en la hoja?</p>',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '<i class="bi bi-printer"></i> 1 Columna',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0d6efd',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarImpresionReal(ids);
      }
    });
  }

  ejecutarImpresionReal(ids: number[]) {
    const pedidosAImprimir = this.listadoPedidos.filter(p => ids.includes(p.id));
    window.print();
  }
}
