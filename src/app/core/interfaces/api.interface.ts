export interface GenericResponse<T> {
  success: boolean;
  message: string;
  tipoIcono: 'success' | 'error' | 'warning' | 'info';
  data: T;
}