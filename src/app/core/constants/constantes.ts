export enum VALIDATION_MESSAGE {
  REQUIRED = 'Campo obligatorio.',
  CELULAR_DIGITO_9 = 'El número debe ser de 9 dígitos y empezar con 9.',
  MIN_LENGTH = 'El campo debe tener al menos {0} caracteres.',
  WRONG_FORMAT = 'Formato incorrecto.',
}

export const REGEX_PATTERN = {
  CELULAR_PERU: '^9[0-9]{8}$', 
  NUMBER: '^[0-9]*$',
  NOMBRES: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$',
};