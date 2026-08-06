import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../services/pedido.service';
import { FiltroPedidoDto } from '../../interfaces/filtroPedido.interface';

@Component({
  selector: 'app-gestion-envios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-envios.html',
  styleUrl: './gestion-envios.scss',
})
export class GestionEnviosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  listadoPedidos: any[] = [];
  estadoSeleccionado: string = 'PENDIENTE';
  pedidosSeleccionados: Set<number> = new Set<number>();
  tipoBandejaActual: string = 'shalom';
  pedidosParaImprimir: any[] = [];
  marcaSeleccionada: string = 'TODOS';
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalPaginas: number = 1;
  
  fechaDesde: string = '';
  fechaHasta: string = '';

  ngOnInit() {
    this.configurarFechasPorDefecto();

    this.route.url.subscribe(url => {
      if (url.length > 0) {
        this.tipoBandejaActual = url[0].path;
        this.pedidosSeleccionados.clear();
        this.paginaActual = 1;
        this.cargarPedidos();
      }
    });
  }

  configurarFechasPorDefecto() {
    const hoy = new Date();
    const diaDeLaSemana = hoy.getDay(); 
    const diferenciaAlLunes = diaDeLaSemana === 0 ? -6 : 1 - diaDeLaSemana;

    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + diferenciaAlLunes);
    
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    this.fechaDesde = this.formatearFecha(lunes);
    this.fechaHasta = this.formatearFecha(domingo);
  }

  formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  cargarPedidos() {
    const pageApi = this.paginaActual - 1; 

    const filtro: FiltroPedidoDto = {
      estado: this.estadoSeleccionado,
      bandeja: this.tipoBandejaActual,
      marca: this.marcaSeleccionada,
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta
    };

    this.pedidoService.llistarPedidosPaginados(pageApi, this.itemsPorPagina, filtro).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.listadoPedidos = res.data.content;
          this.totalPaginas = res.data.totalPages > 0 ? res.data.totalPages : 1;
        } else {
          this.listadoPedidos = [];
          this.totalPaginas = 1;
        }
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        this.listadoPedidos = [];
        this.totalPaginas = 1;
      }
    });
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.pedidosSeleccionados.clear();
      this.cargarPedidos();
    }
  }

  aplicarFiltroPersonalizado() {
    this.paginaActual = 1;
    this.pedidosSeleccionados.clear();
    this.cargarPedidos();
  }

  cambiarMarca(marca: string) {
    this.marcaSeleccionada = marca;
    this.aplicarFiltroPersonalizado();
  }

  cambiarTab(estado: string) {
    if (this.estadoSeleccionado === estado) return;
    
    this.estadoSeleccionado = estado;
    this.listadoPedidos = [];
    this.aplicarFiltroPersonalizado();
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
    
    this.pedidosParaImprimir = this.listadoPedidos.filter(p => idsSeleccionados.includes(p.id));

    const request = {
      ids: idsSeleccionados,
      estado: 'ENVIADO'
    };

    this.pedidoService.cambiarEstadoMasivo(request).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.pedidosSeleccionados.clear();
          this.estadoSeleccionado = 'ENVIADO';
          this.aplicarFiltroPersonalizado();

          Swal.fire({
            title: '¡Estados actualizados!',
            text: 'Abriendo formato de impresión...',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.abrirModalImpresion();
          });
        }
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo generar la etiqueta', 'error');
      }
    });
  }

  abrirModalImpresion() {
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
        this.ejecutarImpresionReal();
      }
    });
  }

  ejecutarImpresionReal() {
    this.cdr.detectChanges();
    setTimeout(() => {
      window.print();
    }, 500);
  }

  anularPedido(id: number) {
    Swal.fire({
      title: '¿Estás seguro de que quieres anular este pedido?',
      text: "Esta acción cambiará el estado a ANULADO y ya no aparecerá en esta bandeja ni en los reportes.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="bi bi-x-circle-fill"></i> Sí, anular pedido',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidoService.anularPedidos([id]).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.pedidosSeleccionados.delete(id);
              this.cargarPedidos();
              
              Swal.fire({
                title: '¡Anulado!',
                text: 'El pedido ha sido anulado correctamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
              });
            }
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo anular el pedido', 'error');
          }
        });
      }
    });
  }
}