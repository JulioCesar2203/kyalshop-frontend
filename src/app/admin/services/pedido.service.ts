import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { FiltroPedidoDto } from '../interfaces/filtroPedido.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/api/pedidos';

  crearPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, pedido);
  }

  listarPedidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listar`);
  }

  cambiarEstadoMasivo(datos: { ids: number[], estado: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/cambiar-estado`, datos);
  }

  anularPedidos(ids: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/anular`, ids);
  }

  llistarPedidosPaginados(page: number, size: number, filtro: FiltroPedidoDto): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('estado', filtro.estado)
      .set('bandeja', filtro.bandeja)
      .set('marca', filtro.marca);

    if (filtro.estado === 'ENVIADO' && filtro.fechaDesde && filtro.fechaHasta) {
      params = params.set('fechaDesde', filtro.fechaDesde).set('fechaHasta', filtro.fechaHasta);
    }

    return this.http.get(`${this.apiUrl}/listar-paginado`, { params });
  }
}