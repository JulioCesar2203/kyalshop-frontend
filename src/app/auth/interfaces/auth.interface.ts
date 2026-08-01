export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  idUsuario: number;
  username: string;
  token: string;
}