import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

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

  listarPedidosPaginados(page: number, size: number, estado: string, bandeja: string, marca: string, fechaDesde: string, fechaHasta: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('estado', estado)
      .set('bandeja', bandeja)
      .set('marca', marca);

    if (estado === 'ENVIADO') {
      params = params.set('fechaDesde', fechaDesde).set('fechaHasta', fechaHasta);
    }

    return this.http.get(`${this.apiUrl}/listar-paginado`, { params });
  }
}