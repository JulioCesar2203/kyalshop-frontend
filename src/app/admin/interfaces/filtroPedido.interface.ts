export interface FiltroPedidoDto {
  estado: string;
  bandeja: string;
  marca: string;
  fechaDesde?: string; 
  fechaHasta?: string;
}