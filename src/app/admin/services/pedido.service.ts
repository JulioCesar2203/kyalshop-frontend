import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8095/api/pedidos';

  crearPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, pedido);
  }

  listarPedidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listar`);
  }

  cambiarEstadoMasivo(datos: { ids: number[], estado: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/cambiar-estado`, datos);
  }
}