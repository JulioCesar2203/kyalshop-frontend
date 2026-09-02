import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function diasPermitidosValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const partes = control.value.split('-');
    const fecha = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
    const diaDeLaSemana = fecha.getDay();

    if (diaDeLaSemana !== 1 && diaDeLaSemana !== 2 && diaDeLaSemana !== 6) {
      return { diaInvalido: true };
    }
    return null;
  };
}